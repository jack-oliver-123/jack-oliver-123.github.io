import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  unlink,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  UploadError,
  acquireManifestLock,
  createGuiUploader,
  createUploadPlan,
  processUploadPlan,
  redactSensitive,
  resolveAssetPaths,
  safeErrorSummary,
  sanitizeUploadResult,
  validateUploadManifest,
} from '../upload-infographics.mjs';

const CONTENT_HASH = 'a'.repeat(64);
const PROMPT_HASH = 'b'.repeat(64);

function hash(value) {
  return createHash('sha256').update(value).digest('hex');
}

function assetPaths(workDir, assetId) {
  const suffix = assetId === 'primary' ? '' : `-${assetId.slice(-2)}`;
  return {
    localPath: `${workDir}/infographic${suffix}.png`,
    sourcePath: `${workDir}/source.md`,
    analysisPath: `${workDir}/analysis${suffix}.md`,
    structuredContentPath: `${workDir}/structured-content${suffix}.md`,
    promptPath: `${workDir}/prompts/infographic${suffix}.md`,
    uploadRecordPath: `${workDir}/upload${suffix}.json`,
  };
}

function makeItem(number, assetIds = ['primary']) {
  const workDir = `docs/infographics/ai-interview/agent/${String(number).padStart(2, '0')}-topic`;
  return {
    article: `src/content/agent/${String(number).padStart(2, '0')}.md`,
    series: 'agent',
    number,
    slug: `topic-${number}`,
    title: `Topic ${number}`,
    workDir,
    layout: 'bento-grid',
    style: 'hand-drawn-edu',
    aspect: '16:9',
    language: 'zh',
    backend: 'imagegen',
    contentHash: CONTENT_HASH,
    assets: assetIds.map((assetId) => ({
      assetId,
      role: assetId === 'primary' ? 'primary' : 'secondary',
      position: assetId === 'primary' ? 'after-summary' : 'after-detail',
      ...assetPaths(workDir, assetId),
      contentHash: CONTENT_HASH,
      promptHash: PROMPT_HASH,
      imageHash: '',
      remoteUrl: '',
      status: 'generated',
    })),
  };
}

function makeManifest(items = [makeItem(0)]) {
  return {
    version: 2,
    generatedOn: '2026-07-12',
    defaults: { aspect: '16:9', language: 'zh', backend: 'imagegen' },
    items,
  };
}

async function makeFixture(t, { itemCount = 1, assetIds = ['primary'] } = {}) {
  const repoRoot = await mkdtemp(path.join(os.tmpdir(), 'infographic-upload-'));
  t.after(() => rm(repoRoot, { recursive: true, force: true }));
  const manifest = makeManifest(Array.from({ length: itemCount }, (_, index) => makeItem(index, assetIds)));
  for (const item of manifest.items) {
    for (const entry of item.assets) {
      const bytes = Buffer.from(`png:${item.number}:${entry.assetId}`);
      const absolute = path.resolve(repoRoot, entry.localPath);
      await mkdir(path.dirname(absolute), { recursive: true });
      await writeFile(absolute, bytes);
      entry.imageHash = hash(bytes);
    }
  }
  return { repoRoot, manifest };
}

function entryAt(manifest, itemIndex = 0, assetIndex = 0) {
  const item = manifest.items[itemIndex];
  return {
    article: item.article,
    series: item.series,
    number: item.number,
    item,
    asset: item.assets[assetIndex],
  };
}

function successUploadRecord(entry, overrides = {}) {
  return {
    version: 2,
    status: 'uploaded',
    article: entry.item.article,
    series: entry.item.series,
    number: entry.item.number,
    assetId: entry.asset.assetId,
    localPath: entry.asset.localPath,
    remoteUrl: `https://img.example/${entry.item.number}-${entry.asset.assetId}.png`,
    contentHash: entry.asset.contentHash,
    promptHash: entry.asset.promptHash,
    imageHash: entry.asset.imageHash,
    uploadedAt: '2026-07-12T00:00:00.000Z',
    provider: 'github',
    result: { imgUrl: `https://img.example/${entry.item.number}-${entry.asset.assetId}.png`, type: 'github' },
    ...overrides,
  };
}

