import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import {
  buildInfographicManifest,
  hashArticleContent,
  isInfographicCorpusArticle,
  validateInfographicManifest,
} from '../generate-infographic-manifest.mjs';

const REPO_ROOT = path.resolve('.');
const CONTENT_ROOT = path.resolve('src/content/blog/AI应用开发');
const HASH = 'a'.repeat(64);

async function collectMarkdown(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const child = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectMarkdown(child));
    else if (entry.isFile() && /\.mdx?$/iu.test(entry.name)) files.push(child);
  }
  return files;
}

async function repositoryRecords() {
  const articles = (await collectMarkdown(CONTENT_ROOT))
    .filter((article) => isInfographicCorpusArticle(article, REPO_ROOT));
  return Promise.all(articles.map(async (article) => ({
    article,
    content: await readFile(article, 'utf8'),
  })));
}

function singleRecord({
  fileName = '01.测试文章.md',
  content = '---\ntitle: "1. 测试文章"\n---\n\n## 60 秒回答\n\n正文。\n',
} = {}) {
  return {
    article: path.join(CONTENT_ROOT, '01.Agent面试专题', fileName),
    content,
  };
}

function uploadedPrimary(item, overrides = {}) {
  return {
    ...item.assets[0],
    contentHash: item.contentHash,
    promptHash: 'b'.repeat(64),
    imageHash: 'c'.repeat(64),
    remoteUrl: 'https://cdn.example.com/agent-01.png',
    status: 'uploaded',
    ...overrides,
  };
}

test('excludes Agent and RAG articles from the infographic corpus', () => {
  assert.equal(isInfographicCorpusArticle(
    path.join(CONTENT_ROOT, '01.Agent面试专题', '01.示例.md'),
    REPO_ROOT,
  ), false);
  assert.equal(isInfographicCorpusArticle(
    path.join(CONTENT_ROOT, '02.RAG面试专题', '01.示例.md'),
    REPO_ROOT,
  ), false);
  assert.equal(isInfographicCorpusArticle(
    path.join(CONTENT_ROOT, '03.LLM工具调用面试专题', '01.示例.md'),
    REPO_ROOT,
  ), true);
});

test('builds manifest v2 for all 57 infographic-eligible articles', async () => {
  const manifest = buildInfographicManifest(await repositoryRecords(), { repoRoot: REPO_ROOT });

  assert.equal(manifest.version, 2);
  assert.equal(manifest.items.length, 57);
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(Object.groupBy(manifest.items, (item) => item.series))
        .map(([series, items]) => [series, items.length]),
    ),
    { overview: 1, tools: 24, llm: 32 },
  );
  assert.equal(validateInfographicManifest(manifest).length, 0);

  const item = manifest.items.find(({ series, number }) => series === 'tools' && number === 1);
  assert.match(item.contentHash, /^[a-f0-9]{64}$/u);
  assert.deepEqual(item.assets, [{
    assetId: 'primary',
    role: 'primary',
    position: 'after-60-second-answer',
    localPath: `${item.workDir}/infographic.png`,
    sourcePath: `${item.workDir}/source.md`,
    analysisPath: `${item.workDir}/analysis.md`,
    structuredContentPath: `${item.workDir}/structured-content.md`,
    promptPath: `${item.workDir}/prompts/infographic.md`,
    uploadRecordPath: `${item.workDir}/upload.json`,
    contentHash: item.contentHash,
    promptHash: '',
    imageHash: '',
    remoteUrl: '',
    status: 'planned',
  }]);
});

test('checked-in manifest is valid and matches current article content hashes', async () => {
  const checkedIn = JSON.parse(await readFile(
    path.join(REPO_ROOT, 'docs/infographics/ai-interview/manifest.json'),
    'utf8',
  ));
  const rebuilt = buildInfographicManifest(await repositoryRecords(), {
    repoRoot: REPO_ROOT,
    existingManifest: checkedIn,
  });

  assert.deepEqual(validateInfographicManifest(checkedIn), []);
  assert.deepEqual(checkedIn.items, rebuilt.items);
});

test('article content hash ignores only managed infographic lines and normalizes line endings', () => {
  const withoutImage = '---\r\ntitle: Test\r\n---\r\n\r\n正文。\r\n';
  const withImage = '---\ntitle: Test\n---\n\n![架构信息图](https://cdn.example.com/diagram.png)\n正文。\n';
  const expected = createHash('sha256')
    .update('---\ntitle: Test\n---\n\n正文。\n', 'utf8')
    .digest('hex');

  assert.equal(hashArticleContent(withoutImage), expected);
  assert.equal(hashArticleContent(withImage), expected);
  assert.notEqual(
    hashArticleContent('---\ntitle: Test\n---\n\n![产品截图](https://cdn.example.com/product.png)\n正文。\n'),
    expected,
  );
});

