Create a professional infographic following these specifications:

## Image Specifications

- **Type**: Infographic
- **Layout**: bento-grid
- **Style**: hand-drawn-edu
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

# bento-grid

Modular grid layout with varied cell sizes, like a bento box.

## Structure

- Grid of rectangular cells
- Mixed cell sizes (1x1, 2x1, 1x2, 2x2)
- No strict symmetry required
- Hero cell for main point
- Supporting cells around it

## Best For

- Multiple topic overview
- Feature highlights
- Dashboard summaries
- Portfolio displays
- Mixed content types

## Visual Elements

- Clear cell boundaries
- Varied cell backgrounds
- Icons or illustrations per cell
- Consistent padding/margins
- Visual hierarchy through size

## Text Placement

- Main title at top
- Cell titles within each cell
- Brief content per cell
- Minimal text, maximum visual
- CTA or summary in prominent cell

## Recommended Pairings

- `craft-handmade`: Friendly overviews (default)
- `corporate-memphis`: Business summaries
- `pixel-art`: Retro feature grids


## Style Guidelines

# hand-drawn-edu

Hand-drawn educational infographic with macaron pastel color blocks on warm cream paper texture.

## Color Palette

- Background: Warm cream (#F5F0E8) with subtle paper grain texture
- Primary text: Deep charcoal (#2D2D2D) for headlines, outlines
- Macaron Blue: #A8D8EA for cool-toned information zones
- Macaron Mint: #B5E5CF for growth/positive zones
- Macaron Lavender: #D5C6E0 for abstract/concept zones
- Macaron Peach: #FFD5C2 for warm-toned zones
- Accent: Coral Red (#E8655A) for key data, warnings, emphasis
- Muted annotations: Warm gray (#6B6B6B) for secondary labels

## Visual Elements

- Macaron pastel rounded cards as distinct information zones
- Hand-drawn wavy connection lines and arrows with small text labels
- Simple stick-figure characters and cartoon icons to humanize concepts
- Doodle decorations: small stars, underlines, spirals, sparkles
- Color fills don't completely fill outlines — preserve casual hand-drawn feel
- Dashed borders for secondary or contained zones
- Small icon doodles (clipboard, lock, checkmark, lightbulb) to reinforce concepts
- Bold centered quote or takeaway at the bottom
- Slight hand-drawn wobble on all lines and shapes

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Sketch-notes** | Concept mapping | More stick figures, thought bubbles, connecting arrows |
| **Pastel cards** | Structured info | Cleaner macaron blocks, less doodle, more white space |

## Typography

- Main title: Bold hand-drawn lettering with organic strokes, large confident letterforms with slight wobble
- Section headers: Hand-lettered text on or inside macaron color blocks
- Body text: Clear handwritten print style, legible but not mechanical
- Annotations: Warm gray (#6B6B6B), smaller, neat handwritten labels
- Keywords: Bold emphasis within body text

## Style Enforcement

- All lines must have slight hand-drawn wobble — no perfect geometry
- Each information zone uses a distinct macaron color block
- Maintain consistent wobble quality across all shapes and lines
- Include at least one simple cartoon character or stick figure
- Generous white space between zones — each zone should breathe
- Maximum 4 macaron colors per infographic

## Avoid

- Perfect geometric shapes or straight lines
- Photorealistic elements or stock illustration style
- Pure white backgrounds
- Flat vector icons or digital-precision graphics
- Overcrowded layouts — let zones breathe
- Corporate or clinical aesthetic

## Best For

Educational diagrams, process explainers, concept maps, knowledge summaries, tutorial walkthroughs, onboarding visuals


---

Generate the infographic based on the content below:

# 14. RAG 检索优化策略有哪些？

## Overview

介绍 RAG 检索优化的核心策略，梳理 Query 处理、多路召回、Rerank、过滤和上下文拼接的优化思路

## Learning Objectives

The viewer will understand:

1. 建立“RAG 检索优化策略有哪些？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

检索优化应按误差链路做，而不是罗列技巧。先建立带相关文档标注的查询集，区分解析失败、索引缺失、查询表达、候选召回、过滤、融合、重排和上下文打包问题。然后从数据治理与切块、Embedding/稀疏索引、查询改写、多路召回、元数据过滤、reranker 和上下文选择逐层做消融。

每次改动同时看 Recall@K、MRR/nDCG、延迟、资源、无答案误召和端到端答案质量。Top-K、chunk 长度、阈值或 ANN 参数都没有通用最佳值，应在固定模型、数据、硬件和负载下选择。

## 详细解析

### 数据和索引层

高质量解析、去重、标题路径、稳定 ID 与版本信息通常比盲目换模型更基础。针对文档类型选择切块；对编号和专名保留稀疏索引；Embedding 变更时重建向量。ANN 参数要通过精确检索基准校准召回损失。

### 查询和召回层

对会话问题做指代消解，对复合问题做受控分解。混合检索利用词法与语义互补，结构化过滤缩小合法范围。过滤不是纯性能选项，它还承担 ACL 与时效正确性。

### 排序和上下文层

reranker 用更高计算成本改善少量候选的排序。上下文打包要去重、合并相邻片段、保留标题与来源，并防止单一文档占满预算。若答案需要多个证据，评测应标注证据集合而非单个 chunk。

## 工程实践与边界

- 建立失败分类看板，每类保留代表样本，优先优化占比和业务损失都高的问题。
- 对每层做可回滚配置和影子实验，避免同时换切块、模型和提示词后无法归因。
- 评测至少重复运行模型裁判类指标，报告方差并定期人工校准。
- 新索引先离线验收，再影子读和小流量灰度；监控质量代理指标及 SLO。

## 常见误区

- **“检索优化就是调 Top-K”**：召回链路包含数据、索引、查询、过滤、融合和排序。
- **“Recall 越高答案越好”**：更多候选也可能带来冲突和上下文噪声。
- **“换榜单更强的 Embedding 就能提升”**：领域、语言和检索配置可能不匹配。
- **“线上点击率足够评估”**：点击受位置与交互偏差影响，且不直接证明答案忠实。

## 面试追问

1. **相关文档没进候选怎么办？** 检查索引覆盖、ACL、查询表示和 ANN 召回，再决定改切块、增加召回路或调搜索参数。
2. **进候选但没进上下文怎么办？** 检查融合、重排、去重和预算策略，用候选阶段指标定位掉点。
3. **如何控制实验污染？** 固定评测快照和版本，一次改变一个主要变量，并隔离在线流量分组。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

检索优化应按误差链路做，而不是罗列技巧。先建立带相关文档标注的查询集，区分解析失败、索引缺失、查询表达、候选召回、过滤、融合、重排和上下文打包问题。然后从数据治理与切块、Embedding/稀疏索引、查询改写、多路召回、元数据过滤、reranker 和上下文选择逐层做消融。

每次改动同时看 Recall@K、MRR/nDCG、延迟、资源、无答案误召和端到端答案质量。Top-K、chunk 长度、阈值或 ANN 参数都没有通用最佳值，应在固定模型、数据、硬件和负载下选择。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 数据和索引层
高质量解析、去重、标题路径、稳定 ID 与版本信息通常比盲目换模型更基础。

### 查询和召回层
对会话问题做指代消解，对复合问题做受控分解。

### 排序和上下文层
reranker 用更高计算成本改善少量候选的排序。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 建立失败分类看板，每类保留代表样本，优先优化占比和业务损失都高的问题。
- 对每层做可回滚配置和影子实验，避免同时换切块、模型和提示词后无法归因。
- 评测至少重复运行模型裁判类指标，报告方差并定期人工校准。
- 新索引先离线验收，再影子读和小流量灰度；监控质量代理指标及 SLO。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“检索优化就是调 Top-K”**：召回链路包含数据、索引、查询、过滤、融合和排序。
- **“Recall 越高答案越好”**：更多候选也可能带来冲突和上下文噪声。
- **“换榜单更强的 Embedding 就能提升”**：领域、语言和检索配置可能不匹配。
- **“线上点击率足够评估”**：点击受位置与交互偏差影响，且不直接证明答案忠实。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

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
- 14. RAG 检索优化策略有哪些？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
