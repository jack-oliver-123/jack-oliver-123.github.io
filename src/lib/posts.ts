import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export async function getAllPosts() {
  const posts = await getCollection('blog');
  return posts
    .filter((post) => !post.data.draft)
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
