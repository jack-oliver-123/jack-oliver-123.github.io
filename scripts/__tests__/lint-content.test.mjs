import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  formatDiagnostic,
  lintManifest,
  lintMarkdown,
  lintNumbering,
} from '../content-lint/rules.mjs';
import { hashArticleContent } from '../generate-infographic-manifest.mjs';

const ARTICLE = 'src/content/blog/AI应用开发/01.Agent面试专题/01.示例.md';
const IMAGE_URL = 'https://images.example.com/ai-interview/example.png';
const VALID_FRONTMATTER = `---
title: "示例"
description: "用于内容规则测试"
tags: ["AI应用开发"]
draft: false
---`;
const VALID_BODY = `
## 60 秒回答

这是一个带条件的简短回答。

![Agent 执行流程](${IMAGE_URL})

## 详细解析

正文。

## 工程实践与边界

说明适用条件。

## 常见误区

不要忽略边界。

## 面试追问

**问：** 如何验证？

**答：** 使用测试集验证。

## 参考资料

- [官方文档](https://example.com/docs)
`;

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function writeFixtureFile(root, relativePath, value) {
  const absolutePath = path.join(root, ...relativePath.split('/'));
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, value);
  return absolutePath;
}

function createInfographicFixture(t, options = {}) {
  const repoRoot = mkdtempSync(path.join(os.tmpdir(), 'content-lint-'));
  t.after(() => rmSync(repoRoot, { recursive: true, force: true }));

  const content = options.content ?? `${VALID_FRONTMATTER}\n${VALID_BODY}`;
  const workDir = 'docs/infographics/ai-interview/agent/01-example';
  const paths = {
    localPath: `${workDir}/infographic.png`,
    sourcePath: `${workDir}/source.md`,
    analysisPath: `${workDir}/analysis.md`,
    structuredContentPath: `${workDir}/structured-content.md`,
    promptPath: `${workDir}/prompts/infographic.md`,
    uploadRecordPath: `${workDir}/upload.json`,
  };
  const image = Buffer.from('test infographic bytes');
  const prompt = '# 信息图提示词\n\n只使用给定内容。\n';
  const imageHash = sha256(image);
  const promptHash = sha256(prompt);
  const contentHash = hashArticleContent(content);

  const absoluteArticle = writeFixtureFile(repoRoot, ARTICLE, content);
  writeFixtureFile(repoRoot, paths.localPath, image);
  writeFixtureFile(repoRoot, paths.sourcePath, content);
  writeFixtureFile(repoRoot, paths.analysisPath, '# 内容分析\n');
  writeFixtureFile(repoRoot, paths.structuredContentPath, '# 结构化内容\n');
  writeFixtureFile(repoRoot, paths.promptPath, prompt);

  const asset = {
    assetId: 'primary',
    role: 'primary',
    position: 'after-60-second-answer',
    ...paths,
    contentHash,
    promptHash,
    imageHash,
    remoteUrl: IMAGE_URL,
    status: 'uploaded',
    uploadedAt: '2026-07-12T08:00:00.000Z',
    uploadProvider: 'picgo-gui',
  };
  const item = {
    article: ARTICLE,
    series: 'agent',
    number: 1,
    slug: 'example',
    title: '示例',
    workDir,
    layout: 'bento-grid',
    style: 'hand-drawn-edu',
    aspect: '16:9',
    language: 'zh',
    backend: 'imagegen',
    contentHash,
    assets: [asset],
  };
  const manifest = {
    version: 2,
    generatedOn: '2026-07-12',
    defaults: { aspect: '16:9', language: 'zh', backend: 'imagegen' },
    items: [item],
  };
  const uploadRecord = {
    version: 2,
    status: 'uploaded',
    article: ARTICLE,
    series: 'agent',
    number: 1,
    assetId: 'primary',
    localPath: paths.localPath,
    remoteUrl: IMAGE_URL,
    imageHash,
    contentHash,
    promptHash,
    uploadedAt: '2026-07-12T08:00:00.000Z',
    provider: 'picgo-gui',
    result: { url: IMAGE_URL },
  };
  writeFixtureFile(repoRoot, paths.uploadRecordPath, `${JSON.stringify(uploadRecord, null, 2)}\n`);

  return {
    absoluteArticle,
    asset,
    content,
    item,
    manifest,
    paths,
    repoRoot,
    uploadRecord,
  };
}

