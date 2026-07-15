import { execFile as execFileCallback } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
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
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { validateInfographicManifest } from './generate-infographic-manifest.mjs';
import { acquireManifestLock } from './infographic-manifest-lock.mjs';

export { acquireManifestLock } from './infographic-manifest-lock.mjs';

const execFile = promisify(execFileCallback);
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
const INFOGRAPHIC_ROOT = path.join('docs', 'infographics', 'ai-interview');
const DEFAULT_MANIFEST = path.join(REPO_ROOT, INFOGRAPHIC_ROOT, 'manifest.json');
const DEFAULT_GUI_UPLOADER = path.join(
  os.homedir(),
  '.agents',
  'skills',
  'picgo-upload',
  'scripts',
  'gui-upload.mjs',
);
const MAX_BATCH_SIZE = 5;
const SERIES_COUNTS = { overview: 1, llm: 32 };
const SERIES = new Set(['overview', 'agent', 'rag', 'tools', 'llm']);
const COMPLETE_CORPUS_COUNT = Object.values(SERIES_COUNTS).reduce((sum, count) => sum + count, 0);
const ASSET_IDS = new Set(['primary', 'secondary-02', 'secondary-03']);
const ASSET_STATUSES = new Set(['planned', 'generated', 'upload-failed', 'uploaded']);
const SAFE_UPLOAD_FIELDS = ['imgUrl', 'fileName', 'type', 'size', 'width', 'height'];
const HASH_PATTERN = /^[a-f\d]{64}$/iu;

export class UploadError extends Error {
  constructor(code, message, { abort = false, retryable = false, cause } = {}) {
    super(message, { cause });
    this.name = 'UploadError';
    this.safeCode = code;
    this.abort = abort;
    this.retryable = retryable;
  }
}

function isSensitiveKey(key) {
  return /(?:token|secret|password|authorization|cookie|credential|signature|^key$|(?:api|access|private)[_-]?key|awsaccesskeyid|googleaccessid)/iu
    .test(String(key));
}

