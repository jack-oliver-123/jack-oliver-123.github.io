# CLAUDE.md

本文件为 Claude Code（claude.ai/code）在此仓库中工作时提供指导。

## 必须遵守

- 所有面向用户或维护者的内容都使用简体中文，包括站点界面、文章辅助文案、SEO/RSS 元信息、README、提交说明中的主体内容，以及本 `CLAUDE.md`。
- 修改代码、配置、内容结构或部署流程后，如果这些变化会影响未来维护方式，必须同步更新相关文档，优先检查 `README.md` 和 `CLAUDE.md`。
- 不要把顶部导航改成侧边导航；文章页左侧的是文章目录（TOC），只服务于当前文章标题跳转。
- 保持当前“纸张边注式极简博客”的克制阅读风格，除非用户明确要求重新设计。

## 项目概览

此仓库是 Jack Oliver 个人博客的源码，线上地址为 `https://jack-oliver-123.github.io/`。项目使用 Astro 生成静态站点，并通过 GitHub Actions 部署到 GitHub Pages。

视觉方向是“纸张边注式极简博客”：文章优先、低噪音、纸张色、细线、中文排版、边注式元信息。调整页面或组件时，应延续这种克制、编辑感强的阅读体验。

## 常用命令

```bash
npm install        # 安装本地开发依赖
npm run dev        # 启动 Astro 开发服务器
npm run build      # 构建静态站点到 dist/
npm run preview    # 本地预览生产构建结果
npm run check      # 运行 Astro/TypeScript 检查
```

当前 `package.json` 没有配置测试脚本，因此主要使用 `npm run check` 和 `npm run build` 作为验证命令。

## 部署

GitHub Pages 部署由 `.github/workflows/deploy.yml` 负责。

- 推送到 `main` 会自动触发部署，也支持 `workflow_dispatch` 手动触发。
- 工作流使用 Node.js 22，执行 `npm ci`、`npm run build`，上传 `./dist`，再通过 `actions/deploy-pages@v4` 发布。
- `actions/checkout` 必须保留 `fetch-depth: 0`，因为文章发布时间和更新时间会从 Git 历史自动推导。
- 仓库 Pages Source 应保持为 GitHub Actions/workflow 模式，不要依赖 GitHub 默认的 Jekyll Pages 构建。

## 架构说明

### Astro 配置

- `astro.config.mjs` 设置 `site: 'https://jack-oliver-123.github.io'`，这是 GitHub Pages 用户主页仓库，不需要配置项目子路径 `base`。
- 使用 `@astrojs/mdx` 支持 MDX 内容，使用 `@astrojs/sitemap` 生成站点地图。
- Markdown 代码高亮使用 Shiki 的 `github-light` 主题，并开启换行。
- `tsconfig.json` 继承 Astro strict 配置，并将 `@/*` 映射到 `src/*`。

### 内容模型

博客文章放在 `src/content/blog/`，格式为 Markdown 或 MDX。可以用子文件夹按项目或主题分类，例如 `src/content/blog/docker/database/01.install-mysql.md`。内容集合会递归读取子目录，子文件夹也会进入文章 ID 和发布路径；一级子文件夹会自动成为系列名，一级以下目录会在系列详情页中递归展开为章节树，根目录文章不属于系列；草稿文章即使不发布，也必须保留完整 frontmatter 才能通过 Astro 校验。

Docker 系列按中间件类型分目录组织（`database/`、`messaging/`、`search/`、`storage/`、`gateway/`、`microservice/`、`monitoring/`），每篇文章同时覆盖 Linux 和 Windows 平台，统一使用 Docker Compose 部署，文件名格式为 `{序号}.install-{中间件}.md`。

`src/content.config.ts` 使用 Astro v6 风格的 `glob()` loader 定义内容集合：

- 集合名：`blog`
- 基础路径：`./src/content/blog`
- 匹配规则：`**/*.{md,mdx}`
- 字段：`title`、`description`、可选 `pubDate`、可选 `updatedDate`、`tags`、`draft`、`featured`

`src/lib/posts.ts` 是文章数据的核心工具层：

- `getAllPosts()` 读取内容集合，过滤草稿，自动补全发布时间/更新时间，并按发布时间倒序排列。
- `getFeaturedPosts()` 优先返回 `featured` 文章，没有精选文章时回退到最新文章。
- `getPostUrl()` 将文章映射到 `/posts/${post.id}/`。
- `formatDate()` 使用 `zh-CN` 格式化日期。
- `getReadingTime()` 使用中文字符数和拉丁单词数估算阅读时间。
- `getAdjacentPosts()` 为文章页生成上一篇/下一篇链接。
- 文章日期优先使用 frontmatter 中手写的 `pubDate` / `updatedDate`；未填写时，从 Git 首次提交时间和最后修改提交时间自动推导。