test('flattens article assets and caps checkpoints at five', async (t) => {
  const { manifest, repoRoot } = await makeFixture(t, { itemCount: 2, assetIds: ['primary', 'secondary-02', 'secondary-03'] });
  const plan = createUploadPlan(manifest, { series: 'agent', batchSize: 99, repoRoot });

  assert.equal(plan.items.length, 6);
  assert.deepEqual(plan.batches.map((batch) => batch.length), [5, 1]);
  assert.deepEqual(plan.items.map((entry) => entry.asset.assetId), [
    'primary', 'secondary-02', 'secondary-03',
    'primary', 'secondary-02', 'secondary-03',
  ]);
});

test('uploads exactly one file per call and preserves asset mapping order', async (t) => {
  const { manifest, repoRoot } = await makeFixture(t, { itemCount: 2, assetIds: ['primary', 'secondary-02', 'secondary-03'] });
  const plan = createUploadPlan(manifest, { batchSize: 5, repoRoot });
  const calls = [];
  const records = [];
  const checkpoints = [];
  const result = await processUploadPlan({
    manifest,
    plan,
    repoRoot,
    uploadOne: async (entry, absoluteFile) => {
      assert.equal(typeof absoluteFile, 'string');
      calls.push(`${entry.item.number}:${entry.asset.assetId}`);
      return {
        imgUrl: `https://img.example/${entry.item.number}-${entry.asset.assetId}.png`,
        fileName: path.basename(absoluteFile),
        type: 'github',
      };
    },
    writeUploadRecord: async (entry, record) => records.push({ entry, record }),
    persistManifest: async (current) => checkpoints.push(structuredClone(current)),
    now: () => '2026-07-12T00:00:00.000Z',
  });

  assert.deepEqual(calls, [
    '0:primary', '0:secondary-02', '0:secondary-03',
    '1:primary', '1:secondary-02', '1:secondary-03',
  ]);
  assert.equal(records.length, 6);
  assert.equal(checkpoints.length, 6);
  assert.equal(result.summary.uploaded, 6);
  assert.equal(manifest.items[1].assets[2].remoteUrl, 'https://img.example/1-secondary-03.png');
});

test('dry-run performs no file inspection, upload, persistence, or mutation', async (t) => {
  const { manifest, repoRoot } = await makeFixture(t);
  const original = structuredClone(manifest);
  const plan = createUploadPlan(manifest, { repoRoot });
  let calls = 0;
  const result = await processUploadPlan({
    manifest,
    plan,
    dryRun: true,
    inspect: async () => { calls += 1; },
    uploadOne: async () => { calls += 1; },
    persistManifest: async () => { calls += 1; },
  });

  assert.equal(calls, 0);
  assert.equal(result.summary.planned, 1);
  assert.deepEqual(manifest, original);
});

test('persists five successes before a later fatal upload failure', async (t) => {
  const { manifest, repoRoot } = await makeFixture(t, { itemCount: 2, assetIds: ['primary', 'secondary-02', 'secondary-03'] });
  const plan = createUploadPlan(manifest, { batchSize: 5, repoRoot });
  const snapshots = [];
  let calls = 0;
  const result = await processUploadPlan({
    manifest,
    plan,
    repoRoot,
    uploadOne: async (entry) => {
      calls += 1;
      if (calls === 6) throw new UploadError('GUI_AUTH_FAILED', 'GUI authentication failed', { abort: true });
      return { imgUrl: `https://img.example/${entry.item.number}-${entry.asset.assetId}.png`, type: 'github' };
    },
    writeUploadRecord: async () => {},
    persistManifest: async (current) => snapshots.push(structuredClone(current)),
  });

  assert.equal(result.summary.uploaded, 5);
  assert.equal(result.summary.failed, 1);
  assert.equal(result.summary.aborted, true);
  assert.equal(snapshots.length, 6);
  assert.equal(manifest.items.flatMap((item) => item.assets).filter((asset) => asset.status === 'uploaded').length, 5);
  assert.equal(manifest.items[1].assets[2].status, 'upload-failed');
  assert.equal(result.summary.failures[0].reason.code, 'GUI_AUTH_FAILED');
});

