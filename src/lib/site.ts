export const SITE = {
  title: 'Jack Oliver 的博客',
  description: '记录技术、写作与日常思考。',
  url: 'https://jack-oliver-123.github.io',
  author: 'Jack Oliver',
  language: 'zh-CN',
  nav: [
    { href: '/', label: '首页' },
    { href: '/blog/', label: '文章' },
    { href: '/search/', label: '搜索' },
    { href: '/tags/', label: '标签' },
    { href: '/archive/', label: '归档' },
    { href: '/about/', label: '关于' },
  ],
  social: {
    github: 'https://github.com/jack-oliver-123',
    rss: '/rss.xml',
  },
} as const;

export const POSTS_PER_PAGE = 8;