function lint(content, overrides = {}) {
  return lintMarkdown({
    filePath: ARTICLE,
    absoluteFilePath: path.join(os.tmpdir(), 'virtual-ai-content', '01.示例.md'),
    content,
    manifest: { version: 2, items: [] },
    requireInfographic: false,
    fileExists: () => true,
    ...overrides,
  });
}

function lintFixture(fixture, overrides = {}) {
  return lintMarkdown({
    filePath: ARTICLE,
    absoluteFilePath: fixture.absoluteArticle,
    repoRoot: fixture.repoRoot,
    content: readFileSync(fixture.absoluteArticle, 'utf8'),
    manifest: fixture.manifest,
    fileExists: existsSync,
    ...overrides,
  });
}

test('accepts a complete article while infographic checks are deferred', () => {
  assert.deepEqual(lint(`${VALID_FRONTMATTER}\n${VALID_BODY}`), []);
});

test('CLI does not require infographic uploads by default', () => {
  const result = spawnSync(process.execPath, ['scripts/lint-content.mjs'], {
    cwd: path.resolve('.'),
    encoding: 'utf8',
  });
  const summary = result.stdout.trim().split(/\r?\n/u).at(-1) ?? result.stderr;

  assert.equal(result.status, 0, summary);
  assert.match(result.stdout, /检查 115 个文件：0 errors，0 warnings/u);
});

