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

# 6. ReAct、Plan-and-Execute、Reflection 三种范式有什么核心区别？实际项目中该如何选型？

## Overview

对比 ReAct、Plan-and-Execute、Reflection 三种 Agent 范式，分析规划、执行、反思机制的差异与工程选型

## Learning Objectives

The viewer will understand:

1. 比较“ReAct、Plan-and-Execute、Reflection 三种范式有什么核心区别？实际项目中该如何选型？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

ReAct 是“观察后决定下一步”，适合短路径、环境反馈频繁的任务；Plan-and-Execute 是“先形成高层计划，再逐步执行并按条件重规划”，适合有依赖的长任务；Reflection 是“根据测试或评价反馈再改进”，适合结果可以验证、允许多次尝试的任务。

它们不是互斥选项。常见组合是先用 Planner 生成少量高层步骤，每一步由受约束的 ReAct 执行，关键产物再经过一次有明确标准的评估。选择时看路径长度、反馈频率、可验证性和预算，而不是看哪个名称更新。

## 详细解析

| 范式 | 决策节奏 | 优势 | 主要风险 |
| --- | --- | --- | --- |
| ReAct | 每次观察后选择动作 | 适应变化快 | 局部漂移、重复调用 |
| Plan-and-Execute | 先规划，执行中按触发条件调整 | 保留全局目标与依赖 | 错误计划、计划过期 |
| Reflection | 生成后基于反馈重试 | 可利用失败证据改进 | 评估偏差、无效循环 |

ReAct 不要求一开始知道完整路径；它用当前观察换取灵活性。Plan-and-Execute 将“想清楚整体结构”和“完成当前步骤”分开，但计划应包含依赖、完成标准和重规划触发器，而不是只有自然语言清单。Reflection 的有效性取决于反馈质量：单元测试、约束检查和引用核验通常比模型自评更可靠。

复杂任务可以组合三者，但每增加一层循环都会扩大状态空间。若基线 Workflow 已达到目标，新增 Planner 或 Critic 可能只增加调用次数。选型应以离线评测和生产轨迹为依据。

## 工程实践与边界

- 计划保存为结构化步骤，包含依赖、输入、预期输出、状态和验收条件。
- 重规划只在结果与预期不一致、工具不可用或约束变化时触发，不必每步都调用 Planner。
- Reflection 的反馈必须引用具体失败证据，限制修改范围和最大轮次。
- Planner、Executor、Evaluator 可使用不同模型，但要分别评测，避免成本路由降低关键步骤质量。
- 写操作执行前冻结并审批计划；重规划不能绕过原审批范围。

## 常见误区

- **“Plan-and-Execute 就是一次性列清单”**：真实环境变化时需要受控重规划。
- **“Reflection 等于让模型再想一遍”**：没有外部反馈或独立标准时，重试可能重复同一错误。
- **“ReAct 适用于所有任务”**：长依赖任务会因局部决策和上下文增长而失稳。
- **“三者叠加就会更强”**：更复杂的控制流需要更多评测样本和故障处理。

## 面试追问

> **面试官：** 什么时候不需要 Planner？
>
> **候选人：** 一两步即可完成、路径可枚举，或规划成本高于执行成本时，用固定 Workflow 或受限 ReAct 更合适。

> **面试官：** 如何避免错误计划一路执行？
>
> **候选人：** 每步设置前置条件和验收条件；关键节点用规则或测试验证，偏离时暂停、重规划或转人工。

> **面试官：** Reflection 用同一个模型可以吗？
>
> **候选人：** 可以，但相关错误更难被发现。应尽量引入独立证据、不同提示视角或可执行验证器，而不是把模型意见当真值。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

ReAct 是“观察后决定下一步”，适合短路径、环境反馈频繁的任务；Plan-and-Execute 是“先形成高层计划，再逐步执行并按条件重规划”，适合有依赖的长任务；Reflection 是“根据测试或评价反馈再改进”，适合结果可以验证、允许多次尝试的任务。

它们不是互斥选项。常见组合是先用 Planner 生成少量高层步骤，每一步由受约束的 ReAct 执行，关键产物再经过一次有明确标准的评估。选择时看路径长度、反馈频率、可验证性和预算，而不是看哪个名称更新。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

| 范式 | 决策节奏 | 优势 | 主要风险 |
| --- | --- | --- | --- |
| ReAct | 每次观察后选择动作 | 适应变化快 | 局部漂移、重复调用 |
| Plan-and-Execute | 先规划，执行中按触发条件调整 | 保留全局目标与依赖 | 错误计划、计划过期 |
| Reflection | 生成后基于反馈重试 | 可利用失败证据改进 | 评估偏差、无效循环 |

ReAct 不要求一开始知道完整路径；它用当前观察换取灵活性。Plan-and-Execute 将“想清楚整体结构”和“完成当前步骤”分开，但计划应包含依赖、完成标准和重规划触发器，而不是只有自然语言清单。Reflection 的有效性取决于反馈质量：单元测试、约束检查和引用核验通常比模型自评更可靠。

复杂任务可以组合三者，但每增加一层循环都会扩大状态空间。若基线 Workflow 已达到目标，新增 Planner 或 Critic 可能只增加调用次数。选型应以离线评测和生产轨迹为依据。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 计划保存为结构化步骤，包含依赖、输入、预期输出、状态和验收条件。
- 重规划只在结果与预期不一致、工具不可用或约束变化时触发，不必每步都调用 Planner。
- Reflection 的反馈必须引用具体失败证据，限制修改范围和最大轮次。
- Planner、Executor、Evaluator 可使用不同模型，但要分别评测，避免成本路由降低关键步骤质量。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“Plan-and-Execute 就是一次性列清单”**：真实环境变化时需要受控重规划。
- **“Reflection 等于让模型再想一遍”**：没有外部反馈或独立标准时，重试可能重复同一错误。
- **“ReAct 适用于所有任务”**：长依赖任务会因局部决策和上下文增长而失稳。
- **“三者叠加就会更强”**：更复杂的控制流需要更多评测样本和故障处理。

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
- 6. ReAct、Plan-and-Execute、Reflection 三种范式有什么核心区别？实际项目中该如何选型？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