test('recovers manifest state from a matching upload record without reuploading', async (t) => {
  const { manifest, repoRoot } = await makeFixture(t);
  const entry = entryAt(manifest);
  const record = successUploadRecord(entry);
  const recordPath = path.resolve(repoRoot, entry.asset.uploadRecordPath);
  await writeFile(recordPath, JSON.stringify(record));
  let uploads = 0;
  let persists = 0;
  const result = await processUploadPlan({
    manifest,
    plan: createUploadPlan(manifest, { repoRoot }),
    repoRoot,
    uploadOne: async () => { uploads += 1; },
    persistManifest: async () => { persists += 1; },
  });

  assert.equal(uploads, 0);
  assert.equal(persists, 1);
  assert.equal(result.summary.recovered, 1);
  assert.equal(result.summary.skipped, 1);
  assert.equal(entry.asset.remoteUrl, record.remoteUrl);
  assert.equal(entry.asset.status, 'uploaded');
});

test('skips only when current image, manifest, and upload record hashes all match', async (t) => {
  const { manifest, repoRoot } = await makeFixture(t);
  const entry = entryAt(manifest);
  const record = successUploadRecord(entry);
  Object.assign(entry.asset, {
    status: 'uploaded',
    remoteUrl: record.remoteUrl,
    uploadedAt: record.uploadedAt,
    uploadProvider: record.provider,
  });
  await writeFile(path.resolve(repoRoot, entry.asset.uploadRecordPath), JSON.stringify(record));
  let uploads = 0;
  let persists = 0;
  const first = await processUploadPlan({
    manifest,
    plan: createUploadPlan(manifest, { repoRoot }),
    repoRoot,
    uploadOne: async () => { uploads += 1; },
    persistManifest: async () => { persists += 1; },
  });
  assert.equal(first.summary.skipped, 1);
  assert.equal(uploads, 0);
  assert.equal(persists, 0);

  await writeFile(path.resolve(repoRoot, entry.asset.localPath), Buffer.from('changed-image'));
  const second = await processUploadPlan({
    manifest,
    plan: createUploadPlan(manifest, { repoRoot }),
    repoRoot,
    uploadOne: async () => { uploads += 1; },
    writeUploadRecord: async () => {},
    persistManifest: async () => { persists += 1; },
  });
  assert.equal(second.summary.failed, 1);
  assert.equal(second.summary.failures[0].reason.code, 'IMAGE_HASH_MISMATCH');
  assert.equal(entry.asset.remoteUrl, '');
  assert.equal(entry.asset.status, 'upload-failed');
  assert.equal(uploads, 0);
  assert.equal(persists, 2);
});

test('rejects path traversal for image and upload record paths', async (t) => {
  const { manifest, repoRoot } = await makeFixture(t);
  manifest.items[0].assets[0].localPath = '../secret.png';
  assert.match(validateUploadManifest(manifest, { repoRoot }).join('\n'), /traversal|outside/iu);
  assert.throws(() => createUploadPlan(manifest, { repoRoot }), /Manifest validation failed/iu);

  const second = (await makeFixture(t)).manifest;
  second.items[0].assets[0].uploadRecordPath = 'docs/infographics/ai-interview/../../outside/upload.json';
  assert.match(validateUploadManifest(second, { repoRoot }).join('\n'), /traversal|outside/iu);
});

test('rejects an image symlink even when its manifest path stays inside the root', async (t) => {
  const { manifest, repoRoot } = await makeFixture(t);
  const entry = entryAt(manifest);
  const localPath = path.resolve(repoRoot, entry.asset.localPath);
  const outsidePath = path.resolve(repoRoot, 'outside.png');
  await writeFile(outsidePath, 'outside');
  await unlink(localPath);
  try {
    await symlink(outsidePath, localPath, 'file');
  } catch (error) {
    if (['EPERM', 'EACCES', 'UNKNOWN'].includes(error?.code)) {
      t.skip(`Creating symlinks is unavailable on this host (${error.code})`);
      return;
    }
    throw error;
  }
  await assert.rejects(
    resolveAssetPaths(entry, { repoRoot }),
    (error) => error?.safeCode === 'SYMLINK_NOT_ALLOWED',
  );
});

