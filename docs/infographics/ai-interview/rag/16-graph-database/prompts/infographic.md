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

# 16. 在什么场景下，你会选择使用图数据库来增强传统的向量检索？

## Overview

分析图数据库增强向量检索的适用场景，梳理实体关系、知识图谱、路径推理和结构化查询在 RAG 中的价值

## Learning Objectives

The viewer will understand:

1. 建立“在什么场景下，你会选择使用图数据库来增强传统的向量检索？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

当问题的答案依赖明确实体关系、路径约束或跨文档聚合，而不是只需找到语义相似段落时，我会考虑图数据库。例如供应链影响分析、组织与权限关系、药物相互作用、设备依赖和“某人参与的项目又依赖哪些系统”等多跳查询。

典型链路是先识别实体，使用图查询做邻域或路径扩展，再用文本或向量检索补充证据，最后重排。是否采用图取决于关系是否可可靠抽取、是否需要确定性约束、更新成本与评测收益；图中错误会沿路径传播，所以它不是向量检索的自动升级。

## 详细解析

### 向量与图的能力边界

向量检索根据表示空间的邻近性返回相似内容，适合开放文本匹配，但不会天然执行“必须经过两条指定关系”或“统计某实体所有上游依赖”这样的约束。图查询显式操作节点、边、方向和属性，适合关系遍历与可解释路径。

### 组合检索

一种做法是向量先定位种子实体或文档，再沿图扩展邻居；另一种是先用实体解析得到图节点，再取相关节点挂接的文本证据。最终回答应引用原始文档或权威记录，而不是把自动抽取的边当成无条件事实。

### 什么时候不值得

如果问题主要是单文档事实、实体关系稀疏，或关系抽取质量不足，BM25 加向量与重排更简单。图还需要 schema、实体消歧、时态、来源、版本和删除传播，长期维护成本往往高于演示阶段。

## 工程实践与边界

- 边记录来源、有效时间、置信度与版本，支持追溯和冲突处理。
- 图查询同样执行租户与 ACL；不能先扩展全图再在生成后过滤。
- 限制路径长度、节点数量与查询时间，防止爆炸式扩展。
- 图和文本索引用同一发布版本或兼容映射，避免新旧实体关系混用。

## 常见误区

- **“图数据库能让模型真正推理”**：它提供结构化检索与路径，最终推理仍可能出错。
- **“实体抽取正确率高就够了”**：实体消歧、边方向、时间和来源同样影响答案。
- **“图检索不需要向量”**：自然语言到实体、相关文本补充仍可受益于向量检索。
- **“所有多跳问题都要上图”**：查询分解加普通检索也可能更经济。

## 面试追问

1. **如何评估图增强？** 标注所需实体、路径和证据，分别比较实体链接、路径召回与最终答案。
2. **关系冲突怎么办？** 保留来源和有效时间，按权威规则筛选；无法裁决时向用户呈现冲突。
3. **删除文档如何处理图？** 根据来源反向找到派生节点和边，重算仍有其他来源支持的关系，再原子发布新版本。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

当问题的答案依赖明确实体关系、路径约束或跨文档聚合，而不是只需找到语义相似段落时，我会考虑图数据库。例如供应链影响分析、组织与权限关系、药物相互作用、设备依赖和“某人参与的项目又依赖哪些系统”等多跳查询。

典型链路是先识别实体，使用图查询做邻域或路径扩展，再用文本或向量检索补充证据，最后重排。是否采用图取决于关系是否可可靠抽取、是否需要确定性约束、更新成本与评测收益；图中错误会沿路径传播，所以它不是向量检索的自动升级。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 向量与图的能力边界
向量检索根据表示空间的邻近性返回相似内容，适合开放文本匹配，但不会天然执行“必须经过两条指定关系”或“统计某实体所有上游依赖”这样的约束。

### 组合检索
一种做法是向量先定位种子实体或文档，再沿图扩展邻居；

### 什么时候不值得
如果问题主要是单文档事实、实体关系稀疏，或关系抽取质量不足，BM25 加向量与重排更简单。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 边记录来源、有效时间、置信度与版本，支持追溯和冲突处理。
- 图查询同样执行租户与 ACL；不能先扩展全图再在生成后过滤。
- 限制路径长度、节点数量与查询时间，防止爆炸式扩展。
- 图和文本索引用同一发布版本或兼容映射，避免新旧实体关系混用。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“图数据库能让模型真正推理”**：它提供结构化检索与路径，最终推理仍可能出错。
- **“实体抽取正确率高就够了”**：实体消歧、边方向、时间和来源同样影响答案。
- **“图检索不需要向量”**：自然语言到实体、相关文本补充仍可受益于向量检索。
- **“所有多跳问题都要上图”**：查询分解加普通检索也可能更经济。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 如果问题主要是单文档事实、实体关系稀疏，或关系抽取质量不足，BM25 加向量与重排更简单。图还需要 schema、实体消歧、时态、来源、版本和删除传播，长期维护成本往往高于演示阶段。

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
- 16. 在什么场景下，你会选择使用图数据库来增强传统的向量检索？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
