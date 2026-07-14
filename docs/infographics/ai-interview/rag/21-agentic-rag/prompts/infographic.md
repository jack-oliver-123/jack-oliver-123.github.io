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

# 21. 什么是 Agentic RAG？它和传统 RAG 有什么区别？

## Overview

解析 Agentic RAG 的规划、工具选择、多步检索和停止条件，并对比固定 RAG 管线的工程取舍

## Learning Objectives

The viewer will understand:

1. 比较“什么是 Agentic RAG？它和传统 RAG 有什么区别？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

传统 RAG 通常是预先定义的单次或固定多阶段管线：改写、检索、重排、生成。Agentic RAG 把部分控制流交给规划器，让它根据问题和中间证据决定是否检索、选择哪个数据源、如何拆分子问题、是否继续搜索或停止。

它适合多跳、开放式或跨异构系统的问题，但也增加循环、错误工具选择、延迟、成本和提示注入风险。生产实现必须限定工具权限、最大步数、预算和停止条件，记录每次决策，并与固定管线做消融。简单 FAQ 通常不需要代理化。

## 详细解析

### 从固定 DAG 到动态控制流

固定 RAG 的节点和顺序由工程师预先确定，行为可预测且易设 SLO。Agentic RAG 中，模型可以生成检索计划，执行一步后观察结果，再决定下一步。ReAct 展示了推理轨迹与动作交替的思路；后续 Agentic RAG 将检索器、数据库、网页或业务 API 作为受控工具。

### 核心组件

- **规划器**：识别子问题、依赖关系与数据源。
- **工具网关**：校验参数、权限、超时和返回大小。
- **证据状态**：保存已获取证据、来源与冲突，而非只累积自然语言历史。
- **停止器**：依据证据充分度、边际新信息、最大步数和预算结束。
- **验证器**：检查最终陈述与可访问证据的支持关系。

动态决策不等于完全自治。权限与预算必须由确定性代码强制执行，模型只能在授权集合内选择。

## 工程实践与边界

- 为每类查询设步骤上限、总 token、工具调用和墙钟时间预算。
- 将工具描述与返回内容分隔，外部内容不得修改系统策略。
- 对只需一次检索的问题走快速固定路径，复杂问题才进入代理流程。
- 评估答案、步骤成功率、无效循环、工具错误、安全违规和单位成功成本。

## 常见误区

- **“Agentic RAG 就是多查几次”**：关键是根据观察动态选择动作与停止，而非固定重复。
- **“模型可以自己判断权限”**：ACL 必须由服务端根据身份强制执行。
- **“反思能保证停止”**：模型可能循环，需要硬性步数和预算上限。
- **“复杂问题都要 Agent”**：确定性工作流往往更稳定，也更易测试。

## 面试追问

1. **怎么判断证据足够？** 结合子问题覆盖、来源质量、冲突和预算；模型评分只是信号，仍需硬上限。
2. **如何防止重复检索？** 对规范化查询和结果 ID 去重，跟踪边际新增证据，连续无新增时停止。
3. **怎么回放一次执行？** 保存状态转移、Prompt/模型版本、工具参数、结果哈希和决策原因。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

传统 RAG 通常是预先定义的单次或固定多阶段管线：改写、检索、重排、生成。Agentic RAG 把部分控制流交给规划器，让它根据问题和中间证据决定是否检索、选择哪个数据源、如何拆分子问题、是否继续搜索或停止。

它适合多跳、开放式或跨异构系统的问题，但也增加循环、错误工具选择、延迟、成本和提示注入风险。生产实现必须限定工具权限、最大步数、预算和停止条件，记录每次决策，并与固定管线做消融。简单 FAQ 通常不需要代理化。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 从固定 DAG 到动态控制流
固定 RAG 的节点和顺序由工程师预先确定，行为可预测且易设 SLO。

### 核心组件
- **规划器**：识别子问题、依赖关系与数据源。

动态决策不等于完全自治。权限与预算必须由确定性代码强制执行，模型只能在授权集合内选择。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 为每类查询设步骤上限、总 token、工具调用和墙钟时间预算。
- 将工具描述与返回内容分隔，外部内容不得修改系统策略。
- 对只需一次检索的问题走快速固定路径，复杂问题才进入代理流程。
- 评估答案、步骤成功率、无效循环、工具错误、安全违规和单位成功成本。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“Agentic RAG 就是多查几次”**：关键是根据观察动态选择动作与停止，而非固定重复。
- **“模型可以自己判断权限”**：ACL 必须由服务端根据身份强制执行。
- **“反思能保证停止”**：模型可能循环，需要硬性步数和预算上限。
- **“复杂问题都要 Agent”**：确定性工作流往往更稳定，也更易测试。

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
- 21. 什么是 Agentic RAG？它和传统 RAG 有什么区别？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
