import { createHash, randomUUID } from 'node:crypto';
import { access, lstat, mkdir, readFile, realpath, rename, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { hashArticleContent, validateInfographicManifest } from './generate-infographic-manifest.mjs';
import { acquireManifestLock } from './infographic-manifest-lock.mjs';
import { validateUploadManifest } from './upload-infographics.mjs';

const INFOGRAPHIC_ROOT = 'docs/infographics/ai-interview';
const CONTENT_ROOT = 'src/content/blog/AI应用开发';

const ASPECT_RATIOS = {
  landscape: '16:9',
  portrait: '9:16',
  square: '1:1',
};

const DATA_TYPES = {
  'bento-grid': 'overview',
  'comparison-matrix': 'comparison',
  dashboard: 'data',
  'linear-progression': 'process',
  'structural-breakdown': 'system',
};

const ALTERNATIVES = {
  'bento-grid': [
    ['hub-spoke', 'hand-drawn-edu'],
    ['dense-modules', 'pop-laboratory'],
  ],
  'comparison-matrix': [
    ['binary-comparison', 'corporate-memphis'],
    ['dense-modules', 'pop-laboratory'],
  ],
  dashboard: [
    ['dense-modules', 'pop-laboratory'],
    ['bento-grid', 'corporate-memphis'],
  ],
  'linear-progression': [
    ['winding-roadmap', 'hand-drawn-edu'],
    ['circular-flow', 'technical-schematic'],
  ],
  'structural-breakdown': [
    ['hub-spoke', 'technical-schematic'],
    ['bento-grid', 'hand-drawn-edu'],
  ],
};

function yamlString(value) {
  return JSON.stringify(String(value));
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) throw new Error('Article is missing frontmatter');

  const readField = (name) => {
    const field = match[1].match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
    if (!field) return '';
    const raw = field[1].trim();
    if (raw.startsWith('"') && raw.endsWith('"')) {
      try {
        return JSON.parse(raw);
      } catch {
        return raw.slice(1, -1);
      }
    }
    return raw.replace(/^['"]|['"]$/g, '');
  };

  return {
    title: readField('title'),
    description: readField('description'),
    body: content.slice(match[0].length),
  };
}

function parseSections(body) {
  const headings = [...body.matchAll(/^##\s+(.+?)\s*$/gm)];
  return headings.map((heading, index) => ({
    title: heading[1].trim(),
    content: body
      .slice(heading.index + heading[0].length, headings[index + 1]?.index ?? body.length)
      .trim(),
  }));
}

function splitBlocks(content) {
  const blocks = content
    .replace(/^\s*!\[[^\]]*\]\([^\n]*\)\s*$/gm, '')
    .replace(/^\s*<img\b[^>]*>\s*$/gim, '')
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const grouped = [];
  for (let index = 0; index < blocks.length; index += 1) {
    if (/^###\s+[^\n]+$/u.test(blocks[index]) && blocks[index + 1]) {
      grouped.push(`${blocks[index]}\n${blocks[index + 1]}`);
      index += 1;
    } else {
      grouped.push(blocks[index]);
    }
  }
  return grouped;
}

function stripMarkdownDestinations(value) {
  return value.replace(/\[([^\]]+)\]\((?:<[^>\r\n]+>|(?:[^()\r\n]|\([^()\r\n]*\))*)\)/gu, '$1');
}

function takeTable(block) {
  const lines = block.split(/\r?\n/);
  if (lines.length < 2 || !lines[0].trim().startsWith('|') || !lines[1].includes('---')) return null;
  return stripMarkdownDestinations(lines.join('\n'));
}

function compactBlock(block, maxChars) {
  const cleanBlock = stripMarkdownDestinations(block);
  const lines = cleanBlock.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1 && lines.every((line) => /^(?:[-*+] |\d+[.)]\s)/u.test(line))) {
    return lines.slice(0, 4).join('\n');
  }
  if (lines[0]?.startsWith('### ')) {
    const detail = lines.slice(1).join(' ');
    const compactDetail = detail.match(/^[^。！？；]+[。！？；]?/u)?.[0] ?? '';
    return [lines[0], compactDetail].filter(Boolean).join('\n');
  }
  if (cleanBlock.length <= maxChars) return cleanBlock;
  const table = takeTable(cleanBlock);
  if (table) return table;

  const sentences = cleanBlock.match(/[^。！？；\n]+[。！？；]?/g) ?? [cleanBlock];
  const selected = [];
  let length = 0;
  for (const sentence of sentences) {
    const next = sentence.trim();
    if (!next) continue;
    if (selected.length > 0 && length + next.length > maxChars) break;
    selected.push(next);
    length += next.length;
  }
  return selected.join('');
}

