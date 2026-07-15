import { createHash, randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { acquireManifestLock } from './infographic-manifest-lock.mjs';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const DEFAULT_REPO_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
const EXPECTED_COUNTS = { overview: 1, llm: 32 };
const EXPECTED_TOTAL = Object.values(EXPECTED_COUNTS).reduce((sum, count) => sum + count, 0);
const SERIES_ORDER = Object.keys(EXPECTED_COUNTS);
const LAYOUTS = new Set([
  'bento-grid',
  'comparison-matrix',
  'dashboard',
  'linear-progression',
  'structural-breakdown',
]);
const STYLES = new Set([
  'corporate-memphis',
  'hand-drawn-edu',
  'pop-laboratory',
  'technical-schematic',
]);
const ASSET_IDS = ['primary', 'secondary-02', 'secondary-03'];
const ASSET_ID_SET = new Set(ASSET_IDS);
const STATUSES = new Set(['planned', 'generated', 'upload-failed', 'uploaded']);
const SHA256_PATTERN = /^[a-f0-9]{64}$/u;

const SLUGS = {
  overview: ['series-overview'],
  agent: [
    'overview', 'agent-vs-llm', 'core-components', 'workflow-agent-tools', 'design-patterns',
    'react-reasoning', 'pattern-selection', 'task-decomposition', 'memory-design', 'memory-storage',
    'multi-agent', 'single-vs-multi', 'memory-compression', 'framework-vs-custom', 'planning',
    'reflection', 'collaboration-routing', 'context-engineering', 'agent-evaluation', 'durable-execution',
    'agent-security', 'human-approval', 'computer-use',
  ],
  rag: [
    'overview', 'rag-pipeline', 'rag-problems', 'rag-vs-finetune', 'chunking',
    'semantic-boundaries', 'embedding-selection', 'embedding-algorithms', 'vector-db-selection',
    'vector-db-performance', 'online-rag-flow', 'vector-vs-keyword', 'query-rewrite',
    'multi-retrieval', 'retrieval-optimization', 'advanced-rag', 'graph-database', 'rag-hallucination',
    'rag-evaluation', 'knowledge-update', 'production-challenges', 'agentic-rag', 'multimodal-rag',
    'rag-security', 'late-interaction', 'production-graphrag', 'long-context-vs-rag',
  ],
  tools: [
    'overview', 'function-calling', 'tool-learning', 'tool-training', 'mcp-core', 'mcp-components',
    'mcp-vs-functions', 'tool-selection', 'reasoning-and-mcp', 'agent-skills', 'mcp-vs-skills',
    'tooling-layers', 'a2a-vs-mcp', 'mcp-transports', 'sse-vs-websocket', 'webrtc-vs-websocket',
    'llm-gateway', 'structured-output-modes', 'tool-schema', 'reliable-parallel-tools',
    'safe-tool-runtime', 'mcp-oauth', 'mcp-lifecycle', 'mcp-client-features',
  ],
  llm: [
    'overview', 'llm-vs-nlp', 'transformer-architecture', 'attention-optimizations',
    'position-encoding', 'tokenizers', 'llm-training', 'scaling-and-emergence', 'finetuning',
    'lora', 'post-training', 'dpo-vs-ppo', 'decoding-strategies', 'sampling-parameters',
    'kv-and-prompt-cache', 'model-quantization', 'prompt-engineering', 'chain-of-thought',
    'hallucination', 'mixture-of-experts', 'inference-engines', 'model-evaluation', 'model-selection',
    'test-time-compute', 'distillation-synthetic-data', 'speculative-decoding', 'cache-taxonomy',
    'prefill-decode', 'low-precision-formats', 'long-context', 'multimodal-alignment',
    'constrained-decoding',
  ],
};

function normalize(value) {
  return value.replaceAll('\\', '/');
}

export function isInfographicCorpusArticle(article, repoRoot = DEFAULT_REPO_ROOT) {
  const relativePath = normalize(path.relative(repoRoot, article));
  return !relativePath.includes('/01.Agent面试专题/')
    && !relativePath.includes('/02.RAG面试专题/')
    && !relativePath.includes('/03.LLM工具调用面试专题/');
}

function stableIdentity(series, number) {
  return `${series}:${number}`;
}

function identifySeries(relativePath) {
  if (/\/AI应用开发\/00\.[^/]+\.mdx?$/u.test(`/${relativePath}`)) return 'overview';
  if (relativePath.includes('/01.Agent面试专题/')) return 'agent';
  if (relativePath.includes('/02.RAG面试专题/')) return 'rag';
  if (relativePath.includes('/03.LLM工具调用面试专题/')) return 'tools';
  if (relativePath.includes('/04.大模型工程面试专题/')) return 'llm';
  throw new Error(`无法识别文章专题：${relativePath}`);
}

function extractTitle(content, fallback) {
  const match = content.match(/^title:\s*(?:"([^"]+)"|'([^']+)'|(.+?))\s*$/mu);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? fallback;
}

function visualCombination(title, number) {
  if (number === 0) return { layout: 'bento-grid', style: 'hand-drawn-edu' };
  if (/评测|指标|可观测|安全|防御|可靠|幻觉|风险|成本/iu.test(title)) {
    return { layout: 'dashboard', style: 'pop-laboratory' };
  }
  if (/区别|对比|怎么选|选型|什么关系|分别|\bvs\b/iu.test(title)) {
    return { layout: 'comparison-matrix', style: 'corporate-memphis' };
  }
  if (/流程|如何|怎么做|怎么训练|怎么工作|调用|更新|授权|生命周期/iu.test(title)) {
    return { layout: 'linear-progression', style: 'hand-drawn-edu' };
  }
  if (/架构|组成|组件|原理|系统|机制|Cache|Transformer|注意力|位置编码|MoE/iu.test(title)) {
    return { layout: 'structural-breakdown', style: 'technical-schematic' };
  }
  return { layout: 'bento-grid', style: 'hand-drawn-edu' };
}

function sequenceNumber(series, relativePath) {
  if (series === 'overview') return 0;
  const match = path.posix.basename(relativePath).match(/^(\d{2})\./u);
  if (!match) throw new Error(`文章缺少两位编号：${relativePath}`);
  return Number(match[1]);
}

function stableDirectory(series, number, slug) {
  return series === 'overview'
    ? '00-series-overview'
    : `${String(number).padStart(2, '0')}-${slug}`;
}

function standaloneManagedInfographic(line) {
  const match = line.match(/^\s*!\[([^\]\r\n]*)\]\(\s*(?:<[^>\r\n]+>|[^)\r\n]+)\s*\)\s*$/u);
  return Boolean(match && /信息图(?:\s+[23])?$/u.test(match[1].replace(/\\([\[\]])/gu, '$1').trim()));
}

