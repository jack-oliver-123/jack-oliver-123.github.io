Create a professional infographic following these specifications:

## Image Specifications

- **Type**: Infographic
- **Layout**: dashboard
- **Style**: pop-laboratory
- **Aspect Ratio**: 16:9
- **Language**: zh

## Core Principles

- Follow the layout structure precisely for information architecture
- Apply style aesthetics consistently throughout
- If content involves sensitive or copyrighted figures, create stylistically similar alternatives
- Keep information concise, highlight keywords and core concepts
- Use ample whitespace for visual clarity
- Maintain clear visual hierarchy

## Text Requirements

- All text must match the specified style treatment
- Main titles should be prominent and readable
- Key concepts should be visually emphasized
- Labels should be clear and appropriately sized
- Use the specified language for all text content

## Layout Guidelines

# dashboard

Multi-metric display with charts, numbers, and KPI indicators.

## Structure

- Multiple data widgets
- Charts, graphs, numbers
- Grid or modular layout
- Key metrics prominent
- Status indicators

## Best For

- KPI summaries
- Performance metrics
- Analytics overviews
- Status reports
- Data snapshots

## Visual Elements

- Chart types (bar, line, pie, gauge)
- Big numbers for KPIs
- Trend arrows (up/down)
- Color-coded status (green/red)
- Clean data visualization

## Text Placement

- Title at top
- Widget titles above each section
- Metric labels and values
- Units clearly shown
- Time period indicated

## Recommended Pairings

- `corporate-memphis`: Business dashboards
- `ui-wireframe`: Technical dashboards
- `cyberpunk-neon`: Futuristic displays


## Style Guidelines

# pop-laboratory

Lab manual precision meets pop art color impact—coordinate systems, technical diagrams, and fluorescent accents on blueprint grid.

## Color Palette

