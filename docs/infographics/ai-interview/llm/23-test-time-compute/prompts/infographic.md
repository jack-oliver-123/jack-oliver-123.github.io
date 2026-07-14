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

# 23. 什么是推理模型和 Test-Time Compute？为什么增加推理计算能提升效果？

## Overview

解释推理模型与 Test-Time Compute 的训练和推理机制，并说明搜索、验证、成本与收益边界

## Learning Objectives

The viewer will understand:

1. 建立“什么是推理模型和 Test-Time Compute？为什么增加推理计算能提升效果？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

推理模型通常经过专门后训练，能够在回答前分配更多 Token、采样或工具步骤处理复杂问题。Test-Time Compute 指权重固定后，为单个请求增加的推理计算，例如生成更长的中间步骤、并行采样多条候选、树搜索、调用代码执行器或让验证器筛选答案。

增加计算可能提高效果，因为它扩大了搜索范围，并允许模型分解问题和修正候选。但收益依赖任务、策略和验证器：简单任务会浪费预算，错误验证器会放大偏差，过长推理也可能偏离。生产系统应按难度动态分配预算，并用准确率、延迟和每次成功任务成本共同评估。

## 详细解析

推理时扩展主要有两条路线：

- **顺序扩展**：同一轨迹生成更多步骤，执行反思、回溯或工具调用
- **并行扩展**：采样多个独立候选，再用投票、奖励模型或可验证程序选择

顺序扩展能复用当前状态，但早期错误可能沿轨迹传播；并行扩展提高覆盖率，却需要更多 KV Cache 和批次资源。两者可组合，例如先并行生成计划，再对高分计划深入执行。

训练侧通常使用可验证奖励、拒绝采样或强化学习，让模型学会在预算内生成更有效的步骤。推理侧再设置最大 Token、候选数、工具次数和时间上限。因而“推理模型”不是只把普通模型的 `max_tokens` 调大，而是训练配方和运行策略的组合。

验证是扩展能否奏效的关键。数学和代码可用答案、单元测试或执行结果验证；开放问答只能依赖证据、人工或不完美的 Judge。验证器与目标不一致时，会出现 reward hacking 或选择表面更像正确答案的候选。

## 工程实践与边界

先建立单次生成基线，再逐步增加 Token、候选数或工具预算，绘制质量、P95 延迟和成本曲线。按请求难度做路由：规则任务走固定低预算，复杂且高价值任务才扩展。所有路径都要有总超时和取消传播。

不要把自然语言推理轨迹当作审计真相。保存可验证的计划、工具输入/输出、代码结果和最终证据；对外只返回任务所需的简短依据。

## 常见误区

- **把长回答等同于强推理**：额外 Token 只有在改善搜索或验证时才有价值
- **认为扩展收益单调**：预算增加后可能饱和或退化
- **只统计模型调用次数**：并行候选、验证器和工具都属于推理计算
- **忽略简单请求**：统一高预算会增加延迟且未必改善质量

## 面试追问

**问：如何做动态预算？**

**答：** 用问题类型、首轮置信特征或验证失败触发升级，并设置候选数、Token、工具和时间硬上限。路由器本身也要用隐藏集评测。

**问：多数投票为什么可能无效？**

**答：** 候选来自同一模型和 Prompt，错误高度相关。投票只在正确路径概率和候选多样性足够时改善结果。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

推理模型通常经过专门后训练，能够在回答前分配更多 Token、采样或工具步骤处理复杂问题。Test-Time Compute 指权重固定后，为单个请求增加的推理计算，例如生成更长的中间步骤、并行采样多条候选、树搜索、调用代码执行器或让验证器筛选答案。

增加计算可能提高效果，因为它扩大了搜索范围，并允许模型分解问题和修正候选。但收益依赖任务、策略和验证器：简单任务会浪费预算，错误验证器会放大偏差，过长推理也可能偏离。生产系统应按难度动态分配预算，并用准确率、延迟和每次成功任务成本共同评估。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

推理时扩展主要有两条路线：

- **顺序扩展**：同一轨迹生成更多步骤，执行反思、回溯或工具调用
- **并行扩展**：采样多个独立候选，再用投票、奖励模型或可验证程序选择

顺序扩展能复用当前状态，但早期错误可能沿轨迹传播；并行扩展提高覆盖率，却需要更多 KV Cache 和批次资源。两者可组合，例如先并行生成计划，再对高分计划深入执行。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

先建立单次生成基线，再逐步增加 Token、候选数或工具预算，绘制质量、P95 延迟和成本曲线。按请求难度做路由：规则任务走固定低预算，复杂且高价值任务才扩展。所有路径都要有总超时和取消传播。

不要把自然语言推理轨迹当作审计真相。保存可验证的计划、工具输入/输出、代码结果和最终证据；对外只返回任务所需的简短依据。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **把长回答等同于强推理**：额外 Token 只有在改善搜索或验证时才有价值
- **认为扩展收益单调**：预算增加后可能饱和或退化
- **只统计模型调用次数**：并行候选、验证器和工具都属于推理计算
- **忽略简单请求**：统一高预算会增加延迟且未必改善质量

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 先建立单次生成基线，再逐步增加 Token、候选数或工具预算，绘制质量、P95 延迟和成本曲线。按请求难度做路由：规则任务走固定低预算，复杂且高价值任务才扩展。所有路径都要有总超时和取消传播。

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
- 23. 什么是推理模型和 Test-Time Compute？为什么增加推理计算能提升效果？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
