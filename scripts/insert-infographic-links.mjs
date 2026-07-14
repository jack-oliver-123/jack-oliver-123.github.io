import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import {
  lstat,
  mkdir,
  readFile,
  realpath,
  rename,
  stat,
  unlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { validateInfographicManifest } from './generate-infographic-manifest.mjs';
import { acquireManifestLock } from './infographic-manifest-lock.mjs';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
const CONTENT_ROOT = path.join('src', 'content', 'blog', 'AI应用开发');
const DEFAULT_MANIFEST = path.join(REPO_ROOT, 'docs', 'infographics', 'ai-interview', 'manifest.json');
const SERIES = new Set(['overview', 'agent', 'rag', 'tools', 'llm']);
const STATUSES = new Set(['planned', 'generated', 'upload-failed', 'uploaded']);
const POSITIONS = new Map([
  ['after-60-second-answer', '60 秒回答'],
  ['after-detailed-analysis', '详细解析'],
  ['after-engineering-practice', '工程实践与边界'],
]);

export class InsertionError extends Error {
  constructor(code, message, options = {}) {
    super(message, options);
    this.name = 'InsertionError';
    this.code = code;
  }
}

function normalize(value) {
  return value.replaceAll('\\', '/');
}

function isWithin(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (
    relative !== '..'
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative)
  );
}

function validHttpsUrl(value) {
  if (typeof value !== 'string' || value === '' || /\s/u.test(value)) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:'
      && parsed.hostname !== ''
      && parsed.username === ''
      && parsed.password === '';
  } catch {
    return false;
  }
}

function resolveArticlePathShape(article, { repoRoot = REPO_ROOT } = {}) {
  if (typeof article !== 'string' || article.trim() === '') {
    throw new InsertionError('ARTICLE_PATH_INVALID', 'article must be a non-empty repository-relative path');
  }
  if (article.includes('\0') || path.isAbsolute(article)
    || path.win32.isAbsolute(article) || path.posix.isAbsolute(article)) {
    throw new InsertionError('ARTICLE_PATH_INVALID', 'article must be repository-relative');
  }
  if (article.split(/[\\/]+/u).some((segment) => segment === '.' || segment === '..')) {
    throw new InsertionError('ARTICLE_PATH_TRAVERSAL', 'article contains a traversal segment');
  }
  const contentRoot = path.resolve(repoRoot, CONTENT_ROOT);
  const absolute = path.resolve(repoRoot, article);
  if (!isWithin(contentRoot, absolute)) {
    throw new InsertionError('ARTICLE_PATH_OUTSIDE_ROOT', 'article is outside src/content/blog/AI应用开发');
  }
  if (!/\.mdx?$/iu.test(absolute)) {
    throw new InsertionError('ARTICLE_EXTENSION_INVALID', 'article must use .md or .mdx');
  }
  return { absolute, contentRoot };
}

export function validateInsertionManifest(manifest, {
  repoRoot = REPO_ROOT,
  requireCompleteCorpus = false,
} = {}) {
  const errors = [];
  const items = Array.isArray(manifest?.items) ? manifest.items : [];
  if (manifest?.version !== 2) errors.push('version must be 2');
  if (items.length === 0) errors.push('items must not be empty');
  const articles = new Set();

  for (const [itemIndex, item] of items.entries()) {
    const label = typeof item?.article === 'string' ? item.article : `items[${itemIndex}]`;
    if (!SERIES.has(item?.series)) errors.push(`${label}: unknown series ${String(item?.series)}`);
    if (typeof item?.title !== 'string' || item.title.trim() === '') errors.push(`${label}: title is required`);
    try {
      resolveArticlePathShape(item?.article, { repoRoot });
    } catch (error) {
      errors.push(`${label}: ${error.message}`);
    }
    if (articles.has(item?.article)) errors.push(`${label}: duplicate article`);
    articles.add(item?.article);
    if (!Array.isArray(item?.assets) || item.assets.length === 0) {
      errors.push(`${label}: assets must not be empty`);
      continue;
    }
    const assetIds = new Set();
    for (const [assetIndex, asset] of item.assets.entries()) {
      const assetLabel = `${label}.assets[${assetIndex}]`;
      if (typeof asset?.assetId !== 'string' || asset.assetId === '') {
        errors.push(`${assetLabel}: assetId is required`);
      }
      if (assetIds.has(asset?.assetId)) errors.push(`${assetLabel}: duplicate assetId`);
      assetIds.add(asset?.assetId);
      if (!STATUSES.has(asset?.status)) errors.push(`${assetLabel}: invalid status ${String(asset?.status)}`);
      if (!POSITIONS.has(asset?.position)) errors.push(`${assetLabel}: invalid position ${String(asset?.position)}`);
      if (typeof asset?.remoteUrl !== 'string') errors.push(`${assetLabel}: remoteUrl must be a string`);
      if (asset?.remoteUrl && !validHttpsUrl(asset.remoteUrl)) {
        errors.push(`${assetLabel}: remoteUrl must use HTTPS`);
      }
      if (asset?.status === 'uploaded' && !validHttpsUrl(asset?.remoteUrl)) {
        errors.push(`${assetLabel}: uploaded assets require an HTTPS remoteUrl`);
      }
      if (asset?.status !== 'uploaded' && asset?.remoteUrl) {
        errors.push(`${assetLabel}: only uploaded assets may have remoteUrl`);
      }
    }
  }

  if (requireCompleteCorpus) errors.push(...validateInfographicManifest(manifest));
  return errors;
}

