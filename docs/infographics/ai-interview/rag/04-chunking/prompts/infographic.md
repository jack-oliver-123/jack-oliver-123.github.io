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

# 4. RAG 中的文档是怎么存的？粒度是多大？详细说说文档切割（Chunking）策略？

## Overview

系统介绍 RAG 文档存储和 Chunking 策略，梳理切割粒度、重叠窗口、语义完整性和检索质量之间的关系

## Learning Objectives

The viewer will understand:

1. 建立“RAG 中的文档是怎么存的？粒度是多大？详细说说文档切割（Chunking）策略？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

RAG 通常同时保存原始文档、规范化后的结构、可检索 chunk、向量和元数据。chunk 至少要带文档 ID、稳定 chunk ID、层级路径、来源、版本、权限和时间信息；向量只是索引，不能替代原文与元数据。

切块没有通用的最佳长度。我会先按标题、段落、表格和代码块等结构边界切分，再依据任务做递归切分或父子切块。候选 chunk 要足够小，便于精确召回；提供给模型的上下文可以扩展到父段落。长度、重叠和 Top-K 都通过目标查询集评测，并受 Embedding 输入限制与生成上下文预算约束。

## 详细解析

### 数据模型

一个可维护的 chunk 记录通常包含 `document_id`、`chunk_id`、`content`、`section_path`、`source_uri`、`content_hash`、`version`、`valid_from`、`acl` 和解析器版本。原始文件放对象存储或文档系统，检索库保存可查询副本。这样可以由答案追溯到原文，也能按文档删除所有派生 chunk。

### 常见切块策略

- **结构切块**：沿 Markdown 标题、HTML 节点、PDF 版面、段落或表格边界切分。
- **递归切块**：块过长时依次按段落、句子或 token 边界继续切。
- **滑动窗口**：相邻块保留少量重叠，缓解边界信息丢失，但会增加重复召回。
- **父子切块**：用较小子块检索，命中后返回更完整的父块。
- **语义切块**：依据句子表示或主题变化寻找边界，成本更高且仍需离线评测。

粒度取决于问题：事实定位偏好更精确的块，摘要或跨段推理需要更完整的上下文。表格、代码和扫描 PDF 应用专门解析策略，不能一律按字符截断。

## 工程实践与边界

- 以模型 tokenizer 计算长度，字符数不能准确代表 token 预算。
- 将切块配置写入索引版本；变更策略时重建影子索引并比较召回指标。
- 去除页眉页脚和重复模板，但保留标题路径等可帮助理解的上下文。
- ACL 要继承自原文，并在 chunk 更新或删除时同步，不允许出现孤儿向量。

## 常见误区

- **“固定 500 token 最好”**：这是未经任务和数据验证的泛化结论。
- **“重叠越大越安全”**：过多重叠会浪费存储与上下文，并让同一证据挤占候选位。
- **“Embedding 维度决定 chunk 长度”**：向量维度是输出表示大小，输入长度由模型架构和配置决定。
- **“只存向量即可”**：无法生成可读上下文，也无法可靠追溯、更新和删除。

## 面试追问

1. **如何评估切块？** 固定检索器与查询集，比较 Recall@K、命中块完整性、重复率和端到端答案质量。
2. **表格怎么切？** 保留表头与行列关系，可按逻辑分区生成文本表示，同时保存原始表格位置。
3. **策略变更怎么上线？** 构建新版本索引，离线验收后灰度流量，出现回归时切回旧别名。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

RAG 通常同时保存原始文档、规范化后的结构、可检索 chunk、向量和元数据。chunk 至少要带文档 ID、稳定 chunk ID、层级路径、来源、版本、权限和时间信息；向量只是索引，不能替代原文与元数据。

切块没有通用的最佳长度。我会先按标题、段落、表格和代码块等结构边界切分，再依据任务做递归切分或父子切块。候选 chunk 要足够小，便于精确召回；提供给模型的上下文可以扩展到父段落。长度、重叠和 Top-K 都通过目标查询集评测，并受 Embedding 输入限制与生成上下文预算约束。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 数据模型
一个可维护的 chunk 记录通常包含 `document_id`、`chunk_id`、`content`、`section_path`、`source_uri`、`content_hash`、`version`、`valid_from`、`acl` 和解析器版本。

### 常见切块策略
- **结构切块**：沿 Markdown 标题、HTML 节点、PDF 版面、段落或表格边界切分。

粒度取决于问题：事实定位偏好更精确的块，摘要或跨段推理需要更完整的上下文。表格、代码和扫描 PDF 应用专门解析策略，不能一律按字符截断。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 以模型 tokenizer 计算长度，字符数不能准确代表 token 预算。
- 将切块配置写入索引版本；变更策略时重建影子索引并比较召回指标。
- 去除页眉页脚和重复模板，但保留标题路径等可帮助理解的上下文。
- ACL 要继承自原文，并在 chunk 更新或删除时同步，不允许出现孤儿向量。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“固定 500 token 最好”**：这是未经任务和数据验证的泛化结论。
- **“重叠越大越安全”**：过多重叠会浪费存储与上下文，并让同一证据挤占候选位。
- **“Embedding 维度决定 chunk 长度”**：向量维度是输出表示大小，输入长度由模型架构和配置决定。
- **“只存向量即可”**：无法生成可读上下文，也无法可靠追溯、更新和删除。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- **“固定 500 token 最好”**：这是未经任务和数据验证的泛化结论。

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
- 4. RAG 中的文档是怎么存的？粒度是多大？详细说说文档切割（Chunking）策略？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
