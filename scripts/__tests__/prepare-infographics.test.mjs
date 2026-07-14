import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { hashArticleContent } from '../generate-infographic-manifest.mjs';
import { prepareInfographics } from '../prepare-infographics.mjs';

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const ARTICLE = `---
title: "1. 什么是测试？"
description: "解释测试的目标与工程边界"
tags: ["测试"]
---

## 60 秒回答

测试用可重复证据验证行为是否符合预期。它不能证明系统没有缺陷。

## 详细解析

| 维度 | 单元测试 | 集成测试 |
| --- | --- | --- |
| 范围 | 单个模块 | 多个组件 |

## 工程实践与边界

- 先定义可观察结果，再选择测试层级。
- 失败信息必须能帮助定位问题。

## 常见误区

- **只看覆盖率**：覆盖率不能替代断言质量。

## 面试追问

1. **如何处理不稳定测试？** 先识别共享状态、时间和外部依赖。

## 参考资料

- [Node.js Test Runner](https://nodejs.org/api/test.html)
`;

async function makeFixture({ articleContent = ARTICLE } = {}) {
  const repoRoot = await mkdtemp(path.join(os.tmpdir(), 'prepare-infographics-'));
  const article = 'src/content/blog/AI应用开发/01.Agent面试专题/01.什么是测试？.md';
  const workDir = 'docs/infographics/ai-interview/agent/01-testing';
  const referenceRoot = path.join(repoRoot, 'skill-references');

  await mkdir(path.join(repoRoot, path.dirname(article)), { recursive: true });
  await mkdir(path.join(referenceRoot, 'layouts'), { recursive: true });
  await mkdir(path.join(referenceRoot, 'styles'), { recursive: true });
  await writeFile(path.join(repoRoot, article), articleContent, 'utf8');
  await writeFile(
    path.join(referenceRoot, 'base-prompt.md'),
    '布局={{LAYOUT}}\n风格={{STYLE}}\n比例={{ASPECT_RATIO}}\n语言={{LANGUAGE}}\n{{LAYOUT_GUIDELINES}}\n{{STYLE_GUIDELINES}}\n{{CONTENT}}\n标签={{TEXT_LABELS}}\n',
    'utf8',
  );
  await writeFile(path.join(referenceRoot, 'layouts', 'comparison-matrix.md'), '# comparison-matrix\n\n矩阵布局规则', 'utf8');
  await writeFile(path.join(referenceRoot, 'styles', 'corporate-memphis.md'), '# corporate-memphis\n\n企业孟菲斯风格规则', 'utf8');

  const contentHash = hashArticleContent(articleContent);
  const manifest = {
    version: 2,
    generatedOn: '2026-07-12',
    defaults: { aspect: '16:9', language: 'zh', backend: 'imagegen' },
    items: [
      {
        article,
        series: 'agent',
        number: 1,
        slug: 'testing',
        title: '1. 什么是测试？',
        workDir,
        layout: 'comparison-matrix',
        style: 'corporate-memphis',
        aspect: '16:9',
        language: 'zh',
        backend: 'imagegen',
        contentHash,
        assets: [
          {
            assetId: 'primary',
            role: 'primary',
            position: 'after-60-second-answer',
            localPath: `${workDir}/infographic.png`,
            sourcePath: `${workDir}/source.md`,
            analysisPath: `${workDir}/analysis.md`,
            structuredContentPath: `${workDir}/structured-content.md`,
            promptPath: `${workDir}/prompts/infographic.md`,
            uploadRecordPath: `${workDir}/upload.json`,
            contentHash,
            promptHash: '',
            imageHash: '',
            remoteUrl: '',
            status: 'planned',
          },
        ],
      },
    ],
  };
  const manifestPath = path.join(repoRoot, 'docs/infographics/ai-interview/manifest.json');
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  return { repoRoot, article, workDir, referenceRoot, manifestPath };
}

