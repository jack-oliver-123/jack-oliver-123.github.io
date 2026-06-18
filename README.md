# Jack Oliver 的博客

这是 `jack-oliver-123.github.io` 的个人博客源码。站点使用 Astro 构建，部署到 GitHub Pages，所有界面文案和示例内容均使用简体中文。

## 设计方向

这个博客采用“纸张边注式极简博客”的设计方向：

- 文章优先，减少不必要的视觉噪音；
- 使用纸张色、细线、边注和中文排版建立阅读节奏；
- 支持浅色 / 深色模式；
- 支持基于静态索引的全站搜索；
- 保留首页、文章、搜索、标签、归档、关于、RSS 等基础内容结构。

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

本地预览生产构建：

```bash
npm run preview
```

## 写文章

文章放在：

```txt
src/content/blog/
```

可以用子文件夹按项目或主题分类，例如：

```txt
src/content/blog/agentcode/00.agentcode.md
src/content/blog/agentcode/01.letaispeak.md
```

子文件夹会进入文章路径。比如 `src/content/blog/agentcode/00.agentcode.md` 发布后会对应类似 `/posts/agentcode/00agentcode/` 的地址。文件可以先设为 `draft: true`，但仍然必须写完整 frontmatter，否则 Astro 校验会失败。

每篇文章使用 Markdown 或 MDX。Frontmatter 示例：

```yaml
---
title: "文章标题"
description: "文章摘要"
tags: ["Astro", "前端"]
draft: false
featured: false
---
```

字段说明：

- `title`：文章标题，使用简体中文；
- `description`：文章摘要；
- `tags`：标签数组，普通主题优先使用简体中文；
- `draft`：是否为草稿，草稿不会出现在正式页面；
- `featured`：是否优先显示在首页；
- `pubDate`：发布时间，可选；不写时会从 Git 首次提交时间自动推导；
- `updatedDate`：更新时间，可选；不写时会从 Git 最后修改提交时间自动推导。

## 搜索

站点提供 `/search/` 全站搜索页面，搜索范围包括文章标题、摘要、标签和正文。搜索数据由构建时生成的静态 `/search-index.json` 提供，不依赖后端或数据库，适合 GitHub Pages 静态部署。

## 部署

站点通过 GitHub Actions 部署到 GitHub Pages。

工作流会用 `fetch-depth: 0` 拉取完整 Git 历史，用于自动推导文章发布时间和更新时间。仓库 Settings → Pages 中需要确认 Source 使用 **GitHub Actions**。推送到 `main` 后会自动构建并发布到：

```txt
https://jack-oliver-123.github.io/
```

## 目录结构

```txt
src/
├─ components/    # 导航、页脚、文章列表、标签等组件
├─ content/blog/  # Markdown / MDX 文章
├─ layouts/       # 页面布局和文章布局
├─ lib/           # 文章、搜索、标签、归档、站点配置等工具
├─ pages/         # Astro 路由页面，包含搜索页和搜索索引端点
└─ styles/        # 设计 token、全局样式、正文排版
```