function compactSection(content, { maxBlocks = 3, maxChars = 520 } = {}) {
  const blocks = splitBlocks(content);
  const selected = [];
  let length = 0;

  for (const block of blocks) {
    const table = takeTable(block);
    const compact = table ?? compactBlock(block, Math.min(maxChars, 180));
    if (!compact) continue;
    if (!table && selected.length > 0 && length + compact.length > maxChars) break;
    selected.push(compact);
    length += compact.length;
    if (selected.length >= maxBlocks) break;
  }

  return selected.join('\n\n');
}

function selectVisualSections(sections, layout, assetId = 'primary') {
  const byTitle = new Map(sections.map((section) => [section.title, section]));
  const standardOrder = assetId === 'secondary-02'
    ? ['详细解析', '工程实践与边界', '面试追问', '常见误区']
    : assetId === 'secondary-03'
      ? ['工程实践与边界', '常见误区', '面试追问', '详细解析']
      : ['60 秒回答', '详细解析', '工程实践与边界', '常见误区'];
  const selected = standardOrder.map((title) => byTitle.get(title)).filter(Boolean);
  const fallback = sections.filter((section) => section.title !== '参考资料' && !selected.includes(section));
  const result = [...selected, ...fallback].slice(0, 4);

  return result.map((section) => ({
    title: section.title,
    content: compactSection(section.content, {
      maxBlocks: layout === 'bento-grid' ? 3 : 4,
      maxChars: layout === 'comparison-matrix' ? 620 : 520,
    }),
  }));
}

