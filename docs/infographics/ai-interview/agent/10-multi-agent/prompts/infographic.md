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

# 10. 什么是 Multi-Agent？

## Overview

系统介绍 Multi-Agent 的基本概念、协作方式和角色分工，梳理多智能体系统相比单 Agent 的适用场景

## Learning Objectives

The viewer will understand:

1. 建立“什么是 Multi-Agent？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

Multi-Agent 是由多个具有独立角色、上下文或工具权限的 Agent 协作完成任务的系统。价值不在“多”，而在明确的职责分工：不同 Agent 可以并行处理独立子任务、使用不同专业上下文。高风险能力只有在专门 Agent 使用独立运行时身份、最小权限凭据和服务端授权时才形成隔离；仅更换 system prompt 或角色名称不构成安全边界。

常见组织方式有中心编排、受控 handoff 和共享任务空间。系统必须定义任务分配、消息契约、状态所有权、完成判定和失败恢复。若一个 Agent 加普通 Workflow 就能完成任务，多 Agent 往往只会增加通信、延迟、成本和故障面。

## 详细解析

多 Agent 的独立性通常体现在四个方面：各自的系统指令、可见上下文、工具集合和运行状态。仅用多个提示串行调用同一个模型，不一定需要称为多 Agent；是否有独立职责和协作协议更重要。

常见拓扑包括：

- **中心编排**：Orchestrator 拆分任务、调度 Worker、跟踪依赖并聚合结果，控制和审计最清晰。
- **Handoff**：当前 Agent 根据条件把会话和必要状态交给另一个专长 Agent，适合客服或分域助手。
- **共享任务空间**：Agent 通过任务队列或黑板读取和发布成果，适合松耦合并行，但需要更强的一致性与完成检测。

多 Agent 不能自动解决上下文问题。信息在 Agent 之间传递仍要选择摘要、原始证据和权限边界；摘要不足会丢约束，传递过多又会复制噪声和敏感数据。

## 工程实践与边界

- 每个 Agent 声明能力、输入输出 schema、请求的工具和数据作用域；实际授权由运行时根据可信身份和策略计算。
- Orchestrator 维护任务图和唯一状态源，Worker 不直接修改其他 Worker 的私有状态。
- 消息携带 task_id、sender、recipient、schema_version、correlation_id 和幂等键。
- 并行 Worker 的结果必须保留来源；聚合器处理冲突，不把多数意见等同于事实。
- 跨组织 Agent 通信需要双向身份验证、授权、限流和审计，不能只信任 Agent Card 或自报能力。

## 常见误区

- **“复杂任务就上 Multi-Agent”**：步骤多可以由一个 Agent 或 Workflow 完成，只有隔离、并行或专业边界带来净收益时才值得。
- **“多个模型投票就更正确”**：相关模型可能共享同一偏差，投票不能替代外部证据。
- **“上下文拆开就没有记忆压力”**：跨 Agent 的状态同步和摘要本身会产生新成本。
- **“协议解决协作逻辑”**：Agent2Agent（A2A）等协议提供互操作基础，任务语义和业务治理仍需应用定义。

## 面试追问

> **面试官：** Multi-Agent 的最小收益证据是什么？
>
> **候选人：** 在相同任务集上，相比单 Agent 基线，在成功率、关键路径延迟或权限隔离上有可测提升，并且抵消通信和运维成本。

> **面试官：** 谁判断整体任务完成？
>
> **候选人：** 中心编排模式由 Orchestrator 根据任务图和验收条件判断；分布式模式也需要明确的完成协议，不能让各 Agent 自行猜测。

> **面试官：** Agent 之间传什么？
>
> **候选人：** 传任务契约、必要状态、已验证产物和证据引用，避免复制完整对话、密钥或无关的个人可识别信息（PII）。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

Multi-Agent 是由多个具有独立角色、上下文或工具权限的 Agent 协作完成任务的系统。价值不在“多”，而在明确的职责分工：不同 Agent 可以并行处理独立子任务、使用不同专业上下文。高风险能力只有在专门 Agent 使用独立运行时身份、最小权限凭据和服务端授权时才形成隔离；仅更换 system prompt 或角色名称不构成安全边界。

常见组织方式有中心编排、受控 handoff 和共享任务空间。系统必须定义任务分配、消息契约、状态所有权、完成判定和失败恢复。若一个 Agent 加普通 Workflow 就能完成任务，多 Agent 往往只会增加通信、延迟、成本和故障面。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

多 Agent 的独立性通常体现在四个方面：各自的系统指令、可见上下文、工具集合和运行状态。仅用多个提示串行调用同一个模型，不一定需要称为多 Agent；是否有独立职责和协作协议更重要。

常见拓扑包括：

- **中心编排**：Orchestrator 拆分任务、调度 Worker、跟踪依赖并聚合结果，控制和审计最清晰。
- **Handoff**：当前 Agent 根据条件把会话和必要状态交给另一个专长 Agent，适合客服或分域助手。
- **共享任务空间**：Agent 通过任务队列或黑板读取和发布成果，适合松耦合并行，但需要更强的一致性与完成检测。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 每个 Agent 声明能力、输入输出 schema、请求的工具和数据作用域；实际授权由运行时根据可信身份和策略计算。
- Orchestrator 维护任务图和唯一状态源，Worker 不直接修改其他 Worker 的私有状态。
- 消息携带 task_id、sender、recipient、schema_version、correlation_id 和幂等键。
- 并行 Worker 的结果必须保留来源；聚合器处理冲突，不把多数意见等同于事实。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“复杂任务就上 Multi-Agent”**：步骤多可以由一个 Agent 或 Workflow 完成，只有隔离、并行或专业边界带来净收益时才值得。
- **“多个模型投票就更正确”**：相关模型可能共享同一偏差，投票不能替代外部证据。
- **“上下文拆开就没有记忆压力”**：跨 Agent 的状态同步和摘要本身会产生新成本。
- **“协议解决协作逻辑”**：Agent2Agent（A2A）等协议提供互操作基础，任务语义和业务治理仍需应用定义。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- **“协议解决协作逻辑”**：Agent2Agent（A2A）等协议提供互操作基础，任务语义和业务治理仍需应用定义。

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
- 10. 什么是 Multi-Agent？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
