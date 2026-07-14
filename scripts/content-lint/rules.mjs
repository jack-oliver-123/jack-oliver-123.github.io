import { createHash } from 'node:crypto';
import {
  existsSync,
  readFileSync,
  realpathSync,
  statSync,
} from 'node:fs';
import path from 'node:path';

import { hashArticleContent, validateInfographicManifest } from '../generate-infographic-manifest.mjs';

const LEGACY_SOURCE_PATTERN = /原文来源|小林面试笔记/iu;
const LEGACY_DOMAIN_PATTERN = /(?:xiaolinnote\.com|xiaolincoding\.com)/iu;
const STRONG_ASSERTION_PATTERN = /(?:(?<!不)一定|必然|永远|绝对|完全不会|百分之百|100\s*%|最佳选择|最优解)/gu;
const REQUIRED_SECTIONS = [
  '60 秒回答',
  '详细解析',
  '工程实践与边界',
  '常见误区',
  '面试追问',
  '参考资料',
];

function normalizePath(value) {
  return String(value ?? '').replaceAll('\\', '/').replace(/^\.\//u, '');
}

function lineAt(content, index) {
  return content.slice(0, Math.max(0, index)).split(/\r?\n/u).length;
}

function maskMarkdownContexts(content) {
  const characters = content.split('');
  const mask = (start, end) => {
    for (let index = start; index < end; index += 1) {
      if (characters[index] !== '\n' && characters[index] !== '\r') characters[index] = ' ';
    }
  };

  for (const comment of content.matchAll(/<!--[\s\S]*?-->/gu)) {
    mask(comment.index, comment.index + comment[0].length);
  }

  let offset = 0;
  let fence = null;
  for (const line of content.split(/(?<=\n)/u)) {
    const visible = characters.slice(offset, offset + line.length).join('').replace(/\r?\n$/u, '');
    const match = visible.match(/^ {0,3}(`{3,}|~{3,})(.*)$/u);
    if (!fence && match) {
      fence = { char: match[1][0], length: match[1].length };
      mask(offset, offset + line.length);
    } else if (fence) {
      mask(offset, offset + line.length);
      if (match && match[1][0] === fence.char && match[1].length >= fence.length && !match[2].trim()) {
        fence = null;
      }
    }
    offset += line.length;
  }

  const withoutBlocks = characters.join('');
  offset = 0;
  for (const line of withoutBlocks.split(/(?<=\n)/u)) {
    const body = line.replace(/\r?\n$/u, '');
    for (let index = 0; index < body.length;) {
      if (body[index] !== '`') {
        index += 1;
        continue;
      }
      let runLength = 1;
      while (body[index + runLength] === '`') runLength += 1;
      const marker = '`'.repeat(runLength);
      const closing = body.indexOf(marker, index + runLength);
      if (closing === -1) {
        index += runLength;
        continue;
      }
      mask(offset + index, offset + closing + runLength);
      index = closing + runLength;
    }
    offset += line.length;
  }
  return characters.join('');
}

function diagnostic(severity, rule, filePath, line, message) {
  return { severity, rule, filePath, line, message };
}

function isPathInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function isHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function findClosingBracket(content, start) {
  let depth = 1;
  for (let index = start + 1; index < content.length; index += 1) {
    const character = content[index];
    if (character === '\\') {
      index += 1;
      continue;
    }
    if (character === '[') depth += 1;
    if (character === ']') {
      depth -= 1;
      if (depth === 0) return index;
    }
    if (character === '\n' || character === '\r') return -1;
  }
  return -1;
}

function findClosingParenthesis(content, start) {
  let angleDestination = false;
  let depth = 1;
  let quote = null;

  for (let index = start + 1; index < content.length; index += 1) {
    const character = content[index];
    if (character === '\\') {
      index += 1;
      continue;
    }
    if (character === '\n' || character === '\r') return -1;
    if (quote) {
      if (character === quote) quote = null;
      continue;
    }
    if (angleDestination) {
      if (character === '>') angleDestination = false;
      continue;
    }
    if (character === '<' && content.slice(start + 1, index).trim() === '') {
      angleDestination = true;
      continue;
    }
    if ((character === '"' || character === "'") && /\s/u.test(content[index - 1] ?? '')) {
      quote = character;
      continue;
    }
    if (character === '(') depth += 1;
    if (character === ')') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function parseLinkDestination(rawDestination) {
  const value = rawDestination.trim();
  if (!value) return '';
  if (value.startsWith('<')) {
    let escaped = false;
    for (let index = 1; index < value.length; index += 1) {
      if (!escaped && value[index] === '>') return value.slice(1, index).trim();
      escaped = !escaped && value[index] === '\\';
      if (value[index] !== '\\') escaped = false;
    }
    return value.slice(1).trim();
  }

  const withoutTitle = value.match(/^(.*?)(?:\s+(?:"[^"]*"|'[^']*'|\([^()]*\)))\s*$/u)?.[1] ?? value;
  return withoutTitle.trim().replace(/\\([\\() ])/gu, '$1');
}

function extractInlineLinks(content) {
  const links = [];
  for (let index = 0; index < content.length; index += 1) {
    const isImage = content[index] === '!' && content[index + 1] === '[';
    if (!isImage && content[index] !== '[') continue;

    const labelStart = isImage ? index + 1 : index;
    const labelEnd = findClosingBracket(content, labelStart);
    if (labelEnd === -1 || content[labelEnd + 1] !== '(') continue;
    const destinationEnd = findClosingParenthesis(content, labelEnd + 1);
    if (destinationEnd === -1) continue;

    links.push({
      alt: content.slice(labelStart + 1, labelEnd),
      index,
      isImage,
      source: parseLinkDestination(content.slice(labelEnd + 2, destinationEnd)),
    });
    index = destinationEnd;
  }

  const definitions = new Map();
  for (const match of content.matchAll(/^ {0,3}\[([^\]\r\n]+)\]:\s*(.+)$/gmu)) {
    definitions.set(match[1].trim().replace(/\s+/gu, ' ').toLowerCase(), parseLinkDestination(match[2]));
  }
  for (const match of content.matchAll(/(!?)\[([^\]\r\n]+)\]\[([^\]\r\n]*)\]/gu)) {
    const reference = (match[3] || match[2]).trim().replace(/\s+/gu, ' ').toLowerCase();
    const source = definitions.get(reference);
    links.push({
      alt: match[2],
      index: match.index,
      isImage: match[1] === '!',
      missingReference: source === undefined,
      source: source ?? '',
    });
  }
  return links;
}

function htmlAttribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const match = tag.match(new RegExp(`\\b${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'iu'));
  if (!match) return { present: false, value: '' };
  return { present: true, value: match[1] ?? match[2] ?? match[3] ?? '' };
}

function extractImages(content, inlineLinks = extractInlineLinks(content)) {
  const images = inlineLinks
    .filter((link) => link.isImage)
    .map((link) => ({
      alt: link.alt,
      index: link.index,
      missingReference: link.missingReference,
      source: link.source,
    }));

  for (const match of content.matchAll(/<img\b[^>]*>/giu)) {
    const source = htmlAttribute(match[0], 'src');
    const alt = htmlAttribute(match[0], 'alt');
    images.push({
      alt: alt.present ? alt.value : '',
      index: match.index,
      source: source.value,
    });
  }
  return images;
}

function lintFrontmatter({ content, filePath }) {
  const diagnostics = [];
  const normalized = content.replace(/^\uFEFF/u, '');
  if (!normalized.startsWith('---\n') && !normalized.startsWith('---\r\n')) {
    diagnostics.push(diagnostic('error', 'frontmatter', filePath, 1, '缺少 YAML frontmatter'));
    return diagnostics;
  }

  const lines = normalized.split(/\r?\n/u);
  const closingLine = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (closingLine === -1) {
    diagnostics.push(diagnostic('error', 'frontmatter', filePath, 1, 'frontmatter 未闭合'));
    return diagnostics;
  }

  const frontmatterLines = lines.slice(1, closingLine);
  for (const field of ['title', 'description']) {
    const fieldIndex = frontmatterLines.findIndex((line) => new RegExp(`^${field}\\s*:`, 'u').test(line));
    let value = '';
    if (fieldIndex >= 0) {
      const rawValue = frontmatterLines[fieldIndex].replace(new RegExp(`^${field}\\s*:\\s*`, 'u'), '').trim();
      if (/^[|>][+-]?$/u.test(rawValue)) {
        const blockLines = [];
        for (const line of frontmatterLines.slice(fieldIndex + 1)) {
          if (!/^\s+/u.test(line)) break;
          blockLines.push(line.trim());
        }
        value = blockLines.join('\n');
      } else {
        value = rawValue;
      }
    }

    const normalizedValue = value
      .replace(/^(["'])([\s\S]*)\1$/u, '$2')
      .replace(/^#.*$/u, '')
      .trim();
    if (!normalizedValue || /^(?:null|~)$/iu.test(normalizedValue)) {
      diagnostics.push(
        diagnostic('error', 'frontmatter', filePath, fieldIndex >= 0 ? fieldIndex + 2 : 1, `frontmatter 的 ${field} 必须为非空值`),
      );
    }
  }
  return diagnostics;
}

function lintCodeFences({ content, filePath }) {
  const diagnostics = [];
  const lines = content.split(/\r?\n/u);
  let openFence = null;

  lines.forEach((line, index) => {
    const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/u);
    if (!match) return;

    const marker = match[1];
    const rest = match[2].trim();
    if (!openFence) {
      openFence = { char: marker[0], length: marker.length, line: index + 1 };
      if (!rest) {
        diagnostics.push(
          diagnostic('error', 'typed-code-fence', filePath, index + 1, '代码围栏缺少语言标签'),
        );
      }
      return;
    }

    if (marker[0] === openFence.char && marker.length >= openFence.length && !rest) {
      openFence = null;
    }
  });

  if (openFence) {
    diagnostics.push(
      diagnostic('error', 'closed-code-fence', filePath, openFence.line, '代码围栏未闭合'),
    );
  }
  return diagnostics;
}

function lintControlCharacters({ content, filePath }) {
  const diagnostics = [];
  const pattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/gu;
  for (const match of content.matchAll(pattern)) {
    const codePoint = match[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
    diagnostics.push(
      diagnostic('error', 'control-character', filePath, lineAt(content, match.index), `包含隐藏控制字符 U+${codePoint}`),
    );
  }
  return diagnostics;
}

function lintStructure({ content, filePath }) {
  const diagnostics = [];
  const isOverview = /^00\./u.test(path.basename(filePath));
  const requiredSections = isOverview ? ['参考资料'] : REQUIRED_SECTIONS;
  for (const section of requiredSections) {
    const escaped = section.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
    const pattern = new RegExp(`^##\\s+${escaped}\\s*$`, 'mu');
    if (!pattern.test(content)) {
      diagnostics.push(
        diagnostic('error', section === '参考资料' ? 'references' : 'article-structure', filePath, 1, `缺少“## ${section}”章节`),
      );
    }
  }

  const references = content.match(/^##\s+参考资料\s*$([\s\S]*)$/mu)?.[1] ?? '';
  if (/^##\s+/mu.test(references)) {
    const nextHeading = references.search(/^##\s+/mu);
    if (nextHeading >= 0 && !/https?:\/\//u.test(references.slice(0, nextHeading))) {
      diagnostics.push(diagnostic('error', 'references', filePath, 1, '参考资料章节至少需要一个可验证链接'));
    }
  } else if (/^##\s+参考资料\s*$/mu.test(content) && !/https?:\/\//u.test(references)) {
    diagnostics.push(diagnostic('error', 'references', filePath, 1, '参考资料章节至少需要一个可验证链接'));
  }
  return diagnostics;
}

function lintSources({ content, filePath }) {
  const diagnostics = [];
  const source = LEGACY_SOURCE_PATTERN.exec(content);
  if (source) {
    diagnostics.push(
      diagnostic('error', 'legacy-source', filePath, lineAt(content, source.index), '残留旧稿来源或署名'),
    );
  }

  const domain = LEGACY_DOMAIN_PATTERN.exec(content);
  if (domain) {
    diagnostics.push(
      diagnostic('error', 'legacy-domain', filePath, lineAt(content, domain.index), '残留旧稿域名或第三方资产'),
    );
  }
  return diagnostics;
}

function lintImageBasics({ content, filePath, images }) {
  const diagnostics = [];
  for (const image of images) {
    if (!image.alt.trim()) {
      diagnostics.push(
        diagnostic('error', 'image-alt', filePath, lineAt(content, image.index), '图片必须提供有意义的 alt 文本'),
      );
    }
    if (image.missingReference) {
      diagnostics.push(
        diagnostic('error', 'remote-image', filePath, lineAt(content, image.index), '引用式图片缺少链接定义'),
      );
      continue;
    }
    if (/^http:\/\//iu.test(image.source)) {
      diagnostics.push(
        diagnostic('error', 'image-https', filePath, lineAt(content, image.index), '正文图片必须使用 HTTPS 公网链接'),
      );
      continue;
    }
    if (!isHttpsUrl(image.source)) {
      diagnostics.push(
        diagnostic('error', 'remote-image', filePath, lineAt(content, image.index), '正文图片必须使用 PicGo HTTPS 公网链接'),
      );
    }
  }
  return diagnostics;
}

function resolveWorkDir({ diagnostics, filePath, item, repoRoot }) {
  if (!repoRoot || !path.isAbsolute(repoRoot)) {
    diagnostics.push(diagnostic('error', 'infographic-manifest', filePath, 1, '信息图校验缺少绝对 repoRoot'));
    return null;
  }
  if (typeof item.workDir !== 'string' || !item.workDir || path.isAbsolute(item.workDir)) {
    diagnostics.push(diagnostic('error', 'infographic-manifest', filePath, 1, 'manifest workDir 必须是仓库内相对路径'));
    return null;
  }

  const infographicRoot = path.resolve(repoRoot, 'docs', 'infographics', 'ai-interview');
  const workDir = path.resolve(repoRoot, item.workDir);
  if (!isPathInside(infographicRoot, workDir)) {
    diagnostics.push(diagnostic('error', 'infographic-manifest', filePath, 1, 'manifest workDir 越出信息图目录'));
    return null;
  }

  if (existsSync(workDir) && existsSync(infographicRoot)) {
    try {
      if (!isPathInside(realpathSync(infographicRoot), realpathSync(workDir))) {
        diagnostics.push(diagnostic('error', 'infographic-manifest', filePath, 1, 'manifest workDir 通过链接越出信息图目录'));
        return null;
      }
    } catch {
      diagnostics.push(diagnostic('error', 'infographic-manifest', filePath, 1, '无法解析 manifest workDir'));
      return null;
    }
  }
  return workDir;
}

function resolveAssetPath({ asset, diagnostics, field, filePath, repoRoot, workDir }) {
  const relativePath = asset?.[field];
  if (typeof relativePath !== 'string' || !relativePath || path.isAbsolute(relativePath)) {
    diagnostics.push(diagnostic('error', 'infographic-artifact', filePath, 1, `${asset?.assetId ?? 'unknown'} 缺少有效 ${field}`));
    return null;
  }

  const absolutePath = path.resolve(repoRoot, relativePath);
  if (!isPathInside(workDir, absolutePath)) {
    diagnostics.push(diagnostic('error', 'infographic-artifact', filePath, 1, `${field} 必须位于对应 workDir 内`));
    return null;
  }
  if (existsSync(absolutePath)) {
    try {
      if (!isPathInside(realpathSync(workDir), realpathSync(absolutePath))) {
        diagnostics.push(diagnostic('error', 'infographic-artifact', filePath, 1, `${field} 通过链接越出对应 workDir`));
        return null;
      }
    } catch {
      diagnostics.push(diagnostic('error', 'infographic-artifact', filePath, 1, `无法解析 ${field}`));
      return null;
    }
  }
  return absolutePath;
}

function requireArtifactFile({ absolutePath, asset, diagnostics, field, filePath }) {
  if (!absolutePath || !existsSync(absolutePath)) {
    if (absolutePath) {
      diagnostics.push(diagnostic('error', 'infographic-artifact', filePath, 1, `${asset.assetId} 缺少 ${field}：${asset[field]}`));
    }
    return false;
  }
  try {
    const info = statSync(absolutePath);
    if (!info.isFile() || info.size === 0) {
      diagnostics.push(diagnostic('error', 'infographic-artifact', filePath, 1, `${asset.assetId} 的 ${field} 必须是非空文件`));
      return false;
    }
  } catch {
    diagnostics.push(diagnostic('error', 'infographic-artifact', filePath, 1, `无法读取 ${asset.assetId} 的 ${field}`));
    return false;
  }
  return true;
}

function readUploadRecord({ absolutePath, asset, diagnostics, filePath }) {
  if (!absolutePath || !existsSync(absolutePath)) return null;
  try {
    return JSON.parse(readFileSync(absolutePath, 'utf8'));
  } catch {
    diagnostics.push(diagnostic('error', 'image-upload-record', filePath, 1, `${asset.assetId} 的 upload.json 不是有效 JSON`));
    return null;
  }
}

function lintUploadRecord({ actualImageHash, asset, diagnostics, filePath, item, record }) {
  if (!record) return;
  const mismatches = [];
  if (record.version !== 2) mismatches.push('version');
  if (record.status !== 'uploaded') mismatches.push('status');
  if (normalizePath(record.article) !== normalizePath(item.article)) mismatches.push('article');
  if (record.series !== item.series) mismatches.push('series');
  if (record.number !== item.number) mismatches.push('number');
  if (record.assetId !== asset.assetId) mismatches.push('assetId');
  if (normalizePath(record.localPath) !== normalizePath(asset.localPath)) mismatches.push('localPath');
  if (record.remoteUrl !== asset.remoteUrl || !isHttpsUrl(record.remoteUrl)) mismatches.push('remoteUrl');
  if (record.imageHash !== asset.imageHash || record.imageHash !== actualImageHash) mismatches.push('imageHash');
  if (record.contentHash !== asset.contentHash || record.contentHash !== item.contentHash) mismatches.push('contentHash');
  if (record.promptHash !== asset.promptHash) mismatches.push('promptHash');
  if (typeof record.provider !== 'string' || !record.provider.trim()) mismatches.push('provider');
  if (asset.uploadProvider && record.provider !== asset.uploadProvider) mismatches.push('provider');

  if (mismatches.length > 0) {
    diagnostics.push(
      diagnostic('error', 'image-upload-record', filePath, 1, `${asset.assetId} 的 upload.json 字段不一致：${[...new Set(mismatches)].join(', ')}`),
    );
  }
}

function lintInfographicEvidence({ content, filePath, images, manifest, repoRoot }) {
  const diagnostics = [];
  if (manifest?.version !== 2 || !Array.isArray(manifest?.items)) {
    diagnostics.push(diagnostic('error', 'infographic-manifest', filePath, 1, '缺少有效的 v2 信息图 manifest'));
    return diagnostics;
  }

  const matches = manifest.items.filter((item) => normalizePath(item?.article) === normalizePath(filePath));
  if (matches.length !== 1) {
    diagnostics.push(
      diagnostic('error', 'infographic-manifest', filePath, 1, matches.length === 0 ? 'manifest 缺少当前文章' : 'manifest 中当前文章重复'),
    );
    return diagnostics;
  }

  const item = matches[0];
  const actualContentHash = hashArticleContent(content);
  if (item.contentHash !== actualContentHash) {
    diagnostics.push(
      diagnostic('error', 'infographic-content-hash', filePath, 1, 'manifest contentHash 与当前文章正文不一致'),
    );
  }
  if (!Array.isArray(item.assets) || item.assets.length === 0) {
    diagnostics.push(diagnostic('error', 'infographic-manifest', filePath, 1, '当前文章没有信息图 asset'));
    return diagnostics;
  }
  const workDir = resolveWorkDir({ diagnostics, filePath, item, repoRoot });
  if (!workDir) return diagnostics;

  const httpsImages = images.filter((image) => isHttpsUrl(image.source));
  const checkedSources = new Set();
  const assetUrls = new Set(item.assets.map((asset) => asset?.remoteUrl).filter(Boolean));
  for (const image of httpsImages) {
    if (!assetUrls.has(image.source)) {
      diagnostics.push(
        diagnostic('error', 'image-upload-record', filePath, lineAt(content, image.index), '远程图片不属于当前文章的 manifest assets'),
      );
    }
  }

  for (const asset of item.assets) {
    if (!asset || typeof asset.assetId !== 'string' || !asset.assetId) {
      diagnostics.push(diagnostic('error', 'infographic-manifest', filePath, 1, '信息图 asset 缺少 assetId'));
      continue;
    }
    if (asset.status !== 'uploaded' || !isHttpsUrl(asset.remoteUrl)) {
      diagnostics.push(diagnostic('error', 'infographic-manifest', filePath, 1, `${asset.assetId} 尚未完成 HTTPS 上传`));
    }
    if (!httpsImages.some((image) => image.source === asset.remoteUrl)) {
      diagnostics.push(diagnostic('error', 'infographic', filePath, 1, `${asset.assetId} 的远程图片尚未插入正文`));
    }
    if (!/^[a-f0-9]{64}$/u.test(item.contentHash ?? '') || asset.contentHash !== item.contentHash) {
      diagnostics.push(diagnostic('error', 'infographic-manifest', filePath, 1, `${asset.assetId} 的 contentHash 与文章不一致`));
    }

    const artifactPaths = {};
    for (const field of [
      'sourcePath',
      'analysisPath',
      'structuredContentPath',
      'promptPath',
      'uploadRecordPath',
      'localPath',
    ]) {
      artifactPaths[field] = resolveAssetPath({ asset, diagnostics, field, filePath, repoRoot, workDir });
      requireArtifactFile({ absolutePath: artifactPaths[field], asset, diagnostics, field, filePath });
    }

    if (artifactPaths.sourcePath && existsSync(artifactPaths.sourcePath)
      && !checkedSources.has(artifactPaths.sourcePath)) {
      checkedSources.add(artifactPaths.sourcePath);
      try {
        const sourceHash = hashArticleContent(readFileSync(artifactPaths.sourcePath, 'utf8'));
        if (sourceHash !== actualContentHash) {
          diagnostics.push(
            diagnostic('error', 'infographic-source-snapshot', filePath, 1, 'source.md 与当前文章正文不一致'),
          );
        }
      } catch {
        diagnostics.push(diagnostic('error', 'infographic-source-snapshot', filePath, 1, '无法核验 source.md 原文快照'));
      }
    }

    if (artifactPaths.promptPath && existsSync(artifactPaths.promptPath)) {
      try {
        const actualPromptHash = sha256(readFileSync(artifactPaths.promptPath));
        if (asset.promptHash !== actualPromptHash) {
          diagnostics.push(diagnostic('error', 'infographic-artifact', filePath, 1, `${asset.assetId} 的 promptHash 与提示词文件不一致`));
        }
      } catch {
        diagnostics.push(diagnostic('error', 'infographic-artifact', filePath, 1, `无法计算 ${asset.assetId} 的 promptHash`));
      }
    }

    let actualImageHash = '';
    if (artifactPaths.localPath && existsSync(artifactPaths.localPath)) {
      try {
        actualImageHash = sha256(readFileSync(artifactPaths.localPath));
        if (asset.imageHash !== actualImageHash) {
          diagnostics.push(diagnostic('error', 'image-upload-integrity', filePath, 1, `${asset.assetId} 的 imageHash 与本地图片不一致`));
        }
      } catch {
        diagnostics.push(diagnostic('error', 'image-upload-integrity', filePath, 1, `无法计算 ${asset.assetId} 的 imageHash`));
      }
    }

    const record = readUploadRecord({
      absolutePath: artifactPaths.uploadRecordPath,
      asset,
      diagnostics,
      filePath,
    });
    lintUploadRecord({ actualImageHash, asset, diagnostics, filePath, item, record });
  }
  return diagnostics;
}

function lintLocalLinks({ absoluteFilePath, content, filePath, fileExists, inlineLinks }) {
  const diagnostics = [];
  for (const link of inlineLinks) {
    if (link.isImage) continue;
    if (link.missingReference) {
      diagnostics.push(
        diagnostic('error', 'local-link', filePath, lineAt(content, link.index), '引用式链接缺少定义'),
      );
      continue;
    }
    const target = link.source;
    if (/^(?:[a-z][a-z\d+.-]*:|#|\?|\/)/iu.test(target)) continue;

    const separator = target.search(/[?#]/u);
    const targetPath = separator >= 0 ? target.slice(0, separator) : target;
    if (!targetPath) continue;
    let cleanTarget;
    try {
      cleanTarget = decodeURIComponent(targetPath);
    } catch {
      diagnostics.push(
        diagnostic('error', 'local-link', filePath, lineAt(content, link.index), `本地链接包含无效百分号编码：${target}`),
      );
      continue;
    }
    if (!path.isAbsolute(absoluteFilePath ?? '')) {
      diagnostics.push(
        diagnostic('error', 'local-link', filePath, lineAt(content, link.index), '本地链接校验需要文章的绝对路径'),
      );
      continue;
    }
    const resolved = path.resolve(path.dirname(absoluteFilePath), cleanTarget);
    if (!fileExists(resolved)) {
      diagnostics.push(
        diagnostic('error', 'local-link', filePath, lineAt(content, link.index), `本地链接不存在：${target}`),
      );
    }
  }
  return diagnostics;
}

function lintLongDialogue({ content, filePath }) {
  const heading = /^##\s+面试追问\s*$/mu.exec(content);
  if (!heading) return [];
  const sectionStart = heading.index + heading[0].length;
  const remainder = content.slice(sectionStart);
  const nextHeading = remainder.search(/^##\s+/mu);
  const section = nextHeading >= 0 ? remainder.slice(0, nextHeading) : remainder;
  const questionCount = [...section.matchAll(/^\s*(?:\*\*)?(?:问|Q)\s*[：:]/gimu)].length;
  if (questionCount <= 4) return [];
  return [
    diagnostic('warning', 'long-interview-dialogue', filePath, lineAt(content, heading.index), `面试追问包含 ${questionCount} 轮对话，建议压缩到 4 轮以内`),
  ];
}

function lintStrongAssertions({ content, filePath }) {
  const diagnostics = [];
  const lines = content.split(/\r?\n/u);
  lines.forEach((line, index) => {
    STRONG_ASSERTION_PATTERN.lastIndex = 0;
    const match = STRONG_ASSERTION_PATTERN.exec(line);
    if (!match) return;
    diagnostics.push(
      diagnostic('warning', 'strong-assertion', filePath, index + 1, `强断言“${match[0]}”需要补充条件或来源`),
    );
  });
  return diagnostics;
}

export function lintMarkdown({
  absoluteFilePath,
  filePath,
  content,
  manifest = null,
  repoRoot,
  requireInfographic = true,
  fileExists = existsSync,
}) {
  const input = { filePath, content };
  const proseContent = maskMarkdownContexts(content);
  const proseInput = { filePath, content: proseContent };
  const inlineLinks = extractInlineLinks(proseContent);
  const images = extractImages(proseContent, inlineLinks);
  return [
    ...lintFrontmatter(input),
    ...lintControlCharacters(input),
    ...lintCodeFences(input),
    ...lintStructure(proseInput),
    ...lintSources(proseInput),
    ...lintImageBasics({ ...input, images }),
    ...(requireInfographic ? lintInfographicEvidence({ ...input, images, manifest, repoRoot }) : []),
    ...lintLocalLinks({ ...input, absoluteFilePath, fileExists, inlineLinks }),
    ...lintLongDialogue(proseInput),
    ...lintStrongAssertions(proseInput),
  ];
}

export function lintManifest(manifest, filePath = 'docs/infographics/ai-interview/manifest.json') {
  if (!manifest) {
    return [diagnostic('error', 'infographic-manifest-schema', filePath, 1, '缺少信息图 manifest')];
  }
  return validateInfographicManifest(manifest).map((message) => (
    diagnostic('error', 'infographic-manifest-schema', filePath, 1, message)
  ));
}

export function lintNumbering(files) {
  const diagnostics = [];
  const groups = new Map();

  for (const file of files) {
    const normalized = normalizePath(file);
    const name = path.posix.basename(normalized);
    const match = name.match(/^(\d{2})\./u);
    if (!match) continue;
    const directory = path.posix.dirname(normalized);
    const entries = groups.get(directory) ?? [];
    entries.push({ filePath: file, number: Number(match[1]) });
    groups.set(directory, entries);
  }

  for (const entries of groups.values()) {
    const byNumber = new Map();
    for (const entry of entries) {
      const matches = byNumber.get(entry.number) ?? [];
      matches.push(entry.filePath);
      byNumber.set(entry.number, matches);
    }

    for (const [number, matches] of byNumber) {
      if (matches.length > 1) {
        diagnostics.push(
          diagnostic('error', 'numbering-duplicate', matches[1], 1, `编号 ${String(number).padStart(2, '0')} 重复`),
        );
      }
    }

    const max = Math.max(...byNumber.keys());
    for (let number = 0; number <= max; number += 1) {
      if (!byNumber.has(number)) {
        diagnostics.push(
          diagnostic('error', 'numbering-gap', entries[0].filePath, 1, `缺少编号 ${String(number).padStart(2, '0')}`),
        );
      }
    }
  }
  return diagnostics;
}

export function formatDiagnostic(item) {
  return `${item.filePath}:${item.line} ${item.severity} [${item.rule}] ${item.message}`;
}