test('rejects empty manifests, unknown series, and HTTP URLs', async (t) => {
  const empty = makeManifest([]);
  assert.match(validateUploadManifest(empty).join('\n'), /must not be empty/iu);
  assert.throws(() => createUploadPlan(empty), /must not be empty/iu);

  const { manifest, repoRoot } = await makeFixture(t);
  assert.throws(() => createUploadPlan(manifest, { series: 'typo', repoRoot }), (error) => error?.safeCode === 'UNKNOWN_SERIES');
  const asset = manifest.items[0].assets[0];
  asset.status = 'uploaded';
  asset.remoteUrl = 'http://img.example/insecure.png';
  assert.match(validateUploadManifest(manifest, { repoRoot }).join('\n'), /HTTPS/iu);
});

test('rejects a non-HTTPS PicGo result and records the affected file', async (t) => {
  const { manifest, repoRoot } = await makeFixture(t);
  const result = await processUploadPlan({
    manifest,
    plan: createUploadPlan(manifest, { repoRoot }),
    repoRoot,
    uploadOne: async () => ({ imgUrl: 'http://img.example/insecure.png', type: 'github' }),
    writeUploadRecord: async () => {},
    persistManifest: async () => {},
  });

  assert.equal(result.summary.failed, 1);
  assert.equal(result.summary.aborted, true);
  assert.equal(result.summary.failures[0].localPath, manifest.items[0].assets[0].localPath);
  assert.equal(result.summary.failures[0].reason.code, 'UPLOAD_URL_NOT_HTTPS');
});

test('recursively redacts credentials, signed URL queries, and long error bodies', () => {
  const redacted = redactSensitive({
    token: 'top-secret-token',
    key: 'generic-key-value',
    nested: {
      apiKey: 'api-key-value',
      message: 'Authorization: Bearer bearer-value https://x.test/a?X-Amz-Signature=query-secret&ok=1',
    },
  });
  const serialized = JSON.stringify(redacted);
  assert.doesNotMatch(serialized, /top-secret-token|generic-key-value|api-key-value|bearer-value|query-secret/u);
  assert.match(serialized, /REDACTED/u);

  const summary = safeErrorSummary(new Error(
    `server returned {"password":"json-secret","details":"${'x'.repeat(600)}"} cookie=session-secret`,
  ));
  assert.equal(summary.code, 'UPLOAD_FAILED');
  assert.doesNotMatch(summary.message, /json-secret|session-secret/u);
  assert.ok(summary.message.length <= 280);
});

test('sanitizes successful PicGo results with a strict allowlist', () => {
  assert.deepEqual(sanitizeUploadResult({
    imgUrl: 'https://img.example/a.png',
    fileName: 'a.png',
    type: 'github',
    size: 42,
    token: 'secret-token',
    Authorization: 'Bearer secret',
    nested: { secret: 'value' },
  }), {
    imgUrl: 'https://img.example/a.png',
    fileName: 'a.png',
    type: 'github',
    size: 42,
  });
});

test('retries one transient GUI failure and still invokes the helper with one file', async () => {
  let calls = 0;
  const uploader = createGuiUploader(process.execPath, {
    execute: async (_command, args) => {
      calls += 1;
      assert.equal(args.length, 2);
      if (calls === 1) {
        const error = new Error('fetch failed: ECONNRESET');
        error.code = 4;
        error.stderr = 'network fetch failed';
        throw error;
      }
      return { stdout: '[{"imgUrl":"https://img.example/a.png","type":"github"}]' };
    },
  });

  const result = await uploader({}, 'C:\\images\\a.png');
  assert.equal(calls, 2);
  assert.equal(result.imgUrl, 'https://img.example/a.png');
});

