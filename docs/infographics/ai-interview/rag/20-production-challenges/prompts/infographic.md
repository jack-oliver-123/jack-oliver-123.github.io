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

# 20. 在实际落地中，你觉得 RAG 最难的地方是哪里？

## Overview

分析 RAG 落地中的主要难点，梳理数据治理、切块策略、检索质量、评测体系和业务闭环的工程挑战

## Learning Objectives

The viewer will understand:

1. 建立“在实际落地中，你觉得 RAG 最难的地方是哪里？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

我认为最难的不是接入向量库，而是建立可持续的质量与治理闭环：数据持续变化，查询分布长尾，错误又可能来自解析、权限、检索、生成或来源冲突。没有可复现 trace 和分层评测，团队只能靠调 Prompt 猜原因。

生产方案要把 ACL、数据与索引版本、增量更新、灰度、回滚、新鲜度和延迟 SLO、评测方差、提示注入防护一起设计。先定义业务失败与上线门禁，再做最小可用链路，通过真实失败样本迭代，而不是一次堆满所有高级范式。

## 详细解析

### 数据治理比索引更长期

PDF 解析、重复内容、权威来源、有效时间和删除传播会持续变化。每个 chunk 必须能追溯源文档、版本与 ACL。同步管线需幂等、可对账，并把“源更新到可检索”的时间纳入 SLO。

### 质量归因与评测

一次回答应保存查询改写、候选、过滤、重排、最终上下文、模型和索引版本。离线集包含正常、长尾、无答案、冲突、权限和注入查询；检索、生成和端到端指标分开。模型裁判需要重复运行、报告方差并由人工样本校准。

### 安全和发布

文档内容是不可信输入，可能包含提示注入；系统指令与文档隔离，检索器和生成器遵循最小权限，工具调用另设批准边界。索引和模型分别版本化，影子验证、小流量灰度，指标异常时可以切回已知版本。

## 工程实践与边界

- 定义质量、P95/P99 延迟、错误率、可用性和新鲜度 SLO，并明确超时降级不能绕过权限。
- 缓存键绑定租户、ACL 与数据版本；缓存正文和回答都要支持删除失效。
- 建立每周失败分类与数据回流，但日志先去敏且只允许授权人员访问。
- 对重大变更一次只灰度一个主要变量，确保回归可归因。

## 常见误区

- **“最大难点是选哪个向量库”**：产品重要，但长期质量更多受数据、评测和运营流程影响。
- **“线上有监控就有质量闭环”**：延迟和错误率不能替代相关性、忠实度与权限正确性。
- **“加 Agent 可以自动修复长尾”**：也会引入循环、工具误用、成本和注入风险。
- **“Demo 准确就能上线”**：生产还要经受并发、更新、删除、故障和分布漂移。

## 面试追问

1. **只能先做三件事会选什么？** 稳定数据 lineage 与 ACL、可复现的分层评测、可灰度回滚的版本发布。
2. **如何推动质量闭环？** 统一失败分类和负责人，将线上样本变成去敏回归集，并把门禁接入发布流程。
3. **怎样处理安全与体验冲突？** 按风险分层；高风险严格引用或审批，低风险可更灵活，但权限边界始终不可降级。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

我认为最难的不是接入向量库，而是建立可持续的质量与治理闭环：数据持续变化，查询分布长尾，错误又可能来自解析、权限、检索、生成或来源冲突。没有可复现 trace 和分层评测，团队只能靠调 Prompt 猜原因。

生产方案要把 ACL、数据与索引版本、增量更新、灰度、回滚、新鲜度和延迟 SLO、评测方差、提示注入防护一起设计。先定义业务失败与上线门禁，再做最小可用链路，通过真实失败样本迭代，而不是一次堆满所有高级范式。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 数据治理比索引更长期
PDF 解析、重复内容、权威来源、有效时间和删除传播会持续变化。

### 质量归因与评测
一次回答应保存查询改写、候选、过滤、重排、最终上下文、模型和索引版本。

### 安全和发布
文档内容是不可信输入，可能包含提示注入；

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 定义质量、P95/P99 延迟、错误率、可用性和新鲜度 SLO，并明确超时降级不能绕过权限。
- 缓存键绑定租户、ACL 与数据版本；缓存正文和回答都要支持删除失效。
- 建立每周失败分类与数据回流，但日志先去敏且只允许授权人员访问。
- 对重大变更一次只灰度一个主要变量，确保回归可归因。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“最大难点是选哪个向量库”**：产品重要，但长期质量更多受数据、评测和运营流程影响。
- **“线上有监控就有质量闭环”**：延迟和错误率不能替代相关性、忠实度与权限正确性。
- **“加 Agent 可以自动修复长尾”**：也会引入循环、工具误用、成本和注入风险。
- **“Demo 准确就能上线”**：生产还要经受并发、更新、删除、故障和分布漂移。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 定义质量、P95/P99 延迟、错误率、可用性和新鲜度 SLO，并明确超时降级不能绕过权限。

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
- 20. 在实际落地中，你觉得 RAG 最难的地方是哪里？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
