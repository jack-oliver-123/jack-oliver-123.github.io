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

# 12. Agent 记忆压缩通常有哪些方法？

## Overview

介绍 Agent 记忆压缩的常见方法，梳理摘要、筛选、分层存储和检索增强等手段如何控制上下文成本

## Learning Objectives

The viewer will understand:

1. 建立“Agent 记忆压缩通常有哪些方法？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

常见方法有滑动窗口、阶段摘要、结构化事实抽取、相关性筛选、工具结果压缩和外部存储按需检索。生产中通常分层组合：固定保留系统政策、当前目标和未完成约束；近期消息保留原文；旧历史转成摘要；大体量证据外置，只把相关片段放回上下文。

压缩不是越短越好。要评测约束保留率、事实一致性、任务成功率、延迟和成本，并保留原始证据引用。Prompt caching 只复用相同前缀的计算，不会减少模型实际看到的信息，不能替代记忆压缩。

## 详细解析

- **滑动窗口**：成本低，但按时间硬截断可能丢失早期关键决策。
- **滚动或层级摘要**：用较短摘要替代旧对话，适合保留脉络，但会产生累计失真。
- **结构化抽取**：把目标、约束、决策、待办和实体事实写入字段，信息密度高，但依赖业务 schema。
- **选择性上下文**：按当前步骤检索相关消息、文档和工具结果，减少无关内容。
- **观察压缩**：对搜索结果、日志和网页提取证据片段，原文外置并保留引用。

好的上下文通常由不同保真度层组成：不可变政策和用户明确约束保持原文；执行状态保持结构化；可重新获取的背景信息可以摘要；无关且可恢复的数据可以移出当前窗口。

摘要本身也是模型输出，应记录生成版本和覆盖范围。多次“摘要的摘要”会放大遗漏，关键字段应从结构化状态读取，而非只依赖自然语言摘要。

## 工程实践与边界

- 设定 Token 预算时为模型输出和工具响应预留空间，不要把窗口全部用于历史。
- 压缩前识别“不可丢”项：用户目标、否决方案、权限、截止时间、已产生副作用和待审批动作。
- 摘要输出使用 schema，并校验实体、数字、否定和未完成项是否保留。
- 原始数据的访问沿用租户权限和保留期；外置不等于可以永久保存。
- Prompt cache 监控命中率，但把它视为性能优化，不改变信息治理策略。

## 常见误区

- **“窗口更大就不需要压缩”**：长上下文仍有成本、检索干扰和隐私暴露问题。
- **“摘要一次后长期准确”**：新信息可能使旧摘要过时，应版本化并定期校验。
- **“最近消息最重要”**：早期确认的硬约束可能比近期闲聊更关键。
- **“缓存就是记忆”**：缓存复用计算，记忆决定保存和检索什么信息。

## 面试追问

> **面试官：** 如何验证摘要没有丢关键约束？
>
> **候选人：** 将原始历史中的约束、决策和待办作为标注集，检查摘要字段覆盖，并在下游任务做回归评测。

> **面试官：** 什么时候直接丢弃而不是摘要？
>
> **候选人：** 内容与当前及未来任务无关、可重新获取、不承担审计证据且符合删除策略时，可以丢弃。

> **面试官：** 工具返回一大段网页怎么处理？
>
> **候选人：** 先隔离为不可信数据，提取与当前问题相关的证据和来源引用，限制长度；需要复核时再按权限读取原文。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

常见方法有滑动窗口、阶段摘要、结构化事实抽取、相关性筛选、工具结果压缩和外部存储按需检索。生产中通常分层组合：固定保留系统政策、当前目标和未完成约束；近期消息保留原文；旧历史转成摘要；大体量证据外置，只把相关片段放回上下文。

压缩不是越短越好。要评测约束保留率、事实一致性、任务成功率、延迟和成本，并保留原始证据引用。Prompt caching 只复用相同前缀的计算，不会减少模型实际看到的信息，不能替代记忆压缩。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

- **滑动窗口**：成本低，但按时间硬截断可能丢失早期关键决策。
- **滚动或层级摘要**：用较短摘要替代旧对话，适合保留脉络，但会产生累计失真。
- **结构化抽取**：把目标、约束、决策、待办和实体事实写入字段，信息密度高，但依赖业务 schema。
- **选择性上下文**：按当前步骤检索相关消息、文档和工具结果，减少无关内容。

好的上下文通常由不同保真度层组成：不可变政策和用户明确约束保持原文；执行状态保持结构化；可重新获取的背景信息可以摘要；无关且可恢复的数据可以移出当前窗口。

摘要本身也是模型输出，应记录生成版本和覆盖范围。多次“摘要的摘要”会放大遗漏，关键字段应从结构化状态读取，而非只依赖自然语言摘要。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 设定 Token 预算时为模型输出和工具响应预留空间，不要把窗口全部用于历史。
- 压缩前识别“不可丢”项：用户目标、否决方案、权限、截止时间、已产生副作用和待审批动作。
- 摘要输出使用 schema，并校验实体、数字、否定和未完成项是否保留。
- 原始数据的访问沿用租户权限和保留期；外置不等于可以永久保存。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“窗口更大就不需要压缩”**：长上下文仍有成本、检索干扰和隐私暴露问题。
- **“摘要一次后长期准确”**：新信息可能使旧摘要过时，应版本化并定期校验。
- **“最近消息最重要”**：早期确认的硬约束可能比近期闲聊更关键。
- **“缓存就是记忆”**：缓存复用计算，记忆决定保存和检索什么信息。

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
- 12. Agent 记忆压缩通常有哪些方法？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
