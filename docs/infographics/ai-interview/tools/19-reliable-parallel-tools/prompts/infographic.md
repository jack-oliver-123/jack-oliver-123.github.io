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

# 19. 并行工具调用中如何处理超时、重试、幂等与补偿？

## Overview

介绍并行工具调用的可靠性设计，覆盖依赖分析、截止时间、重试分类、幂等键和补偿事务

## Learning Objectives

The viewer will understand:

1. 复述“并行工具调用中如何处理超时、重试、幂等与补偿？”的关键流程与控制点
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

👔面试官：模型一次返回多个工具调用，全部并行执行可以吗？

🙋我：只有无数据依赖且副作用不冲突的调用才能并行，其他调用要按依赖图排序。

👔面试官：请求超时后直接重试呢？

🙋我：先判断是否可重试，并确认上一次是否已执行；写操作要靠幂等键或状态查询。

## 60 秒回答

先把调用构造成依赖图：互不依赖的读操作可并行，后一步依赖前一步结果或共享同一资源的写操作要串行。为整次任务设置截止时间，再给各工具分配更短预算；取消等待不代表远端执行已停止。

重试只用于瞬时且可安全重放的失败，并采用次数上限、指数退避和抖动。副作用工具用业务幂等键去重，不能只依赖模型 call ID。跨系统操作无法原子回滚时，记录状态并执行语义补偿，同时保留人工介入和审计。

## 详细解析

### 并行前先做依赖分析

查询天气和查询汇率可以并行；“创建订单”和“支付该订单”有数据依赖；两个修改同一库存的操作即使参数独立，也可能有并发冲突。宿主应根据工具元数据和业务键建立 DAG，而不是相信模型返回数组的顺序。

并行结果可能乱序返回，必须用调用 ID 关联。部分成功时，向模型提供每个调用的结构化状态，不能把整批归为一个模糊错误。

### 截止时间与重试

任务截止时间是用户愿意等待的上限，单工具超时只是其中一段预算。连接、读取和执行阶段可分别设限。超时后先取消本地等待，再查询远端状态。

适合重试的通常是限流、短暂网络错误和服务不可用。不适合自动重试的包括参数错误、权限拒绝和明确业务冲突。多层系统只能选一层主导重试，避免次数相乘。

### 幂等与补偿

幂等键应绑定业务动作，例如“租户、订单、操作类型、请求 nonce”，并由执行端持久化结果。模型重新生成的 call ID 可能变化，不能承担业务去重。

补偿不是数据库回滚。退款、撤销预留或删除草稿都是新的业务动作，可能失败，也要幂等和审计。高风险流程应有可查询状态机和人工处理队列。

## 工程实践与边界

工具元数据至少声明 read/write、幂等性、可重试错误、资源键和默认超时。Host 在执行前做参数校验和授权，并为高风险动作请求确认。审计记录原始意图、规范化参数、每次尝试、结果与补偿。

模型输出和工具结果都可能含提示注入。重试时复用已校验参数，不要把错误文本无条件交给模型改写后再次执行。

## 常见误区

- **多个调用就应该并行**：数据依赖和写冲突决定调度
- **超时等于失败且未执行**：远端可能已提交操作
- **call ID 就是幂等键**：新一轮模型调用可能生成新 ID
- **补偿能恢复原始世界状态**：外部通知、价格变化等副作用可能不可逆

## 面试追问

**追问：怎样避免重试风暴？**

限制次数，使用指数退避与抖动，集中在一层重试，并配合并发上限、熔断和服务端 Retry-After。

**追问：并行批次部分失败怎样回答用户？**

保留逐项状态，先返回已完成结果和失败原因；只有在业务允许时重试失败项，不能重放整批写操作。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

先把调用构造成依赖图：互不依赖的读操作可并行，后一步依赖前一步结果或共享同一资源的写操作要串行。为整次任务设置截止时间，再给各工具分配更短预算；取消等待不代表远端执行已停止。

重试只用于瞬时且可安全重放的失败，并采用次数上限、指数退避和抖动。副作用工具用业务幂等键去重，不能只依赖模型 call ID。跨系统操作无法原子回滚时，记录状态并执行语义补偿，同时保留人工介入和审计。

**Visual Element**: Type: numbered process node; Subject: 60 秒回答；Treatment: 从左到右连接并标明第 1 阶段

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 并行前先做依赖分析
查询天气和查询汇率可以并行；

并行结果可能乱序返回，必须用调用 ID 关联。部分成功时，向模型提供每个调用的结构化状态，不能把整批归为一个模糊错误。

### 截止时间与重试
任务截止时间是用户愿意等待的上限，单工具超时只是其中一段预算。

适合重试的通常是限流、短暂网络错误和服务不可用。不适合自动重试的包括参数错误、权限拒绝和明确业务冲突。多层系统只能选一层主导重试，避免次数相乘。

**Visual Element**: Type: numbered process node; Subject: 详细解析；Treatment: 从左到右连接并标明第 2 阶段

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

工具元数据至少声明 read/write、幂等性、可重试错误、资源键和默认超时。Host 在执行前做参数校验和授权，并为高风险动作请求确认。审计记录原始意图、规范化参数、每次尝试、结果与补偿。

模型输出和工具结果都可能含提示注入。重试时复用已校验参数，不要把错误文本无条件交给模型改写后再次执行。

**Visual Element**: Type: numbered process node; Subject: 工程实践与边界；Treatment: 从左到右连接并标明第 3 阶段

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **多个调用就应该并行**：数据依赖和写冲突决定调度
- **超时等于失败且未执行**：远端可能已提交操作
- **call ID 就是幂等键**：新一轮模型调用可能生成新 ID
- **补偿能恢复原始世界状态**：外部通知、价格变化等副作用可能不可逆

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
- 19. 并行工具调用中如何处理超时、重试、幂等与补偿？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