test('preserves upload state by series, number, and asset id when an article is renamed', () => {
  const original = buildInfographicManifest([singleRecord()], { repoRoot: REPO_ROOT });
  original.items[0].assets[0] = uploadedPrimary(original.items[0]);

  const renamed = buildInfographicManifest([
    singleRecord({ fileName: '01.重命名后的文章.md' }),
  ], { repoRoot: REPO_ROOT, existingManifest: original });

  assert.match(renamed.items[0].article, /01\.重命名后的文章\.md$/u);
  assert.equal(renamed.items[0].assets[0].remoteUrl, 'https://cdn.example.com/agent-01.png');
  assert.equal(renamed.items[0].assets[0].status, 'uploaded');
  assert.equal(renamed.items[0].assets[0].promptHash, 'b'.repeat(64));
  assert.equal(renamed.items[0].assets[0].imageHash, 'c'.repeat(64));
});

test('preserves upload state when only an infographic Markdown line changes', () => {
  const content = singleRecord().content;
  const original = buildInfographicManifest([singleRecord()], { repoRoot: REPO_ROOT });
  original.items[0].assets[0] = uploadedPrimary(original.items[0]);

  const rebuilt = buildInfographicManifest([singleRecord({
    content: content.replace('正文。', '![旧信息图](https://cdn.example.com/old.png)\n正文。'),
  })], { repoRoot: REPO_ROOT, existingManifest: original });

  assert.equal(rebuilt.items[0].contentHash, original.items[0].contentHash);
  assert.equal(rebuilt.items[0].assets[0].remoteUrl, 'https://cdn.example.com/agent-01.png');
});

test('clears derived hashes and URL for every asset when article content changes', () => {
  const original = buildInfographicManifest([singleRecord()], { repoRoot: REPO_ROOT });
  original.items[0].assets[0] = uploadedPrimary(original.items[0]);
  original.items[0].assets.push({
    ...uploadedPrimary(original.items[0], {
      assetId: 'secondary-02',
      role: 'secondary',
      position: 'after-detailed-analysis',
      localPath: `${original.items[0].workDir}/infographic-02.png`,
      analysisPath: `${original.items[0].workDir}/analysis-02.md`,
      structuredContentPath: `${original.items[0].workDir}/structured-content-02.md`,
      promptPath: `${original.items[0].workDir}/prompts/infographic-02.md`,
      uploadRecordPath: `${original.items[0].workDir}/upload-02.json`,
      remoteUrl: 'https://cdn.example.com/agent-01-02.png',
    }),
  });

  const changed = buildInfographicManifest([singleRecord({
    content: singleRecord().content.replace('正文。', '内容发生变化。'),
  })], { repoRoot: REPO_ROOT, existingManifest: original });

  assert.notEqual(changed.items[0].contentHash, original.items[0].contentHash);
  assert.equal(changed.items[0].assets.length, 2);
  for (const asset of changed.items[0].assets) {
    assert.equal(asset.contentHash, changed.items[0].contentHash);
    assert.equal(asset.promptHash, '');
    assert.equal(asset.imageHash, '');
    assert.equal(asset.remoteUrl, '');
    assert.equal(asset.status, 'planned');
  }
});

test('keeps secondary-02 and secondary-03 assets without changing article uniqueness', () => {
  const original = buildInfographicManifest([singleRecord()], { repoRoot: REPO_ROOT });
  const { workDir, contentHash } = original.items[0];
  original.items[0].assets.push(
    {
      assetId: 'secondary-02',
      role: 'secondary',
      position: 'after-detailed-analysis',
      localPath: `${workDir}/infographic-02.png`,
      sourcePath: `${workDir}/source.md`,
      analysisPath: `${workDir}/analysis-02.md`,
      structuredContentPath: `${workDir}/structured-content-02.md`,
      promptPath: `${workDir}/prompts/infographic-02.md`,
      uploadRecordPath: `${workDir}/upload-02.json`,
      contentHash,
      promptHash: '',
      imageHash: '',
      remoteUrl: '',
      status: 'planned',
    },
    {
      assetId: 'secondary-03',
      role: 'secondary',
      position: 'after-engineering-practice',
      localPath: `${workDir}/infographic-03.png`,
      sourcePath: `${workDir}/source.md`,
      analysisPath: `${workDir}/analysis-03.md`,
      structuredContentPath: `${workDir}/structured-content-03.md`,
      promptPath: `${workDir}/prompts/infographic-03.md`,
      uploadRecordPath: `${workDir}/upload-03.json`,
      contentHash,
      promptHash: '',
      imageHash: '',
      remoteUrl: '',
      status: 'planned',
    },
  );

  const rebuilt = buildInfographicManifest([singleRecord()], {
    repoRoot: REPO_ROOT,
    existingManifest: original,
  });

  assert.equal(rebuilt.items.length, 1);
  assert.deepEqual(rebuilt.items[0].assets.map(({ assetId }) => assetId), [
    'primary', 'secondary-02', 'secondary-03',
  ]);
});