test('CLI can require infographic uploads explicitly', () => {
  const result = spawnSync(process.execPath, ['scripts/lint-content.mjs', '--require-images'], {
    cwd: path.resolve('.'),
    encoding: 'utf8',
  });

  assert.equal(result.status, 1);
  assert.match(result.stdout, /\[infographic-(?:manifest|artifact|content-hash)/u);
  assert.match(result.stdout, /检查 115 个文件：[1-9]\d* errors/u);
});

test('accepts a complete v2 infographic evidence chain', (t) => {
  const fixture = createInfographicFixture(t);
  assert.deepEqual(lintFixture(fixture), []);
});

test('validates the complete infographic manifest schema as a final gate', () => {
  const manifest = JSON.parse(readFileSync(path.resolve('docs/infographics/ai-interview/manifest.json'), 'utf8'));
  manifest.items[0].layout = 'invalid-layout';

  const diagnostics = lintManifest(manifest, 'docs/infographics/ai-interview/manifest.json');
  assert.ok(diagnostics.some((item) => item.rule === 'infographic-manifest-schema'));
});

test('recomputes the article content hash instead of trusting stale manifest fields', (t) => {
  const fixture = createInfographicFixture(t);
  writeFileSync(fixture.absoluteArticle, fixture.content.replace('正文。', '正文已经修改。'), 'utf8');

  const diagnostics = lintFixture(fixture);
  assert.ok(diagnostics.some((item) => item.rule === 'infographic-content-hash'));
  assert.ok(diagnostics.some((item) => item.rule === 'infographic-source-snapshot'));
});

test('requires source.md to match the current article apart from managed image lines', (t) => {
  const fixture = createInfographicFixture(t);
  writeFixtureFile(fixture.repoRoot, fixture.paths.sourcePath, fixture.content.replace('正文。', '旧正文。'));

  const diagnostics = lintFixture(fixture);
  assert.ok(diagnostics.some((item) => item.rule === 'infographic-source-snapshot'));
});

test('flags missing, unclosed, and incomplete frontmatter', () => {
  const missing = lint(VALID_BODY);
  const unclosed = lint(`---\ntitle: "示例"\n${VALID_BODY}`);
  const missingFields = lint(`---\ntitle: ""\ndescription: '   '\n---\n${VALID_BODY}`);
  const emptyChompingScalars = lint(`---\ntitle: |-\ndescription: >+\n---\n${VALID_BODY}`);

  assert.ok(missing.some((item) => item.rule === 'frontmatter'));
  assert.ok(unclosed.some((item) => item.rule === 'frontmatter'));
  assert.ok(missingFields.some((item) => item.rule === 'frontmatter' && item.message.includes('title')));
  assert.ok(missingFields.some((item) => item.rule === 'frontmatter' && item.message.includes('description')));
  assert.ok(emptyChompingScalars.some((item) => item.rule === 'frontmatter' && item.message.includes('title')));
  assert.ok(emptyChompingScalars.some((item) => item.rule === 'frontmatter' && item.message.includes('description')));
});

test('ignores headings, links, and images inside code or HTML comments', () => {
  const fakeStructure = `${VALID_FRONTMATTER}\n\n\`\`\`text\n${VALID_BODY}\n\`\`\`\n\n\`[inline](./missing-inline.md)\`\n\n<!-- ![hidden](http://images.example.com/a.png) -->`;
  const diagnostics = lint(fakeStructure, { fileExists: () => false });

  assert.ok(diagnostics.some((item) => item.rule === 'article-structure'));
  assert.ok(diagnostics.some((item) => item.rule === 'references'));
  assert.ok(!diagnostics.some((item) => item.rule === 'local-link'));
  assert.ok(!diagnostics.some((item) => item.rule === 'image-https'));
});

test('validates explicit reference-style links and images', () => {
  const content = `${VALID_FRONTMATTER}\n${VALID_BODY}\n[缺失文档][doc]\n![架构图][pic]\n\n[doc]: ./missing-reference.md\n[pic]: http://images.example.com/reference.png`;
  const diagnostics = lint(content, { fileExists: () => false });

  assert.ok(diagnostics.some((item) => item.rule === 'local-link' && /missing-reference/u.test(item.message)));
  assert.ok(diagnostics.some((item) => item.rule === 'image-https'));
});

test('flags untyped and unclosed code fences', () => {
  const untyped = lint(`${VALID_FRONTMATTER}\n${VALID_BODY}\n\`\`\`\nprint(1)\n\`\`\``);
  const unclosed = lint(`${VALID_FRONTMATTER}\n${VALID_BODY}\n\`\`\`python\nprint(1)`);

  assert.ok(untyped.some((item) => item.rule === 'typed-code-fence'));
  assert.ok(unclosed.some((item) => item.rule === 'closed-code-fence'));
});

test('flags hidden control characters while allowing tabs and line endings', () => {
  const hiddenBackspace = String.fromCharCode(8);
  const diagnostics = lint(`${VALID_FRONTMATTER}\n${VALID_BODY}\n参数为 $${hiddenBackspace}eta$。`);

  assert.ok(diagnostics.some((item) => item.rule === 'control-character'));
});

test('flags the legacy attribution, domain, and third-party image', () => {
  const content = `${VALID_FRONTMATTER}\n${VALID_BODY}\n> 原文来源：[小林面试笔记](https://xiaolinnote.com/ai/example)\n![](https://cdn.xiaolincoding.com/picgo/old.png)`;
  const diagnostics = lint(content);

  assert.ok(diagnostics.some((item) => item.rule === 'legacy-source'));
  assert.ok(diagnostics.some((item) => item.rule === 'legacy-domain'));
});

test('requires a reference section', () => {
  const diagnostics = lint(`${VALID_FRONTMATTER}\n${VALID_BODY.replace(/## 参考资料[\s\S]*$/, '')}`);
  assert.ok(diagnostics.some((item) => item.rule === 'references'));
});

test('requires an infographic manifest item and uploaded asset', () => {
  const diagnostics = lintMarkdown({
    filePath: ARTICLE,
    absoluteFilePath: path.join(os.tmpdir(), 'missing-article.md'),
    content: `${VALID_FRONTMATTER}\n${VALID_BODY}`,
    manifest: { version: 2, items: [] },
    requireInfographic: true,
  });

  assert.ok(diagnostics.some((item) => item.rule === 'infographic-manifest'));
});

test('requires every reproducibility and image artifact', async (t) => {
  for (const field of [
    'sourcePath',
    'analysisPath',
    'structuredContentPath',
    'promptPath',
    'uploadRecordPath',
    'localPath',
  ]) {
    await t.test(field, (subtest) => {
      const fixture = createInfographicFixture(subtest);
      rmSync(path.join(fixture.repoRoot, ...fixture.paths[field].split('/')));

      const diagnostics = lintFixture(fixture);
      assert.ok(
        diagnostics.some((item) => item.rule === 'infographic-artifact'),
        `${field} should be required`,
      );
    });
  }
});

test('rejects inconsistent upload record identity and provider fields', async (t) => {
  const mutations = [
    ['article', 'src/content/blog/other.md'],
    ['localPath', 'docs/infographics/ai-interview/other.png'],
    ['remoteUrl', 'https://images.example.com/wrong.png'],
    ['provider', ''],
    ['status', 'failed'],
  ];

  for (const [field, value] of mutations) {
    await t.test(field, (subtest) => {
      const fixture = createInfographicFixture(subtest);
      const record = { ...fixture.uploadRecord, [field]: value };
      writeFixtureFile(
        fixture.repoRoot,
        fixture.paths.uploadRecordPath,
        `${JSON.stringify(record, null, 2)}\n`,
      );

      const diagnostics = lintFixture(fixture);
      assert.ok(
        diagnostics.some((item) => item.rule === 'image-upload-record'),
        `${field} mismatch should be rejected`,
      );
    });
  }
});

test('rejects stale image and prompt hashes', async (t) => {
  await t.test('image bytes changed after upload', (subtest) => {
    const fixture = createInfographicFixture(subtest);
    writeFixtureFile(fixture.repoRoot, fixture.paths.localPath, Buffer.from('changed image'));

    const diagnostics = lintFixture(fixture);
    assert.ok(diagnostics.some((item) => item.rule === 'image-upload-integrity'));
  });

  await t.test('prompt changed after generation', (subtest) => {
    const fixture = createInfographicFixture(subtest);
    writeFixtureFile(fixture.repoRoot, fixture.paths.promptPath, '# changed prompt\n');

    const diagnostics = lintFixture(fixture);
    assert.ok(diagnostics.some((item) => item.rule === 'infographic-artifact'));
  });
});

test('requires HTTPS image URLs even when artifact checks are deferred', () => {
  const content = `${VALID_FRONTMATTER}\n${VALID_BODY.replace(IMAGE_URL, 'http://images.example.com/example.png')}`;
  const diagnostics = lint(content);

  assert.ok(diagnostics.some((item) => item.rule === 'image-https'));
});

test('flags empty Markdown and HTML image alt text', () => {
  const markdown = lint(`${VALID_FRONTMATTER}\n${VALID_BODY.replace('![Agent 执行流程]', '![]')}`);
  const html = lint(`${VALID_FRONTMATTER}\n${VALID_BODY}\n<img src="https://images.example.com/extra.png">`);

  assert.ok(markdown.some((item) => item.rule === 'image-alt'));
  assert.ok(html.some((item) => item.rule === 'image-alt'));
});

test('--no-images bypasses only infographic evidence checks', () => {
  const content = `---\ntitle: ""\n---\n${VALID_BODY.replace('![Agent 执行流程]', '![]')}\n[缺失](./missing.md)`;
  const diagnostics = lint(content, {
    manifest: null,
    requireInfographic: false,
    fileExists: () => false,
  });

  assert.ok(diagnostics.some((item) => item.rule === 'frontmatter'));
  assert.ok(diagnostics.some((item) => item.rule === 'image-alt'));
  assert.ok(diagnostics.some((item) => item.rule === 'local-link'));
  assert.ok(!diagnostics.some((item) => item.rule.startsWith('infographic')));
  assert.ok(!diagnostics.some((item) => item.rule === 'image-upload-record'));
});

test('resolves local links from the absolute article path and ignores query and anchor', (t) => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'content-links-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const absoluteArticle = writeFixtureFile(root, 'nested/article.md', 'placeholder');
  writeFixtureFile(root, 'nested/target.md', '# target\n');
  const content = `${VALID_FRONTMATTER}\n${VALID_BODY}\n[目标](./target.md?view=full#details)\n[页内](#details)`;

  const diagnostics = lintMarkdown({
    filePath: 'display/path/that/is/not/the/source/article.md',
    absoluteFilePath: absoluteArticle,
    content,
    requireInfographic: false,
    fileExists: existsSync,
  });

  assert.ok(!diagnostics.some((item) => item.rule === 'local-link'));
});