- Background: Professional grayish-white with faint blueprint grid texture (#F2F2F2)
- Primary: Muted teal/sage green (#B8D8BE) for major functional blocks and data zones
- High-alert accent: Vibrant fluorescent pink (#E91E63) strictly for warnings, critical data, or "winner" highlights
- Marker highlights: Vivid lemon yellow (#FFF200) as translucent highlighter effect for keywords
- Line art: Ultra-fine charcoal brown (#2D2926) for technical grids, coordinates, and hairlines

## Visual Elements

- Coordinate-style labels on every module (e.g., R-20, G-02, SEC-08)
- Technical diagrams: exploded views, cross-sections with anchor points, architectural skeletal lines
- Vertical/horizontal rulers with precise markers (0.5mm, 1.8mm, 45°)
- "Marker-over-print" effect: color blocks slightly offset from text, postmodern print feel
- Cross-hair targets, mathematical symbols (Σ, Δ, ∞), directional arrows (X/Y axis)
- Microscopic detail annotations alongside macroscopic bold headers
- Corner metadata: tiny barcodes, timestamps, technical parameters
- High contrast between massive bold headers and tiny 8pt-style annotations

## Typography

- Headers: Bold brutalist characters, high visual impact
- Body: Professional sans-serif or crisp technical print
- Numbers: Large, highlighted with yellow or blue to stand out
- Annotations: Ultra-crisp, small technical labels

## Style Enforcement

- Strictly systematic color usage: only teal, pink, yellow, charcoal—no rainbow palette
- Sufficient fine grid lines and coordinate annotations throughout
- Maintain tension between large impactful headers and small precise parameters
- Lab manual aesthetic: mix of microscopic details and macroscopic data

## Avoid

- Cute or cartoonish doodles
- Soft pastels or generic textures
- Empty white space
- Flat vector stock icons
- Organic or hand-drawn imperfections

## Best For

Technical product guides, specification comparisons, precision-focused data visualization, engineering-adjacent content


---

Generate the infographic based on the content below:

# 25. GraphRAG 如何在生产环境处理实体消歧、增量更新和成本问题？

## Overview

拆解 GraphRAG 的实体解析、图版本、增量发布、质量评测和索引成本控制

## Learning Objectives

The viewer will understand:

1. 识别“GraphRAG 如何在生产环境处理实体消歧、增量更新和成本问题？”的核心指标、信号与评估边界
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

生产 GraphRAG 最难的是让自动抽取的图可追溯并持续更新。实体消歧要结合规范名、别名、类型、上下文与外部主键，不能只按字符串合并；每个实体和关系保存来源、有效时间、抽取模型与置信信息。变更时根据源文档定位受影响的实体、边、社区和摘要，构建新图版本并重新计算受影响范围。

上线采用影子评测、灰度和版本路由，保留旧图与摘要用于回滚。成本按解析、实体关系抽取、社区计算、摘要、Embedding 和查询分项测量，先用小样本验证适合全局关系问题。Microsoft GraphRAG 仓库明确提示索引可能昂贵，且项目代码是方法演示而非官方支持产品，生产能力要由团队自行补齐。

## 详细解析

### 实体消歧与来源

“Apple”可能指公司或水果，同名人物也可能属于不同组织。实体解析应先做候选生成，再用类型、邻接关系、时间和权威主键决策；低置信案例保留为不同节点或进入人工队列。关系必须指向原始文本证据，自动摘要不能成为唯一来源。

### 增量更新

GraphRAG 的派生关系比普通向量索引更复杂：删除一份文档可能改变边支持度、社区结构和社区摘要。生产系统需要维护反向 lineage，计算受影响子图，并决定局部重算还是周期性全量重建。当前 Microsoft GraphRAG 主仓库文档不应被解读为提供适用于所有场景的事务性增量更新保证。

### 成本与查询路由

索引阶段的多次模型调用往往是主要成本之一。可以先限制实体类型和 claim 范围，复用内容哈希缓存，选择性地对高价值语料构图。局部事实查询走普通 RAG；需要跨文档主题、关系或全局摘要时才路由 GraphRAG。

## 工程实践与边界

- 图、社区、摘要、向量和 Prompt 统一版本化，回答 trace 记录所用版本。
- 建立实体准确率、边证据支持率、社区稳定性、查询质量和成本看板。
- 新图影子运行后按租户或查询类型灰度；异常时路由回旧图或普通 RAG。
- ACL 沿实体和边的来源传播。社区摘要应在 ACL 同质分区内按授权域生成，或在请求时仅基于已授权证据重新汇总；缓存键必须绑定租户和权限域。查询时只过滤节点或边，无法从已经混合生成的摘要文本中移除越权事实。

## 常见误区

- **“实体名相同就应合并”**：会把不同对象错误连接，产生虚假路径。
- **“只更新新增节点即可”**：社区与摘要可能因局部变更而失效。
- **“GraphRAG 是现成受支持的企业产品”**：Microsoft 仓库明确说明代码是方法演示。
- **“图越大答案越好”**：噪声边、成本和权限传播都会随规模增加。

## 面试追问

1. **如何验证实体合并？** 对高影响实体抽样人工审核，比较外部主键与邻域一致性，并保留可拆分的合并历史。
2. **怎样选择局部重算范围？** 从变更文档沿 lineage 找到派生实体、边和社区，设置影响上限；超过上限转全量重建。
3. **如何做回滚？** 图表、摘要与向量以同一发布 ID 原子切换，旧版本保留到观察窗口结束。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

生产 GraphRAG 最难的是让自动抽取的图可追溯并持续更新。实体消歧要结合规范名、别名、类型、上下文与外部主键，不能只按字符串合并；每个实体和关系保存来源、有效时间、抽取模型与置信信息。变更时根据源文档定位受影响的实体、边、社区和摘要，构建新图版本并重新计算受影响范围。

上线采用影子评测、灰度和版本路由，保留旧图与摘要用于回滚。成本按解析、实体关系抽取、社区计算、摘要、Embedding 和查询分项测量，先用小样本验证适合全局关系问题。Microsoft GraphRAG 仓库明确提示索引可能昂贵，且项目代码是方法演示而非官方支持产品，生产能力要由团队自行补齐。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 实体消歧与来源
“Apple”可能指公司或水果，同名人物也可能属于不同组织。

### 增量更新
GraphRAG 的派生关系比普通向量索引更复杂：删除一份文档可能改变边支持度、社区结构和社区摘要。

### 成本与查询路由
索引阶段的多次模型调用往往是主要成本之一。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 图、社区、摘要、向量和 Prompt 统一版本化，回答 trace 记录所用版本。
- 建立实体准确率、边证据支持率、社区稳定性、查询质量和成本看板。
- 新图影子运行后按租户或查询类型灰度；异常时路由回旧图或普通 RAG。
- ACL 沿实体和边的来源传播。社区摘要应在 ACL 同质分区内按授权域生成，或在请求时仅基于已授权证据重新汇总；缓存键必须绑定租户和权限域。查询时只过滤节点或边，无法从已经混合生成的摘要文本中移除越权事实。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“实体名相同就应合并”**：会把不同对象错误连接，产生虚假路径。
- **“只更新新增节点即可”**：社区与摘要可能因局部变更而失效。
- **“GraphRAG 是现成受支持的企业产品”**：Microsoft 仓库明确说明代码是方法演示。
- **“图越大答案越好”**：噪声边、成本和权限传播都会随规模增加。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 本图不使用额外定量数据。

---

## Design Instructions

### Style Preferences

- 使用 manifest 中已确认的版式与风格
- 保持简体中文清晰可读，技术名词按原文拼写

### Layout Preferences

- 横版 16:9
- 标题突出，主要信息区不超过 4 个

### Other Requirements

- 仅使用上面的原文内容，不添加事实、示例、数值或来源
- 不生成品牌标志、水印、页脚引用或装饰性长文


Text labels (in zh):
- 25. GraphRAG 如何在生产环境处理实体消歧、增量更新和成本问题？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
