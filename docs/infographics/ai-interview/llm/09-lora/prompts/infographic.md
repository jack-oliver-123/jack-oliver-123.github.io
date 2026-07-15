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

# 9. 请讲一下 LoRA 技术，除了减少参数量，它还有哪些优点？

## Overview

解释 LoRA 的低秩更新、初始化与合并方式，并分析多任务适配、显存和质量方面的工程取舍

## Learning Objectives

The viewer will understand:

1. 建立“请讲一下 LoRA 技术，除了减少参数量，它还有哪些优点？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

低秩适配（Low-Rank Adaptation，LoRA）冻结基座权重 $W$，只训练低秩增量 $BA$。如果原矩阵是 $d_{out}\times d_{in}$，LoRA 参数量约为 $r(d_{in}+d_{out})$，其中秩 $r$ 远小于原维度。除减少可训练参数外，它还能把不同任务保存为小型适配器、按需切换，并在部署前把增量合并到基座权重。

LoRA 不会按参数比例消除全部训练成本。前向/反向激活、基座权重和数据仍占资源；效果还取决于目标层、秩、缩放、数据和基座模型。是否优于全量微调要通过同一业务集验证。

## 详细解析

对线性层 $W\in\mathbb{R}^{d_{out}\times d_{in}}$，LoRA 使用：

$
y=Wx+\frac{\alpha}{r}BAx
$

其中 $A\in\mathbb{R}^{r\times d_{in}}$，$B\in\mathbb{R}^{d_{out}\times r}$。常见初始化让一个低秩矩阵随机、另一个为零，使训练开始时 $BA=0$，因此初始模型行为与基座一致。具体哪一个矩阵为零由实现约定决定，不应把变量名当作标准。

关键超参数包括：

- **目标模块**：只适配 Query/Value，或同时覆盖 Key、Output 与 FFN
- **秩 $r$**：控制更新子空间容量，不是越大越合适
- **缩放 $\alpha/r$**：控制增量幅度，需和学习率一起调
- **LoRA dropout**：只作用于适配路径，主要用于正则化
- **偏置与归一化参数**：可冻结，也可按任务选择训练

QLoRA 进一步把冻结基座以 4-bit 表示存储，并用高精度计算训练 LoRA。它降低基座显存，但引入量化格式、反量化内核和分页优化器等实现约束。

## 工程实践与边界

训练记录应绑定基座哈希、Tokenizer、聊天模板、目标模块、秩和精度。加载到不同版本基座即使维度相同，也可能产生不可预测结果。多租户动态适配器要限制来源和权限，避免加载未审核权重。

评测至少包含目标任务、通用能力、安全、延迟和显存。若部署框架支持批内不同适配器，还要测适配器切换与缓存对吞吐的影响。

## 常见误区

- **把秩理解为压缩率**：秩控制更新空间，质量与参数节省不是线性关系
- **认为冻结基座就没有反向成本**：仍需为适配路径计算梯度，并保存相关激活
- **认为适配器可跨基座通用**：它依赖具体层、权重和 Tokenizer 版本
- **合并后仍可零成本切换**：合并适合固定部署，动态切换需保留独立适配器

## 面试追问

**问：为什么 LoRA 初始增量通常设为零？**

**答：** 这样训练起点复现基座行为，优化从无扰动状态开始。若两个矩阵都为零，初始梯度传播会受阻，因此只把其中一个置零。

**问：如何选择秩？**

**答：** 从较小秩建立基线，再按验证集和目标层做消融。任务复杂度、数据量与模块覆盖比固定经验值更可靠。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

低秩适配（Low-Rank Adaptation，LoRA）冻结基座权重 $W$，只训练低秩增量 $BA$。如果原矩阵是 $d_{out}\times d_{in}$，LoRA 参数量约为 $r(d_{in}+d_{out})$，其中秩 $r$ 远小于原维度。除减少可训练参数外，它还能把不同任务保存为小型适配器、按需切换，并在部署前把增量合并到基座权重。

LoRA 不会按参数比例消除全部训练成本。前向/反向激活、基座权重和数据仍占资源；效果还取决于目标层、秩、缩放、数据和基座模型。是否优于全量微调要通过同一业务集验证。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

对线性层 $W\in\mathbb{R}^{d_{out}\times d_{in}}$，LoRA 使用：

$
y=Wx+\frac{\alpha}{r}BAx
$

其中 $A\in\mathbb{R}^{r\times d_{in}}$，$B\in\mathbb{R}^{d_{out}\times r}$。常见初始化让一个低秩矩阵随机、另一个为零，使训练开始时 $BA=0$，因此初始模型行为与基座一致。具体哪一个矩阵为零由实现约定决定，不应把变量名当作标准。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

训练记录应绑定基座哈希、Tokenizer、聊天模板、目标模块、秩和精度。加载到不同版本基座即使维度相同，也可能产生不可预测结果。多租户动态适配器要限制来源和权限，避免加载未审核权重。

评测至少包含目标任务、通用能力、安全、延迟和显存。若部署框架支持批内不同适配器，还要测适配器切换与缓存对吞吐的影响。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **把秩理解为压缩率**：秩控制更新空间，质量与参数节省不是线性关系
- **认为冻结基座就没有反向成本**：仍需为适配路径计算梯度，并保存相关激活
- **认为适配器可跨基座通用**：它依赖具体层、权重和 Tokenizer 版本
- **合并后仍可零成本切换**：合并适合固定部署，动态切换需保留独立适配器

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 其中 $A\in\mathbb{R}^{r\times d_{in}}$，$B\in\mathbb{R}^{d_{out}\times r}$。常见初始化让一个低秩矩阵随机、另一个为零，使训练开始时 $BA=0$，因此初始模型行为与基座一致。具体哪一个矩阵为零由实现约定决定，不应把变量名当作标准。
- QLoRA 进一步把冻结基座以 4-bit 表示存储，并用高精度计算训练 LoRA。它降低基座显存，但引入量化格式、反量化内核和分页优化器等实现约束。

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
- 9. 请讲一下 LoRA 技术，除了减少参数量，它还有哪些优点？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