export function hashArticleContent(content) {
  const normalized = String(content)
    .replace(/^\uFEFF/u, '')
    .replace(/\r\n?/gu, '\n')
    .split('\n')
    .filter((line) => !standaloneManagedInfographic(line))
    .join('\n');
  return createHash('sha256').update(normalized, 'utf8').digest('hex');
}

function assetSuffix(assetId) {
  if (assetId === 'primary') return '';
  if (assetId === 'secondary-02') return '-02';
  if (assetId === 'secondary-03') return '-03';
  throw new Error(`不支持的信息图 assetId：${assetId}`);
}

function defaultPosition(assetId) {
  if (assetId === 'primary') return 'after-60-second-answer';
  if (assetId === 'secondary-02') return 'after-detailed-analysis';
  return 'after-engineering-practice';
}

function fixedAssetPaths(workDir, assetId) {
  const suffix = assetSuffix(assetId);
  return {
    localPath: `${workDir}/infographic${suffix}.png`,
    sourcePath: `${workDir}/source.md`,
    analysisPath: `${workDir}/analysis${suffix}.md`,
    structuredContentPath: `${workDir}/structured-content${suffix}.md`,
    promptPath: `${workDir}/prompts/infographic${suffix}.md`,
    uploadRecordPath: `${workDir}/upload${suffix}.json`,
  };
}