test('parses bare and angle-bracket local links containing spaces', (t) => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'content-links-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const absoluteArticle = writeFixtureFile(root, 'nested/article.md', 'placeholder');
  writeFixtureFile(root, 'nested/exists with spaces.md', '# target\n');
  const content = `${VALID_FRONTMATTER}\n${VALID_BODY}\n[存在](./exists with spaces.md)\n[也存在](<./exists with spaces.md>)\n[缺失](./missing with spaces.md)`;

  const diagnostics = lintMarkdown({
    filePath: ARTICLE,
    absoluteFilePath: absoluteArticle,
    content,
    requireInfographic: false,
    fileExists: existsSync,
  }).filter((item) => item.rule === 'local-link');

  assert.equal(diagnostics.length, 1);
  assert.match(diagnostics[0].message, /missing with spaces/u);
});

test('reports invalid percent encoding in a local link without throwing', () => {
  const diagnostics = lint(`${VALID_FRONTMATTER}\n${VALID_BODY}\n[错误编码](./bad%ZZ.md)`, {
    fileExists: existsSync,
  });

  assert.ok(diagnostics.some((item) => item.rule === 'local-link'));
});

test('warns only when the interview follow-up exceeds four dialogue turns', () => {
  const extraTurns = Array.from(
    { length: 5 },
    (_, index) => `**问：** 追问 ${index + 1}？\n\n**答：** 回答 ${index + 1}。`,
  ).join('\n\n');
  const content = `${VALID_FRONTMATTER}\n${VALID_BODY.replace(
    /\*\*问：\*\*[\s\S]*?(?=\n## 参考资料)/u,
    extraTurns,
  )}`;
  const diagnostics = lint(content);

  assert.equal(diagnostics.find((item) => item.rule === 'long-interview-dialogue')?.severity, 'warning');
});

test('reports conditional-language warnings for strong assertions', () => {
  const diagnostics = lint(`${VALID_FRONTMATTER}\n${VALID_BODY}\n这个方案一定是最佳选择。`);
  const warning = diagnostics.find((item) => item.rule === 'strong-assertion');

  assert.equal(warning?.severity, 'warning');
});

test('detects numbering gaps and duplicate prefixes per directory', () => {
  const diagnostics = lintNumbering([
    'topic/00.专题介绍.md',
    'topic/01.第一题.md',
    'topic/03.第三题.md',
    'topic/03.重复编号.md',
  ]);

  assert.ok(diagnostics.some((item) => item.rule === 'numbering-gap'));
  assert.ok(diagnostics.some((item) => item.rule === 'numbering-duplicate'));
});

test('formats diagnostics for CLI output', () => {
  assert.equal(
    formatDiagnostic({
      severity: 'error',
      rule: 'frontmatter',
      filePath: ARTICLE,
      line: 1,
      message: '缺少 frontmatter',
    }),
    `${ARTICLE}:1 error [frontmatter] 缺少 frontmatter`,
  );
});
