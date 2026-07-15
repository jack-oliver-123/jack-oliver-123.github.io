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

# 30. 多模态大模型如何对齐文本、图像、音频和视频？

## Overview

解释模态编码器、投影器、交叉注意力与统一 Token 的对齐方法，并覆盖时空定位、数据和安全边界

## Learning Objectives

The viewer will understand:

1. 复述“多模态大模型如何对齐文本、图像、音频和视频？”的关键流程与控制点
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

多模态大模型先把图像、音频或视频编码成特征，再通过投影器、Q-Former、交叉注意力或统一 Token 空间接入语言模型。训练通常先做对比学习或配对预训练对齐模态，再用图文/音文指令数据做生成和对话后训练。视频还要处理帧采样与时间顺序，音频要处理长序列和时间戳。

“对齐”至少包含表示可比较、条件生成可用和行为符合指令三层，不等于模型精确感知所有细节。评测要覆盖 OCR、对象/关系、空间、时间、语音、跨模态引用和幻觉，并保留原始媒体的权限与来源。

## 详细解析

常见架构有三类：

| 接入方式 | 机制 | 特点 |
|---|---|---|
| 投影到 LLM Token | 视觉/音频编码器输出经 MLP 映射 | 结构直接，序列长度可能大 |
| Query/交叉注意力 | 少量可学习 Query 从模态特征提取信息 | 压缩 Token，但可能丢细节 |
| 统一离散 Token | 各模态编码为共同序列 | 接口统一，Tokenizer 和训练复杂 |

CLIP 用图文对比目标拉近匹配样本的表示，适合检索与零样本分类；Flamingo 在冻结视觉和语言模块之间插入交叉注意力；LLaVA 用视觉编码器、投影器和语言模型做图文指令微调。这些是不同设计点，不是固定演进顺序。

视频可把帧或片段特征按时间送入模型，但均匀抽帧可能漏掉短事件。音频模型还要在声学内容、说话人、背景声和文本转录之间取舍。多模态上下文会占用大量 Token 和显存，输入分辨率与帧数必须纳入容量规划。

## 工程实践与边界

数据管线记录媒体许可、人物同意、时间戳、转码和标注版本。OCR 或 ASR 结果应保留置信与位置，重要字段由专用解析器或人工复核。不要把图像中的文本直接视为可信指令，防止视觉 Prompt Injection。

评测按模态和组合切片：纯文本、图像、音频、视频及跨模态冲突。对定位任务检查框或时间段，对问答检查证据片段，对生成内容检查安全和身份误判。

## 常见误区

- **把多模态等同于图片转文字**：端到端模型还会学习视觉关系和跨模态条件生成
- **认为更多帧总会更好**：重复帧增加成本并稀释关键事件
- **只测图像描述**：OCR、空间、计数和时间推理是不同能力
- **信任媒体中的指令**：图片、PDF 和音频都属于不可信输入

## 面试追问

**问：为什么需要投影器？**

**答：** 模态编码器的维度和表示分布与语言模型隐藏空间不同，投影器把特征映射到 LLM 可消费的维度，并通过配对训练完成接口对齐。

**问：视频模型如何兼顾长时和短事件？**

**答：** 可组合低频全局采样与高频局部片段，先检索相关时间段再精细编码，并用时间定位指标验证是否漏检。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

多模态大模型先把图像、音频或视频编码成特征，再通过投影器、Q-Former、交叉注意力或统一 Token 空间接入语言模型。训练通常先做对比学习或配对预训练对齐模态，再用图文/音文指令数据做生成和对话后训练。视频还要处理帧采样与时间顺序，音频要处理长序列和时间戳。

“对齐”至少包含表示可比较、条件生成可用和行为符合指令三层，不等于模型精确感知所有细节。评测要覆盖 OCR、对象/关系、空间、时间、语音、跨模态引用和幻觉，并保留原始媒体的权限与来源。

**Visual Element**: Type: numbered process node; Subject: 60 秒回答；Treatment: 从左到右连接并标明第 1 阶段

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

常见架构有三类：

| 接入方式 | 机制 | 特点 |
|---|---|---|
| 投影到 LLM Token | 视觉/音频编码器输出经 MLP 映射 | 结构直接，序列长度可能大 |
| Query/交叉注意力 | 少量可学习 Query 从模态特征提取信息 | 压缩 Token，但可能丢细节 |
| 统一离散 Token | 各模态编码为共同序列 | 接口统一，Tokenizer 和训练复杂 |

CLIP 用图文对比目标拉近匹配样本的表示，适合检索与零样本分类；Flamingo 在冻结视觉和语言模块之间插入交叉注意力；LLaVA 用视觉编码器、投影器和语言模型做图文指令微调。这些是不同设计点，不是固定演进顺序。

视频可把帧或片段特征按时间送入模型，但均匀抽帧可能漏掉短事件。音频模型还要在声学内容、说话人、背景声和文本转录之间取舍。多模态上下文会占用大量 Token 和显存，输入分辨率与帧数必须纳入容量规划。

**Visual Element**: Type: numbered process node; Subject: 详细解析；Treatment: 从左到右连接并标明第 2 阶段

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

数据管线记录媒体许可、人物同意、时间戳、转码和标注版本。OCR 或 ASR 结果应保留置信与位置，重要字段由专用解析器或人工复核。不要把图像中的文本直接视为可信指令，防止视觉 Prompt Injection。

评测按模态和组合切片：纯文本、图像、音频、视频及跨模态冲突。对定位任务检查框或时间段，对问答检查证据片段，对生成内容检查安全和身份误判。

**Visual Element**: Type: numbered process node; Subject: 工程实践与边界；Treatment: 从左到右连接并标明第 3 阶段

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **把多模态等同于图片转文字**：端到端模型还会学习视觉关系和跨模态条件生成
- **认为更多帧总会更好**：重复帧增加成本并稀释关键事件
- **只测图像描述**：OCR、空间、计数和时间推理是不同能力
- **信任媒体中的指令**：图片、PDF 和音频都属于不可信输入

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
- 30. 多模态大模型如何对齐文本、图像、音频和视频？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
