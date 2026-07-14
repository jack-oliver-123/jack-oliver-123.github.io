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

# 25. 什么是 Speculative Decoding？Draft Model、验证和加速比怎么理解？

## Overview

解释 Draft Model 提案、Target Model 并行验证和拒绝采样校正，并分析接受率、延迟与硬件边界

## Learning Objectives

The viewer will understand:

1. 建立“什么是 Speculative Decoding？Draft Model、验证和加速比怎么理解？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

推测解码（Speculative Decoding）让成本较低的 Draft Model 连续提出多个 Token，再由 Target Model 一次前向并行验证。目标模型接受匹配其分布的前缀，在第一个不接受位置按校正分布采样，然后进入下一轮。标准算法在正确实现下保持 Target Model 的输出分布，而不是用小模型结果近似替换大模型。

速度取决于接受率、一次提案长度、Draft 成本、Target 并行验证效率和硬件利用率。Draft 太弱会频繁拒绝，太强又可能本身很贵；批量服务中，额外调度和显存也可能抵消收益。

## 详细解析

一轮标准流程如下：

1. Draft 根据当前前缀生成 $\gamma$ 个候选 Token，并记录其概率 $q$
2. Target 对这 $\gamma$ 个位置做一次并行前向，得到概率 $p$
3. 对每个候选按 $\min(1,p(x)/q(x))$ 的接受概率依次判断
4. 在首个拒绝位置从校正分布采样，保证最终分布与 Target 自回归采样一致

若整段候选都接受，还可从 Target 的下一位置分布额外采样一个 Token。一次 Target 调用因此可能产出多个 Token，减少串行 Decode 步数。

加速比不是“提案长度倍数”。粗略看，它由每轮接受的 Token 数除以 Draft 与验证耗时决定。高接受率、内存带宽受限的 Target 和低成本 Draft 更有利；若 Target 已在大批次下充分利用 GPU，推测解码的相对收益可能下降。

Draft 不一定是独立小模型。N-gram、Prompt Lookup、多 Token 预测头和 EAGLE 类特征预测都可提供候选，但它们的分布校正与实现边界不同。

## 工程实践与边界

压测要按输入/输出长度、批大小和采样策略分层，记录接受率、每轮接受 Token、TPOT、吞吐和额外显存。Draft 与 Target 的 Tokenizer 必须兼容，聊天模板和停止规则也要一致。

质量回归不仅看最终文本，还要确认所用框架是否实现无偏校正。某些“speculative”模式为追求速度采用近似接受，可能改变输出分布，必须按产品文档区分。

## 常见误区

- **认为小模型替大模型作答**：最终候选由 Target 验证并校正
- **认为质量不会变化是所有实现的保证**：只适用于满足算法条件的精确实现
- **只追求高接受率**：更大的 Draft 可能提高接受率，却增加每轮成本
- **忽略批量场景**：单请求加速不等于集群吞吐提升

## 面试追问

**问：Draft 和 Target 越相似越好吗？**

**答：** 相似通常提高接受率，但 Draft 成本也可能上升。应优化端到端延迟，而不是单独优化接受率。

**问：为什么 Target 能一次验证多个 Token？**

**答：** 候选序列已由 Draft 给出，Target 可像教师强制训练一样并行计算这些位置的条件分布，再按顺序执行接受判断。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

推测解码（Speculative Decoding）让成本较低的 Draft Model 连续提出多个 Token，再由 Target Model 一次前向并行验证。目标模型接受匹配其分布的前缀，在第一个不接受位置按校正分布采样，然后进入下一轮。标准算法在正确实现下保持 Target Model 的输出分布，而不是用小模型结果近似替换大模型。

速度取决于接受率、一次提案长度、Draft 成本、Target 并行验证效率和硬件利用率。Draft 太弱会频繁拒绝，太强又可能本身很贵；批量服务中，额外调度和显存也可能抵消收益。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

一轮标准流程如下：

1. Draft 根据当前前缀生成 $\gamma$ 个候选 Token，并记录其概率 $q$
2. Target 对这 $\gamma$ 个位置做一次并行前向，得到概率 $p$
3. 对每个候选按 $\min(1,p(x)/q(x))$ 的接受概率依次判断
4. 在首个拒绝位置从校正分布采样，保证最终分布与 Target 自回归采样一致

若整段候选都接受，还可从 Target 的下一位置分布额外采样一个 Token。一次 Target 调用因此可能产出多个 Token，减少串行 Decode 步数。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

压测要按输入/输出长度、批大小和采样策略分层，记录接受率、每轮接受 Token、TPOT、吞吐和额外显存。Draft 与 Target 的 Tokenizer 必须兼容，聊天模板和停止规则也要一致。

质量回归不仅看最终文本，还要确认所用框架是否实现无偏校正。某些“speculative”模式为追求速度采用近似接受，可能改变输出分布，必须按产品文档区分。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **认为小模型替大模型作答**：最终候选由 Target 验证并校正
- **认为质量不会变化是所有实现的保证**：只适用于满足算法条件的精确实现
- **只追求高接受率**：更大的 Draft 可能提高接受率，却增加每轮成本
- **忽略批量场景**：单请求加速不等于集群吞吐提升

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 3. 对每个候选按 $\min(1,p(x)/q(x))$ 的接受概率依次判断

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
- 25. 什么是 Speculative Decoding？Draft Model、验证和加速比怎么理解？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