test('probes but never switches to PicGo CLI when the GUI is unavailable', async () => {
  let calls = 0;
  let probes = 0;
  const uploader = createGuiUploader(process.execPath, {
    execute: async () => {
      calls += 1;
      const error = new Error('PicGo GUI server is not running');
      error.code = 2;
      error.stderr = 'PicGo GUI server is not running at http://127.0.0.1:36677';
      throw error;
    },
    probeCli: async () => {
      probes += 1;
      return true;
    },
  });

  await assert.rejects(
    uploader({}, 'C:\\images\\a.png'),
    (error) => error?.safeCode === 'GUI_UNAVAILABLE_CLI_AVAILABLE',
  );
  assert.equal(calls, 1);
  assert.equal(probes, 1);
});

test('does not retry an authentication exit code', async () => {
  let calls = 0;
  const uploader = createGuiUploader(process.execPath, {
    execute: async () => {
      calls += 1;
      const error = new Error('authentication required');
      error.code = 3;
      throw error;
    },
  });
  await assert.rejects(
    uploader({}, 'C:\\images\\a.png'),
    (error) => error?.safeCode === 'GUI_AUTH_FAILED',
  );
  assert.equal(calls, 1);
});

test('treats malformed PicGo JSON as a fatal response instead of retrying every asset', async () => {
  let calls = 0;
  const uploader = createGuiUploader(process.execPath, {
    execute: async () => {
      calls += 1;
      return { stdout: 'debug log followed by invalid json' };
    },
  });
  await assert.rejects(
    uploader({}, 'C:\\images\\a.png'),
    (error) => error?.safeCode === 'PICGO_RESULT_INVALID' && error?.abort === true,
  );
  assert.equal(calls, 1);
});

test('writes a v2 recovery record before each manifest success checkpoint', async (t) => {
  const { manifest, repoRoot } = await makeFixture(t);
  const events = [];
  await processUploadPlan({
    manifest,
    plan: createUploadPlan(manifest, { repoRoot }),
    repoRoot,
    uploadOne: async () => ({ imgUrl: 'https://img.example/a.png', type: 'github' }),
    writeUploadRecord: async (_entry, record) => {
      events.push(`record:${record.version}:${record.status}:${record.imageHash}`);
    },
    persistManifest: async () => events.push('manifest'),
  });

  assert.deepEqual(events, [`record:2:uploaded:${manifest.items[0].assets[0].imageHash}`, 'manifest']);
});

test('matching upload.json remains recoverable when manifest checkpoint writing fails', async (t) => {
  const { manifest, repoRoot } = await makeFixture(t);
  const entry = entryAt(manifest);
  const result = await processUploadPlan({
    manifest,
    plan: createUploadPlan(manifest, { repoRoot }),
    repoRoot,
    uploadOne: async () => ({ imgUrl: 'https://img.example/recoverable.png', type: 'github' }),
    persistManifest: async () => { throw new Error('disk unavailable'); },
  });

  assert.equal(result.summary.aborted, true);
  assert.equal(result.summary.failures[0].reason.code, 'MANIFEST_WRITE_FAILED');
  const record = JSON.parse(await readFile(path.resolve(repoRoot, entry.asset.uploadRecordPath), 'utf8'));
  assert.equal(record.status, 'uploaded');
  assert.equal(record.remoteUrl, 'https://img.example/recoverable.png');
});

test('does not overwrite a valid recovery record when recovery checkpoint writing fails', async (t) => {
  const { manifest, repoRoot } = await makeFixture(t);
  const entry = entryAt(manifest);
  const record = successUploadRecord(entry);
  const recordPath = path.resolve(repoRoot, entry.asset.uploadRecordPath);
  await writeFile(recordPath, JSON.stringify(record));
  let recordWrites = 0;
  const result = await processUploadPlan({
    manifest,
    plan: createUploadPlan(manifest, { repoRoot }),
    repoRoot,
    uploadOne: async () => assert.fail('a valid recovery record must not reupload'),
    writeUploadRecord: async () => { recordWrites += 1; },
    persistManifest: async () => { throw new Error('disk unavailable'); },
  });

  assert.equal(result.summary.aborted, true);
  assert.equal(result.summary.failures[0].reason.code, 'MANIFEST_WRITE_FAILED');
  assert.equal(recordWrites, 0);
  assert.deepEqual(JSON.parse(await readFile(recordPath, 'utf8')), record);
});