test('creates a reproducible source, analysis, structured content, and final prompt', async () => {
  const fixture = await makeFixture();

  const result = await prepareInfographics({
    repoRoot: fixture.repoRoot,
    manifestPath: fixture.manifestPath,
    referenceRoot: fixture.referenceRoot,
    timestamp: '20260712-120000',
    allowPartialManifest: true,
  });

  assert.deepEqual(result, { articles: 1, assets: 1, written: 4, backedUp: 0, manifestUpdates: 1 });

  const base = path.join(fixture.repoRoot, fixture.workDir);
  assert.equal(await readFile(path.join(base, 'source.md'), 'utf8'), ARTICLE);

  const analysis = await readFile(path.join(base, 'analysis.md'), 'utf8');
  assert.match(analysis, /title: "1\. 什么是测试？"/);
  assert.match(analysis, /data_type: "comparison"/);
  assert.match(analysis, /comparison-matrix \+ corporate-memphis/);

  const structured = await readFile(path.join(base, 'structured-content.md'), 'utf8');
  assert.match(structured, /测试用可重复证据验证行为是否符合预期。/);
  assert.match(structured, /\| 维度 \| 单元测试 \| 集成测试 \|/);
  assert.match(structured, /覆盖率不能替代断言质量。/);
  assert.doesNotMatch(structured, /Node\.js Test Runner/);
  assert.match(structured, /如何处理不稳定测试/);
  assert.doesNotMatch(structured.split('## On-Image Content Plan')[1], /如何处理不稳定测试/);

  const prompt = await readFile(path.join(base, 'prompts', 'infographic.md'), 'utf8');
  assert.match(prompt, /布局=comparison-matrix/);
  assert.match(prompt, /风格=corporate-memphis/);
  assert.match(prompt, /比例=16:9/);
  assert.match(prompt, /语言=zh/);
  assert.match(prompt, /矩阵布局规则/);
  assert.match(prompt, /企业孟菲斯风格规则/);
  assert.match(prompt, /测试用可重复证据验证行为是否符合预期。/);

  const manifest = JSON.parse(await readFile(fixture.manifestPath, 'utf8'));
  assert.equal(manifest.items[0].assets[0].promptHash, sha256(prompt));
});

test('backs up changed reproducibility files before replacing them', async () => {
  const fixture = await makeFixture();
  const sourcePath = path.join(fixture.repoRoot, fixture.workDir, 'source.md');
  await mkdir(path.dirname(sourcePath), { recursive: true });
  await writeFile(sourcePath, '旧快照\n', 'utf8');

  const result = await prepareInfographics({
    repoRoot: fixture.repoRoot,
    manifestPath: fixture.manifestPath,
    referenceRoot: fixture.referenceRoot,
    timestamp: '20260712-120001',
    allowPartialManifest: true,
  });

  assert.equal(result.backedUp, 1);
  assert.equal(await readFile(path.join(fixture.repoRoot, fixture.workDir, 'source-backup-20260712-120001.md'), 'utf8'), '旧快照\n');
  assert.equal(await readFile(sourcePath, 'utf8'), ARTICLE);
});

test('rejects artifact paths outside the infographic root', async () => {
  const fixture = await makeFixture();
  const manifest = JSON.parse(await readFile(fixture.manifestPath, 'utf8'));
  manifest.items[0].assets[0].promptPath = '../escaped-prompt.md';
  await writeFile(fixture.manifestPath, JSON.stringify(manifest), 'utf8');

  await assert.rejects(
    prepareInfographics({
      repoRoot: fixture.repoRoot,
      manifestPath: fixture.manifestPath,
      referenceRoot: fixture.referenceRoot,
      timestamp: '20260712-120002',
      allowPartialManifest: true,
    }),
    /outside docs\/infographics\/ai-interview/i,
  );
});

test('keeps an existing image link in source but excludes it from generated visual content', async () => {
  const articleWithImage = ARTICLE.replace(
    '测试用可重复证据验证行为是否符合预期。它不能证明系统没有缺陷。',
    '测试用可重复证据验证行为是否符合预期。它不能证明系统没有缺陷。\n\n![测试信息图](https://images.example.com/testing.png)',
  );
  const fixture = await makeFixture({ articleContent: articleWithImage });

  await prepareInfographics({
    repoRoot: fixture.repoRoot,
    manifestPath: fixture.manifestPath,
    referenceRoot: fixture.referenceRoot,
    timestamp: '20260712-120003',
    allowPartialManifest: true,
  });

  const base = path.join(fixture.repoRoot, fixture.workDir);
  assert.match(await readFile(path.join(base, 'source.md'), 'utf8'), /images\.example\.com\/testing\.png/);
  assert.doesNotMatch(await readFile(path.join(base, 'structured-content.md'), 'utf8'), /images\.example\.com/);
  assert.doesNotMatch(await readFile(path.join(base, 'prompts', 'infographic.md'), 'utf8'), /images\.example\.com/);
});

