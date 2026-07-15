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

# 13. 在工程实践中，为什么有时候选择「手搓」Agent，而不是直接用成熟框架？

## Overview

分析手搓 Agent 与成熟框架的取舍，梳理可控性、调试成本、业务适配和复杂系统落地中的工程考量

## Learning Objectives

The viewer will understand:

1. 建立“在工程实践中，为什么有时候选择「手搓」Agent，而不是直接用成熟框架？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

这不是“框架不好”，而是控制权与交付速度的取舍。原型阶段，成熟 SDK 或框架能快速提供工具调用、状态图、持久化和追踪；当核心流程很小、性能或合规要求高、需要精确控制状态与依赖时，手写薄编排层可能更容易审计和维护。

我的原则是先画清运行时契约，再选择最薄的满足方案。无论框架还是手写，都要固定版本、隔离供应商接口、做回归评测和故障演练。不要因为代码行数少就把关键状态、权限和重试交给不可理解的默认行为。

## 详细解析

框架的价值包括快速验证、统一抽象、生态集成和已有的持久化/可观测能力。它的代价可能是抽象层、升级迁移、隐藏默认值和依赖体积。但这些代价并非所有框架都相同，也不能用个别版本经验一概而论。

手写适合以下情况：

- 控制循环只有少量状态和工具，框架抽象比业务逻辑更复杂。
- 需要严格控制消息顺序、重试、副作用提交和数据流向。
- 团队需要长期支持稳定接口，且有能力自行维护测试与观测。
- 延迟、部署体积或依赖供应链有明确约束。

框架适合快速原型、复杂状态图、标准连接器多、团队希望采用统一模式的场景。折中做法通常最好：核心状态机和安全策略由业务代码掌握，模型客户端、协议适配、追踪或文档解析复用稳定组件。

## 工程实践与边界

- 为模型、工具、存储和追踪定义自有窄接口，避免业务代码直接依赖大量框架类型。
- 锁定依赖并阅读变更日志；升级前回放黄金轨迹、错误用例和安全用例。
- 框架默认重试必须审查，涉及副作用时要求幂等或关闭自动重试。
- 记录依赖许可证、软件物料清单和漏洞修复策略。
- 手写实现同样要有超时、取消、持久化、审计和测试，不能把“透明”误当成“可靠”。

## 常见误区

- **“手写性能更好”**：瓶颈常在模型与外部 I/O，应先测量。
- **“框架难调试”**：成熟框架可能提供完善追踪；关键是团队是否理解执行模型。
- **“核心逻辑手写就没有升级风险”**：底层 SDK、模型行为和协议仍会变化。
- **“POC 代码可以直接上线”**：原型默认值通常没有生产级权限和恢复语义。

## 面试追问

> **面试官：** 如何量化是否该移除框架？
>
> **候选人：** 用故障定位时间、升级成本、额外延迟、依赖风险和自维护成本对比，而不是只看代码行数。

> **面试官：** 手写最容易漏什么？
>
> **候选人：** 取消与超时传播、工具调用关联、幂等、检查点、敏感日志处理和完整的状态迁移测试。

> **面试官：** 如何避免供应商锁定？
>
> **候选人：** 用窄适配层统一核心能力，但不追求抹平所有厂商差异；对关键模型保留契约测试和替换演练。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

这不是“框架不好”，而是控制权与交付速度的取舍。原型阶段，成熟 SDK 或框架能快速提供工具调用、状态图、持久化和追踪；当核心流程很小、性能或合规要求高、需要精确控制状态与依赖时，手写薄编排层可能更容易审计和维护。

我的原则是先画清运行时契约，再选择最薄的满足方案。无论框架还是手写，都要固定版本、隔离供应商接口、做回归评测和故障演练。不要因为代码行数少就把关键状态、权限和重试交给不可理解的默认行为。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

框架的价值包括快速验证、统一抽象、生态集成和已有的持久化/可观测能力。它的代价可能是抽象层、升级迁移、隐藏默认值和依赖体积。但这些代价并非所有框架都相同，也不能用个别版本经验一概而论。

手写适合以下情况：

- 控制循环只有少量状态和工具，框架抽象比业务逻辑更复杂。
- 需要严格控制消息顺序、重试、副作用提交和数据流向。
- 团队需要长期支持稳定接口，且有能力自行维护测试与观测。
- 延迟、部署体积或依赖供应链有明确约束。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 为模型、工具、存储和追踪定义自有窄接口，避免业务代码直接依赖大量框架类型。
- 锁定依赖并阅读变更日志；升级前回放黄金轨迹、错误用例和安全用例。
- 框架默认重试必须审查，涉及副作用时要求幂等或关闭自动重试。
- 记录依赖许可证、软件物料清单和漏洞修复策略。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“手写性能更好”**：瓶颈常在模型与外部 I/O，应先测量。
- **“框架难调试”**：成熟框架可能提供完善追踪；关键是团队是否理解执行模型。
- **“核心逻辑手写就没有升级风险”**：底层 SDK、模型行为和协议仍会变化。
- **“POC 代码可以直接上线”**：原型默认值通常没有生产级权限和恢复语义。

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
- 13. 在工程实践中，为什么有时候选择「手搓」Agent，而不是直接用成熟框架？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
