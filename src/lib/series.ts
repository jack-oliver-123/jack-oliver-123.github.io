import type { BlogPost } from './posts';

export type SeriesPostNode = {
  kind: 'post';
  name: string;
  path: string[];
  depth: number;
  post: BlogPost;
};

export type SeriesChapterNode = {
  kind: 'chapter';
  name: string;
  path: string[];
  depth: number;
  count: number;
  children: SeriesTreeNode[];
};

export type SeriesTreeNode = SeriesChapterNode | SeriesPostNode;

export type SeriesGroup = {
  name: string;
  slug: string;
  count: number;
  posts: BlogPost[];
  tree: SeriesChapterNode;
};

export function slugifySeries(series: string) {
  return encodeURIComponent(series);
}

export function unslugifySeries(series: string) {
  return decodeURIComponent(series);
}

function getSeriesName(post: BlogPost) {
  const [seriesName] = post.id.split('/');
  return post.id.includes('/') ? seriesName : undefined;
}

function getRelativeSegments(post: BlogPost) {
  return post.id.split('/').slice(1);
}

function createChapter(name: string, path: string[], depth: number): SeriesChapterNode {
  return {
    kind: 'chapter',
    name,
    path,
    depth,
    count: 0,
    children: [],
  };
}

function getOrderPrefix(name: string) {
  const match = name.match(/^(\d+)/);
  return match ? Number(match[1]) : undefined;
}

function compareNames(a: string, b: string) {
  const aOrder = getOrderPrefix(a);
  const bOrder = getOrderPrefix(b);

  if (typeof aOrder === 'number' && typeof bOrder === 'number' && aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  if (typeof aOrder === 'number' && typeof bOrder !== 'number') return -1;
  if (typeof aOrder !== 'number' && typeof bOrder === 'number') return 1;

  return a.localeCompare(b, 'zh-CN', { numeric: true });
}

function compareNodes(a: SeriesTreeNode, b: SeriesTreeNode) {
  const nameCompare = compareNames(a.name, b.name);
  if (nameCompare !== 0) return nameCompare;
  if (a.kind === b.kind) return 0;
  return a.kind === 'chapter' ? -1 : 1;
}

function findOrCreateChapter(parent: SeriesChapterNode, name: string) {
  const existing = parent.children.find(
    (child): child is SeriesChapterNode => child.kind === 'chapter' && child.name === name
  );

  if (existing) return existing;

  const chapter = createChapter(name, [...parent.path, name], parent.depth + 1);
  parent.children.push(chapter);
  return chapter;
}

function insertPost(root: SeriesChapterNode, post: BlogPost) {
  const segments = getRelativeSegments(post);
  const postName = segments.at(-1);
  if (!postName) return;

  let current = root;

  for (const chapterName of segments.slice(0, -1)) {
    current = findOrCreateChapter(current, chapterName);
  }

  current.children.push({
    kind: 'post',
    name: postName,
    path: [...current.path, postName],
    depth: current.depth + 1,
    post,
  });
}

function sortAndCountTree(node: SeriesChapterNode) {
  node.children.sort(compareNodes);

  let count = 0;
  for (const child of node.children) {
    if (child.kind === 'post') {
      count += 1;
    } else {
      count += sortAndCountTree(child);
    }
  }

  node.count = count;
  return count;
}

function buildSeriesTree(name: string, posts: BlogPost[]) {
  const root = createChapter(name, [], 0);
  posts.forEach((post) => insertPost(root, post));
  sortAndCountTree(root);
  return root;
}

function flattenTreePosts(node: SeriesChapterNode) {
  const posts: BlogPost[] = [];

  for (const child of node.children) {
    if (child.kind === 'post') {
      posts.push(child.post);
    } else {
      posts.push(...flattenTreePosts(child));
    }
  }

  return posts;
}

export function getSeriesGroups(posts: BlogPost[]) {
  const groups = new Map<string, BlogPost[]>();

  for (const post of posts) {
    const seriesName = getSeriesName(post);
    if (!seriesName) continue;

    const current = groups.get(seriesName) ?? [];
    current.push(post);
    groups.set(seriesName, current);
  }

  return Array.from(groups.entries())
    .map(([name, seriesPosts]) => {
      const tree = buildSeriesTree(name, seriesPosts);
      const postsInOrder = flattenTreePosts(tree);
      return {
        name,
        slug: slugifySeries(name),
        posts: postsInOrder,
        tree,
        count: tree.count,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}

export function getSeriesBySlug(posts: BlogPost[], slug: string) {
  const seriesName = unslugifySeries(slug);
  return getSeriesGroups(posts).find((series) => series.name === seriesName);
}
