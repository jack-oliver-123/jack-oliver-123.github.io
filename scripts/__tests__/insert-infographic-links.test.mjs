import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const subject = await import('../insert-infographic-links.mjs').catch(() => ({}));

function requiredExport(name) {
  assert.equal(typeof subject[name], 'function', `${name} must be exported`);
  return subject[name];
}

const CONTENT_HASH = 'a'.repeat(64);
const PROMPT_HASH = 'b'.repeat(64);
const IMAGE_HASH = 'c'.repeat(64);

function makeAsset(assetId = 'primary', overrides = {}) {
  const suffix = assetId === 'primary' ? '' : `-${assetId.slice(-2)}`;
  return {
    assetId,
    role: assetId === 'primary' ? 'primary' : 'secondary',
    position: assetId === 'primary'
      ? 'after-60-second-answer'
      : assetId === 'secondary-02'
        ? 'after-detailed-analysis'
        : 'after-engineering-practice',
    localPath: `docs/infographics/ai-interview/agent/01-topic/infographic${suffix}.png`,
    sourcePath: 'docs/infographics/ai-interview/agent/01-topic/source.md',
    analysisPath: `docs/infographics/ai-interview/agent/01-topic/analysis${suffix}.md`,
    structuredContentPath: `docs/infographics/ai-interview/agent/01-topic/structured-content${suffix}.md`,
    promptPath: `docs/infographics/ai-interview/agent/01-topic/prompts/infographic${suffix}.md`,
    uploadRecordPath: `docs/infographics/ai-interview/agent/01-topic/upload${suffix}.json`,
    contentHash: CONTENT_HASH,
    promptHash: PROMPT_HASH,
    imageHash: IMAGE_HASH,
    remoteUrl: `https://img.example/topic${suffix}.png`,
    status: 'uploaded',
    ...overrides,
  };
}

function makeItem(overrides = {}) {
  return {
    article: 'src/content/blog/AI应用开发/01.Agent面试专题/01.主题.md',
    series: 'agent',
    number: 1,
    slug: 'topic',
    title: '1. 如何设计 Agent？',
    workDir: 'docs/infographics/ai-interview/agent/01-topic',
    layout: 'bento-grid',
    style: 'hand-drawn-edu',
    aspect: '16:9',
    language: 'zh',
    backend: 'imagegen',
    contentHash: CONTENT_HASH,
    assets: [makeAsset()],
    ...overrides,
  };
}

function makeManifest(items = [makeItem()]) {
  return {
    version: 2,
    generatedOn: '2026-07-12',
    defaults: { aspect: '16:9', language: 'zh', backend: 'imagegen' },
    items,
  };
}

const FRONTMATTER = [
  '---',
  'title: "测试"',
  'description: "测试文章"',
  '---',
  '',
].join('\n');

test('inserts primary after the complete 60-second-answer section', () => {
  const insertInfographicLinks = requiredExport('insertInfographicLinks');
  const content = `${FRONTMATTER}## 60 秒回答\n\n短答。\n\n### 补充\n\n补充内容。\n\n## 详细解析\n\n正文。\n`;
  const result = insertInfographicLinks(content, makeItem());

  assert.equal(result.changed, true);
  assert.match(
    result.content,
    /### 补充\n\n补充内容。\n\n!\[如何设计 Agent？ 信息图\]\(<https:\/\/img\.example\/topic\.png>\)\n\n## 详细解析/u,
  );
});

