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

# 17. 如何规避 RAG 系统中大模型的幻觉？

## Overview

介绍 RAG 系统中幻觉产生的原因和缓解方法，梳理检索质量、上下文约束、引用溯源和生成控制的作用

## Learning Objectives

The viewer will understand:

1. 识别“如何规避 RAG 系统中大模型的幻觉？”的核心指标、信号与评估边界
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

RAG 只能缓解部分幻觉，不能保证消除。我要先区分：知识库没有答案、正确证据未召回、噪声或冲突证据进入上下文、模型没有忠实使用证据，以及引用与陈述错配。不同原因对应数据补全、检索优化、重排去重、受证据约束的生成、逐条引用校验和拒答策略。

生产上会标注最小充分证据，分别测检索覆盖、答案正确性、faithfulness 和引用准确性；阈值按模型、领域和风险校准。高风险场景还需要规则校验或人工复核，不能把模型自评当成正确性证明。

## 详细解析

### 先保证证据

如果知识库没有有效答案，扩大 Top-K 只会增加噪声。系统需要检测数据覆盖和文档时效。正确文档存在但未召回时，检查切块、查询、ACL、索引和排序。上下文中的冲突应按版本与权威级别处理，不能任由模型猜测。

### 再约束生成

Prompt 要明确区分系统指令、用户问题和不可信文档，要求证据不足时说明不足，并为每项可核验陈述引用来源。结构化输出有助于后处理，但不保证内容真实。对数字、日期和实体可做程序化比对；对复杂主张可用独立验证模型辅助筛查并人工抽检。

### 设计拒答

拒答条件不能只依赖一个向量分数。可综合检索覆盖、reranker 分数、证据一致性与业务风险，并在验证集上选择策略。分数含义随模型和数据变化，不能照搬固定阈值。

## 工程实践与边界

- 将答案拆成原子陈述，检查每条是否由可访问证据支持。
- 来源链接由服务端根据 chunk ID 生成，模型不得自由编造 URL。
- 文档中的“忽略之前指令”等内容视为数据，隔离于系统指令并限制工具权限。
- 监控拒答率、错误接受与错误拒答，按场景风险分层。

## 常见误区

- **“Prompt 写只基于资料就不会幻觉”**：提示是软约束，仍需验证与评测。
- **“相似度低于某固定值就拒答”**：阈值不跨模型和语料通用。
- **“有引用就不是幻觉”**：引用可能不支持主张，或来源本身过期。
- **“让同一个模型自检即可”**：生成与评审错误可能相关，应结合规则、不同模型和人工标注。

## 面试追问

1. **如何评估引用？** 标注陈述与证据的支持关系，测引用完整性与准确性，并检查用户是否有权访问来源。
2. **冲突资料怎么回答？** 展示冲突、来源和时间，应用预先定义的权威规则；无规则时不擅自裁决。
3. **拒答太多怎么办？** 分析是知识覆盖不足、阈值校准还是查询类型差异，不能只整体降低阈值。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

RAG 只能缓解部分幻觉，不能保证消除。我要先区分：知识库没有答案、正确证据未召回、噪声或冲突证据进入上下文、模型没有忠实使用证据，以及引用与陈述错配。不同原因对应数据补全、检索优化、重排去重、受证据约束的生成、逐条引用校验和拒答策略。

生产上会标注最小充分证据，分别测检索覆盖、答案正确性、faithfulness 和引用准确性；阈值按模型、领域和风险校准。高风险场景还需要规则校验或人工复核，不能把模型自评当成正确性证明。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 先保证证据
如果知识库没有有效答案，扩大 Top-K 只会增加噪声。

### 再约束生成
Prompt 要明确区分系统指令、用户问题和不可信文档，要求证据不足时说明不足，并为每项可核验陈述引用来源。

### 设计拒答
拒答条件不能只依赖一个向量分数。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 将答案拆成原子陈述，检查每条是否由可访问证据支持。
- 来源链接由服务端根据 chunk ID 生成，模型不得自由编造 URL。
- 文档中的“忽略之前指令”等内容视为数据，隔离于系统指令并限制工具权限。
- 监控拒答率、错误接受与错误拒答，按场景风险分层。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“Prompt 写只基于资料就不会幻觉”**：提示是软约束，仍需验证与评测。
- **“相似度低于某固定值就拒答”**：阈值不跨模型和语料通用。
- **“有引用就不是幻觉”**：引用可能不支持主张，或来源本身过期。
- **“让同一个模型自检即可”**：生成与评审错误可能相关，应结合规则、不同模型和人工标注。

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
- 17. 如何规避 RAG 系统中大模型的幻觉？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