function existingItemsByIdentity(existingManifest) {
  const items = Array.isArray(existingManifest?.items) ? existingManifest.items : [];
  return new Map(items
    .filter((item) => typeof item?.series === 'string' && Number.isInteger(item?.number))
    .map((item) => [stableIdentity(item.series, item.number), item]));
}

function previousAssets(item) {
  if (Array.isArray(item?.assets) && item.assets.length > 0) return item.assets;
  if (!item) return [];
  return [{
    assetId: 'primary',
    role: 'primary',
    position: 'after-60-second-answer',
    localPath: item.localPath,
    uploadRecordPath: item.uploadRecordPath,
    contentHash: '',
    promptHash: '',
    imageHash: '',
    remoteUrl: item.remoteUrl ?? '',
    status: item.status ?? 'planned',
  }];
}

function buildAsset({ workDir, contentHash, previousItem, previousAsset, assetId }) {
  const unchanged = previousItem?.contentHash === contentHash
    && previousAsset?.contentHash === contentHash;
  const asset = {
    assetId,
    role: assetId === 'primary' ? 'primary' : 'secondary',
    position: previousAsset?.position || defaultPosition(assetId),
    ...fixedAssetPaths(workDir, assetId),
    contentHash,
    promptHash: unchanged ? (previousAsset.promptHash ?? '') : '',
    imageHash: unchanged ? (previousAsset.imageHash ?? '') : '',
    remoteUrl: unchanged ? (previousAsset.remoteUrl ?? '') : '',
    status: unchanged ? (previousAsset.status ?? 'planned') : 'planned',
  };

  if (unchanged) {
    for (const field of ['uploadedAt', 'uploadProvider', 'lastAttemptedAt', 'lastError']) {
      if (previousAsset[field] !== undefined) asset[field] = previousAsset[field];
    }
  }
  return asset;
}

export function buildInfographicManifest(records, {
  repoRoot = DEFAULT_REPO_ROOT,
  existingManifest = null,
} = {}) {
  const existingByIdentity = existingItemsByIdentity(existingManifest);
  const items = records.map(({ article, content }) => {
    const relativePath = normalize(path.relative(repoRoot, article));
    const series = identifySeries(relativePath);
    const number = sequenceNumber(series, relativePath);
    const slug = SLUGS[series]?.[number];
    if (!slug) throw new Error(`缺少稳定 slug：${series} ${number}`);
    const workDir = `docs/infographics/ai-interview/${series}/${stableDirectory(series, number, slug)}`;
    const title = extractTitle(content, path.posix.basename(relativePath));
    const previous = existingByIdentity.get(stableIdentity(series, number));
    const visual = visualCombination(title, number);
    const contentHash = hashArticleContent(content);
    const previousByAssetId = new Map(previousAssets(previous).map((asset) => [asset.assetId, asset]));
    if (!previousByAssetId.has('primary')) previousByAssetId.set('primary', null);
    const assetIds = ASSET_IDS.filter((assetId) => previousByAssetId.has(assetId));

    for (const assetId of previousByAssetId.keys()) {
      if (!ASSET_ID_SET.has(assetId)) throw new Error(`不支持的信息图 assetId：${assetId}`);
    }

    return {
      article: relativePath,
      series,
      number,
      slug,
      title,
      workDir,
      layout: previous?.layout ?? visual.layout,
      style: previous?.style ?? visual.style,
      aspect: '16:9',
      language: 'zh',
      backend: 'imagegen',
      contentHash,
      assets: assetIds.map((assetId) => buildAsset({
        workDir,
        contentHash,
        previousItem: previous,
        previousAsset: previousByAssetId.get(assetId),
        assetId,
      })),
    };
  });

  const order = Object.fromEntries(SERIES_ORDER.map((series, index) => [series, index]));
  items.sort((left, right) => order[left.series] - order[right.series] || left.number - right.number);
  return {
    version: 2,
    generatedOn: new Date().toISOString().slice(0, 10),
    defaults: { aspect: '16:9', language: 'zh', backend: 'imagegen' },
    items,
  };
}

