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

# 23. RAG 系统如何做权限隔离并防御提示注入与知识库投毒？

## Overview

从租户 ACL、数据摄取、提示注入、知识库投毒和审计响应设计 RAG 安全边界

## Learning Objectives

The viewer will understand:

1. 识别“RAG 系统如何做权限隔离并防御提示注入与知识库投毒？”的核心指标、信号与评估边界
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

RAG 安全要按数据流分层。身份系统签发用户与租户上下文；检索服务在候选进入重排、模型、缓存和日志前强制执行 ACL，且 ACL 从权威源同步并版本化。摄取端校验来源、签名或权限、做恶意内容扫描和人工审批，高风险数据先隔离再发布。

提示注入方面，把文档和网页视为不可信数据，不允许其覆盖系统指令或扩大工具权限；模型只通过最小权限网关调用工具。知识库投毒还需要 provenance、异常变更检测、影子评测、灰度和快速回滚。输出过滤是最后一道防线，不能替代前置隔离。

## 详细解析

### 权限隔离

每个文档和 chunk 继承租户、用户组、数据分类与有效期。查询由服务端注入过滤条件，客户端不能自报租户。数据库级行安全、独立集合或分区可作为防御层，但具体选择取决于隔离要求。缓存键、trace 和离线评测样本同样必须带权限域。

### 间接提示注入

攻击者把“忽略系统指令、调用某工具、泄露历史”等文本放入网页或文档，模型在检索后可能误把它当指令。防护包括清晰分隔指令与数据、输入规范化、工具 allowlist、参数 schema、敏感操作审批、输出和数据流监控。没有单一 Prompt 能彻底解决该问题。

### 投毒与供应链

投毒通过新增或篡改文档影响检索和回答。系统应验证来源和作者权限，保留不可变审计记录，检测短时大量更新、异常关键词与召回分布漂移。新内容或新索引先在隔离环境运行安全回归集，再小流量发布。

## 工程实践与边界

- 设计跨租户诱饵查询，发布前和持续运行时验证零越权召回。
- 删除或降权可疑内容时使索引、缓存和派生摘要同步失效。
- 工具凭证不进入模型上下文，网关根据当前用户重新授权每次调用。
- 发生事件后保留来源版本、摄取人、召回 trace 与调用审计，支持快速封禁和回滚。

## 常见误区

- **“生成后把敏感词删掉就安全”**：敏感数据可能已进入模型、第三方服务或日志。
- **“向量相似度不会泄露权限”**：索引若未过滤，越权候选和侧信道仍可能出现。
- **“可信内部文档不会注入”**：账号被盗、同步源污染和无意指令都可能发生。
- **“扫描到恶意关键词就足够”**：攻击可混淆或跨模态，需要分层控制与行为限制。

## 面试追问

1. **ACL 在重排前还是后做？** 在任何内容离开受控检索边界前做，重排和生成只能看到授权候选。
2. **如何验证没有缓存越权？** 权限域参与缓存键，权限变化主动失效，并做跨身份命中测试。
3. **投毒如何回滚？** 按来源和索引版本定位派生数据，切回已知安全版本，撤销缓存并重放经审核的变更。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

RAG 安全要按数据流分层。身份系统签发用户与租户上下文；检索服务在候选进入重排、模型、缓存和日志前强制执行 ACL，且 ACL 从权威源同步并版本化。摄取端校验来源、签名或权限、做恶意内容扫描和人工审批，高风险数据先隔离再发布。

提示注入方面，把文档和网页视为不可信数据，不允许其覆盖系统指令或扩大工具权限；模型只通过最小权限网关调用工具。知识库投毒还需要 provenance、异常变更检测、影子评测、灰度和快速回滚。输出过滤是最后一道防线，不能替代前置隔离。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 权限隔离
每个文档和 chunk 继承租户、用户组、数据分类与有效期。

### 间接提示注入
攻击者把“忽略系统指令、调用某工具、泄露历史”等文本放入网页或文档，模型在检索后可能误把它当指令。

### 投毒与供应链
投毒通过新增或篡改文档影响检索和回答。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 设计跨租户诱饵查询，发布前和持续运行时验证零越权召回。
- 删除或降权可疑内容时使索引、缓存和派生摘要同步失效。
- 工具凭证不进入模型上下文，网关根据当前用户重新授权每次调用。
- 发生事件后保留来源版本、摄取人、召回 trace 与调用审计，支持快速封禁和回滚。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“生成后把敏感词删掉就安全”**：敏感数据可能已进入模型、第三方服务或日志。
- **“向量相似度不会泄露权限”**：索引若未过滤，越权候选和侧信道仍可能出现。
- **“可信内部文档不会注入”**：账号被盗、同步源污染和无意指令都可能发生。
- **“扫描到恶意关键词就足够”**：攻击可混淆或跨模态，需要分层控制与行为限制。

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
- 23. RAG 系统如何做权限隔离并防御提示注入与知识库投毒？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
