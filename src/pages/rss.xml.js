import rss from '@astrojs/rss';
import { getAllPosts, getPostUrl } from '@/lib/posts';
import { SITE } from '@/lib/site';

export async function GET(context) {
  const posts = await getAllPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getPostUrl(post),
      categories: post.data.tags,
    })),
    customData: '<language>zh-CN</language>',
  });
}
