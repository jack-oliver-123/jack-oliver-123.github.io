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

# 8. 请你介绍一下 AI Agent 的记忆机制，并说明在实际开发中应该如何设计记忆模块？

## Overview

系统介绍 AI Agent 的短期记忆、长期记忆和记忆检索机制，梳理实际开发中记忆模块的设计思路

## Learning Objectives

The viewer will understand:

1. 复述“请你介绍一下 AI Agent 的记忆机制，并说明在实际开发中应该如何设计记忆模块？”的关键流程与控制点
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

Agent 记忆不是统一标准，而是一组状态管理策略。我会区分当前运行状态、会话历史和跨会话记忆：运行状态要求精确、一致且可恢复；会话历史要做上下文裁剪；长期记忆只保存未来任务可能复用的信息，并按结构化查询或语义检索取回。

设计时回答四个问题：为什么存、存什么、按什么作用域存、何时删除。偏好和事实用结构化存储，文档或事件摘要可用向量检索，原始证据放对象存储并保留引用。所有读写必须带租户和用户边界，对个人可识别信息（PII）提供同意、保留期、更正和删除机制。

## 详细解析

工程上常见的记忆形态包括：

- **工作状态**：任务目标、计划、已完成步骤、工具调用 ID 和预算，要求可精确恢复。
- **会话记忆**：最近消息、工具观察和阶段摘要，主要用于保持当前对话连贯。
- **情节记忆**：某次任务发生了什么、结果如何，适合复用历史案例。
- **语义记忆**：用户偏好、业务事实或从多个事件提炼的知识。
- **程序性记忆**：受版本控制的提示、规则或操作流程，通常应由系统治理，而非让模型任意改写。

这是一种实用分类，不是唯一标准。关键是让不同数据使用合适的存储和一致性。账户余额不能靠向量相似度召回；文档相关片段也不适合只用键值精确匹配。

记忆链路分为写入、整理、检索和使用。写入前做价值判断、敏感数据分类和作用域标注；整理阶段去重、版本化并处理冲突；检索时结合身份过滤、时间、关键词和向量相似度；使用时只把必要片段注入上下文，并附来源与更新时间。

## 工程实践与边界

- 数据模型至少包含 tenant_id、user_id、source、created_at、valid_from、valid_to、sensitivity 和 version。
- 检索先做权限过滤，再做排序；不能先跨租户向量搜索后在应用层过滤。
- 用户的新陈述与旧记忆冲突时保留版本和来源，不让模型静默覆盖权威系统记录。
- 记忆写入使用最少数据原则；密钥、认证令牌和完整支付信息不进入模型记忆。
- 删除需要覆盖主存、向量索引、缓存和派生摘要，并记录可审计的删除任务状态。

## 常见误区

- **“长期记忆就是向量数据库”**：结构化事实、任务状态和审计记录需要其他存储。
- **“对话都应该存”**：无差别写入会增加隐私风险和召回噪声。
- **“相似就是真实”**：向量相似度只表示语义接近，不代表时效、权限或事实正确。
- **“摘要可以替代原始证据”**：摘要可能遗漏细节，应保留必要的证据引用和版本。

## 面试追问

> **面试官：** 什么内容值得进入长期记忆？
>
> **候选人：** 未来任务复用价值明确、来源可追溯、作用域清晰且用户允许保存的信息；临时工具输出和私有推理通常不应保存。

> **面试官：** 如何防止跨租户泄露？
>
> **候选人：** 从身份上下文生成不可伪造的租户过滤条件，在存储层执行行级或分区隔离，并用越权测试验证。

> **面试官：** 记忆召回后直接放进系统提示吗？
>
> **候选人：** 不直接提升为指令。记忆是可能过时或被污染的数据，应标注来源、验证关键事实，并与系统政策分层。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

Agent 记忆不是统一标准，而是一组状态管理策略。我会区分当前运行状态、会话历史和跨会话记忆：运行状态要求精确、一致且可恢复；会话历史要做上下文裁剪；长期记忆只保存未来任务可能复用的信息，并按结构化查询或语义检索取回。

设计时回答四个问题：为什么存、存什么、按什么作用域存、何时删除。偏好和事实用结构化存储，文档或事件摘要可用向量检索，原始证据放对象存储并保留引用。所有读写必须带租户和用户边界，对个人可识别信息（PII）提供同意、保留期、更正和删除机制。

**Visual Element**: Type: numbered process node; Subject: 60 秒回答；Treatment: 从左到右连接并标明第 1 阶段

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

工程上常见的记忆形态包括：

- **工作状态**：任务目标、计划、已完成步骤、工具调用 ID 和预算，要求可精确恢复。
- **会话记忆**：最近消息、工具观察和阶段摘要，主要用于保持当前对话连贯。
- **情节记忆**：某次任务发生了什么、结果如何，适合复用历史案例。
- **语义记忆**：用户偏好、业务事实或从多个事件提炼的知识。

这是一种实用分类，不是唯一标准。关键是让不同数据使用合适的存储和一致性。账户余额不能靠向量相似度召回；文档相关片段也不适合只用键值精确匹配。

记忆链路分为写入、整理、检索和使用。写入前做价值判断、敏感数据分类和作用域标注；整理阶段去重、版本化并处理冲突；检索时结合身份过滤、时间、关键词和向量相似度；使用时只把必要片段注入上下文，并附来源与更新时间。

**Visual Element**: Type: numbered process node; Subject: 详细解析；Treatment: 从左到右连接并标明第 2 阶段

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 数据模型至少包含 tenant_id、user_id、source、created_at、valid_from、valid_to、sensitivity 和 version。
- 检索先做权限过滤，再做排序；不能先跨租户向量搜索后在应用层过滤。
- 用户的新陈述与旧记忆冲突时保留版本和来源，不让模型静默覆盖权威系统记录。
- 记忆写入使用最少数据原则；密钥、认证令牌和完整支付信息不进入模型记忆。

**Visual Element**: Type: numbered process node; Subject: 工程实践与边界；Treatment: 从左到右连接并标明第 3 阶段

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“长期记忆就是向量数据库”**：结构化事实、任务状态和审计记录需要其他存储。
- **“对话都应该存”**：无差别写入会增加隐私风险和召回噪声。
- **“相似就是真实”**：向量相似度只表示语义接近，不代表时效、权限或事实正确。
- **“摘要可以替代原始证据”**：摘要可能遗漏细节，应保留必要的证据引用和版本。

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
- 8. 请你介绍一下 AI Agent 的记忆机制，并说明在实际开发中应该如何设计记忆模块？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