function missingString(value) {
  return typeof value !== 'string' || value.length === 0;
}

function safeRepositoryPath(value) {
  if (missingString(value) || value.includes('\\') || value.includes('\0')) return false;
  if (path.posix.isAbsolute(value) || /^[a-z]:/iu.test(value)) return false;
  return !value.split('/').includes('..');
}

function validTimestamp(value) {
  return typeof value === 'string'
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u.test(value)
    && !Number.isNaN(Date.parse(value));
}

function validHttpsUrl(value) {
  if (typeof value !== 'string' || value === '' || /\s/u.test(value)) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:'
      && Boolean(parsed.hostname)
      && !parsed.username
      && !parsed.password;
  } catch {
    return false;
  }
}

export function validateInfographicManifest(manifest) {
  const errors = [];
  const items = Array.isArray(manifest?.items) ? manifest.items : [];

  if (manifest?.version !== 2) errors.push(`version: expected 2, found ${manifest?.version}`);
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(manifest?.generatedOn ?? '')) {
    errors.push('generatedOn: expected YYYY-MM-DD');
  }
  if (manifest?.defaults?.aspect !== '16:9'
    || manifest?.defaults?.language !== 'zh'
    || manifest?.defaults?.backend !== 'imagegen') {
    errors.push('defaults: invalid rendering defaults');
  }
  if (items.length !== EXPECTED_TOTAL) {
    errors.push(`expected ${EXPECTED_TOTAL} items, found ${items.length}`);
  }

  for (const [series, expected] of Object.entries(EXPECTED_COUNTS)) {
    const seriesItems = items.filter((item) => item?.series === series);
    if (seriesItems.length !== expected) {
      errors.push(`${series}: expected ${expected}, found ${seriesItems.length}`);
    }
    const numbers = [...new Set(seriesItems.map((item) => item.number))]
      .filter(Number.isInteger)
      .sort((left, right) => left - right);
    const expectedNumbers = Array.from({ length: expected }, (_, index) => index);
    if (numbers.join(',') !== expectedNumbers.join(',')) {
      errors.push(`${series}: expected numbers ${expectedNumbers.join(',')}, found ${numbers.join(',')}`);
    }
  }

  const articleValues = [];
  const workDirValues = [];
  const itemIdentities = [];
  const assetIdentities = [];
  const uniqueAssetPaths = {
    localPath: [],
    analysisPath: [],
    structuredContentPath: [],
    promptPath: [],
    uploadRecordPath: [],
  };
  const remoteUrls = [];

  for (const item of items) {
    const label = `${item?.series ?? 'unknown'}:${item?.number ?? 'unknown'}`;
    for (const field of [
      'article', 'series', 'slug', 'title', 'workDir', 'layout', 'style',
      'aspect', 'language', 'backend', 'contentHash',
    ]) {
      if (missingString(item?.[field])) errors.push(`${label} ${field}: missing value`);
    }
    if (!Number.isInteger(item?.number)) errors.push(`${label} number: expected integer`);

    articleValues.push(item?.article);
    workDirValues.push(item?.workDir);
    itemIdentities.push(stableIdentity(item?.series, item?.number));

    if (!Object.hasOwn(EXPECTED_COUNTS, item?.series)) {
      errors.push(`${label}: invalid series ${item?.series}`);
    }
    if (!LAYOUTS.has(item?.layout)) errors.push(`${label}: invalid layout ${item?.layout}`);
    if (!STYLES.has(item?.style)) errors.push(`${label}: invalid style ${item?.style}`);
    if (item?.aspect !== '16:9' || item?.language !== 'zh' || item?.backend !== 'imagegen') {
      errors.push(`${label}: invalid rendering defaults`);
    }
    if (!SHA256_PATTERN.test(item?.contentHash ?? '')) {
      errors.push(`${label}: invalid contentHash`);
    }

    if (!safeRepositoryPath(item?.article)
      || !/^src\/content\/blog\/AI应用开发\/.+\.mdx?$/u.test(item?.article ?? '')) {
      errors.push(`${label}: article must stay inside AI应用开发`);
    } else {
      try {
        const detectedSeries = identifySeries(item.article);
        if (detectedSeries !== item.series || sequenceNumber(detectedSeries, item.article) !== item.number) {
          errors.push(`${label}: article path does not match series and number`);
        }
      } catch (error) {
        errors.push(`${label}: ${error.message}`);
      }
    }

    const expectedSlug = SLUGS[item?.series]?.[item?.number];
    if (item?.slug !== expectedSlug) errors.push(`${label}: expected slug ${expectedSlug}`);
    const expectedWorkDir = expectedSlug
      ? `docs/infographics/ai-interview/${item.series}/${stableDirectory(item.series, item.number, expectedSlug)}`
      : null;
    if (!safeRepositoryPath(item?.workDir) || item?.workDir !== expectedWorkDir) {
      errors.push(`${label}: workDir must equal ${expectedWorkDir}`);
    }

    if (!Array.isArray(item?.assets) || item.assets.length === 0) {
      errors.push(`${label}: assets must contain primary`);
      continue;
    }
    if (item.assets.length > ASSET_IDS.length) errors.push(`${label}: too many assets`);

    const itemAssetIds = [];
    for (const asset of item.assets) {
      const assetLabel = `${label}:${asset?.assetId ?? 'unknown'}`;
      itemAssetIds.push(asset?.assetId);
      assetIdentities.push(assetLabel);

      for (const field of [
        'assetId', 'role', 'position', 'localPath', 'sourcePath', 'analysisPath',
        'structuredContentPath', 'promptPath', 'uploadRecordPath', 'contentHash', 'status',
      ]) {
        if (missingString(asset?.[field])) errors.push(`${assetLabel} ${field}: missing value`);
      }
      for (const field of ['promptHash', 'imageHash', 'remoteUrl']) {
        if (typeof asset?.[field] !== 'string') errors.push(`${assetLabel} ${field}: expected string`);
      }

      if (!ASSET_ID_SET.has(asset?.assetId)) {
        errors.push(`${assetLabel}: invalid assetId ${asset?.assetId}`);
      } else {
        const expectedRole = asset.assetId === 'primary' ? 'primary' : 'secondary';
        if (asset.role !== expectedRole) errors.push(`${assetLabel}: role must equal ${expectedRole}`);

        const expectedPaths = fixedAssetPaths(item.workDir, asset.assetId);
        for (const [field, expectedPath] of Object.entries(expectedPaths)) {
          if (!safeRepositoryPath(asset[field]) || asset[field] !== expectedPath) {
            errors.push(`${assetLabel}: ${field} must equal ${expectedPath}`);
          }
        }
      }
      for (const field of Object.keys(uniqueAssetPaths)) uniqueAssetPaths[field].push(asset[field]);

      if (asset.contentHash !== item.contentHash) {
        errors.push(`${assetLabel}: asset contentHash must match article`);
      }
      for (const field of ['promptHash', 'imageHash']) {
        if (asset[field] !== '' && !SHA256_PATTERN.test(asset[field] ?? '')) {
          errors.push(`${assetLabel}: invalid ${field}`);
        }
      }
      if (!STATUSES.has(asset.status)) errors.push(`${assetLabel}: invalid status ${asset.status}`);
      if (asset.remoteUrl && !validHttpsUrl(asset.remoteUrl)) {
        errors.push(`${assetLabel}: remoteUrl must use HTTPS`);
      }
      if (asset.status === 'uploaded' && !asset.remoteUrl) {
        errors.push(`${assetLabel}: uploaded status requires remoteUrl`);
      }
      if (asset.status !== 'uploaded' && asset.remoteUrl) {
        errors.push(`${assetLabel}: ${asset.status} status cannot have remoteUrl`);
      }
      if (asset.remoteUrl) remoteUrls.push(asset.remoteUrl);

      for (const field of ['uploadedAt', 'lastAttemptedAt']) {
        if (asset[field] !== undefined && !validTimestamp(asset[field])) {
          errors.push(`${assetLabel}: invalid ${field}`);
        }
      }
      if (asset.uploadProvider !== undefined && missingString(asset.uploadProvider)) {
        errors.push(`${assetLabel}: invalid uploadProvider`);
      }
      if (asset.lastError !== undefined) {
        const validStringError = typeof asset.lastError === 'string' && asset.lastError.length > 0;
        const validStructuredError = asset.lastError
          && typeof asset.lastError === 'object'
          && !Array.isArray(asset.lastError)
          && !missingString(asset.lastError.code)
          && !missingString(asset.lastError.message);
        if (!validStringError && !validStructuredError) {
          errors.push(`${assetLabel}: invalid lastError`);
        }
      }
    }

    if (!itemAssetIds.includes('primary')) errors.push(`${label}: assets must contain primary`);
    if (new Set(itemAssetIds).size !== itemAssetIds.length) errors.push(`${label}: duplicate assetId`);
  }

  for (const [field, values] of Object.entries({
    article: articleValues,
    workDir: workDirValues,
    'article identity': itemIdentities,
    'asset identity': assetIdentities,
    remoteUrl: remoteUrls,
    ...uniqueAssetPaths,
  })) {
    const defined = values.filter((value) => typeof value === 'string' && value.length > 0);
    if (new Set(defined).size !== defined.length) errors.push(`duplicate ${field}`);
  }

  return errors;
}

