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

# 24. 什么是 Late Interaction 和多向量检索？什么时候值得使用 ColBERT？

## Overview

解释 ColBERT 的 token 级多向量、MaxSim late interaction，以及质量、存储与延迟的取舍

## Learning Objectives

The viewer will understand:

1. 建立“什么是 Late Interaction 和多向量检索？什么时候值得使用 ColBERT？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

单向量双塔把整段文本压缩成一个向量，检索快但可能丢失细粒度匹配。Cross-encoder 联合编码查询和文档，交互充分却难以全库计算。ColBERT 位于两者之间：查询和文档先独立编码成 token 级多向量，文档可离线索引；查询时让每个查询 token 找到文档 token 的最大相似度，再聚合为 MaxSim 分数，这就是 late interaction。

它适合长文档、实体与短语细粒度匹配明显，且单向量召回达到瓶颈的场景。代价是更大的索引、更多候选交互和更复杂的压缩检索。是否值得要在目标数据上与单向量加 reranker 比较质量、P95 延迟、内存和构建成本。

## 详细解析

### Late Interaction 的位置

双塔在编码阶段完全分离，只在最终向量上点积；cross-encoder 在 Transformer 内让查询与文档 token 深度交互；late interaction 先独立计算表示，在评分阶段保留 token 间交互，因此文档表示仍可预计算。

ColBERT 的典型分数可以理解为：对每个查询 token，取它与全部文档 token 相似度的最大值，再把这些最大值相加。这样不同查询词可以匹配文档中的不同位置，避免所有信息被压到一个向量。

### ColBERTv2 与检索链路

ColBERTv2 研究了残差压缩等方法，以降低多向量索引的空间开销。生产链路仍需候选生成、压缩索引、精确或近似 MaxSim 和后续过滤。实现细节依具体引擎，不能只按论文质量数字估算自有负载。

## 工程实践与边界

- 基准必须使用相同语料、标注和硬件，对比 dense-only、ColBERT 与 dense 加 reranker。
- 测量索引构建时间、峰值磁盘、内存、查询 P95/P99 和更新成本。
- 长文档仍应合理分段；多向量不会自动解决 ACL、过时数据和跨文档推理。
- 模型、tokenizer、压缩与索引版本绑定发布，避免表示不兼容。

## 常见误区

- **“Late interaction 就是 cross-encoder”**：它在编码后交互，文档表示可以预计算。
- **“每篇文档只有一个向量”**：ColBERT 保存 token 级或压缩后的多向量表示。
- **“质量更高就适合 RAG”**：索引、尾延迟和更新成本可能不符合 SLO。
- **“MaxSim 能理解所有关系”**：它增强局部匹配，不等于完成复杂逻辑推理。

## 面试追问

1. **为什么叫 late？** 查询和文档分别经过编码器后，才在 token 向量评分阶段发生交互。
2. **如何控制索引大小？** 使用论文或引擎支持的压缩、裁剪和量化，但必须重新评估召回损失。
3. **它与 reranker 怎么组合？** ColBERT 可做召回或中间排序，最终是否再用 cross-encoder 取决于预算与增益。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

单向量双塔把整段文本压缩成一个向量，检索快但可能丢失细粒度匹配。Cross-encoder 联合编码查询和文档，交互充分却难以全库计算。ColBERT 位于两者之间：查询和文档先独立编码成 token 级多向量，文档可离线索引；

它适合长文档、实体与短语细粒度匹配明显，且单向量召回达到瓶颈的场景。代价是更大的索引、更多候选交互和更复杂的压缩检索。是否值得要在目标数据上与单向量加 reranker 比较质量、P95 延迟、内存和构建成本。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### Late Interaction 的位置
双塔在编码阶段完全分离，只在最终向量上点积；

ColBERT 的典型分数可以理解为：对每个查询 token，取它与全部文档 token 相似度的最大值，再把这些最大值相加。这样不同查询词可以匹配文档中的不同位置，避免所有信息被压到一个向量。

### ColBERTv2 与检索链路
ColBERTv2 研究了残差压缩等方法，以降低多向量索引的空间开销。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 基准必须使用相同语料、标注和硬件，对比 dense-only、ColBERT 与 dense 加 reranker。
- 测量索引构建时间、峰值磁盘、内存、查询 P95/P99 和更新成本。
- 长文档仍应合理分段；多向量不会自动解决 ACL、过时数据和跨文档推理。
- 模型、tokenizer、压缩与索引版本绑定发布，避免表示不兼容。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“Late interaction 就是 cross-encoder”**：它在编码后交互，文档表示可以预计算。
- **“每篇文档只有一个向量”**：ColBERT 保存 token 级或压缩后的多向量表示。
- **“质量更高就适合 RAG”**：索引、尾延迟和更新成本可能不符合 SLO。
- **“MaxSim 能理解所有关系”**：它增强局部匹配，不等于完成复杂逻辑推理。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 它适合长文档、实体与短语细粒度匹配明显，且单向量召回达到瓶颈的场景。代价是更大的索引、更多候选交互和更复杂的压缩检索。是否值得要在目标数据上与单向量加 reranker 比较质量、P95 延迟、内存和构建成本。
- ### ColBERTv2 与检索链路
- ColBERTv2 研究了残差压缩等方法，以降低多向量索引的空间开销。生产链路仍需候选生成、压缩索引、精确或近似 MaxSim 和后续过滤。实现细节依具体引擎，不能只按论文质量数字估算自有负载。
- 测量索引构建时间、峰值磁盘、内存、查询 P95/P99 和更新成本。

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
- 24. 什么是 Late Interaction 和多向量检索？什么时候值得使用 ColBERT？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