标签、归档和系列的分组逻辑分别在 `src/lib/tags.ts`、`src/lib/archive.ts` 和 `src/lib/series.ts`。系列分组必须基于 `getAllPosts()` 的结果派生，按一级文件夹自动归类；系列详情页要把一级以下目录递归渲染为章节树，并按同级目录名/文件名的数字前缀排序。

`src/lib/search.ts` 负责全站搜索的文本清理、标准化、打分和命中片段生成。搜索索引必须复用 `getAllPosts()` 生成，避免草稿文章进入搜索结果。

### 路由与布局

`src/pages/` 下的 Astro 文件定义站点路由：

- `/`：首页
- `/blog/`：文章列表
- `/blog/page/[page]/`：分页文章列表
- `/posts/[...slug]/`：文章详情页，支持子文件夹文章生成多级路径
- `/series/` 和 `/series/[series]/`：系列页
- `/search/`：全站搜索页
- `/search-index.json`：构建期生成的静态搜索索引
- `/tags/` 和 `/tags/[tag]/`：标签页
- `/archive/`：归档页
- `/about/`：关于页
- `/rss.xml`：RSS 订阅
- `/404`：未找到页面

布局流：

- `src/layouts/BaseLayout.astro` 引入全局样式，渲染公共 head/header/footer，并设置 `<html lang="zh-CN">`。
- `src/layouts/PageLayout.astro` 用统一的页面介绍区包装普通索引类页面。
- `src/layouts/PostLayout.astro` 包装文章页，计算相邻文章，渲染文章元信息、可选文章目录、正文和上一篇/下一篇导航。

### 文章渲染、文章目录与代码块复制

`src/pages/posts/[...slug].astro` 使用 `astro:content` 的 `render(post)`，并把 `Content` 和 `headings` 一起传给 `PostLayout`。文章路由使用 rest route，以支持 `src/content/blog/agentcode/00.agentcode.md` 这类子文件夹文章生成 `/posts/agentcode/00.agentcode/`。

`PostLayout` 只保留 H2/H3 标题，并且仅在存在这些标题时渲染 `src/components/TableOfContents.astro`。文章目录的行为：

- 只针对当前文章，不是顶部站点导航的替代品；
- 桌面端固定在左侧并随阅读滚动，移动端回到正文上方；
- 支持折叠，状态保存在 `localStorage` 的 `toc-state`；
- 使用滚动、hash 和点击锁定逻辑高亮当前标题。

文章页代码块复制由 `PostLayout` 挂载 `src/components/CodeBlockCopy.astro` 做客户端渐进增强，只作用于 `.prose[data-code-copy-root]` 中的代码块。按钮文案为 `复制` / `已复制` / `复制失败`，复制时优先使用 Clipboard API，失败后回退到隐藏 `textarea` 加 `document.execCommand('copy')`。禁用 JavaScript 时不输出复制按钮，保留原始代码块阅读体验。

修改文章目录行为时，要同时检查 `TableOfContents.astro` 和 `src/styles/global.css` 中的 `.toc-panel*` 样式。修改代码块复制行为时，要同时检查 `CodeBlockCopy.astro` 和 `src/styles/prose.css` 中的 `.code-copy-*` 样式。

### 样式系统

样式拆分为：

- `src/styles/tokens.css`：浅色/深色主题变量、字体、容器宽度、圆角和焦点样式。
- `src/styles/global.css`：站点外壳、导航、文章列表、系列页、搜索页、归档、文章布局、文章目录、页脚和响应式规则。
- `src/styles/prose.css`：Markdown/MDX 正文排版、标题、代码、代码块复制按钮、表格、引用块，以及标题跳转所需的 `scroll-margin-top`。

当前设计依赖 CSS 变量和系统中文字体栈。除非用户明确要求重做视觉风格，否则不要引入与现有风格割裂的组件样式。

### 元信息与资源

`src/components/Head.astro` 集中处理 SEO 元信息、canonical、RSS 链接、favicon、Open Graph、Twitter Card，以及初始主题选择。

当前图片约定：

- `public/my.jpg` 是头像源图。
- `public/favicon.svg` 内嵌头像图。
- `public/social-cover.svg` 是默认社交分享图。

### 站点配置

`src/lib/site.ts` 保存站点标题、描述、URL、作者、语言、顶部导航、社交链接和 `POSTS_PER_PAGE`。修改站点级配置时优先更新这个文件，不要在组件中重复硬编码。

## 内容约定

- 所有可见 UI 文案和博客辅助内容保持简体中文。
- 技术名称可以保留官方写法，例如 `Astro`、`MDX`、`GitHub Actions`、包名或命令名。
- 公开路由使用稳定英文路径，例如 `/blog/`、`/tags/`、`/archive/`、`/about/`，但页面标题和导航标签必须使用简体中文。
- `draft: true` 的文章不应出现在生产页面中，因为 `getAllPosts()` 会过滤草稿。
