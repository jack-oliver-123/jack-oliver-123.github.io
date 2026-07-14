Create a professional infographic following these specifications:

## Image Specifications

- **Type**: Infographic
- **Layout**: comparison-matrix
- **Style**: corporate-memphis
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

# comparison-matrix

Grid-based multi-factor comparison across multiple items.

## Structure

- Table/grid layout
- Rows: items being compared
- Columns: comparison criteria
- Cells: scores, checks, or values
- Header row and column clearly marked

## Best For

- Product feature comparisons
- Tool/software evaluations
- Multi-criteria decisions
- Specification sheets
- Rating comparisons

## Visual Elements

- Clear grid lines or cell boundaries
- Checkmarks, X marks, or scores in cells
- Color coding for quick scanning
- Icons for criteria categories
- Highlight for recommended option

## Text Placement

- Title at top
- Item names in first column
- Criteria in header row
- Brief values in cells
- Legend if using symbols

## Recommended Pairings

- `corporate-memphis`: Business tool comparisons
- `ui-wireframe`: Technical feature matrices
- `blueprint`: Specification comparisons


## Style Guidelines

# corporate-memphis

Flat vector people with vibrant geometric fills

## Color Palette

- Primary: Bright, saturated - purple, orange, teal, yellow
- Background: White or light pastels
- Accents: Gradient fills, geometric patterns

## Visual Elements

- Flat vector illustration
- Disproportionate human figures
- Abstract body shapes
- Floating geometric elements
- No outlines, solid fills
- Plant and object accents

## Typography

- Clean sans-serif
- Bold headings
- Professional but friendly
- Minimal decoration

## Best For

Business presentations, tech products, marketing materials, corporate training


---

Generate the infographic based on the content below:

# 17. Context Engineering 与 Prompt Engineering 有什么区别？

## Overview

对比 Context Engineering 与 Prompt Engineering，说明 Agent 如何选择、组织和治理运行时上下文

## Learning Objectives

The viewer will understand:

1. 比较“Context Engineering 与 Prompt Engineering 有什么区别？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

Prompt Engineering 主要优化给模型的指令表达、示例和输出约束；Context Engineering 关注一次模型调用前，系统如何从所有可用信息中选择、组织和治理模型真正看到的工作集。这个工作集包括系统政策、用户请求、工具描述、任务状态、记忆、检索证据和近期观察。

在 Agent 中，问题通常不是“有没有更多上下文”，而是“当前步骤需要哪些可信、最新、最小的信息”。好的 Context Engineering 要控制来源、权限、顺序、预算和生命周期，并防止外部数据中的注入内容被误当成高优先级指令。

## 详细解析

Prompt 是上下文的一部分。Prompt Engineering 会处理角色、任务描述、few-shot 示例、格式和拒答规则；Context Engineering 还包含运行时的数据管道：

1. 根据身份和任务确定可访问的数据与工具。
2. 从会话状态、长期记忆和知识源召回候选信息。
3. 去重、验证时效与来源，按当前步骤排序。
4. 在 Token 预算内组装上下文，并把政策、指令和不可信数据分层。
5. 执行后更新状态，决定哪些内容保留、压缩或删除。

上下文质量有四个维度：相关性、正确性、完整性和安全性。只追求召回更多内容会引入冲突与注意力稀释；只保留最近信息又可能丢失早期硬约束。长上下文窗口扩大容量，但不会自动解决排序、污染和权限问题。

Agent 的工具目录也是上下文。工具过多、描述重叠会使选择更难，因此可以按任务动态暴露最小工具集合，而不是每轮传递全部能力。

## 工程实践与边界

- 建立上下文清单，标明每段内容的 owner、source、trust_level、freshness、sensitivity 和 token_budget。
- 系统政策、用户指令、检索数据和工具观察使用明确分隔，不让网页文本覆盖系统政策。
- 先做租户与权限过滤，再做检索和重排；禁止跨租户候选进入模型上下文。
- 对个人可识别信息（PII）做最小化、脱敏和保留期管理；调试快照不能默认保存完整上下文。
- 用消融评测比较某类上下文加入前后的成功率、延迟和成本，删除无收益信息。

## 常见误区

- **“Context Engineering 是 Prompt Engineering 的新名字”**：前者还覆盖检索、状态、工具、权限与生命周期。
- **“窗口越长，上下文越好”**：无关、矛盾或恶意内容会随容量一起增加。
- **“检索结果可以当指令”**：外部内容是不可信数据，只能作为证据处理。
- **“所有历史都能帮助个性化”**：过期偏好和未授权 PII 可能造成错误与合规风险。

## 面试追问

> **面试官：** 上下文太长时先删什么？
>
> **候选人：** 先移除与当前步骤无关且可重新获取的信息，再压缩旧观察；系统政策、用户硬约束和未完成状态应优先保留。

> **面试官：** 如何发现上下文污染？
>
> **候选人：** 追踪每段上下文来源，建立含冲突、过期和注入内容的评测集，检查模型是否错误采纳低信任信息。

> **面试官：** 工具描述为什么也属于 Context Engineering？
>
> **候选人：** 模型依据描述选择动作；工具数量、重叠和参数说明会直接影响决策质量与上下文预算。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

Prompt Engineering 主要优化给模型的指令表达、示例和输出约束；Context Engineering 关注一次模型调用前，系统如何从所有可用信息中选择、组织和治理模型真正看到的工作集。这个工作集包括系统政策、用户请求、工具描述、任务状态、记忆、检索证据和近期观察。

在 Agent 中，问题通常不是“有没有更多上下文”，而是“当前步骤需要哪些可信、最新、最小的信息”。好的 Context Engineering 要控制来源、权限、顺序、预算和生命周期，并防止外部数据中的注入内容被误当成高优先级指令。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

Prompt 是上下文的一部分。Prompt Engineering 会处理角色、任务描述、few-shot 示例、格式和拒答规则；Context Engineering 还包含运行时的数据管道：

1. 根据身份和任务确定可访问的数据与工具。
2. 从会话状态、长期记忆和知识源召回候选信息。
3. 去重、验证时效与来源，按当前步骤排序。
4. 在 Token 预算内组装上下文，并把政策、指令和不可信数据分层。

上下文质量有四个维度：相关性、正确性、完整性和安全性。只追求召回更多内容会引入冲突与注意力稀释；只保留最近信息又可能丢失早期硬约束。长上下文窗口扩大容量，但不会自动解决排序、污染和权限问题。

Agent 的工具目录也是上下文。工具过多、描述重叠会使选择更难，因此可以按任务动态暴露最小工具集合，而不是每轮传递全部能力。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 建立上下文清单，标明每段内容的 owner、source、trust_level、freshness、sensitivity 和 token_budget。
- 系统政策、用户指令、检索数据和工具观察使用明确分隔，不让网页文本覆盖系统政策。
- 先做租户与权限过滤，再做检索和重排；禁止跨租户候选进入模型上下文。
- 对个人可识别信息（PII）做最小化、脱敏和保留期管理；调试快照不能默认保存完整上下文。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“Context Engineering 是 Prompt Engineering 的新名字”**：前者还覆盖检索、状态、工具、权限与生命周期。
- **“窗口越长，上下文越好”**：无关、矛盾或恶意内容会随容量一起增加。
- **“检索结果可以当指令”**：外部内容是不可信数据，只能作为证据处理。
- **“所有历史都能帮助个性化”**：过期偏好和未授权 PII 可能造成错误与合规风险。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

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
- 17. Context Engineering 与 Prompt Engineering 有什么区别？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