test('ignores heading-shaped lines inside fenced code when finding a section end', () => {
  const insertInfographicLinks = requiredExport('insertInfographicLinks');
  const content = `${FRONTMATTER}## 60 秒回答\n\n短答。\n\n\`\`\`md\n## 这不是新章节\n\`\`\`\n\n代码块后的补充。\n\n## 详细解析\n\n正文。\n`;
  const result = insertInfographicLinks(content, makeItem());

  assert.match(
    result.content,
    /```\n\n代码块后的补充。\n\n!\[如何设计 Agent？ 信息图\]\(<https:\/\/img\.example\/topic\.png>\)\n\n## 详细解析/u,
  );
});

test('inserts secondary-02 at the end of detailed analysis', () => {
  const insertInfographicLinks = requiredExport('insertInfographicLinks');
  const item = makeItem({ assets: [makeAsset('secondary-02')] });
  const content = `${FRONTMATTER}## 详细解析\n\n解析正文。\n\n## 工程实践与边界\n\n工程正文。\n`;
  const result = insertInfographicLinks(content, item);

  assert.match(
    result.content,
    /解析正文。\n\n!\[如何设计 Agent？ 信息图 2\]\(<https:\/\/img\.example\/topic-02\.png>\)\n\n## 工程实践与边界/u,
  );
});

test('inserts secondary-03 at the end of engineering practice', () => {
  const insertInfographicLinks = requiredExport('insertInfographicLinks');
  const item = makeItem({ assets: [makeAsset('secondary-03')] });
  const content = `${FRONTMATTER}## 工程实践与边界\n\n工程正文。\n\n## 常见误区\n\n误区正文。\n`;
  const result = insertInfographicLinks(content, item);

  assert.match(
    result.content,
    /工程正文。\n\n!\[如何设计 Agent？ 信息图 3\]\(<https:\/\/img\.example\/topic-03\.png>\)\n\n## 常见误区/u,
  );
});

test('falls back to the end of the introduction for a primary overview image', () => {
  const insertInfographicLinks = requiredExport('insertInfographicLinks');
  const item = makeItem({ title: 'Agent 面试专题介绍' });
  const content = `${FRONTMATTER}第一段导言。\n\n第二段导言。\n\n## 建议学习路径\n\n正文。\n`;
  const result = insertInfographicLinks(content, item);

  assert.match(
    result.content,
    /第一段导言。\n\n第二段导言。\n\n!\[Agent 面试专题介绍 信息图\]\(<https:\/\/img\.example\/topic\.png>\)\n\n## 建议学习路径/u,
  );
});

test('updates and relocates a managed image without duplicating it', () => {
  const insertInfographicLinks = requiredExport('insertInfographicLinks');
  const item = makeItem({
    assets: [makeAsset('primary', { remoteUrl: 'https://img.example/new_(final).png' })],
  });
  const content = `${FRONTMATTER}![如何设计 Agent？ 信息图](<https://img.example/old.png>)\n\n## 60 秒回答\n\n短答。\n\n## 详细解析\n\n正文。\n`;
  const first = insertInfographicLinks(content, item);
  const second = insertInfographicLinks(first.content, item);

  assert.equal(first.changed, true);
  assert.equal(second.changed, false);
  assert.equal(second.content, first.content);
  assert.equal((first.content.match(/!\[如何设计 Agent？ 信息图\]/gu) ?? []).length, 1);
  assert.match(
    first.content,
    /短答。\n\n!\[如何设计 Agent？ 信息图\]\(<https:\/\/img\.example\/new_\(final\)\.png>\)\n\n## 详细解析/u,
  );
});

test('recognizes an existing managed line with a bare URL containing parentheses', () => {
  const insertInfographicLinks = requiredExport('insertInfographicLinks');
  const content = `${FRONTMATTER}![如何设计 Agent？ 信息图](https://img.example/old_(draft).png)\n\n## 60 秒回答\n\n短答。\n\n## 详细解析\n`;
  const result = insertInfographicLinks(content, makeItem());

  assert.equal((result.content.match(/!\[如何设计 Agent？ 信息图\]/gu) ?? []).length, 1);
  assert.doesNotMatch(result.content, /old_\(draft\)/u);
});

test('does not modify unrelated Markdown images', () => {
  const insertInfographicLinks = requiredExport('insertInfographicLinks');
  const otherImage = '![架构截图](https://static.example/existing.png)';
  const content = `${FRONTMATTER}## 60 秒回答\n\n${otherImage}\n\n短答。\n\n## 详细解析\n`;
  const result = insertInfographicLinks(content, makeItem());

  assert.equal((result.content.match(/架构截图/gu) ?? []).length, 1);
  assert.ok(result.content.includes(otherImage));
});

test('preserves CRLF line endings and the final newline', () => {
  const insertInfographicLinks = requiredExport('insertInfographicLinks');
  const content = `${FRONTMATTER}## 60 秒回答\n\n短答。\n\n## 详细解析\n`.replaceAll('\n', '\r\n');
  const result = insertInfographicLinks(content, makeItem());

  assert.equal(result.content.endsWith('\r\n'), true);
  assert.equal(result.content.replaceAll('\r\n', '').includes('\n'), false);
  assert.match(result.content, /短答。\r\n\r\n!\[如何设计 Agent？ 信息图\]/u);
});

test('dry-run reports a change without writing the article', async (t) => {
  const applyManifestLinks = requiredExport('applyManifestLinks');
  const repoRoot = await mkdtemp(path.join(os.tmpdir(), 'insert-infographic-'));
  t.after(() => rm(repoRoot, { recursive: true, force: true }));
  const item = makeItem();
  const articlePath = path.resolve(repoRoot, item.article);
  await mkdir(path.dirname(articlePath), { recursive: true });
  const original = `${FRONTMATTER}## 60 秒回答\n\n短答。\n`;
  await writeFile(articlePath, original, 'utf8');

  const summary = await applyManifestLinks({
    manifest: makeManifest([item]),
    repoRoot,
    dryRun: true,
  });

  assert.equal(summary.changed, 1);
  assert.equal(summary.written, 0);
  assert.equal(await readFile(articlePath, 'utf8'), original);
});

test('filters plans by series and rejects an unknown series', () => {
  const createInsertionPlan = requiredExport('createInsertionPlan');
  const agent = makeItem();
  const rag = makeItem({
    article: 'src/content/blog/AI应用开发/02.RAG面试专题/01.主题.md',
    series: 'rag',
  });
  const manifest = makeManifest([agent, rag]);

  assert.deepEqual(
    createInsertionPlan(manifest, { series: 'rag' }).items.map((item) => item.series),
    ['rag'],
  );
  assert.throws(
    () => createInsertionPlan(manifest, { series: 'typo' }),
    /unknown series/iu,
  );
});

test('strict validation rejects article traversal and non-HTTPS uploaded URLs', () => {
  const validateInsertionManifest = requiredExport('validateInsertionManifest');
  const traversal = makeManifest([makeItem({ article: '../outside.md' })]);
  assert.match(validateInsertionManifest(traversal).join('\n'), /outside|traversal|relative/iu);

  const insecure = makeManifest([makeItem({
    assets: [makeAsset('primary', { remoteUrl: 'http://img.example/insecure.png' })],
  })]);
  assert.match(validateInsertionManifest(insecure).join('\n'), /HTTPS/iu);
});

test('ignores assets that are not in uploaded state', () => {
  const insertInfographicLinks = requiredExport('insertInfographicLinks');
  const item = makeItem({
    assets: [makeAsset('primary', { status: 'generated', remoteUrl: '' })],
  });
  const content = `${FRONTMATTER}## 60 秒回答\n\n短答。\n`;
  const result = insertInfographicLinks(content, item);

  assert.equal(result.changed, false);
  assert.equal(result.content, content);
  assert.equal(result.processed, 0);
});