function extractDataPoints(sections) {
  const body = sections
    .filter((section) => !['参考资料', '面试追问'].includes(section.title))
    .map((section) => section.content)
    .join('\n');
  const points = [];
  let insideFence = false;

  for (const line of body.split(/\r?\n/)) {
    const value = line.trim();
    if (/^```/.test(value)) {
      insideFence = !insideFence;
      continue;
    }
    if (insideFence || !value || /^\|\s*[-:]|^!\[|^<img\b/i.test(value)) continue;
    if (/^(?:\d+[.)]\s+)?\[[^\]]+\]\(/u.test(value)) continue;
    const semanticValue = value.replace(/^\d+[.)]\s+/, '');
    if (/\d|%| MUST\b| SHOULD\b| MAY\b/.test(semanticValue) || value.startsWith('>')) {
      points.push(value.replace(/^[-*>]\s*/, ''));
    }
  }
  return [...new Set(points)];
}

function sourceEvidence(body) {
  const referenceStart = body.search(/^##\s+参考资料\s*$/m);
  const withoutReferences = referenceStart >= 0 ? body.slice(0, referenceStart) : body;
  return withoutReferences
    .replace(/^\s*!\[[^\]]*\]\([^\n]*\)\s*$/gm, '')
    .replace(/^\s*<img\b[^>]*>\s*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function topicForSeries(series) {
  return {
    overview: 'AI application engineering',
    agent: 'AI Agent engineering',
    rag: 'RAG engineering',
    tools: 'LLM tool integration',
    llm: 'large language model engineering',
  }[series] ?? 'AI application engineering';
}

function objectiveText(layout, title) {
  const topic = title.replace(/^\d+\.\s*/, '');
  const objective = {
    'comparison-matrix': `比较“${topic}”涉及的主要方案与选型维度`,
    'linear-progression': `复述“${topic}”的关键流程与控制点`,
    dashboard: `识别“${topic}”的核心指标、信号与评估边界`,
    'structural-breakdown': `说明“${topic}”的组成部分及其关系`,
    'bento-grid': `建立“${topic}”的完整知识框架`,
  }[layout];
  return objective ?? `理解“${topic}”的核心概念`;
}

function buildAnalysis({ title, description, series, layout, style, body, sections, assetId }) {
  const dataPoints = extractDataPoints(sections);
  const pointCount = selectVisualSections(sections, layout, assetId).length;
  const complexity = body.length >= 2200 ? 'complex' : body.length >= 1200 ? 'moderate' : 'simple';
  const alternatives = ALTERNATIVES[layout] ?? ALTERNATIVES['bento-grid'];

  return `---
title: ${yamlString(title)}
topic: ${yamlString(topicForSeries(series))}
data_type: ${yamlString(DATA_TYPES[layout] ?? 'overview')}
complexity: ${yamlString(complexity)}
point_count: ${pointCount}
source_language: "zh"
user_language: "zh"
---

## Main Topic

${description || title}

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. ${objectiveText(layout, title)}
2. 说明关键工程边界、失败模式与验证方法

## Target Audience

- **Knowledge Level**: Intermediate to Expert
- **Context**: 准备 AI 应用开发与大模型工程面试
- **Expectations**: 在短时间内建立可口述、可追问、可落地的答案结构

## Content Type Analysis

- **Data Structure**: ${DATA_TYPES[layout] ?? 'overview'}
- **Key Relationships**: 核心概念、工程实现、边界条件与常见误区之间的关系
- **Visual Opportunities**: 使用原文流程、比较表、组件关系、指标或分区摘要进行可视化

## Key Data Points (Verbatim)

${dataPoints.length ? dataPoints.map((point) => `- ${point}`).join('\n') : '- 原文没有需要单独强调的定量数据或规范关键词。'}

## Source Evidence (Verbatim)

${sourceEvidence(body)}

## Layout × Style Signals

- Content type: ${DATA_TYPES[layout] ?? 'overview'} → suggests ${layout}
- Tone: 专业、教育、工程导向 → suggests ${style}
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: ${complexity} → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：${assetId}

## Recommended Combinations

1. **${layout} + ${style}** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **${alternatives[0][0]} + ${alternatives[0][1]}**: 可作为更强调关系或密度的备选
3. **${alternatives[1][0]} + ${alternatives[1][1]}**: 可作为更强调工程细节的备选
`;
}

function visualElement(layout, index, title) {
  const descriptions = {
    'comparison-matrix': 'Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮',
    'linear-progression': `Type: numbered process node; Subject: ${title}；Treatment: 从左到右连接并标明第 ${index + 1} 阶段`,
    dashboard: 'Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签',
    'structural-breakdown': 'Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线',
    'bento-grid': 'Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标',
  };
  return descriptions[layout] ?? descriptions['bento-grid'];
}

function buildStructuredContent({ title, description, layout, sections, body, assetId }) {
  const visualSections = selectVisualSections(sections, layout, assetId);
  const dataPoints = extractDataPoints(sections);
  const sectionText = visualSections
    .map((section, index) => `### Visual Section ${index + 1}: ${section.title}

**Key Concept**: ${section.title}

**Content**:

${section.content}

**Visual Element**: ${visualElement(layout, index, section.title)}

**Text Labels**:

- Headline: ${yamlString(section.title)}
`)
    .join('\n---\n\n');

  return `# ${title}

## Overview

${description || title}

## Learning Objectives

The viewer will understand:

1. ${objectiveText(layout, title)}
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

${sourceEvidence(body)}

---

## On-Image Content Plan

Asset focus: ${assetId}

${sectionText}
---

## Data Points (Verbatim)

${dataPoints.length ? dataPoints.map((point) => `- ${point}`).join('\n') : '- 本图不使用额外定量数据。'}

---

## Design Instructions

### Style Preferences

- 使用 manifest 中已确认的版式与风格
- 保持简体中文清晰可读，技术名词按原文拼写

### Layout Preferences

- 横版 16:9
- 标题突出，主要信息区不超过 4 个

### Other Requirements

- 仅使用上面的原文内容，不添加事实、示例、数值或来源
- 不生成品牌标志、水印、页脚引用或装饰性长文
`;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

function assertInside(repoRoot, relativePath, allowedRoot) {
  if (typeof relativePath !== 'string' || relativePath.length === 0 || path.isAbsolute(relativePath)) {
    throw new Error(`Artifact path is outside ${INFOGRAPHIC_ROOT}: ${relativePath}`);
  }
  const target = path.resolve(repoRoot, relativePath);
  const root = path.resolve(repoRoot, allowedRoot);
  const relation = path.relative(root, target);
  if (relation === '..' || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
    throw new Error(`Artifact path is outside ${allowedRoot}: ${relativePath}`);
  }
  return target;
}

function fixedAssetPaths(workDir, assetId) {
  const suffix = assetId === 'primary' ? '' : assetId === 'secondary-02' ? '-02' : '-03';
  return {
    localPath: `${workDir}/infographic${suffix}.png`,
    sourcePath: `${workDir}/source.md`,
    analysisPath: `${workDir}/analysis${suffix}.md`,
    structuredContentPath: `${workDir}/structured-content${suffix}.md`,
    promptPath: `${workDir}/prompts/infographic${suffix}.md`,
    uploadRecordPath: `${workDir}/upload${suffix}.json`,
  };
}

function validatePreparationManifest(manifest, { repoRoot, allowPartialManifest }) {
  const errors = allowPartialManifest
    ? validateUploadManifest(manifest, { repoRoot })
    : validateInfographicManifest(manifest);

  if (manifest?.version !== 2 || !Array.isArray(manifest?.items)) {
    errors.push('manifest must use v2 items[]');
  }
  for (const item of manifest?.items ?? []) {
    for (const asset of item.assets ?? []) {
      const expected = fixedAssetPaths(item.workDir, asset.assetId);
      for (const [field, expectedPath] of Object.entries(expected)) {
        if (asset[field] !== expectedPath) {
          errors.push(`${item.series}:${item.number}:${asset.assetId} ${field} must equal ${expectedPath}`);
        }
      }
    }
  }
  if (errors.length > 0) {
    const boundary = errors.some((message) => /traversal|outside|repository-relative/i.test(message))
      ? ` Path is outside ${INFOGRAPHIC_ROOT}.`
      : '';
    throw new Error(`Manifest validation failed.${boundary}\n${errors.join('\n')}`);
  }
}

async function assertNoSymlinkPath(repoRoot, allowedRoot, target) {
  const resolvedRepo = path.resolve(repoRoot);
  const resolvedRoot = path.resolve(allowedRoot);
  const resolvedTarget = path.resolve(target);
  for (const endpoint of [resolvedRoot, resolvedTarget]) {
    const relation = path.relative(resolvedRepo, endpoint);
    let current = resolvedRepo;
    for (const segment of relation.split(path.sep).filter(Boolean)) {
      current = path.join(current, segment);
      try {
        const details = await lstat(current);
        if (details.isSymbolicLink()) throw new Error(`Symbolic links are not allowed: ${current}`);
      } catch (error) {
        if (error?.code === 'ENOENT') break;
        throw error;
      }
    }
  }

  const physicalRepo = await realpath(resolvedRepo);
  const physicalRoot = await realpath(resolvedRoot);
  const rootRelation = path.relative(physicalRepo, physicalRoot);
  if (rootRelation === '..' || rootRelation.startsWith(`..${path.sep}`) || path.isAbsolute(rootRelation)) {
    throw new Error(`${INFOGRAPHIC_ROOT} resolves outside the repository`);
  }
}

function normalizedTimestamp(date = new Date()) {
  const iso = date.toISOString();
  return `${iso.slice(0, 10).replaceAll('-', '')}-${iso.slice(11, 19).replaceAll(':', '')}`;
}

async function uniqueBackupPath(filePath, timestamp) {
  const extension = path.extname(filePath);
  const stem = path.join(path.dirname(filePath), `${path.basename(filePath, extension)}-backup-${timestamp}`);
  let candidate = `${stem}${extension}`;
  let sequence = 2;
  while (await exists(candidate)) {
    candidate = `${stem}-${String(sequence).padStart(2, '0')}${extension}`;
    sequence += 1;
  }
  return candidate;
}

async function writeReproducibilityFile(filePath, content, timestamp) {
  await mkdir(path.dirname(filePath), { recursive: true });
  if (await exists(filePath)) {
    await rename(filePath, await uniqueBackupPath(filePath, timestamp));
    await writeFile(filePath, content, 'utf8');
    return { written: 1, backedUp: 1 };
  }
  await writeFile(filePath, content, 'utf8');
  return { written: 1, backedUp: 0 };
}

async function atomicWriteJson(filePath, value) {
  const temporary = path.join(path.dirname(filePath), `.${path.basename(filePath)}.${process.pid}.${randomUUID()}.tmp`);
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(temporary, filePath);
}

function sensitiveLine(content) {
  const patterns = [
    /\bsk-[A-Za-z0-9_-]{20,}\b/,
    /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
    /\bAKIA[0-9A-Z]{16}\b/,
    /\bAIza[A-Za-z0-9_-]{35}\b/,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  ];
  const lines = content.split(/\r?\n/);
  const index = lines.findIndex((line) => {
    if (patterns.some((pattern) => pattern.test(line))) return true;
    const assignment = line.match(
      /\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)\s*[:=]\s*["']?([^"'\s,;]+)/iu,
    );
    if (!assignment || assignment[1].length < 16) return false;
    return !/^(?:your|example|test|dummy|xxx|changeme|redacted|os\.|process\.env|env\.|\$\{|<)/iu.test(assignment[1]);
  });
  return index >= 0 ? index + 1 : null;
}

async function resolveReferenceRoot(referenceRoot) {
  const candidates = referenceRoot
    ? [referenceRoot]
    : [
        process.env.BAOYU_INFOGRAPHIC_REFERENCES,
        path.join(os.homedir(), '.agents/skills/baoyu-infographic/references'),
        path.join(os.homedir(), '.skills-manager/skills/baoyu-infographic/references'),
      ].filter(Boolean);

  for (const candidate of candidates) {
    if (await exists(path.join(candidate, 'base-prompt.md'))) return path.resolve(candidate);
  }
  throw new Error('Cannot locate baoyu-infographic references; set BAOYU_INFOGRAPHIC_REFERENCES');
}

function fillPrompt(template, values) {
  return Object.entries(values).reduce(
    (content, [key, value]) => content.replaceAll(`{{${key}}}`, value),
    template,
  );
}

export async function prepareInfographics({
  repoRoot = process.cwd(),
  manifestPath = path.join(repoRoot, INFOGRAPHIC_ROOT, 'manifest.json'),
  referenceRoot,
  timestamp,
  allowPartialManifest = false,
} = {}) {
  const absoluteRepoRoot = path.resolve(repoRoot);
  const absoluteManifestPath = path.isAbsolute(manifestPath)
    ? manifestPath
    : path.resolve(absoluteRepoRoot, manifestPath);
  const backupTimestamp = timestamp ?? normalizedTimestamp();
  if (!/^\d{8}-\d{6}$/u.test(backupTimestamp)) {
    throw new Error(`Invalid backup timestamp: ${backupTimestamp}; expected YYYYMMDD-HHMMSS`);
  }
  const references = await resolveReferenceRoot(referenceRoot);
  const releaseLock = await acquireManifestLock(absoluteManifestPath);
  try {
    const manifest = JSON.parse(await readFile(absoluteManifestPath, 'utf8'));
    validatePreparationManifest(manifest, { repoRoot: absoluteRepoRoot, allowPartialManifest });
    const articles = manifest.items;

  const basePrompt = await readFile(path.join(references, 'base-prompt.md'), 'utf8');
  const layoutDefinitions = new Map();
  const styleDefinitions = new Map();
  for (const article of articles) {
    if (!layoutDefinitions.has(article.layout)) {
      layoutDefinitions.set(
        article.layout,
        await readFile(path.join(references, 'layouts', `${article.layout}.md`), 'utf8'),
      );
    }
    if (!styleDefinitions.has(article.style)) {
      styleDefinitions.set(
        article.style,
        await readFile(path.join(references, 'styles', `${article.style}.md`), 'utf8'),
      );
    }
  }

  const allowedInfographicRoot = path.resolve(absoluteRepoRoot, INFOGRAPHIC_ROOT);
  const allowedContentRoot = path.resolve(absoluteRepoRoot, CONTENT_ROOT);
  const assetSpecificPaths = new Set();
  const sourceOwners = new Map();
  const reservedPaths = new Set([path.resolve(absoluteManifestPath)]);
  const preparedArticles = [];

  for (const article of articles) {
    const articlePath = assertInside(absoluteRepoRoot, article.article, CONTENT_ROOT);
    await assertNoSymlinkPath(absoluteRepoRoot, allowedContentRoot, articlePath);
    const source = await readFile(articlePath, 'utf8');
    const currentContentHash = hashArticleContent(source);
    if (currentContentHash !== article.contentHash) {
      throw new Error(`contentHash is stale for ${article.series}:${article.number}`);
    }
    const credentialLine = sensitiveLine(source);
    if (credentialLine !== null) {
      throw new Error(`SENSITIVE_VALUE_DETECTED in ${article.article} at line ${credentialLine}`);
    }
    const parsed = parseFrontmatter(source);
    const sections = parseSections(parsed.body);
    const preparedAssets = [];

    for (const asset of article.assets) {
      const layout = asset.layout ?? article.layout;
      const style = asset.style ?? article.style;
      const aspect = asset.aspect ?? article.aspect;
      const language = asset.language ?? article.language;
      if (!DATA_TYPES[layout]) throw new Error(`Unsupported layout: ${layout}`);

      const paths = {
        source: assertInside(absoluteRepoRoot, asset.sourcePath, INFOGRAPHIC_ROOT),
        analysis: assertInside(absoluteRepoRoot, asset.analysisPath, INFOGRAPHIC_ROOT),
        structured: assertInside(absoluteRepoRoot, asset.structuredContentPath, INFOGRAPHIC_ROOT),
        prompt: assertInside(absoluteRepoRoot, asset.promptPath, INFOGRAPHIC_ROOT),
      };
      const previousSourceOwner = sourceOwners.get(paths.source);
      if (previousSourceOwner && previousSourceOwner !== article.article) {
        throw new Error(`Duplicate sourcePath across articles: ${asset.sourcePath}`);
      }
      sourceOwners.set(paths.source, article.article);
      for (const target of [paths.analysis, paths.structured, paths.prompt]) {
        if (assetSpecificPaths.has(target)) throw new Error(`Duplicate artifact path: ${target}`);
        assetSpecificPaths.add(target);
      }
      for (const relative of [asset.localPath, asset.uploadRecordPath]) {
        reservedPaths.add(assertInside(absoluteRepoRoot, relative, INFOGRAPHIC_ROOT));
      }
      for (const target of Object.values(paths)) {
        if (reservedPaths.has(target)) throw new Error(`Reproducibility path overlaps a reserved path: ${target}`);
        await assertNoSymlinkPath(absoluteRepoRoot, allowedInfographicRoot, target);
      }

      const analysis = buildAnalysis({
        title: parsed.title || article.title,
        description: parsed.description,
        series: article.series,
        layout,
        style,
        body: parsed.body,
        sections,
        assetId: asset.assetId,
      });
      const structured = buildStructuredContent({
        title: parsed.title || article.title,
        description: parsed.description,
        layout,
        sections,
        body: parsed.body,
        assetId: asset.assetId,
      });
      const textLabels = [
        parsed.title || article.title,
        ...selectVisualSections(sections, layout, asset.assetId).map((section) => section.title),
      ]
        .map((label) => `- ${label}`)
        .join('\n');
      const prompt = fillPrompt(basePrompt, {
        LAYOUT: layout,
        STYLE: style,
        ASPECT_RATIO: ASPECT_RATIOS[aspect] ?? aspect,
        LANGUAGE: language,
        LAYOUT_GUIDELINES: layoutDefinitions.get(layout),
        STYLE_GUIDELINES: styleDefinitions.get(style),
        CONTENT: structured,
        TEXT_LABELS: textLabels,
      });
      preparedAssets.push({ asset, paths, analysis, structured, prompt });
    }
    preparedArticles.push({ article, source, assets: preparedAssets });
  }

  const summary = {
    articles: articles.length,
    assets: preparedArticles.reduce((count, article) => count + article.assets.length, 0),
    written: 0,
    backedUp: 0,
    manifestUpdates: 0,
  };
  const writtenSources = new Set();
  for (const preparedArticle of preparedArticles) {
    for (const preparedAsset of preparedArticle.assets) {
      const writes = [];
      if (!writtenSources.has(preparedAsset.paths.source)) {
        writes.push([preparedAsset.paths.source, preparedArticle.source]);
        writtenSources.add(preparedAsset.paths.source);
      }
      writes.push(
        [preparedAsset.paths.analysis, preparedAsset.analysis],
        [preparedAsset.paths.structured, preparedAsset.structured],
        [preparedAsset.paths.prompt, preparedAsset.prompt],
      );

      for (const [target, content] of writes) {
        const result = await writeReproducibilityFile(target, content, backupTimestamp);
        summary.written += result.written;
        summary.backedUp += result.backedUp;
      }

      const promptHash = sha256(preparedAsset.prompt);
      if (preparedAsset.asset.promptHash !== promptHash) {
        preparedAsset.asset.promptHash = promptHash;
        preparedAsset.asset.imageHash = '';
        preparedAsset.asset.remoteUrl = '';
        preparedAsset.asset.status = 'planned';
        delete preparedAsset.asset.generatedAt;
        delete preparedAsset.asset.uploadedAt;
        delete preparedAsset.asset.uploadProvider;
        delete preparedAsset.asset.lastAttemptedAt;
        delete preparedAsset.asset.lastError;
        summary.manifestUpdates += 1;
        await atomicWriteJson(absoluteManifestPath, manifest);
      }
    }
  }

    return summary;
  } finally {
    await releaseLock();
  }
}

async function main() {
  const manifestIndex = process.argv.indexOf('--manifest');
  const manifestPath = manifestIndex >= 0 ? process.argv[manifestIndex + 1] : undefined;
  const summary = await prepareInfographics({ manifestPath });
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`prepare-infographics: ${error.message}\n`);
    process.exitCode = 1;
  });
}
