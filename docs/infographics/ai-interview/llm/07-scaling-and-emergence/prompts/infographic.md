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

# 7. 什么是 Scaling Law？大模型的「涌现能力」是怎么回事？

## Overview

解释经验 Scaling Law、计算最优训练和涌现现象，并说明曲线外推与指标选择的限制

## Learning Objectives

The viewer will understand:

1. 建立“什么是 Scaling Law？大模型的「涌现能力」是怎么回事？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

Scaling Law 是在给定模型族、数据分布和训练方法下，损失随参数、数据和计算量变化的经验幂律。它可用于预算和规模规划，但不是跨架构不变的物理定律。Chinchilla 工作进一步表明，在固定计算预算下，参数量和训练 Token 要一起扩展，过大的模型配过少数据可能不是计算最优。

“涌现”指某些能力在规模增加后看起来突然出现。部分跳变来自离散或非线性指标：底层概率平滑提升，准确率却在跨过阈值后突然上升；另一些能力可能确有阶段性变化。判断时要看连续指标、多个规模点、置信区间和数据污染，而不是只看一张排行榜。

## 详细解析

早期工作常用类似下面的形式拟合交叉熵损失：

$
L(x)=L_\infty+Ax^{-\alpha}
$

$x$ 可以是参数量、数据量或计算量，系数只对对应实验范围有效。曲线能回答“在相同配方附近增加预算，损失大致怎么变”，不能直接推导某项产品能力、事实正确率或安全性。

计算最优训练研究把总 FLOPs 作为约束，联合选择模型参数和 Token 数。结论会随数据质量、重复使用、优化器、稀疏架构和推理成本改变。训练计算最优也不等于生命周期成本最优：更小且训练更久的模型可能训练划算，但请求量很大时还要考虑长期推理成本。

分析涌现时应区分：

- **底层连续量**：负对数似然、正确选项概率、校准误差
- **阈值指标**：Exact Match、pass@1、是否完成整条任务
- **评测变化**：Prompt、评分器、样本难度和污染情况
- **系统能力**：模型加检索、工具和采样预算后的总体表现

若连续得分平滑而二值准确率跳变，指标阈值是重要解释；若不同指标和复现实验都显示结构变化，再讨论能力相变更稳妥。

## 工程实践与边界

用 Scaling Law 做规划时，先以同一数据配方训练多个小规模试验点，拟合曲线并保留外推误差。模型、Token 和计算口径要一致，MoE 还要区分总参数与每 Token 激活参数。

产品评测应单独建立。训练损失下降可能没有改善拒答、安全或工具执行，甚至会使某些风险上升。规模决策还要计入推理延迟、能耗和部署硬件。

## 常见误区

- **把经验律当作保证**：改变数据、架构或训练方法后需要重新拟合
- **只扩大参数**：固定计算下，数据不足会浪费容量
- **把单项准确率跳变当作意识或通用推理**：阈值指标可能制造视觉上的突变
- **忽略置信区间**：少量样本的跳变可能落在测量噪声内

## 面试追问

**问：Chinchilla 结论是否要求参数量和 Token 数严格按固定比例？**

**答：** 不是。论文给出其模型族和预算范围内的经验最优趋势。数据质量、重复训练和推理成本变化后，应重新估计。

**问：如何验证某项能力是否真正涌现？**

**答：** 增加规模采样点，改用连续评分，报告误差条，并控制 Prompt、污染和评分器。再检查不同任务和模型族能否复现。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

Scaling Law 是在给定模型族、数据分布和训练方法下，损失随参数、数据和计算量变化的经验幂律。它可用于预算和规模规划，但不是跨架构不变的物理定律。Chinchilla 工作进一步表明，在固定计算预算下，参数量和训练 Token 要一起扩展，过大的模型配过少数据可能不是计算最优。

“涌现”指某些能力在规模增加后看起来突然出现。部分跳变来自离散或非线性指标：底层概率平滑提升，准确率却在跨过阈值后突然上升；另一些能力可能确有阶段性变化。判断时要看连续指标、多个规模点、置信区间和数据污染，而不是只看一张排行榜。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

早期工作常用类似下面的形式拟合交叉熵损失：

$
L(x)=L_\infty+Ax^{-\alpha}
$

$x$ 可以是参数量、数据量或计算量，系数只对对应实验范围有效。曲线能回答“在相同配方附近增加预算，损失大致怎么变”，不能直接推导某项产品能力、事实正确率或安全性。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

用 Scaling Law 做规划时，先以同一数据配方训练多个小规模试验点，拟合曲线并保留外推误差。模型、Token 和计算口径要一致，MoE 还要区分总参数与每 Token 激活参数。

产品评测应单独建立。训练损失下降可能没有改善拒答、安全或工具执行，甚至会使某些风险上升。规模决策还要计入推理延迟、能耗和部署硬件。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **把经验律当作保证**：改变数据、架构或训练方法后需要重新拟合
- **只扩大参数**：固定计算下，数据不足会浪费容量
- **把单项准确率跳变当作意识或通用推理**：阈值指标可能制造视觉上的突变
- **忽略置信区间**：少量样本的跳变可能落在测量噪声内

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- **阈值指标**：Exact Match、pass@1、是否完成整条任务

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
- 7. 什么是 Scaling Law？大模型的「涌现能力」是怎么回事？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
