import type { BlogPost } from './posts';

export type ArchiveYear = {
  year: string;
  posts: BlogPost[];
};

export function getArchiveYears(posts: BlogPost[]) {
  const years = new Map<string, BlogPost[]>();

  for (const post of posts) {
    const year = String(post.data.pubDate.getFullYear());
    const current = years.get(year) ?? [];
    current.push(post);
    years.set(year, current);
  }

  return Array.from(years.entries()).map(([year, yearPosts]) => ({
    year,
    posts: yearPosts,
  }));
}
