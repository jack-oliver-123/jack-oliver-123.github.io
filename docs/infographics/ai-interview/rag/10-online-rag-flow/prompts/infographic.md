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

# 10. 你使用 RAG 给大模型一个输入，系统是怎样的工作流程？

## Overview

拆解 RAG 在线处理流程，梳理用户输入、Query 改写、向量检索、重排、Prompt 拼接和生成输出的协作链路

## Learning Objectives

The viewer will understand:

1. 复述“你使用 RAG 给大模型一个输入，系统是怎样的工作流程？”的关键流程与控制点
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

在线链路从请求上下文开始，而不是从向量化开始：先认证用户、确定租户与可访问范围，再做输入安全检查和查询理解。系统生成一个或多个检索查询，从稠密、稀疏或结构化数据源召回候选，应用 ACL、版本和时效过滤，融合后重排并去重。

随后在 token 预算内组装带来源 ID 的上下文，提示模型依据证据回答并允许证据不足。服务端校验结构、引用和敏感内容后返回结果，同时记录各阶段 trace、索引与模型版本，用于评测、告警和复现。

## 详细解析

### 请求与检索计划

会话问题可能包含“它”“上一个方案”等指代，系统可以结合有限会话状态生成独立检索查询，但不能让改写改变原意。对于简单事实可直接检索；复合问题可拆分；需要实时数据或动作时应调用权威 API，而不是只搜静态索引。

### 候选处理

稠密检索擅长语义匹配，BM25 擅长精确词项，结构化查询处理明确字段。各路分数不可直接假定同尺度，可用 RRF 等基于排名的方法融合，再用 cross-encoder 或其他 reranker 排序。ACL 必须在内容进入模型前生效。

### 生成与后处理

上下文应标记来源、版本与时间，删除重复片段，并为关键证据保留足够上下文。生成后检查引用是否存在、输出 schema 是否有效，以及回答是否包含不被证据支持的高风险陈述。失败时采用可解释降级，而不是静默回退到无依据生成。

## 工程实践与边界

```text
auth -> normalize -> plan -> retrieve -> ACL/filter -> fuse/rerank
     -> pack context -> generate -> validate/cite -> observe
```

- 给每阶段独立超时和错误策略；重排超时可回退到已过滤候选，但不能绕过 ACL。
- trace 中记录 ID 和哈希，敏感正文按最小必要原则保存。
- 缓存键包含租户、权限、查询、索引版本和模型配置，避免跨权限复用。
- 对索引切换、模型切换和提示模板分别灰度，便于归因与回滚。

## 常见误区

- **“先检索再做权限过滤也没关系”**：候选若已进入不受控日志或模型，风险已经发生。
- **“多 Query 总能提高效果”**：它也会扩大噪声、成本和注入面。
- **“各路分数归一化后可直接相加”**：分数分布和校准不同，需要验证融合方法。
- **“生成失败就直接调用裸模型”**：这可能违反证据与合规契约。

## 面试追问

1. **如何设置超时预算？** 从端到端 SLO 反推各阶段预算，按历史分位数和业务重要性分配，并预留网络与重试空间。
2. **引用如何映射？** 上下文块使用不可歧义的内部 ID，生成结果引用 ID，服务端再解析为用户可访问的来源。
3. **如何处理查询改写失败？** 保留原查询作为一路召回，比较改写与原查询结果，并在低置信度时不改写。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

在线链路从请求上下文开始，而不是从向量化开始：先认证用户、确定租户与可访问范围，再做输入安全检查和查询理解。系统生成一个或多个检索查询，从稠密、稀疏或结构化数据源召回候选，应用 ACL、版本和时效过滤，融合后重排并去重。

随后在 token 预算内组装带来源 ID 的上下文，提示模型依据证据回答并允许证据不足。服务端校验结构、引用和敏感内容后返回结果，同时记录各阶段 trace、索引与模型版本，用于评测、告警和复现。

**Visual Element**: Type: numbered process node; Subject: 60 秒回答；Treatment: 从左到右连接并标明第 1 阶段

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 请求与检索计划
会话问题可能包含“它”“上一个方案”等指代，系统可以结合有限会话状态生成独立检索查询，但不能让改写改变原意。

### 候选处理
稠密检索擅长语义匹配，BM25 擅长精确词项，结构化查询处理明确字段。

### 生成与后处理
上下文应标记来源、版本与时间，删除重复片段，并为关键证据保留足够上下文。

**Visual Element**: Type: numbered process node; Subject: 详细解析；Treatment: 从左到右连接并标明第 2 阶段

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

```text
auth -> normalize -> plan -> retrieve -> ACL/filter -> fuse/rerank
     -> pack context -> generate -> validate/cite -> observe
```

- 给每阶段独立超时和错误策略；重排超时可回退到已过滤候选，但不能绕过 ACL。
- trace 中记录 ID 和哈希，敏感正文按最小必要原则保存。
- 缓存键包含租户、权限、查询、索引版本和模型配置，避免跨权限复用。
- 对索引切换、模型切换和提示模板分别灰度，便于归因与回滚。

**Visual Element**: Type: numbered process node; Subject: 工程实践与边界；Treatment: 从左到右连接并标明第 3 阶段

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“先检索再做权限过滤也没关系”**：候选若已进入不受控日志或模型，风险已经发生。
- **“多 Query 总能提高效果”**：它也会扩大噪声、成本和注入面。
- **“各路分数归一化后可直接相加”**：分数分布和校准不同，需要验证融合方法。
- **“生成失败就直接调用裸模型”**：这可能违反证据与合规契约。

**Visual Element**: Type: numbered process node; Subject: 常见误区；Treatment: 从左到右连接并标明第 4 阶段

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 稠密检索擅长语义匹配，BM25 擅长精确词项，结构化查询处理明确字段。各路分数不可直接假定同尺度，可用 RRF 等基于排名的方法融合，再用 cross-encoder 或其他 reranker 排序。ACL 必须在内容进入模型前生效。

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
- 10. 你使用 RAG 给大模型一个输入，系统是怎样的工作流程？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