function assertValidManifest(manifest, options = {}) {
  const errors = validateInsertionManifest(manifest, options);
  if (errors.length > 0) {
    throw new InsertionError('MANIFEST_INVALID', `Manifest validation failed: ${errors.join('; ')}`);
  }
}

export function createInsertionPlan(manifest, {
  series = 'all',
  repoRoot = REPO_ROOT,
  requireCompleteCorpus = false,
} = {}) {
  if (series !== 'all' && !SERIES.has(series)) {
    throw new InsertionError('UNKNOWN_SERIES', `Unknown series: ${String(series)}`);
  }
  assertValidManifest(manifest, { repoRoot, requireCompleteCorpus });
  const items = manifest.items
    .filter((item) => series === 'all' || item.series === series)
    .map((item) => ({
      ...item,
      assets: item.assets.filter((asset) => asset.status === 'uploaded' && validHttpsUrl(asset.remoteUrl)),
    }))
    .filter((item) => item.assets.length > 0);
  return { series, items };
}

function withoutQuestionNumber(title) {
  return title
    .trim()
    .replace(/^第\s*\d+\s*题\s*[:：.、-]?\s*/u, '')
    .replace(/^\d+\s*[.．、:：)）-]\s*/u, '')
    .trim();
}

function escapeAlt(value) {
  return value.replaceAll('\\', '\\\\').replaceAll(']', '\\]');
}

