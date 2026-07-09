import type { APIRoute } from 'astro';
import { cleanMarkdownForSearch, type SearchDocument } from '@/lib/search';
import { formatDate, getAllPosts, getPostUrl } from '@/lib/posts';

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  const documents: SearchDocument[] = posts.map((post) => {
    const fullBody = cleanMarkdownForSearch(post.body);
    // 截断正文为前 300 字，减少索引体积
    const body = fullBody.length > 300 ? fullBody.slice(0, 300) : fullBody;
    return {
      title: post.data.title,
      description: post.data.description,
      tags: post.data.tags,
      body,
      url: getPostUrl(post),
      pubDate: post.data.pubDate.toISOString(),
      dateLabel: formatDate(post.data.pubDate, 'short'),
    };
  });

  return new Response(JSON.stringify(documents), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
};
