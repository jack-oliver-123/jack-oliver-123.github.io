import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { recordGeneratedInfographics } from '../record-generated-infographics.mjs';

const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');
const hash = (value) => createHash('sha256').update(value).digest('hex');

async function makeFixture({ status = 'planned', uploaded = false } = {}) {
  const repoRoot = await mkdtemp(path.join(os.tmpdir(), 'record-infographics-'));
  const workDir = 'docs/infographics/ai-interview/agent/01-testing';
  const promptPath = `${workDir}/prompts/infographic.md`;
  const localPath = `${workDir}/infographic.png`;
  const prompt = '生成一张测试信息图。\n';
  const articleHash = hash('article');
  const manifest = {
    version: 2,
    generatedOn: '2026-07-12',
    defaults: { aspect: '16:9', language: 'zh', backend: 'imagegen' },
    items: [
      {
        article: 'src/content/blog/AI应用开发/01.Agent面试专题/01.测试.md',
        series: 'agent',
        number: 1,
        slug: 'testing',
        title: '1. 测试',
        workDir,
        layout: 'bento-grid',
        style: 'hand-drawn-edu',
        aspect: '16:9',
        language: 'zh',
        backend: 'imagegen',
        contentHash: articleHash,
        assets: [
          {
            assetId: 'primary',
            role: 'primary',
            position: 'after-60-second-answer',
            localPath,
            sourcePath: `${workDir}/source.md`,
            analysisPath: `${workDir}/analysis.md`,
            structuredContentPath: `${workDir}/structured-content.md`,
            promptPath,
            uploadRecordPath: `${workDir}/upload.json`,
            contentHash: articleHash,
            promptHash: uploaded ? hash(prompt) : '',
            imageHash: uploaded ? hash(PNG) : '',
            remoteUrl: uploaded ? 'https://images.example.com/testing.png' : '',
            status,
            ...(uploaded ? { uploadedAt: '2026-07-12T12:00:00.000Z', uploadProvider: 'picgo' } : {}),
          },
        ],
      },
    ],
  };

  const manifestPath = path.join(repoRoot, 'docs/infographics/ai-interview/manifest.json');
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await mkdir(path.dirname(path.join(repoRoot, promptPath)), { recursive: true });
  await writeFile(path.join(repoRoot, promptPath), prompt, 'utf8');
  await writeFile(path.join(repoRoot, localPath), PNG);
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return { repoRoot, manifestPath, prompt, workDir };
}

test('records current prompt and image hashes and marks a planned asset generated', async () => {
  const fixture = await makeFixture();

  const result = await recordGeneratedInfographics({
    repoRoot: fixture.repoRoot,
    manifestPath: fixture.manifestPath,
    generatedAt: '2026-07-12T13:00:00.000Z',
  });

  assert.deepEqual(result, { selected: 1, generated: 1, unchanged: 0, failed: [] });
  const manifest = JSON.parse(await readFile(fixture.manifestPath, 'utf8'));
  const asset = manifest.items[0].assets[0];
  assert.equal(asset.promptHash, hash(fixture.prompt));
  assert.equal(asset.imageHash, hash(PNG));
  assert.equal(asset.status, 'generated');
  assert.equal(asset.generatedAt, '2026-07-12T13:00:00.000Z');
  assert.equal(asset.remoteUrl, '');
});

test('keeps a matching uploaded asset uploaded and unchanged', async () => {
  const fixture = await makeFixture({ status: 'uploaded', uploaded: true });

  const result = await recordGeneratedInfographics({
    repoRoot: fixture.repoRoot,
    manifestPath: fixture.manifestPath,
    generatedAt: '2026-07-12T13:00:00.000Z',
  });

  assert.deepEqual(result, { selected: 1, generated: 0, unchanged: 1, failed: [] });
  const asset = JSON.parse(await readFile(fixture.manifestPath, 'utf8')).items[0].assets[0];
  assert.equal(asset.status, 'uploaded');
  assert.equal(asset.remoteUrl, 'https://images.example.com/testing.png');
  assert.equal(asset.generatedAt, undefined);
});