test('rejects a valid-root path that does not match the fixed v2 asset path', async () => {
  const fixture = await makeFixture();
  const manifest = JSON.parse(await readFile(fixture.manifestPath, 'utf8'));
  manifest.items[0].assets[0].promptPath = 'docs/infographics/ai-interview/manifest.json';
  await writeFile(fixture.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  await assert.rejects(
    prepareInfographics({
      repoRoot: fixture.repoRoot,
      manifestPath: fixture.manifestPath,
      referenceRoot: fixture.referenceRoot,
      allowPartialManifest: true,
    }),
    /promptPath must equal/i,
  );
  assert.equal(JSON.parse(await readFile(fixture.manifestPath, 'utf8')).version, 2);
});

test('rejects stale article content hashes before writing artifacts', async () => {
  const fixture = await makeFixture();
  const manifest = JSON.parse(await readFile(fixture.manifestPath, 'utf8'));
  manifest.items[0].contentHash = 'a'.repeat(64);
  manifest.items[0].assets[0].contentHash = 'a'.repeat(64);
  await writeFile(fixture.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  await assert.rejects(
    prepareInfographics({
      repoRoot: fixture.repoRoot,
      manifestPath: fixture.manifestPath,
      referenceRoot: fixture.referenceRoot,
      allowPartialManifest: true,
    }),
    /contentHash.*stale/i,
  );
  await assert.rejects(access(path.join(fixture.repoRoot, fixture.workDir, 'source.md')), /ENOENT/);
});

test('prepares secondary assets while writing their shared source only once', async () => {
  const fixture = await makeFixture();
  const manifest = JSON.parse(await readFile(fixture.manifestPath, 'utf8'));
  const item = manifest.items[0];
  item.assets.push({
    assetId: 'secondary-02',
    role: 'secondary',
    position: 'after-detailed-analysis',
    localPath: `${fixture.workDir}/infographic-02.png`,
    sourcePath: `${fixture.workDir}/source.md`,
    analysisPath: `${fixture.workDir}/analysis-02.md`,
    structuredContentPath: `${fixture.workDir}/structured-content-02.md`,
    promptPath: `${fixture.workDir}/prompts/infographic-02.md`,
    uploadRecordPath: `${fixture.workDir}/upload-02.json`,
    contentHash: item.contentHash,
    promptHash: '',
    imageHash: '',
    remoteUrl: '',
    status: 'planned',
  });
  await writeFile(fixture.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const result = await prepareInfographics({
    repoRoot: fixture.repoRoot,
    manifestPath: fixture.manifestPath,
    referenceRoot: fixture.referenceRoot,
    timestamp: '20260712-120004',
    allowPartialManifest: true,
  });

  assert.deepEqual(result, { articles: 1, assets: 2, written: 7, backedUp: 0, manifestUpdates: 2 });
  const saved = JSON.parse(await readFile(fixture.manifestPath, 'utf8'));
  assert.match(saved.items[0].assets[0].promptHash, /^[a-f0-9]{64}$/);
  assert.match(saved.items[0].assets[1].promptHash, /^[a-f0-9]{64}$/);
  assert.notEqual(saved.items[0].assets[0].promptHash, saved.items[0].assets[1].promptHash);
});

test('preserves complete source evidence, long tables, and original ordering', async () => {
  const rows = Array.from({ length: 9 }, (_, index) => `| 指标 ${index + 1} | 条件 ${index + 1} |`).join('\n');
  const article = ARTICLE.replace(
    '| 维度 | 单元测试 | 集成测试 |\n| --- | --- | --- |\n| 范围 | 单个模块 | 多个组件 |',
    `先说明表格的适用条件。\n\n| 指标 | 条件 |\n| --- | --- |\n${rows}\n\n表格之后还有例外条件。`,
  );
  const fixture = await makeFixture({ articleContent: article });

  await prepareInfographics({
    repoRoot: fixture.repoRoot,
    manifestPath: fixture.manifestPath,
    referenceRoot: fixture.referenceRoot,
    allowPartialManifest: true,
  });

  const structured = await readFile(path.join(fixture.repoRoot, fixture.workDir, 'structured-content.md'), 'utf8');
  assert.match(structured, /## Source Content \(Verbatim\)/);
  assert.match(structured, /\| 指标 9 \| 条件 9 \|/);
  assert.match(structured, /表格之后还有例外条件。/);
  assert.ok(structured.indexOf('先说明表格的适用条件。') < structured.indexOf('| 指标 | 条件 |'));
  assert.ok(structured.indexOf('| 指标 9 | 条件 9 |') < structured.indexOf('表格之后还有例外条件。'));
});

test('keeps visual plans concise and strips Markdown destinations from navigation lists', async () => {
  const navigation = Array.from(
    { length: 8 },
    (_, index) => `${index + 1}. [题目 ${index + 1}](./${index + 1}.题目 ${index + 1}.md)`,
  ).join('\n');
  const article = ARTICLE.replace(
    '| 维度 | 单元测试 | 集成测试 |\n| --- | --- | --- |\n| 范围 | 单个模块 | 多个组件 |',
    navigation,
  );
  const fixture = await makeFixture({ articleContent: article });

  await prepareInfographics({
    repoRoot: fixture.repoRoot,
    manifestPath: fixture.manifestPath,
    referenceRoot: fixture.referenceRoot,
    allowPartialManifest: true,
  });

  const structured = await readFile(path.join(fixture.repoRoot, fixture.workDir, 'structured-content.md'), 'utf8');
  const visualPlan = structured.split('## On-Image Content Plan')[1].split('## Data Points')[0];
  const dataPoints = structured.split('## Data Points')[1].split('## Design Instructions')[0];
  assert.doesNotMatch(visualPlan, /\]\(\.\//);
  assert.match(visualPlan, /1\. 题目 1\n2\. 题目 2/);
  assert.doesNotMatch(visualPlan, /题目 8/);
  assert.doesNotMatch(dataPoints, /题目 1/);
  assert.match(structured.split('## Source Content (Verbatim)')[1], /\[题目 8\]\(\.\/8\.题目 8\.md\)/);
});

test('keeps H3 labels paired with their first explanatory sentence', async () => {
  const article = ARTICLE.replace(
    '| 维度 | 单元测试 | 集成测试 |\n| --- | --- | --- |\n| 范围 | 单个模块 | 多个组件 |',
    '### 第一层\n\n第一层负责输入校验。其余内容不进入画面。\n\n### 第二层\n\n第二层负责执行与恢复。其余内容不进入画面。',
  );
  const fixture = await makeFixture({ articleContent: article });

  await prepareInfographics({
    repoRoot: fixture.repoRoot,
    manifestPath: fixture.manifestPath,
    referenceRoot: fixture.referenceRoot,
    allowPartialManifest: true,
  });

  const structured = await readFile(path.join(fixture.repoRoot, fixture.workDir, 'structured-content.md'), 'utf8');
  const visualPlan = structured.split('## On-Image Content Plan')[1];
  assert.match(visualPlan, /### 第一层\n第一层负责输入校验。/);
  assert.match(visualPlan, /### 第二层\n第二层负责执行与恢复。/);
});

test('aborts before writing when source contains a likely live credential', async () => {
  const secret = `sk-${'a'.repeat(40)}`;
  const fixture = await makeFixture({
    articleContent: ARTICLE.replace('测试用可重复证据', `测试使用 ${secret}，再用可重复证据`),
  });

  await assert.rejects(
    prepareInfographics({
      repoRoot: fixture.repoRoot,
      manifestPath: fixture.manifestPath,
      referenceRoot: fixture.referenceRoot,
      allowPartialManifest: true,
    }),
    /SENSITIVE_VALUE_DETECTED.*line/i,
  );
  await assert.rejects(access(path.join(fixture.repoRoot, fixture.workDir, 'source.md')), /ENOENT/);
});

test('also blocks Google API keys and high-confidence api_key assignments', async () => {
  const credentials = [
    `AIza${'b'.repeat(35)}`,
    `api_key = "${'c'.repeat(32)}"`,
  ];
  for (const credential of credentials) {
    const fixture = await makeFixture({
      articleContent: ARTICLE.replace('测试用可重复证据', `配置 ${credential} 后再用可重复证据`),
    });
    await assert.rejects(
      prepareInfographics({
        repoRoot: fixture.repoRoot,
        manifestPath: fixture.manifestPath,
        referenceRoot: fixture.referenceRoot,
        allowPartialManifest: true,
      }),
      /SENSITIVE_VALUE_DETECTED.*line/i,
    );
  }
});

test('uses collision-safe skill-format backup names', async () => {
  const fixture = await makeFixture();
  const sourcePath = path.join(fixture.repoRoot, fixture.workDir, 'source.md');
  const firstBackup = path.join(fixture.repoRoot, fixture.workDir, 'source-backup-20260712-120005.md');
  await mkdir(path.dirname(sourcePath), { recursive: true });
  await writeFile(sourcePath, 'older snapshot\n', 'utf8');
  await writeFile(firstBackup, 'existing backup\n', 'utf8');

  await prepareInfographics({
    repoRoot: fixture.repoRoot,
    manifestPath: fixture.manifestPath,
    referenceRoot: fixture.referenceRoot,
    timestamp: '20260712-120005',
    allowPartialManifest: true,
  });

  assert.equal(await readFile(firstBackup, 'utf8'), 'existing backup\n');
  assert.equal(
    await readFile(path.join(fixture.repoRoot, fixture.workDir, 'source-backup-20260712-120005-02.md'), 'utf8'),
    'older snapshot\n',
  );
});
