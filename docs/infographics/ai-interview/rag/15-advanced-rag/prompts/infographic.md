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

# 15. 了解哪些更复杂的 RAG 范式？

## Overview

介绍 Self-RAG、Corrective RAG、Agentic RAG 等复杂 RAG 范式，梳理自检、纠错和多步检索的增强机制

## Learning Objectives

The viewer will understand:

1. 建立“了解哪些更复杂的 RAG 范式？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

复杂 RAG 的共同点是让“是否检索、检索什么、证据是否足够”变成可迭代决策。Self-RAG 在生成中引入检索与自我反思信号；CRAG 评估检索结果并在不可靠时采用纠正动作；RAPTOR 建立递归聚类与摘要树；GraphRAG 从实体关系与社区摘要支持全局问题；Agentic RAG 则让规划器多步选择查询和数据源。

这些方法不是简单的升级阶梯。它们增加模型调用、索引结构、延迟和失败模式。应先确定基础 RAG 的具体瓶颈，再用消融实验验证复杂机制是否改善目标查询。

## 详细解析

### 生成中的自检与纠正

Self-RAG 原论文通过特殊反思 token 学习何时检索并评价生成；它不等同于随便加一个“请反思”的 Prompt。CRAG 使用检索评估器区分结果质量，并采取知识精炼或补充搜索。实现复现应区分论文方法与工程上的简化版本。

### 层次与图结构

RAPTOR 对文本递归聚类并生成摘要，形成可在不同抽象层级检索的树。GraphRAG 构建实体关系图和社区摘要，适合需要跨文档全局理解的查询，但实体抽取、图更新和摘要生成带来额外成本与误差传播。

### 规划式检索

Agentic RAG 根据中间结果决定继续检索、换数据源或停止。它适合开放式、多跳和异构数据任务；简单 FAQ 使用固定管线通常更稳定、便宜且易评估。

## 工程实践与边界

- 给复杂策略设置最大步数、总 token、并发、工具权限与超时预算。
- 将每一步查询、证据、决策和停止原因写入 trace，支持重放。
- 分别评估基础 RAG 与新增策略，报告失败率和成本，不只报告成功案例。
- 外部网页或文档中的指令必须视为不可信数据，不能控制代理或覆盖系统策略。

## 常见误区

- **“高级范式普遍优于 Naive RAG”**：简单任务可能只增加延迟和错误面。
- **“Self-RAG 就是生成后再问模型一次”**：论文包含专门训练与反思信号。
- **“GraphRAG 等于图数据库加向量搜索”**：其流程还涉及图构建、社区检测与摘要。
- **“反思模型能证明自己正确”**：自评会受模型偏差影响，需要外部标注与人工校准。

## 面试追问

1. **如何选择范式？** 先按查询类型分析基础管线失败原因，再选择能直接处理该原因的机制。
2. **何时停止多步检索？** 结合证据充分度、边际新信息、预算和最大步数，且保留确定性上限。
3. **怎么评估 Agentic RAG？** 除答案质量外，评估步骤成功率、无效循环、工具错误、成本和安全违规。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

复杂 RAG 的共同点是让“是否检索、检索什么、证据是否足够”变成可迭代决策。Self-RAG 在生成中引入检索与自我反思信号；CRAG 评估检索结果并在不可靠时采用纠正动作；RAPTOR 建立递归聚类与摘要树；GraphRAG 从实体关系与社区摘要支持全局问题；Agentic RAG 则让规划器多步选择查询和数据源。

这些方法不是简单的升级阶梯。它们增加模型调用、索引结构、延迟和失败模式。应先确定基础 RAG 的具体瓶颈，再用消融实验验证复杂机制是否改善目标查询。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 生成中的自检与纠正
Self-RAG 原论文通过特殊反思 token 学习何时检索并评价生成；

### 层次与图结构
RAPTOR 对文本递归聚类并生成摘要，形成可在不同抽象层级检索的树。

### 规划式检索
Agentic RAG 根据中间结果决定继续检索、换数据源或停止。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 给复杂策略设置最大步数、总 token、并发、工具权限与超时预算。
- 将每一步查询、证据、决策和停止原因写入 trace，支持重放。
- 分别评估基础 RAG 与新增策略，报告失败率和成本，不只报告成功案例。
- 外部网页或文档中的指令必须视为不可信数据，不能控制代理或覆盖系统策略。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“高级范式普遍优于 Naive RAG”**：简单任务可能只增加延迟和错误面。
- **“Self-RAG 就是生成后再问模型一次”**：论文包含专门训练与反思信号。
- **“GraphRAG 等于图数据库加向量搜索”**：其流程还涉及图构建、社区检测与摘要。
- **“反思模型能证明自己正确”**：自评会受模型偏差影响，需要外部标注与人工校准。

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
- 15. 了解哪些更复杂的 RAG 范式？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
