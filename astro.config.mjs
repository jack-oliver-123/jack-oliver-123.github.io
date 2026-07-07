import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMarkmap from './src/plugins/remark-markmap.mjs';

export default defineConfig({
  site: 'https://jack-oliver-123.github.io',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMarkmap],
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