test('atomically replaces an existing failed upload record on success', async (t) => {
  const { manifest, repoRoot } = await makeFixture(t);
  const entry = entryAt(manifest);
  const recordPath = path.resolve(repoRoot, entry.asset.uploadRecordPath);
  await writeFile(recordPath, JSON.stringify({ version: 2, status: 'failed', error: { code: 'OLD', message: 'old' } }));
  const result = await processUploadPlan({
    manifest,
    plan: createUploadPlan(manifest, { repoRoot }),
    repoRoot,
    uploadOne: async () => ({ imgUrl: 'https://img.example/replaced.png', type: 'github' }),
    persistManifest: async () => {},
  });

  assert.equal(result.summary.uploaded, 1);
  const record = JSON.parse(await readFile(recordPath, 'utf8'));
  assert.equal(record.status, 'uploaded');
  assert.equal(record.remoteUrl, 'https://img.example/replaced.png');
});

test('serializes live upload processes with an exclusive manifest lock', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'infographic-upload-lock-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const manifestPath = path.join(root, 'manifest.json');
  await writeFile(manifestPath, '{}');

  const release = await acquireManifestLock(manifestPath, { pid: 101, now: () => '2026-07-12T00:00:00.000Z' });
  await assert.rejects(
    acquireManifestLock(manifestPath, {
      pid: 202,
      now: () => '2026-07-12T00:00:01.000Z',
      isProcessAlive: (pid) => pid === 101,
    }),
    (error) => error?.safeCode === 'MANIFEST_LOCKED' && error?.abort === true,
  );
  await release();

  const releaseAgain = await acquireManifestLock(manifestPath, { pid: 303 });
  await releaseAgain();

  await writeFile(
    `${manifestPath}.upload.lock`,
    `${JSON.stringify({ pid: 404, acquiredAt: '2026-07-11T00:00:00.000Z' })}\n`,
  );
  const releaseRecovered = await acquireManifestLock(manifestPath, {
    pid: 505,
    now: () => '2026-07-12T00:00:00.000Z',
    isProcessAlive: () => false,
  });
  await releaseRecovered();
});

test('recovers a PicGo URL after the first upload record write fails without reuploading', async (t) => {
  const { manifest, repoRoot } = await makeFixture(t);
  const url = 'https://img.example/orphan-recovery.png';
  let uploads = 0;
  const first = await processUploadPlan({
    manifest,
    plan: createUploadPlan(manifest, { repoRoot }),
    repoRoot,
    uploadOne: async () => {
      uploads += 1;
      return { imgUrl: url, type: 'github' };
    },
    writeUploadRecord: async () => { throw new Error('record disk unavailable'); },
    persistManifest: async () => {},
    now: () => '2026-07-12T00:00:00.000Z',
  });

  assert.equal(first.summary.failed, 1);
  assert.equal(first.summary.failures[0].reason.code, 'UPLOAD_RECORD_WRITE_FAILED_AFTER_UPLOAD');
  assert.equal(first.summary.failures[0].orphanedRemoteUrl, url);
  assert.equal(manifest.items[0].assets[0].lastError.orphanedRemoteUrl, url);

  const recoveredRecords = [];
  const second = await processUploadPlan({
    manifest,
    plan: createUploadPlan(manifest, { repoRoot }),
    repoRoot,
    uploadOne: async () => assert.fail('a preserved PicGo URL must not be uploaded again'),
    writeUploadRecord: async (_entry, record) => recoveredRecords.push(record),
    persistManifest: async () => {},
    now: () => '2026-07-12T00:00:02.000Z',
  });

  assert.equal(uploads, 1);
  assert.equal(second.summary.recovered, 1);
  assert.equal(second.summary.skipped, 1);
  assert.equal(recoveredRecords[0].remoteUrl, url);
  assert.equal(manifest.items[0].assets[0].status, 'uploaded');
  assert.equal(manifest.items[0].assets[0].remoteUrl, url);
});
