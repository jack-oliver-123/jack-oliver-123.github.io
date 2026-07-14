import { createHash, randomUUID } from 'node:crypto';
import { lstat, readFile, realpath, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { acquireManifestLock } from './infographic-manifest-lock.mjs';
import { validateUploadManifest } from './upload-infographics.mjs';

const INFOGRAPHIC_ROOT = 'docs/infographics/ai-interview';
const SERIES = new Set(['overview', 'agent', 'rag', 'tools', 'llm']);
const PNG_SIGNATURE = Buffer.from('89504e470d0a1a0a', 'hex');

function isWithin(root, target) {
  const relation = path.relative(root, target);
  return relation === '' || (!relation.startsWith(`..${path.sep}`) && relation !== '..' && !path.isAbsolute(relation));
}

function resolveBounded(repoRoot, relativePath) {
  if (typeof relativePath !== 'string' || relativePath.length === 0 || path.isAbsolute(relativePath)) {
    throw new Error(`Path is outside ${INFOGRAPHIC_ROOT}`);
  }
  const allowedRoot = path.resolve(repoRoot, INFOGRAPHIC_ROOT);
  const target = path.resolve(repoRoot, relativePath);
  if (!isWithin(allowedRoot, target)) throw new Error(`Path is outside ${INFOGRAPHIC_ROOT}: ${relativePath}`);
  return { allowedRoot, target };
}

async function assertPhysicalPath(allowedRoot, target) {
  const physicalRoot = await realpath(allowedRoot);
  let current = allowedRoot;
  const relation = path.relative(allowedRoot, target);
  for (const segment of relation.split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    let details;
    try {
      details = await lstat(current);
    } catch (error) {
      if (error?.code === 'ENOENT') break;
      throw error;
    }
    if (details.isSymbolicLink()) throw new Error(`Symbolic links are not allowed under ${INFOGRAPHIC_ROOT}`);
  }
  const physicalTarget = await realpath(target);
  if (!isWithin(physicalRoot, physicalTarget)) throw new Error(`Path resolves outside ${INFOGRAPHIC_ROOT}`);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function inspectEntry(entry, repoRoot) {
  const prompt = resolveBounded(repoRoot, entry.asset.promptPath);
  const image = resolveBounded(repoRoot, entry.asset.localPath);

  let promptBytes;
  try {
    promptBytes = await readFile(prompt.target);
  } catch (error) {
    if (error?.code === 'ENOENT') return { error: 'PROMPT_MISSING' };
    throw error;
  }
  if (promptBytes.length === 0) return { error: 'PROMPT_EMPTY' };
  await assertPhysicalPath(prompt.allowedRoot, prompt.target);

  let imageBytes;
  try {
    imageBytes = await readFile(image.target);
  } catch (error) {
    if (error?.code === 'ENOENT') return { error: 'IMAGE_MISSING' };
    throw error;
  }
  const imageDetails = await stat(image.target);
  if (!imageDetails.isFile() || imageBytes.length < PNG_SIGNATURE.length
    || !imageBytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    return { error: 'IMAGE_NOT_PNG' };
  }
  await assertPhysicalPath(image.allowedRoot, image.target);

  return { promptHash: sha256(promptBytes), imageHash: sha256(imageBytes) };
}

async function atomicWriteJson(filePath, value) {
  const temporary = path.join(path.dirname(filePath), `.${path.basename(filePath)}.${process.pid}.${randomUUID()}.tmp`);
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(temporary, filePath);
}

function clearUploadState(asset) {
  asset.remoteUrl = '';
  delete asset.uploadedAt;
  delete asset.uploadProvider;
  delete asset.lastAttemptedAt;
  delete asset.lastError;
}

export async function recordGeneratedInfographics({
  repoRoot = process.cwd(),
  manifestPath = path.join(repoRoot, INFOGRAPHIC_ROOT, 'manifest.json'),
  series = 'all',
  dryRun = false,
  requireCompleteCorpus = false,
  generatedAt = new Date().toISOString(),
} = {}) {
  if (series !== 'all' && !SERIES.has(series)) throw new Error(`Unknown series: ${series}`);
  const absoluteRepoRoot = path.resolve(repoRoot);
  const absoluteManifestPath = path.isAbsolute(manifestPath)
    ? manifestPath
    : path.resolve(absoluteRepoRoot, manifestPath);
  const releaseLock = dryRun ? async () => {} : await acquireManifestLock(absoluteManifestPath);
  try {
    const manifest = JSON.parse(await readFile(absoluteManifestPath, 'utf8'));
    const validationErrors = validateUploadManifest(manifest, {
      repoRoot: absoluteRepoRoot,
      requireCompleteCorpus,
    });
    if (validationErrors.length > 0) {
      const boundary = validationErrors.some((message) => /traversal|outside|repository-relative/i.test(message))
        ? ` Path is outside ${INFOGRAPHIC_ROOT}.`
        : '';
      throw new Error(`Manifest validation failed.${boundary} ${validationErrors.join('; ')}`);
    }

  const selected = manifest.items.flatMap((item) => (
    series === 'all' || item.series === series
      ? item.assets.map((asset) => ({ item, asset }))
      : []
  ));
  const result = { selected: selected.length, generated: 0, unchanged: 0, failed: [] };

  for (const entry of selected) {
    const identity = `${entry.item.series}:${entry.item.number}:${entry.asset.assetId}`;
    const inspection = await inspectEntry(entry, absoluteRepoRoot);
    if (inspection.error) {
      result.failed.push({ identity, reason: inspection.error });
      continue;
    }

    const matchingHashes = entry.asset.promptHash === inspection.promptHash
      && entry.asset.imageHash === inspection.imageHash;
    if (entry.asset.status === 'uploaded' && matchingHashes) {
      result.unchanged += 1;
      continue;
    }
    if (entry.asset.status === 'generated' && matchingHashes) {
      result.unchanged += 1;
      continue;
    }

    entry.asset.promptHash = inspection.promptHash;
    entry.asset.imageHash = inspection.imageHash;
    entry.asset.status = 'generated';
    entry.asset.generatedAt = generatedAt;
    clearUploadState(entry.asset);
    result.generated += 1;
    if (!dryRun) await atomicWriteJson(absoluteManifestPath, manifest);
  }

    return result;
  } finally {
    await releaseLock();
  }
}

function readOption(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const manifestPath = readOption('--manifest');
  const series = readOption('--series') ?? 'all';
  const dryRun = process.argv.includes('--dry-run');
  const result = await recordGeneratedInfographics({
    manifestPath,
    series,
    dryRun,
    requireCompleteCorpus: true,
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.failed.length > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`record-generated-infographics: ${error.message}\n`);
    process.exitCode = 1;
  });
}