async function collectMarkdown(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const child = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectMarkdown(child));
    else if (entry.isFile() && /\.mdx?$/iu.test(entry.name)) files.push(child);
  }
  return files;
}

async function atomicWriteJson(filePath, value) {
  const temporary = path.join(path.dirname(filePath), `.${path.basename(filePath)}.${process.pid}.${randomUUID()}.tmp`);
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(temporary, filePath);
}

async function main() {
  const repoRoot = DEFAULT_REPO_ROOT;
  const contentRoot = path.join(repoRoot, 'src', 'content', 'blog', 'AI应用开发');
  const outputPath = path.join(repoRoot, 'docs', 'infographics', 'ai-interview', 'manifest.json');
  await mkdir(path.dirname(outputPath), { recursive: true });
  const releaseLock = await acquireManifestLock(outputPath);
  try {
    const files = (await collectMarkdown(contentRoot))
      .filter((article) => isInfographicCorpusArticle(article, repoRoot));
    const records = await Promise.all(files.map(async (article) => ({
      article,
      content: await readFile(article, 'utf8'),
    })));
    const existingManifest = existsSync(outputPath)
      ? JSON.parse(await readFile(outputPath, 'utf8'))
      : null;
    const manifest = buildInfographicManifest(records, { repoRoot, existingManifest });
    const errors = validateInfographicManifest(manifest);
    if (errors.length > 0) throw new Error(`manifest 校验失败：\n${errors.join('\n')}`);

    await atomicWriteJson(outputPath, manifest);
    console.log(`已生成 ${normalize(path.relative(repoRoot, outputPath))}，共 ${manifest.items.length} 篇文章`);
  } finally {
    await releaseLock();
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath.toLowerCase() === SCRIPT_PATH.toLowerCase()) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