export function infographicAlt(title, assetId) {
  const base = `${withoutQuestionNumber(title)} 信息图`;
  if (assetId === 'primary') return base;
  if (assetId === 'secondary-02') return `${base} 2`;
  if (assetId === 'secondary-03') return `${base} 3`;
  throw new InsertionError('ASSET_ID_INVALID', `Unsupported assetId: ${String(assetId)}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function managedImagePattern(escapedAlt) {
  return new RegExp(
    `^\\s*!\\[${escapeRegExp(escapedAlt)}\\]\\(\\s*(?:<[^>\\r\\n]*>|[^\\r\\n]*)\\s*\\)\\s*$`,
    'u',
  );
}

function blank(line) {
  return /^\s*$/u.test(line);
}

function markdownLineMask(lines) {
  const outsideFence = [];
  let fence = null;
  for (const [index, line] of lines.entries()) {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})/u)?.[1];
    if (!fence) {
      outsideFence[index] = true;
      if (marker) fence = { character: marker[0], length: marker.length };
      continue;
    }
    outsideFence[index] = false;
    if (marker
      && marker[0] === fence.character
      && marker.length >= fence.length
      && new RegExp(`^\\s{0,3}${escapeRegExp(marker[0])}{${fence.length},}\\s*$`, 'u').test(line)) {
      fence = null;
    }
  }
  return outsideFence;
}

function removeManagedLines(lines, alt) {
  const pattern = managedImagePattern(escapeAlt(alt));
  const outsideFence = markdownLineMask(lines);
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (!outsideFence[index] || !pattern.test(lines[index])) continue;
    lines.splice(index, 1);
    outsideFence.splice(index, 1);
    let blankStart = index;
    while (blankStart > 0 && blank(lines[blankStart - 1])) blankStart -= 1;
    let blankEnd = index;
    while (blankEnd < lines.length && blank(lines[blankEnd])) blankEnd += 1;
    if (blankEnd > blankStart) {
      const keepSeparator = blankStart > 0 && blankEnd < lines.length;
      lines.splice(blankStart, blankEnd - blankStart, ...(keepSeparator ? [''] : []));
    }
  }
}

function sectionHeadingIndex(lines, title) {
  const pattern = new RegExp(`^##\\s+${escapeRegExp(title)}\\s*$`, 'u');
  const outsideFence = markdownLineMask(lines);
  return lines.findIndex((line, index) => outsideFence[index] && pattern.test(line));
}

function nextH2Index(lines, start) {
  const outsideFence = markdownLineMask(lines);
  for (let index = start; index < lines.length; index += 1) {
    if (outsideFence[index] && /^#{1,2}(?:\s|$)/u.test(lines[index])) return index;
  }
  return lines.length;
}

function frontmatterEnd(lines) {
  if (!/^\uFEFF?---\s*$/u.test(lines[0] ?? '')) {
    throw new InsertionError('FRONTMATTER_INVALID', 'Article must begin with frontmatter');
  }
  for (let index = 1; index < lines.length; index += 1) {
    if (/^(?:---|\.\.\.)\s*$/u.test(lines[index])) return index + 1;
  }
  throw new InsertionError('FRONTMATTER_INVALID', 'Article frontmatter is not closed');
}

function insertAtBoundary(lines, boundary, minimum, imageLine) {
  let contentEnd = boundary;
  while (contentEnd > minimum && blank(lines[contentEnd - 1])) contentEnd -= 1;
  const replacement = [];
  if (contentEnd > 0 && !blank(lines[contentEnd - 1])) replacement.push('');
  replacement.push(imageLine);
  if (boundary < lines.length) replacement.push('');
  lines.splice(contentEnd, boundary - contentEnd, ...replacement);
}

function insertAsset(lines, item, asset) {
  const alt = infographicAlt(item.title, asset.assetId);
  removeManagedLines(lines, alt);
  const imageLine = `![${escapeAlt(alt)}](<${asset.remoteUrl}>)`;
  const headingTitle = POSITIONS.get(asset.position);
  const headingIndex = sectionHeadingIndex(lines, headingTitle);
  if (headingIndex >= 0) {
    insertAtBoundary(lines, nextH2Index(lines, headingIndex + 1), headingIndex + 1, imageLine);
    return;
  }
  if (asset.assetId !== 'primary') {
    throw new InsertionError(
      'SECTION_NOT_FOUND',
      `Cannot place ${asset.assetId}: missing section ## ${headingTitle}`,
    );
  }
  const introductionStart = frontmatterEnd(lines);
  insertAtBoundary(lines, nextH2Index(lines, introductionStart), introductionStart, imageLine);
}

function newlineDetails(content) {
  const newline = content.match(/\r\n|\n|\r/u)?.[0] ?? '\n';
  const normalized = content.replace(/\r\n|\r|\n/gu, '\n');
  const finalNewline = normalized.endsWith('\n');
  return {
    newline,
    finalNewline,
    lines: (finalNewline ? normalized.slice(0, -1) : normalized).split('\n'),
  };
}

export function insertInfographicLinks(content, item) {
  if (typeof content !== 'string') throw new TypeError('content must be a string');
  if (!item || typeof item !== 'object') throw new TypeError('item is required');
  const assets = Array.isArray(item.assets)
    ? item.assets.filter((asset) => asset.status === 'uploaded' && validHttpsUrl(asset.remoteUrl))
    : [];
  if (assets.length === 0) return { content, changed: false, processed: 0 };

  const { newline, finalNewline, lines } = newlineDetails(content);
  for (const asset of assets) insertAsset(lines, item, asset);
  const output = `${lines.join(newline)}${finalNewline ? newline : ''}`;
  return { content: output, changed: output !== content, processed: assets.length };
}

async function assertNoSymlink(root, target) {
  if (!isWithin(root, target)) {
    throw new InsertionError('ARTICLE_PATH_OUTSIDE_ROOT', 'Article resolves outside the content root');
  }
  const relative = path.relative(root, target);
  let current = root;
  const rootDetails = await lstat(root);
  if (rootDetails.isSymbolicLink()) {
    throw new InsertionError('ARTICLE_SYMLINK', `Symbolic links are not allowed: ${normalize(root)}`);
  }
  for (const segment of relative.split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    const details = await lstat(current);
    if (details.isSymbolicLink()) {
      throw new InsertionError('ARTICLE_SYMLINK', `Symbolic links are not allowed: ${normalize(current)}`);
    }
  }
}

export async function resolveArticlePath(item, { repoRoot = REPO_ROOT } = {}) {
  const { absolute, contentRoot } = resolveArticlePathShape(item?.article, { repoRoot });
  await assertNoSymlink(repoRoot, contentRoot);
  await assertNoSymlink(contentRoot, absolute);
  const details = await stat(absolute);
  if (!details.isFile()) throw new InsertionError('ARTICLE_NOT_FILE', `${item.article} is not a file`);
  const physicalRepo = await realpath(repoRoot);
  const physicalRoot = await realpath(contentRoot);
  const physicalArticle = await realpath(absolute);
  if (!isWithin(physicalRepo, physicalRoot) || !isWithin(physicalRoot, physicalArticle)) {
    throw new InsertionError('ARTICLE_PATH_OUTSIDE_ROOT', `${item.article} resolves outside the content root`);
  }
  return absolute;
}

async function atomicWriteText(targetPath, content) {
  await mkdir(path.dirname(targetPath), { recursive: true });
  const temporaryPath = path.join(
    path.dirname(targetPath),
    `.${path.basename(targetPath)}.${process.pid}.${randomUUID()}.tmp`,
  );
  try {
    await writeFile(temporaryPath, content, { encoding: 'utf8', flag: 'wx' });
    await rename(temporaryPath, targetPath);
  } finally {
    await unlink(temporaryPath).catch((error) => {
      if (error?.code !== 'ENOENT') throw error;
    });
  }
}

export async function applyManifestLinks({
  manifest,
  repoRoot = REPO_ROOT,
  series = 'all',
  dryRun = false,
  requireCompleteCorpus = false,
  writeArticle = atomicWriteText,
} = {}) {
  const plan = createInsertionPlan(manifest, { series, repoRoot, requireCompleteCorpus });
  const prepared = await Promise.all(plan.items.map(async (item) => {
    const articlePath = await resolveArticlePath(item, { repoRoot });
    const original = await readFile(articlePath, 'utf8');
    return { item, articlePath, original, result: insertInfographicLinks(original, item) };
  }));
  const summary = {
    planned: plan.items.length,
    processed: prepared.reduce((count, operation) => count + operation.result.processed, 0),
    changed: prepared.filter((operation) => operation.result.changed).length,
    written: 0,
    unchanged: prepared.filter((operation) => !operation.result.changed).length,
    files: prepared.map((operation) => ({
      article: operation.item.article,
      changed: operation.result.changed,
      assets: operation.result.processed,
    })),
  };
  if (!dryRun) {
    for (const operation of prepared) {
      if (!operation.result.changed) continue;
      await writeArticle(operation.articlePath, operation.result.content);
      summary.written += 1;
    }
  }
  return summary;
}

function parseArguments(argv) {
  const options = { manifestPath: DEFAULT_MANIFEST, series: 'all', dryRun: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--manifest') {
      const value = argv[++index];
      if (!value) throw new InsertionError('ARGUMENT_INVALID', '--manifest requires a path');
      options.manifestPath = path.resolve(REPO_ROOT, value);
    } else if (argument === '--series') {
      options.series = argv[++index];
    } else if (argument === '--dry-run') {
      options.dryRun = true;
    } else {
      throw new InsertionError('ARGUMENT_INVALID', `Unknown argument: ${argument}`);
    }
  }
  if (options.series !== 'all' && !SERIES.has(options.series)) {
    throw new InsertionError('UNKNOWN_SERIES', `Unknown series: ${String(options.series)}`);
  }
  return options;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (!existsSync(options.manifestPath)) {
    throw new InsertionError('MANIFEST_NOT_FOUND', `Manifest not found: ${options.manifestPath}`);
  }
  const releaseLock = options.dryRun ? async () => {} : await acquireManifestLock(options.manifestPath);
  try {
    const manifest = JSON.parse(await readFile(options.manifestPath, 'utf8'));
    const summary = await applyManifestLinks({
      manifest,
      series: options.series,
      dryRun: options.dryRun,
      requireCompleteCorpus: true,
    });
    console.log(
      `Infographic links: planned=${summary.planned}, assets=${summary.processed}, changed=${summary.changed}, written=${summary.written}, unchanged=${summary.unchanged}.`,
    );
    for (const file of summary.files.filter((entry) => entry.changed)) {
      console.log(`${options.dryRun ? 'WOULD UPDATE' : 'UPDATED'} ${file.article} (${file.assets} assets)`);
    }
  } finally {
    await releaseLock();
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath.toLowerCase() === SCRIPT_PATH.toLowerCase()) {
  main().catch((error) => {
    console.error(`insert-infographic-links: ${error?.code ?? 'FAILED'} ${error?.message ?? String(error)}`);
    process.exitCode = 1;
  });
}
