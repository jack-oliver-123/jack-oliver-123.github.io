Create a professional infographic following these specifications:

## Image Specifications

- **Type**: Infographic
- **Layout**: linear-progression
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

# linear-progression

Sequential progression showing steps, timeline, or chronological events.

## Structure

- Linear arrangement (horizontal or vertical)
- Nodes/markers at key points
- Connecting line or path between nodes
- Clear start and end points
- Directional flow indicators

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Timeline** | Chronological events, dates | Time markers, period labels |
| **Process** | Action steps, numbered sequence | Step numbers, action icons |

## Best For

- Step-by-step tutorials and how-tos
- Historical timelines and evolution
- Project milestones and roadmaps
- Workflow documentation
- Onboarding processes

## Visual Elements

- Numbered steps or date markers
- Arrows or connectors showing direction
- Icons representing each step/event
- Consistent node spacing
- Progress indicators optional

## Text Placement

- Title at top
- Step/event titles at each node
- Brief descriptions below nodes
- Dates or numbers clearly visible

## Recommended Pairings

- `craft-handmade`: Friendly tutorials and timelines
- `ikea-manual`: Clean assembly instructions
- `corporate-memphis`: Business process flows
- `aged-academia`: Historical discoveries


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

# 22. 多模态 RAG 如何处理 PDF、表格、图片和 OCR 内容？

## Overview

说明多模态 RAG 的版面解析、OCR、表格结构、视觉检索和证据引用链路

## Learning Objectives

The viewer will understand:

1. 复述“多模态 RAG 如何处理 PDF、表格、图片和 OCR 内容？”的关键流程与控制点
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

多模态 RAG 的难点不是“把 PDF 转成文本”，而是保留页面结构和跨模态关系。入库时先判断 PDF 是否有文本层，解析标题、段落、阅读顺序、表格、图片和坐标；扫描页再做 OCR。表格保存单元格结构与表头，图片保存区域、标题和邻近文字，并可生成文本与视觉表示。

检索可采用结构化文本、图像/页面向量和元数据多路召回；命中后返回原始页面裁剪、表格区域或文本块，最终引用页码和坐标。OCR 置信度、阅读顺序和表格还原都要单独评测，低置信证据不能被模型当成确定事实。

## 详细解析

### 文档解析与表示

数字 PDF 的文本层可能缺失正确阅读顺序；扫描 PDF 则需要 OCR。解析器应输出带版面坐标的元素树，而不是扁平字符串。表格需保留行列、合并单元格和单位；图表可保存原图、标题、图例、附近段落以及可选的视觉向量或描述。

### 多路检索

文本路检索 OCR、标题与说明；视觉路可对页面或区域做多向量表示；结构化路处理表格字段与数值筛选。ColPali 一类方法直接从文档图像产生多向量并进行 late interaction，减少传统 OCR 管线依赖，但资源、语言和领域效果仍需验证。

### 证据交付

生成器需要知道证据类型、页面、区域和解析置信度。对表格计算优先用结构化程序，不让模型仅凭截图心算；引用链接应定位到用户有权访问的原页或裁剪区域。

## 工程实践与边界

- 建立包含多栏、旋转页、手写、跨页表格和低清扫描件的解析回归集。
- OCR、版面模型和解析配置都版本化；升级后重建影子索引并比较。
- 对图片和 OCR 内容做恶意指令检测与隔离，它们同样可能承载提示注入。
- 缓存原始文件时遵循权限与保留期限，避免预览图绕过 ACL。

## 常见误区

- **“PDF 有文字就不需要版面解析”**：文本顺序仍可能错乱，表格结构也会丢失。
- **“OCR 分数高就代表语义正确”**：数字、单位和相似字符的少量错误可能改变结论。
- **“生成图片描述后就等价于原图”**：描述会遗漏细节，原始区域应作为可核验证据保留。
- **“多模态模型可替代结构化计算”**：精确表格筛选和算术更适合程序执行。

## 面试追问

1. **跨页表格怎么处理？** 通过重复表头、列对齐和版面位置合并，保留每行来源页，并对合并结果做抽样校验。
2. **如何评估解析？** 分别测阅读顺序、OCR 字符/词错误、表格结构与检索命中，不能只看最终问答。
3. **视觉检索何时值得？** 当版面、图形或 OCR 难以表达关键信息，且质量收益能覆盖索引与在线计算成本时。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

多模态 RAG 的难点不是“把 PDF 转成文本”，而是保留页面结构和跨模态关系。入库时先判断 PDF 是否有文本层，解析标题、段落、阅读顺序、表格、图片和坐标；扫描页再做 OCR。表格保存单元格结构与表头，图片保存区域、标题和邻近文字，并可生成文本与视觉表示。

检索可采用结构化文本、图像/页面向量和元数据多路召回；命中后返回原始页面裁剪、表格区域或文本块，最终引用页码和坐标。OCR 置信度、阅读顺序和表格还原都要单独评测，低置信证据不能被模型当成确定事实。

**Visual Element**: Type: numbered process node; Subject: 60 秒回答；Treatment: 从左到右连接并标明第 1 阶段

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 文档解析与表示
数字 PDF 的文本层可能缺失正确阅读顺序；

### 多路检索
文本路检索 OCR、标题与说明；

### 证据交付
生成器需要知道证据类型、页面、区域和解析置信度。

**Visual Element**: Type: numbered process node; Subject: 详细解析；Treatment: 从左到右连接并标明第 2 阶段

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 建立包含多栏、旋转页、手写、跨页表格和低清扫描件的解析回归集。
- OCR、版面模型和解析配置都版本化；升级后重建影子索引并比较。
- 对图片和 OCR 内容做恶意指令检测与隔离，它们同样可能承载提示注入。
- 缓存原始文件时遵循权限与保留期限，避免预览图绕过 ACL。

**Visual Element**: Type: numbered process node; Subject: 工程实践与边界；Treatment: 从左到右连接并标明第 3 阶段

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“PDF 有文字就不需要版面解析”**：文本顺序仍可能错乱，表格结构也会丢失。
- **“OCR 分数高就代表语义正确”**：数字、单位和相似字符的少量错误可能改变结论。
- **“生成图片描述后就等价于原图”**：描述会遗漏细节，原始区域应作为可核验证据保留。
- **“多模态模型可替代结构化计算”**：精确表格筛选和算术更适合程序执行。

**Visual Element**: Type: numbered process node; Subject: 常见误区；Treatment: 从左到右连接并标明第 4 阶段

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
- 22. 多模态 RAG 如何处理 PDF、表格、图片和 OCR 内容？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
