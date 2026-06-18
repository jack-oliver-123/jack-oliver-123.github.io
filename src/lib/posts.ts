import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'> & {
  data: CollectionEntry<'blog'>['data'] & {
    pubDate: Date;
    updatedDate?: Date;
  };
};

type PostDates = {
  createdAt?: Date;
  updatedAt?: Date;
};

const postDateCache = new Map<string, PostDates>();
const projectRoot = fileURLToPath(new URL('../../', import.meta.url));

function getPostFilePath(postId: string) {
  for (const extension of ['md', 'mdx']) {
    const filePath = `src/content/blog/${postId}.${extension}`;
    if (existsSync(new URL(`../../${filePath}`, import.meta.url))) return filePath;
  }

  return `src/content/blog/${postId}.md`;
}

function getGitTimestamp(args: string[]) {
  try {
    return execFileSync('git', args, {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

function parseGitDate(value: string) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) && timestamp > 0 ? new Date(timestamp * 1000) : undefined;
}

function getFileDates(filePath: string) {
  try {
    const stats = statSync(new URL(`../../${filePath}`, import.meta.url));
    return {
      createdAt: stats.birthtime,
      updatedAt: stats.mtime,
    };
  } catch {
    return {};
  }
}

function getPostDates(postId: string) {
  const cached = postDateCache.get(postId);
  if (cached) return cached;

  const filePath = getPostFilePath(postId);
  const fileDates = getFileDates(filePath);
  const dates = {
    createdAt: parseGitDate(getGitTimestamp(['log', '--follow', '--diff-filter=A', '--format=%ct', '--', filePath]).split('\n').at(-1) ?? '') ?? fileDates.createdAt,
    updatedAt: parseGitDate(getGitTimestamp(['log', '-1', '--format=%ct', '--', filePath])) ?? fileDates.updatedAt,
  };

  postDateCache.set(postId, dates);
  return dates;
}

function resolvePostDates(post: CollectionEntry<'blog'>) {
  const postDates = getPostDates(post.id);
  const pubDate = post.data.pubDate ?? postDates.createdAt ?? postDates.updatedAt ?? new Date();
  const updatedDate = post.data.updatedDate ?? postDates.updatedAt;

  return {
    ...post,
    data: {
      ...post.data,
      pubDate,
      updatedDate: updatedDate && updatedDate.getTime() > pubDate.getTime() ? updatedDate : undefined,
    },
  } satisfies BlogPost;
}

export async function getAllPosts() {
  const posts = await getCollection('blog');
  return posts
    .filter((post) => !post.data.draft)
    .map(resolvePostDates)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export async function getFeaturedPosts(limit = 6) {
  const posts = await getAllPosts();
  const featured = posts.filter((post) => post.data.featured);
  return (featured.length ? featured : posts).slice(0, limit);
}

export function getPostUrl(post: BlogPost) {
  return `/posts/${post.id}/`;
}

export function formatDate(date: Date, style: 'short' | 'long' = 'long') {
  if (style === 'short') {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getReadingTime(body = '') {
  const chineseChars = body.match(/[一-龥]/g)?.length ?? 0;
  const latinWords = body.match(/[A-Za-z0-9_]+/g)?.length ?? 0;
  const minutes = Math.max(1, Math.ceil((chineseChars + latinWords) / 450));
  return `${minutes} 分钟阅读`;
}

export function getAdjacentPosts(posts: BlogPost[], currentId: string) {
  const index = posts.findIndex((post) => post.id === currentId);
  return {
    previous: index >= 0 ? posts[index + 1] : undefined,
    next: index > 0 ? posts[index - 1] : undefined,
  };
}