test('invalidates an old upload when prompt or image bytes changed', async () => {
  const fixture = await makeFixture({ status: 'uploaded', uploaded: true });
  const promptPath = path.join(fixture.repoRoot, fixture.workDir, 'prompts', 'infographic.md');
  await writeFile(promptPath, '更新后的提示词。\n', 'utf8');

  await recordGeneratedInfographics({
    repoRoot: fixture.repoRoot,
    manifestPath: fixture.manifestPath,
    generatedAt: '2026-07-12T13:00:00.000Z',
  });

  const asset = JSON.parse(await readFile(fixture.manifestPath, 'utf8')).items[0].assets[0];
  assert.equal(asset.status, 'generated');
  assert.equal(asset.remoteUrl, '');
  assert.equal(asset.uploadedAt, undefined);
  assert.equal(asset.uploadProvider, undefined);
  assert.equal(asset.promptHash, hash('更新后的提示词。\n'));
});

test('dry-run and series filtering do not write the manifest', async () => {
  const fixture = await makeFixture();
  const before = await readFile(fixture.manifestPath, 'utf8');

  const result = await recordGeneratedInfographics({
    repoRoot: fixture.repoRoot,
    manifestPath: fixture.manifestPath,
    series: 'agent',
    dryRun: true,
  });

  assert.deepEqual(result, { selected: 1, generated: 1, unchanged: 0, failed: [] });
  assert.equal(await readFile(fixture.manifestPath, 'utf8'), before);
});

test('reports missing artifacts without discarding successful records', async () => {
  const fixture = await makeFixture();
  const manifest = JSON.parse(await readFile(fixture.manifestPath, 'utf8'));
  const missing = structuredClone(manifest.items[0]);
  missing.number = 2;
  missing.slug = 'missing';
  missing.article = 'src/content/blog/AI应用开发/01.Agent面试专题/02.缺图.md';
  missing.workDir = 'docs/infographics/ai-interview/agent/02-missing';
  missing.assets[0] = {
    ...missing.assets[0],
    localPath: `${missing.workDir}/infographic.png`,
    sourcePath: `${missing.workDir}/source.md`,
    analysisPath: `${missing.workDir}/analysis.md`,
    structuredContentPath: `${missing.workDir}/structured-content.md`,
    promptPath: `${missing.workDir}/prompts/infographic.md`,
    uploadRecordPath: `${missing.workDir}/upload.json`,
  };
  manifest.items.push(missing);
  await writeFile(fixture.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const result = await recordGeneratedInfographics({
    repoRoot: fixture.repoRoot,
    manifestPath: fixture.manifestPath,
    generatedAt: '2026-07-12T13:00:00.000Z',
  });

  assert.equal(result.generated, 1);
  assert.deepEqual(result.failed, [{ identity: 'agent:2:primary', reason: 'PROMPT_MISSING' }]);
  const saved = JSON.parse(await readFile(fixture.manifestPath, 'utf8'));
  assert.equal(saved.items[0].assets[0].status, 'generated');
  assert.equal(saved.items[1].assets[0].status, 'planned');
});

test('rejects unknown series and paths outside the infographic root', async () => {
  const fixture = await makeFixture();
  await assert.rejects(
    recordGeneratedInfographics({ repoRoot: fixture.repoRoot, manifestPath: fixture.manifestPath, series: 'other' }),
    /unknown series/i,
  );

  const manifest = JSON.parse(await readFile(fixture.manifestPath, 'utf8'));
  manifest.items[0].assets[0].promptPath = '../prompt.md';
  await writeFile(fixture.manifestPath, JSON.stringify(manifest), 'utf8');
  await assert.rejects(
    recordGeneratedInfographics({ repoRoot: fixture.repoRoot, manifestPath: fixture.manifestPath }),
    /outside docs\/infographics\/ai-interview/i,
  );
});
