import type { BlogPost } from './posts';

export type TagGroup = {
  name: string;
  count: number;
  posts: BlogPost[];
};

export function getTagGroups(posts: BlogPost[]) {
  const groups = new Map<string, BlogPost[]>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const current = groups.get(tag) ?? [];
      current.push(post);
      groups.set(tag, current);
    }
  }

  return Array.from(groups.entries())
    .map(([name, tagPosts]) => ({
      name,
      posts: tagPosts,
      count: tagPosts.length,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}

export function slugifyTag(tag: string) {
  return encodeURIComponent(tag);
}

export function unslugifyTag(tag: string) {
  return decodeURIComponent(tag);
}
