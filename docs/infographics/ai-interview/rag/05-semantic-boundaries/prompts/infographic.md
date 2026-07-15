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

# 5. 怎么规避语义被切割掉的问题？

## Overview

介绍规避语义切割问题的常见方法，梳理标题层级、重叠窗口、父子切块和语义分段在 RAG 中的作用

## Learning Objectives

The viewer will understand:

1. 建立“怎么规避语义被切割掉的问题？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

规避语义断裂要同时处理“切分”和“取回”。切分时优先尊重标题、段落、句子、表格与代码边界；必要时加受控重叠。检索时可以用小块匹配问题，再扩展到父段落或相邻窗口，并通过重排与去重控制噪声。

我不会把某个重叠比例当成标准答案，而是针对边界型查询建立评测集，比较不同策略的召回、上下文完整性、重复率、token 成本与答案质量。对于跨多个章节的问题，还需要多步检索或查询分解，单纯加大 chunk 往往无效。

## 详细解析

语义断裂有三类：一个句子被截断；定义与限定条件分到不同块；问题需要组合多个远距离段落。对应策略也不同。

### 保留局部上下文

结构解析能避免多数硬截断。滑动窗口让相邻块共享边界内容，句子窗口则以命中句为中心返回前后句。重叠应保持可控，并在结果合并阶段按来源位置去重。

### 检索小块，返回大块

父子检索将较小子块用于 Embedding，提高定位精度；命中后取回包含它的父节点，为模型提供标题和完整论述。父块过大时仍需预算控制，可只扩展必要邻居。

### 处理远距离关系

查询分解把复合问题拆成若干子问题，分别检索后汇总。实体关系明显的任务还可使用结构化查询或图检索。无论采用哪种方法，都要保留来源关系，避免组合出原文不存在的结论。

## 工程实践与边界

- 给 chunk 保存字符或 token 偏移，命中后才能稳定扩展相邻内容。
- 专门收集“答案横跨边界”的困难样本，不然平均 Recall 可能掩盖问题。
- 上下文扩展后重新计算 token，并按证据价值裁剪，而不是无条件拼接整篇文档。
- 对 PDF 多栏、表格和 OCR 文档先修复阅读顺序，否则后续语义切块也无法挽回。

## 常见误区

- **“增加 overlap 就能解决所有断裂”**：它只覆盖局部边界，不能解决跨章节推理。
- **“语义切块普遍优于结构切块”**：效果依赖表示模型、阈值与文档类型，且增加计算和复现成本。
- **“chunk 越大语义越完整”**：更大的块也会引入无关内容，降低检索区分度并占用上下文。
- **“命中句就是完整证据”**：定义、否定和适用范围可能在邻近段落。

## 面试追问

1. **如何设计边界测试？** 人工构造答案跨句、跨段和跨章节三类问题，并标注最小充分证据集。
2. **父子切块如何更新？** 父文档变化时重新计算内容哈希，原子替换其子块与关系，避免新旧层级混用。
3. **扩展邻居会有什么风险？** 可能带入越权、过期或相互冲突的内容，因此邻居同样要经过 ACL 和版本过滤。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

规避语义断裂要同时处理“切分”和“取回”。切分时优先尊重标题、段落、句子、表格与代码边界；必要时加受控重叠。检索时可以用小块匹配问题，再扩展到父段落或相邻窗口，并通过重排与去重控制噪声。

我不会把某个重叠比例当成标准答案，而是针对边界型查询建立评测集，比较不同策略的召回、上下文完整性、重复率、token 成本与答案质量。对于跨多个章节的问题，还需要多步检索或查询分解，单纯加大 chunk 往往无效。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

语义断裂有三类：一个句子被截断；定义与限定条件分到不同块；问题需要组合多个远距离段落。对应策略也不同。

### 保留局部上下文
结构解析能避免多数硬截断。

### 检索小块，返回大块
父子检索将较小子块用于 Embedding，提高定位精度；

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 给 chunk 保存字符或 token 偏移，命中后才能稳定扩展相邻内容。
- 专门收集“答案横跨边界”的困难样本，不然平均 Recall 可能掩盖问题。
- 上下文扩展后重新计算 token，并按证据价值裁剪，而不是无条件拼接整篇文档。
- 对 PDF 多栏、表格和 OCR 文档先修复阅读顺序，否则后续语义切块也无法挽回。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“增加 overlap 就能解决所有断裂”**：它只覆盖局部边界，不能解决跨章节推理。
- **“语义切块普遍优于结构切块”**：效果依赖表示模型、阈值与文档类型，且增加计算和复现成本。
- **“chunk 越大语义越完整”**：更大的块也会引入无关内容，降低检索区分度并占用上下文。
- **“命中句就是完整证据”**：定义、否定和适用范围可能在邻近段落。

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
- 5. 怎么规避语义被切割掉的问题？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
