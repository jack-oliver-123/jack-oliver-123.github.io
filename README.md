# Jack Oliver 的博客

这是 `jack-oliver-123.github.io` 的个人博客源码。站点使用 Astro 构建，部署到 GitHub Pages，所有界面文案和示例内容均使用简体中文。

## 设计方向

这个博客采用“纸张边注式极简博客”的设计方向：

- 文章优先，减少不必要的视觉噪音；
- 使用纸张色、细线、边注和中文排版建立阅读节奏；
- 支持浅色 / 深色模式；
- 保留首页、文章、标签、归档、关于、RSS 等基础内容结构。

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

每篇文章使用 Markdown 或 MDX。Frontmatter 示例：

```yaml
---
title: "文章标题"
description: "文章摘要"
pubDate: 2026-06-17
updatedDate: 2026-06-17
tags: ["Astro", "前端"]
draft: false
featured: false
---
```

字段说明：

- `title`：文章标题，使用简体中文；
- `description`：文章摘要；
- `pubDate`：发布时间；
- `updatedDate`：更新时间，可选；
- `tags`：标签数组，普通主题优先使用简体中文；
- `draft`：是否为草稿，草稿不会出现在正式页面；
- `featured`：是否优先显示在首页。

## 部署

站点通过 GitHub Actions 部署到 GitHub Pages。

仓库 Settings → Pages 中需要确认 Source 使用 **GitHub Actions**。推送到 `main` 后会自动构建并发布到：

```txt
https://jack-oliver-123.github.io/
```

## 目录结构

```txt
src/
├─ components/    # 导航、页脚、文章列表、标签等组件
├─ content/blog/  # Markdown / MDX 文章
├─ layouts/       # 页面布局和文章布局
├─ lib/           # 文章、标签、归档、站点配置等工具
├─ pages/         # Astro 路由页面
└─ styles/        # 设计 token、全局样式、正文排版
```
