import { existsSync } from 'node:fs';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  formatDiagnostic,
  lintManifest,
  lintMarkdown,
  lintNumbering,
} from './content-lint/rules.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_ROOT = path.join(REPO_ROOT, 'src', 'content', 'blog', 'AI应用开发');
const DEFAULT_MANIFEST = path.join(REPO_ROOT, 'docs', 'infographics', 'ai-interview', 'manifest.json');

function parseArguments(argv) {
  const options = { requireInfographic: true, manifestPath: DEFAULT_MANIFEST, targets: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--no-images') {
      options.requireInfographic = false;
    } else if (argument === '--manifest') {
      index += 1;
      if (!argv[index]) throw new Error('--manifest 需要一个文件路径');
      options.manifestPath = path.resolve(REPO_ROOT, argv[index]);
    } else {
      options.targets.push(path.resolve(REPO_ROOT, argument));
    }
  }
  if (options.targets.length === 0) options.targets.push(CONTENT_ROOT);
  return options;
}

async function collectMarkdown(target) {
  if (!existsSync(target)) throw new Error(`路径不存在：${path.relative(REPO_ROOT, target)}`);
  const info = await stat(target);
  if (info.isFile()) return /\.mdx?$/iu.test(target) ? [target] : [];

  const files = [];
  for (const entry of await readdir(target, { withFileTypes: true })) {
    const child = path.join(target, entry.name);
    if (entry.isDirectory()) files.push(...await collectMarkdown(child));
    else if (entry.isFile() && /\.mdx?$/iu.test(entry.name)) files.push(child);
  }
  return files;
}

async function loadManifest(manifestPath) {
  if (!existsSync(manifestPath)) return null;
  try {
    return JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (error) {
    throw new Error(`无法读取信息图清单 ${path.relative(REPO_ROOT, manifestPath)}：${error.message}`);
  }
}

function displayPath(filePath) {
  return path.relative(REPO_ROOT, filePath).replaceAll('\\', '/');
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const targetFiles = [...new Set((await Promise.all(options.targets.map(collectMarkdown))).flat())].sort();
  const allFiles = (await collectMarkdown(CONTENT_ROOT)).sort();
  const manifest = options.requireInfographic ? await loadManifest(options.manifestPath) : null;
  const diagnostics = [];
  if (options.requireInfographic) {
    diagnostics.push(...lintManifest(manifest, displayPath(options.manifestPath)));
  }

  for (const absolutePath of targetFiles) {
    const filePath = displayPath(absolutePath);
    diagnostics.push(...lintMarkdown({
      absoluteFilePath: absolutePath,
      filePath,
      content: await readFile(absolutePath, 'utf8'),
      manifest,
      repoRoot: REPO_ROOT,
      requireInfographic: options.requireInfographic,
      fileExists: existsSync,
    }));
  }

  diagnostics.push(...lintNumbering(allFiles.map(displayPath)));
  diagnostics.sort((left, right) =>
    left.filePath.localeCompare(right.filePath, 'zh-CN') || left.line - right.line || left.rule.localeCompare(right.rule),
  );

  for (const item of diagnostics) console.log(formatDiagnostic(item));
  const errors = diagnostics.filter((item) => item.severity === 'error').length;
  const warnings = diagnostics.length - errors;
  console.log(`检查 ${targetFiles.length} 个文件：${errors} errors，${warnings} warnings`);
  process.exitCode = errors > 0 ? 1 : 0;
}

main().catch((error) => {
  console.error(`content-lint: ${error.message}`);
  process.exitCode = 1;
});