function redactText(value) {
  return String(value)
    .replace(
      /\b((?:proxy-)?authorization\s*[:=]\s*)(?:(?:Bearer|Basic)\s+)?[^\s,;}"']+/giu,
      '$1[REDACTED]',
    )
    .replace(/\b(Bearer|Basic)\s+[^\s,;}"']+/giu, '$1 [REDACTED]')
    .replace(
      /([?&](?:token|secret|password|authorization|cookie|credential|signature|sig|key|api[_-]?key|access[_-]?key|x-amz-(?:credential|signature)|awsaccesskeyid|googleaccessid)=)[^&#\s"']*/giu,
      '$1[REDACTED]',
    )
    .replace(
      /((?:["']?(?:token|secret|password|authorization|cookie|credential|signature|key|api[_-]?key|access[_-]?key|private[_-]?key|awsaccesskeyid|googleaccessid)["']?)\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^\s,}&]+)/giu,
      '$1"[REDACTED]"',
    );
}

export function redactSensitive(value, seen = new WeakSet()) {
  if (typeof value === 'string') return redactText(value);
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return '[Circular]';
  seen.add(value);
  if (Array.isArray(value)) return value.map((item) => redactSensitive(item, seen));
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [
    key,
    isSensitiveKey(key) ? '[REDACTED]' : redactSensitive(item, seen),
  ]));
}

export function safeErrorSummary(error) {
  const rawCode = error?.safeCode ?? error?.code ?? 'UPLOAD_FAILED';
  const code = /^[A-Z][A-Z\d_]{1,63}$/u.test(String(rawCode))
    ? String(rawCode)
    : 'UPLOAD_FAILED';
  let source = error?.message ?? error ?? 'Upload failed';
  if (source && typeof source === 'object') source = JSON.stringify(redactSensitive(source));
  let message = redactText(source).replace(/\s+/gu, ' ').trim();
  if (!message) message = 'Upload failed';
  if (message.length > 280) message = `${message.slice(0, 277)}...`;
  return { code, message };
}

export function sanitizeUploadResult(result) {
  return Object.fromEntries(
    SAFE_UPLOAD_FIELDS
      .filter((key) => ['string', 'number'].includes(typeof result?.[key]))
      .map((key) => [key, result[key]]),
  );
}

function normalize(value) {
  return value.replaceAll('\\', '/');
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

function isWithin(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (
    relative !== '..'
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative)
  );
}

function expectedAssetNames(assetId) {
  const suffix = assetId === 'primary' ? '' : `-${assetId.slice(-2)}`;
  return {
    image: `infographic${suffix}.png`,
    upload: `upload${suffix}.json`,
  };
}

function resolveBoundedRelative(relativePath, {
  repoRoot = REPO_ROOT,
  allowedRoot = path.resolve(repoRoot, INFOGRAPHIC_ROOT),
  field = 'path',
} = {}) {
  if (typeof relativePath !== 'string' || relativePath.trim() === '') {
    throw new UploadError('MANIFEST_INVALID', `${field} must be a non-empty repository-relative path`, { abort: true });
  }
  if (relativePath.includes('\0') || path.isAbsolute(relativePath)
    || path.win32.isAbsolute(relativePath) || path.posix.isAbsolute(relativePath)) {
    throw new UploadError('PATH_OUTSIDE_ROOT', `${field} must be repository-relative`, { abort: true });
  }
  const segments = relativePath.split(/[\\/]+/u);
  if (segments.some((segment) => segment === '..' || segment === '.')) {
    throw new UploadError('PATH_TRAVERSAL', `${field} contains a traversal segment`, { abort: true });
  }
  const absolute = path.resolve(repoRoot, relativePath);
  if (!isWithin(allowedRoot, absolute)) {
    throw new UploadError('PATH_OUTSIDE_ROOT', `${field} is outside docs/infographics/ai-interview`, { abort: true });
  }
  return absolute;
}

function validateManifestShape(manifest, { repoRoot = REPO_ROOT, requireCompleteCorpus = false } = {}) {
  const errors = [];
  const items = Array.isArray(manifest?.items) ? manifest.items : [];
  if (manifest?.version !== 2) errors.push('version must be 2');
  if (typeof manifest?.generatedOn !== 'string' || manifest.generatedOn.trim() === '') {
    errors.push('generatedOn is required');
  }
  if (manifest?.defaults?.aspect !== '16:9'
    || manifest?.defaults?.language !== 'zh'
    || manifest?.defaults?.backend !== 'imagegen') {
    errors.push('defaults must be aspect=16:9, language=zh, backend=imagegen');
  }
  if (items.length === 0) errors.push('items must not be empty');
  if (requireCompleteCorpus && items.length !== COMPLETE_CORPUS_COUNT) {
    errors.push(`expected ${COMPLETE_CORPUS_COUNT} articles, found ${items.length}`);
  }

  const articles = new Set();
  const identities = new Set();
  const localPaths = new Set();
  const recordPaths = new Set();
  const remoteUrls = new Set();

  for (const [itemIndex, item] of items.entries()) {
    const label = typeof item?.article === 'string' ? item.article : `items[${itemIndex}]`;
    for (const field of ['article', 'slug', 'title', 'workDir', 'layout', 'style', 'aspect', 'language', 'backend', 'contentHash']) {
      if (typeof item?.[field] !== 'string' || item[field].trim() === '') errors.push(`${label}: ${field} is required`);
    }
    if (!SERIES.has(item?.series)) errors.push(`${label}: unknown series ${String(item?.series)}`);
    if (!Number.isInteger(item?.number) || item.number < 0) errors.push(`${label}: number must be a non-negative integer`);
    if (articles.has(item?.article)) errors.push(`${label}: duplicate article`);
    articles.add(item?.article);
    if (!HASH_PATTERN.test(item?.contentHash ?? '')) errors.push(`${label}: contentHash must be SHA-256`);

    let workDirAbsolute;
    try {
      workDirAbsolute = resolveBoundedRelative(item?.workDir, { repoRoot, field: `${label}.workDir` });
    } catch (error) {
      errors.push(`${label}: ${safeErrorSummary(error).message}`);
    }

    if (!Array.isArray(item?.assets) || item.assets.length === 0) {
      errors.push(`${label}: assets must not be empty`);
      continue;
    }

    const itemAssetIds = new Set();
    for (const [assetIndex, asset] of item.assets.entries()) {
      const assetLabel = `${label}.assets[${assetIndex}]`;
      for (const field of [
        'assetId', 'role', 'position', 'localPath', 'sourcePath', 'analysisPath',
        'structuredContentPath', 'promptPath', 'uploadRecordPath', 'contentHash',
        'promptHash', 'imageHash', 'remoteUrl', 'status',
      ]) {
        if (typeof asset?.[field] !== 'string') errors.push(`${assetLabel}: ${field} must be a string`);
      }
      if (!ASSET_IDS.has(asset?.assetId)) errors.push(`${assetLabel}: invalid assetId ${String(asset?.assetId)}`);
      const expectedRole = asset?.assetId === 'primary' ? 'primary' : 'secondary';
      if (asset?.role !== expectedRole) errors.push(`${assetLabel}: role must be ${expectedRole}`);
      if (!ASSET_STATUSES.has(asset?.status)) errors.push(`${assetLabel}: invalid status ${String(asset?.status)}`);
      if (itemAssetIds.has(asset?.assetId)) errors.push(`${assetLabel}: duplicate assetId`);
      itemAssetIds.add(asset?.assetId);
      const identity = `${item?.series}:${item?.number}:${asset?.assetId}`;
      if (identities.has(identity)) errors.push(`${assetLabel}: duplicate stable identity`);
      identities.add(identity);
      if (asset?.contentHash !== item?.contentHash) errors.push(`${assetLabel}: contentHash does not match article`);
      for (const field of ['promptHash', 'imageHash']) {
        if (asset?.[field] && !HASH_PATTERN.test(asset[field])) errors.push(`${assetLabel}: ${field} must be empty or SHA-256`);
      }
      const hasUrl = typeof asset?.remoteUrl === 'string' && asset.remoteUrl !== '';
      if (hasUrl && !validHttpsUrl(asset.remoteUrl)) errors.push(`${assetLabel}: remoteUrl must use HTTPS`);
      if ((asset?.status === 'uploaded') !== hasUrl) errors.push(`${assetLabel}: only uploaded assets may have remoteUrl`);
      if (hasUrl && (!asset?.imageHash || !asset?.promptHash)) errors.push(`${assetLabel}: uploaded asset requires promptHash and imageHash`);
      if (hasUrl && remoteUrls.has(asset.remoteUrl)) errors.push(`${assetLabel}: duplicate remoteUrl`);
      if (hasUrl) remoteUrls.add(asset.remoteUrl);

      for (const field of [
        'localPath', 'sourcePath', 'analysisPath', 'structuredContentPath',
        'promptPath', 'uploadRecordPath',
      ]) {
        try {
          const absolute = resolveBoundedRelative(asset?.[field], { repoRoot, field: `${assetLabel}.${field}` });
          if (workDirAbsolute && !isWithin(workDirAbsolute, absolute)) {
            errors.push(`${assetLabel}: ${field} must be inside workDir`);
          }
        } catch (error) {
          errors.push(`${assetLabel}: ${safeErrorSummary(error).message}`);
        }
      }
      const expected = ASSET_IDS.has(asset?.assetId) ? expectedAssetNames(asset.assetId) : null;
      if (expected && path.basename(asset?.localPath ?? '') !== expected.image) {
        errors.push(`${assetLabel}: localPath must end with ${expected.image}`);
      }
      if (expected && path.basename(asset?.uploadRecordPath ?? '') !== expected.upload) {
        errors.push(`${assetLabel}: uploadRecordPath must end with ${expected.upload}`);
      }
      if (localPaths.has(asset?.localPath)) errors.push(`${assetLabel}: duplicate localPath`);
      if (recordPaths.has(asset?.uploadRecordPath)) errors.push(`${assetLabel}: duplicate uploadRecordPath`);
      localPaths.add(asset?.localPath);
      recordPaths.add(asset?.uploadRecordPath);
    }
  }

  if (requireCompleteCorpus) {
    for (const [series, expected] of Object.entries(SERIES_COUNTS)) {
      const actual = items.filter((item) => item.series === series).length;
      if (actual !== expected) errors.push(`${series}: expected ${expected} articles, found ${actual}`);
    }
  }
  return errors;
}

export function validateUploadManifest(manifest, options = {}) {
  return validateManifestShape(manifest, options);
}

function assertValidManifest(manifest, options = {}) {
  const errors = validateManifestShape(manifest, options);
  if (options.requireCompleteCorpus) errors.push(...validateInfographicManifest(manifest));
  if (errors.length > 0) {
    throw new UploadError('MANIFEST_INVALID', `Manifest validation failed: ${errors.join('; ')}`, { abort: true });
  }
}

export function createUploadPlan(manifest, { series = 'all', batchSize = MAX_BATCH_SIZE, repoRoot = REPO_ROOT } = {}) {
  assertValidManifest(manifest, { repoRoot });
  if (series !== 'all' && !SERIES.has(series)) {
    throw new UploadError('UNKNOWN_SERIES', `Unknown series: ${String(series)}`, { abort: true });
  }
  const numericBatchSize = Number(batchSize);
  if (!Number.isInteger(numericBatchSize) || numericBatchSize < 1) {
    throw new UploadError('INVALID_BATCH_SIZE', 'batch-size must be a positive integer', { abort: true });
  }
  const safeBatchSize = Math.min(MAX_BATCH_SIZE, numericBatchSize);
  const items = manifest.items
    .filter((item) => series === 'all' || item.series === series)
    .flatMap((item) => item.assets.map((asset) => ({
      article: item.article,
      series: item.series,
      number: item.number,
      item,
      asset,
    })));
  const batches = [];
  for (let index = 0; index < items.length; index += safeBatchSize) {
    batches.push(items.slice(index, index + safeBatchSize));
  }
  return { series, batchSize: safeBatchSize, items, batches };
}

async function assertNoSymlink(root, target, { allowMissingLeaf = false } = {}) {
  const relative = path.relative(root, target);
  if (!isWithin(root, target)) {
    throw new UploadError('PATH_OUTSIDE_ROOT', 'Resolved path is outside the infographic root', { abort: true });
  }
  const segments = relative === '' ? [] : relative.split(path.sep);
  let current = root;
  for (const [index, segment] of segments.entries()) {
    current = path.join(current, segment);
    try {
      const details = await lstat(current);
      if (details.isSymbolicLink()) {
        throw new UploadError('SYMLINK_NOT_ALLOWED', `Symbolic links are not allowed: ${normalize(path.relative(root, current))}`, { abort: true });
      }
    } catch (error) {
      if (error?.code === 'ENOENT' && (allowMissingLeaf || index < segments.length)) break;
      throw error;
    }
  }
}

export async function resolveAssetPaths(entry, { repoRoot = REPO_ROOT } = {}) {
  const allowedRoot = path.resolve(repoRoot, INFOGRAPHIC_ROOT);
  const localPath = resolveBoundedRelative(entry.asset.localPath, {
    repoRoot,
    allowedRoot,
    field: `${entry.article}:${entry.asset.assetId}.localPath`,
  });
  const uploadRecordPath = resolveBoundedRelative(entry.asset.uploadRecordPath, {
    repoRoot,
    allowedRoot,
    field: `${entry.article}:${entry.asset.assetId}.uploadRecordPath`,
  });
  await assertNoSymlink(repoRoot, allowedRoot);
  await assertNoSymlink(allowedRoot, localPath);
  await assertNoSymlink(allowedRoot, uploadRecordPath, { allowMissingLeaf: true });

  let localDetails;
  try {
    localDetails = await stat(localPath);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new UploadError('LOCAL_FILE_MISSING', `Image does not exist: ${entry.asset.localPath}`, { cause: error });
    }
    throw error;
  }
  if (!localDetails.isFile()) throw new UploadError('LOCAL_FILE_INVALID', `Image is not a file: ${entry.asset.localPath}`);
  const physicalRepoRoot = await realpath(repoRoot);
  const physicalRoot = await realpath(allowedRoot);
  if (!isWithin(physicalRepoRoot, physicalRoot)) {
    throw new UploadError('PATH_OUTSIDE_ROOT', 'Infographic root resolves outside the repository', { abort: true });
  }
  const physicalLocal = await realpath(localPath);
  if (!isWithin(physicalRoot, physicalLocal)) {
    throw new UploadError('PATH_OUTSIDE_ROOT', 'Image resolves outside the infographic root', { abort: true });
  }
  if (existsSync(uploadRecordPath)) {
    const physicalRecord = await realpath(uploadRecordPath);
    if (!isWithin(physicalRoot, physicalRecord)) {
      throw new UploadError('PATH_OUTSIDE_ROOT', 'Upload record resolves outside the infographic root', { abort: true });
    }
  }
  return { localPath, uploadRecordPath };
}

async function sha256File(filePath) {
  return createHash('sha256').update(await readFile(filePath)).digest('hex');
}

async function readUploadRecordFile(recordPath) {
  try {
    return JSON.parse(await readFile(recordPath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT' || error instanceof SyntaxError) return null;
    throw error;
  }
}

export function uploadRecordMatches(entry, record, currentImageHash) {
  const { item, asset } = entry;
  return record?.version === 2
    && record.status === 'uploaded'
    && record.article === item.article
    && record.series === item.series
    && record.number === item.number
    && record.assetId === asset.assetId
    && record.localPath === asset.localPath
    && record.contentHash === asset.contentHash
    && record.promptHash === asset.promptHash
    && record.imageHash === asset.imageHash
    && record.imageHash === currentImageHash
    && typeof record.provider === 'string'
    && record.provider.trim() !== ''
    && typeof record.uploadedAt === 'string'
    && validHttpsUrl(record.remoteUrl);
}

async function inspectAsset(entry, { repoRoot = REPO_ROOT } = {}) {
  const paths = await resolveAssetPaths(entry, { repoRoot });
  return {
    paths,
    currentImageHash: await sha256File(paths.localPath),
    record: await readUploadRecordFile(paths.uploadRecordPath),
  };
}

function successRecord(entry, result, uploadedAt, imageHash) {
  const safeResult = sanitizeUploadResult(result);
  return {
    version: 2,
    status: 'uploaded',
    article: entry.item.article,
    series: entry.item.series,
    number: entry.item.number,
    assetId: entry.asset.assetId,
    localPath: entry.asset.localPath,
    remoteUrl: safeResult.imgUrl,
    contentHash: entry.asset.contentHash,
    promptHash: entry.asset.promptHash,
    imageHash,
    uploadedAt,
    provider: safeResult.type?.trim() || 'picgo-gui',
    result: safeResult,
  };
}

function failedRecord(entry, errorSummary, attemptedAt, currentImageHash = '') {
  return {
    version: 2,
    status: 'failed',
    article: entry.item.article,
    series: entry.item.series,
    number: entry.item.number,
    assetId: entry.asset.assetId,
    localPath: entry.asset.localPath,
    contentHash: entry.asset.contentHash,
    promptHash: entry.asset.promptHash,
    imageHash: currentImageHash,
    attemptedAt,
    error: errorSummary,
  };
}

async function atomicWriteJson(targetPath, value) {
  await mkdir(path.dirname(targetPath), { recursive: true });
  const temporaryPath = path.join(
    path.dirname(targetPath),
    `.${path.basename(targetPath)}.${process.pid}.${randomUUID()}.tmp`,
  );
  try {
    await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
    await rename(temporaryPath, targetPath);
  } finally {
    await unlink(temporaryPath).catch((error) => {
      if (error?.code !== 'ENOENT') throw error;
    });
  }
}

export async function writeUploadRecordFile(entry, record, paths, { repoRoot = REPO_ROOT } = {}) {
  const checkedPaths = paths ?? await resolveAssetPaths(entry, { repoRoot });
  const allowedRoot = path.resolve(repoRoot, INFOGRAPHIC_ROOT);
  await assertNoSymlink(repoRoot, allowedRoot);
  await assertNoSymlink(allowedRoot, checkedPaths.uploadRecordPath, { allowMissingLeaf: true });
  await atomicWriteJson(checkedPaths.uploadRecordPath, record);
}

function clearUploadedState(asset) {
  asset.remoteUrl = '';
  delete asset.uploadedAt;
  delete asset.uploadProvider;
}

async function persistFailure({
  entry,
  error,
  inspection,
  manifest,
  persistManifest,
  writeUploadRecord,
  now,
  summary,
}) {
  const attemptedAt = now();
  const orphanedUpload = error?.orphanedUpload;
  let safeError = safeErrorSummary(error);
  if (orphanedUpload && validHttpsUrl(orphanedUpload.remoteUrl)) {
    safeError = {
      ...safeError,
      orphanedRemoteUrl: orphanedUpload.remoteUrl,
      uploadedAt: orphanedUpload.uploadedAt,
      provider: orphanedUpload.provider,
    };
  }
  clearUploadedState(entry.asset);
  entry.asset.status = 'upload-failed';
  entry.asset.lastAttemptedAt = attemptedAt;
  entry.asset.lastError = safeError;

  if (inspection?.paths && !orphanedUpload) {
    try {
      await writeUploadRecord(
        entry,
        failedRecord(entry, safeError, attemptedAt, inspection.currentImageHash),
        inspection.paths,
      );
    } catch (recordError) {
      const recordSummary = safeErrorSummary(new UploadError(
        'UPLOAD_RECORD_WRITE_FAILED',
        `Could not persist upload record: ${safeErrorSummary(recordError).message}`,
        { abort: true },
      ));
      safeError = recordSummary;
      entry.asset.lastError = safeError;
      error = Object.assign(recordError, { abort: true });
    }
  }

  try {
    await persistManifest(manifest, entry);
  } catch (manifestError) {
    safeError = safeErrorSummary(new UploadError(
      'MANIFEST_WRITE_FAILED',
      `Could not persist manifest checkpoint: ${safeErrorSummary(manifestError).message}`,
      { abort: true },
    ));
    error = Object.assign(manifestError, { abort: true });
  }

  summary.failed += 1;
  summary.failures.push({
    article: entry.item.article,
    assetId: entry.asset.assetId,
    localPath: entry.asset.localPath,
    reason: safeError,
    attemptedAt,
    ...(safeError.orphanedRemoteUrl ? { orphanedRemoteUrl: safeError.orphanedRemoteUrl } : {}),
  });
  if (error?.abort) summary.aborted = true;
}

function recoverableOrphan(asset) {
  const error = asset?.lastError;
  if (asset?.status !== 'upload-failed'
    || error?.code !== 'UPLOAD_RECORD_WRITE_FAILED_AFTER_UPLOAD'
    || !validHttpsUrl(error?.orphanedRemoteUrl)
    || typeof error?.uploadedAt !== 'string'
    || typeof error?.provider !== 'string'
    || !error.provider.trim()) return null;
  return {
    remoteUrl: error.orphanedRemoteUrl,
    uploadedAt: error.uploadedAt,
    provider: error.provider,
  };
}

function recordRecoverableManifestFailure(summary, entry, error, attemptedAt, context) {
  const safeError = safeErrorSummary(new UploadError(
    'MANIFEST_WRITE_FAILED',
    `${context}: ${safeErrorSummary(error).message}`,
    { abort: true },
  ));
  summary.failed += 1;
  summary.aborted = true;
  summary.failures.push({
    article: entry.item.article,
    assetId: entry.asset.assetId,
    localPath: entry.asset.localPath,
    reason: safeError,
    attemptedAt,
  });
}

export async function processUploadPlan({
  manifest,
  plan,
  dryRun = false,
  uploadOne,
  repoRoot = REPO_ROOT,
  inspect = (entry) => inspectAsset(entry, { repoRoot }),
  writeUploadRecord = (entry, record, paths) => writeUploadRecordFile(
    entry,
    record,
    paths,
    { repoRoot },
  ),
  persistManifest = async () => {},
  now = () => new Date().toISOString(),
  onCheckpoint = async () => {},
}) {
  const summary = {
    planned: plan.items.length,
    uploaded: 0,
    recovered: 0,
    skipped: 0,
    failed: 0,
    aborted: false,
    failures: [],
  };
  if (dryRun) return { manifest, plan, summary };
  if (typeof uploadOne !== 'function') throw new TypeError('uploadOne is required outside dry-run');

  for (const [batchIndex, batch] of plan.batches.entries()) {
    for (const entry of batch) {
      let inspection;
      try {
        inspection = await inspect(entry);
        const { asset } = entry;
        const currentAsset = asset.contentHash === entry.item.contentHash
          && HASH_PATTERN.test(asset.promptHash)
          && HASH_PATTERN.test(asset.imageHash)
          && asset.imageHash === inspection.currentImageHash;
        const validRecord = currentAsset
          && uploadRecordMatches(entry, inspection.record, inspection.currentImageHash);

        if (validRecord) {
          const recovered = asset.status !== 'uploaded'
            || asset.remoteUrl !== inspection.record.remoteUrl
            || asset.uploadedAt !== inspection.record.uploadedAt
            || asset.uploadProvider !== inspection.record.provider;
          asset.status = 'uploaded';
          asset.remoteUrl = inspection.record.remoteUrl;
          asset.uploadedAt = inspection.record.uploadedAt;
          asset.uploadProvider = inspection.record.provider;
          delete asset.lastAttemptedAt;
          delete asset.lastError;
          if (recovered) {
            try {
              await persistManifest(manifest, entry);
            } catch (manifestError) {
              recordRecoverableManifestFailure(
                summary,
                entry,
                manifestError,
                now(),
                'The valid upload record remains recoverable, but its manifest checkpoint failed',
              );
              break;
            }
            summary.recovered += 1;
          }
          summary.skipped += 1;
          continue;
        }

        const orphan = currentAsset ? recoverableOrphan(asset) : null;
        if (orphan) {
          const recoveredRecord = successRecord(
            entry,
            { imgUrl: orphan.remoteUrl, type: orphan.provider },
            orphan.uploadedAt,
            inspection.currentImageHash,
          );
          await writeUploadRecord(entry, recoveredRecord, inspection.paths);
          asset.status = 'uploaded';
          asset.remoteUrl = orphan.remoteUrl;
          asset.uploadedAt = orphan.uploadedAt;
          asset.uploadProvider = orphan.provider;
          delete asset.lastAttemptedAt;
          delete asset.lastError;
          try {
            await persistManifest(manifest, entry);
          } catch (manifestError) {
            recordRecoverableManifestFailure(
              summary,
              entry,
              manifestError,
              now(),
              'Recovered upload record is durable, but its manifest checkpoint failed',
            );
            break;
          }
          summary.recovered += 1;
          summary.skipped += 1;
          continue;
        }

        if (asset.remoteUrl || asset.status === 'uploaded') {
          clearUploadedState(asset);
          asset.status = currentAsset ? 'generated' : 'upload-failed';
          await persistManifest(manifest, entry);
        }
        if (asset.contentHash !== entry.item.contentHash) {
          throw new UploadError('CONTENT_HASH_MISMATCH', 'Asset content hash does not match its article');
        }
        if (!HASH_PATTERN.test(asset.promptHash)) {
          throw new UploadError('PROMPT_HASH_MISSING', 'Prompt hash is missing or invalid');
        }
        if (!HASH_PATTERN.test(asset.imageHash)) {
          throw new UploadError('IMAGE_HASH_MISSING', 'Image hash is missing or invalid');
        }
        if (asset.imageHash !== inspection.currentImageHash) {
          throw new UploadError('IMAGE_HASH_MISMATCH', 'Current image does not match the manifest image hash');
        }

        const result = await uploadOne(entry, inspection.paths.localPath);
        const safeResult = sanitizeUploadResult(result);
        if (!validHttpsUrl(safeResult.imgUrl)) {
          throw new UploadError('UPLOAD_URL_NOT_HTTPS', 'PicGo did not return a valid HTTPS URL', { abort: true });
        }
        const uploadedAt = now();
        const record = successRecord(entry, safeResult, uploadedAt, inspection.currentImageHash);
        try {
          await writeUploadRecord(entry, record, inspection.paths);
        } catch (recordError) {
          const uploadError = new UploadError(
            'UPLOAD_RECORD_WRITE_FAILED_AFTER_UPLOAD',
            `PicGo returned a URL, but upload.json could not be persisted: ${safeErrorSummary(recordError).message}`,
            { abort: true, cause: recordError },
          );
          uploadError.orphanedUpload = {
            remoteUrl: record.remoteUrl,
            uploadedAt,
            provider: record.provider,
          };
          throw uploadError;
        }

        asset.remoteUrl = record.remoteUrl;
        asset.status = 'uploaded';
        asset.uploadedAt = uploadedAt;
        asset.uploadProvider = record.provider;
        delete asset.lastAttemptedAt;
        delete asset.lastError;
        try {
          await persistManifest(manifest, entry);
        } catch (manifestError) {
          recordRecoverableManifestFailure(
            summary,
            entry,
            manifestError,
            uploadedAt,
            'Upload record is recoverable, but the manifest checkpoint failed',
          );
          break;
        }
        summary.uploaded += 1;
      } catch (error) {
        await persistFailure({
          entry,
          error,
          inspection,
          manifest,
          persistManifest,
          writeUploadRecord,
          now,
          summary,
        });
      }
      if (summary.aborted) break;
    }
    await onCheckpoint({ batchIndex, batch, summary });
    if (summary.aborted) break;
  }
  return { manifest, plan, summary };
}

function rawErrorText(error) {
  return `${error?.stderr ?? ''}\n${error?.message ?? ''}`;
}

function classifyPicGoError(error) {
  if (error instanceof UploadError) return error;
  const exitCode = Number(error?.code);
  const raw = rawErrorText(error);
  if (exitCode === 3 || /(?:authentication|unauthori[sz]ed|\b401\b)/iu.test(raw)) {
    return new UploadError('GUI_AUTH_FAILED', 'PicGo GUI authentication failed', { abort: true, cause: error });
  }
  if (exitCode === 2 && /(?:server is not running|heartbeat.*failed|GUI server not reachable)/iu.test(raw)) {
    return new UploadError('GUI_UNAVAILABLE', 'PicGo GUI server is not available', { abort: true, cause: error });
  }
  if (/(?:ECONN|ETIMEDOUT|ENOTFOUND|socket hang up|fetch failed|Failed to reach|network|HTTP\s+5\d\d)/iu.test(raw)) {
    return new UploadError('UPLOAD_TRANSIENT', 'PicGo upload failed because of a transient network error', {
      abort: true,
      retryable: true,
      cause: error,
    });
  }
  if (/(?:quota|configuration|not configured|login required)/iu.test(raw)) {
    return new UploadError('UPLOAD_CONFIGURATION_FAILED', 'PicGo uploader configuration or quota rejected the upload', {
      abort: true,
      cause: error,
    });
  }
  if (exitCode === 1 || /(?:file type|not allowed|does not exist|not a file)/iu.test(raw)) {
    return new UploadError('UPLOAD_INPUT_REJECTED', 'PicGo rejected the input file', { cause: error });
  }
  return new UploadError('PICGO_UPLOAD_FAILED', 'PicGo could not upload the image', { abort: exitCode === 4, cause: error });
}

export async function probePicgoCli({ execute = execFile } = {}) {
  try {
    await execute('picgo', ['get', 'uploader', '--format', 'json'], {
      cwd: REPO_ROOT,
      windowsHide: true,
      timeout: 10_000,
    });
    return true;
  } catch {
    return false;
  }
}

export function createGuiUploader(uploaderPath = DEFAULT_GUI_UPLOADER, {
  execute = execFile,
  probeCli = () => probePicgoCli({ execute }),
  repoRoot = REPO_ROOT,
} = {}) {
  return async (_entry, absoluteFile) => {
    if (!existsSync(uploaderPath)) {
      throw new UploadError('GUI_HELPER_MISSING', 'PicGo GUI upload helper is missing', { abort: true });
    }
    if (typeof absoluteFile !== 'string' || absoluteFile === '') {
      throw new UploadError('UPLOAD_INPUT_REJECTED', 'PicGo requires exactly one absolute image path');
    }
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const { stdout } = await execute(process.execPath, [uploaderPath, absoluteFile], {
          cwd: repoRoot,
          maxBuffer: 4 * 1024 * 1024,
          windowsHide: true,
        });
        let parsed;
        try {
          parsed = JSON.parse(stdout.trim());
        } catch (error) {
          throw new UploadError('PICGO_RESULT_INVALID', 'PicGo returned invalid JSON', { abort: true, cause: error });
        }
        if (!Array.isArray(parsed) || parsed.length !== 1) {
          throw new UploadError('PICGO_RESULT_INVALID', 'PicGo must return exactly one result for one input', { abort: true });
        }
        const safeResult = sanitizeUploadResult(parsed[0]);
        if (!validHttpsUrl(safeResult.imgUrl)) {
          throw new UploadError('UPLOAD_URL_NOT_HTTPS', 'PicGo returned an insecure or invalid URL', { abort: true });
        }
        return safeResult;
      } catch (rawError) {
        const error = classifyPicGoError(rawError);
        if (error.safeCode === 'GUI_UNAVAILABLE') {
          const cliAvailable = await probeCli();
          throw new UploadError(
            cliAvailable ? 'GUI_UNAVAILABLE_CLI_AVAILABLE' : 'GUI_UNAVAILABLE_CLI_MISSING',
            cliAvailable
              ? 'PicGo GUI is unavailable; PicGo CLI is installed but automatic fallback is disabled'
              : 'PicGo GUI is unavailable and PicGo CLI was not found',
            { abort: true, cause: error },
          );
        }
        if (attempt === 0 && error.retryable) continue;
        throw error;
      }
    }
    throw new UploadError('PICGO_UPLOAD_FAILED', 'PicGo upload failed', { abort: true });
  };
}

function parseArguments(argv) {
  const options = {
    series: 'all',
    batchSize: MAX_BATCH_SIZE,
    dryRun: false,
    manifestPath: DEFAULT_MANIFEST,
    uploaderPath: DEFAULT_GUI_UPLOADER,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--series') options.series = argv[++index];
    else if (argument === '--batch-size') options.batchSize = Number(argv[++index]);
    else if (argument === '--manifest') options.manifestPath = path.resolve(REPO_ROOT, argv[++index]);
    else if (argument === '--uploader-script') options.uploaderPath = path.resolve(REPO_ROOT, argv[++index]);
    else if (argument === '--dry-run') options.dryRun = true;
    else throw new UploadError('UNKNOWN_ARGUMENT', `Unknown argument: ${argument}`, { abort: true });
  }
  if (options.series !== 'all' && !SERIES.has(options.series)) {
    throw new UploadError('UNKNOWN_SERIES', `Unknown series: ${String(options.series)}`, { abort: true });
  }
  if (!Number.isInteger(options.batchSize) || options.batchSize < 1) {
    throw new UploadError('INVALID_BATCH_SIZE', '--batch-size must be a positive integer', { abort: true });
  }
  return options;
}

async function validateManifestFilePath(manifestPath) {
  const allowedRoot = path.resolve(REPO_ROOT, INFOGRAPHIC_ROOT);
  if (!isWithin(allowedRoot, manifestPath) || path.basename(manifestPath) !== 'manifest.json') {
    throw new UploadError('MANIFEST_PATH_INVALID', 'Manifest must be docs/infographics/ai-interview/manifest.json', { abort: true });
  }
  await assertNoSymlink(REPO_ROOT, allowedRoot);
  await assertNoSymlink(allowedRoot, manifestPath);
  const physicalRoot = await realpath(allowedRoot);
  const physicalManifest = await realpath(manifestPath);
  if (!isWithin(physicalRoot, physicalManifest)) {
    throw new UploadError('MANIFEST_PATH_INVALID', 'Manifest resolves outside the infographic root', { abort: true });
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  await validateManifestFilePath(options.manifestPath);
  const releaseLock = options.dryRun ? async () => {} : await acquireManifestLock(options.manifestPath);
  try {
    const manifest = JSON.parse(await readFile(options.manifestPath, 'utf8'));
    assertValidManifest(manifest, { repoRoot: REPO_ROOT, requireCompleteCorpus: true });
    const plan = createUploadPlan(manifest, options);

    console.log(`Series ${options.series}: ${plan.items.length} assets in ${plan.batches.length} checkpoints (max ${plan.batchSize}).`);
    const result = await processUploadPlan({
      manifest,
      plan,
      dryRun: options.dryRun,
      uploadOne: createGuiUploader(options.uploaderPath),
      persistManifest: () => atomicWriteJson(options.manifestPath, manifest),
      onCheckpoint: ({ batchIndex, summary }) => {
        console.log(`Checkpoint ${batchIndex + 1}: uploaded=${summary.uploaded}, skipped=${summary.skipped}, failed=${summary.failed}`);
      },
    });
    const { summary } = result;
    console.log(
      `Result: planned=${summary.planned}, uploaded=${summary.uploaded}, recovered=${summary.recovered}, skipped=${summary.skipped}, failed=${summary.failed}.`,
    );
    for (const failure of summary.failures) {
      const orphan = failure.orphanedRemoteUrl
        ? ` preserved-url=${redactText(failure.orphanedRemoteUrl)}`
        : '';
      console.error(
        `FAILED ${failure.article}#${failure.assetId} (${failure.localPath}): ${failure.reason.code} ${failure.reason.message}${orphan}`,
      );
    }
    if (summary.failed > 0 || summary.aborted) process.exitCode = 1;
  } finally {
    await releaseLock();
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath.toLowerCase() === SCRIPT_PATH.toLowerCase()) {
  main().catch((error) => {
    const safe = safeErrorSummary(error);
    console.error(`upload-infographics: ${safe.code} ${safe.message}`);
    process.exitCode = 1;
  });
}