test('migrates a v1 item to a v2 primary asset without trusting its unhashed URL', () => {
  const record = singleRecord();
  const article = path.relative(REPO_ROOT, record.article).replaceAll('\\', '/');
  const existingManifest = {
    version: 1,
    items: [{
      article,
      series: 'agent',
      number: 1,
      remoteUrl: 'https://cdn.example.com/stale.png',
      status: 'uploaded',
    }],
  };

  const migrated = buildInfographicManifest([record], { repoRoot: REPO_ROOT, existingManifest });

  assert.equal(migrated.version, 2);
  assert.equal(migrated.items[0].assets[0].assetId, 'primary');
  assert.equal(migrated.items[0].assets[0].remoteUrl, '');
  assert.equal(migrated.items[0].assets[0].status, 'planned');
});

test('validator rejects duplicate stable identities, invalid HTTPS state, and non-fixed asset paths', async () => {
  const manifest = buildInfographicManifest(await repositoryRecords(), { repoRoot: REPO_ROOT });
  const duplicate = structuredClone(manifest.items[1]);
  duplicate.article = duplicate.article.replace(/\.md$/u, '-copy.md');
  manifest.items.push(duplicate);

  const target = manifest.items.find(({ series, number }) => series === 'tools' && number === 1);
  target.assets[0].remoteUrl = 'http://cdn.example.com/tools.png';
  target.assets[0].status = 'uploaded';
  target.assets[0].localPath = '../secret.env';

  const errors = validateInfographicManifest(manifest);
  assert.ok(errors.some((error) => error.includes('expected 57 items')));
  assert.ok(errors.some((error) => error.includes('duplicate article identity')));
  assert.ok(errors.some((error) => error.includes('remoteUrl must use HTTPS')));
  assert.ok(errors.some((error) => error.includes('localPath must equal')));
});

test('validator enforces required fields, allowed asset ids, unique URLs, and status consistency', async () => {
  const manifest = buildInfographicManifest(await repositoryRecords(), { repoRoot: REPO_ROOT });
  const first = manifest.items[0];
  const second = manifest.items[1];
  delete first.title;
  first.assets[0].assetId = 'secondary-04';
  first.assets[0].role = 'secondary';
  first.assets[0].remoteUrl = 'https://cdn.example.com/shared.png';
  first.assets[0].status = 'planned';
  second.assets[0].remoteUrl = 'https://cdn.example.com/shared.png';
  second.assets[0].status = 'uploaded';
  second.assets[0].contentHash = HASH;

  const errors = validateInfographicManifest(manifest);
  assert.ok(errors.some((error) => error.includes('title: missing value')));
  assert.ok(errors.some((error) => error.includes('invalid assetId secondary-04')));
  assert.ok(errors.some((error) => error.includes('planned status cannot have remoteUrl')));
  assert.ok(errors.some((error) => error.includes('duplicate remoteUrl')));
  assert.ok(errors.some((error) => error.includes('asset contentHash must match article')));
});

test('validator rejects HTTPS-looking URLs without a host or with credentials', async () => {
  const manifest = buildInfographicManifest(await repositoryRecords(), { repoRoot: REPO_ROOT });
  const first = manifest.items[0].assets[0];
  first.remoteUrl = 'https://?x';
  first.status = 'uploaded';
  const second = manifest.items[1].assets[0];
  second.remoteUrl = 'https://user:password@cdn.example.com/image.png';
  second.status = 'uploaded';

  const errors = validateInfographicManifest(manifest);
  assert.ok(errors.filter((error) => error.includes('remoteUrl must use HTTPS')).length >= 2);
});

test('validator accepts a sanitized structured upload error', async () => {
  const manifest = buildInfographicManifest(await repositoryRecords(), { repoRoot: REPO_ROOT });
  manifest.items[0].assets[0].status = 'upload-failed';
  manifest.items[0].assets[0].lastAttemptedAt = '2026-07-12T01:02:03.000Z';
  manifest.items[0].assets[0].lastError = {
    code: 'PICGO_NETWORK',
    message: 'PicGo 服务暂时不可用',
  };

  assert.equal(validateInfographicManifest(manifest).length, 0);
});
