---
title: "4. 了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什么？"
topic: "AI Agent engineering"
data_type: "comparison"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

介绍常见 Agent 设计范式及其与 Workflow 的区别，梳理 ReAct、Plan-and-Execute、Reflection 等模式的适用场景

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 比较“了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什么？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

## Target Audience

- **Knowledge Level**: Intermediate to Expert
- **Context**: 准备 AI 应用开发与大模型工程面试
- **Expectations**: 在短时间内建立可口述、可追问、可落地的答案结构

## Content Type Analysis

- **Data Structure**: comparison
- **Key Relationships**: 核心概念、工程实现、边界条件与常见误区之间的关系
- **Visual Opportunities**: 使用原文流程、比较表、组件关系、指标或分区摘要进行可视化

## Key Data Points (Verbatim)

- 原文没有需要单独强调的定量数据或规范关键词。

## Source Evidence (Verbatim)

## 60 秒回答

我会先区分 Workflow 模式和 Agent 循环。常见 Workflow 包括提示链、路由、并行、编排者-执行者、评估者-优化者；常见 Agent 控制策略包括 ReAct、Plan-and-Execute 和带反馈的 Reflection。

选型原则是从最小自主性开始：路径稳定就用 Workflow；任务能拆但子任务未知时用编排者-执行者；环境反馈会持续改变下一步时再用 Agent。Reflection 只在有明确评价标准、改写确实能提高结果时使用，并设置最大轮次，避免模型反复修改却没有实质收益。

## 详细解析

### Workflow 模式

- **提示链**：把任务分成固定阶段，每段输出经过校验再进入下一段。
- **路由**：先分类，再把请求发送给不同提示、模型或工具。
- **并行**：独立子任务同时执行，最后聚合；适合多来源检索或多维评价。
- **编排者-执行者**：编排者动态拆分子任务，但工作者职责和汇合规则由系统约束。
- **评估者-优化者**：生成器提交结果，评估器按清晰标准反馈，直到通过或触发预算上限。

### Agent 控制策略

ReAct 在每轮根据最新观察选择动作，适合路径短且反馈频繁的任务。Plan-and-Execute 先生成计划，再执行和按条件重规划，适合存在依赖的长任务。Reflection 将失败证据或评价反馈带入下一次尝试，适合代码、检索和有可验证目标的生成任务。

这些名称描述的是控制结构，不保证质量。比如评估器与生成器犯相同错误时，Reflection 可能放大偏差；初始计划遗漏硬约束时，Plan-and-Execute 也可能稳定地执行错误计划。因此，结构选择必须配合外部验证器、测试数据和停止条件。

## 工程实践与边界

- 先建立基线 Workflow，再用轨迹数据证明某节点需要动态决策。
- 每个模式都定义输入/输出契约、错误出口、最大轮次和人工接管条件。
- 并行执行只用于无写冲突的任务；涉及共享资源时使用锁、版本号或事务。
- 评估器优先使用可执行测试、规则或独立证据，不能只问另一个模型“是否正确”。
- 不记录或展示模型私有思维链；保留计划、动作、观察和可验证的简短理由即可。

## 常见误区

- **把 Multi-Agent 当成推理范式**：它是系统拓扑，可以承载不同控制策略。
- **认为 Workflow 完全不能动态**：它可以包含条件、循环和 LLM 路由，关键是边界由开发者定义。
- **认为 Reflection 总能提高质量**：没有可靠评价信号时，它可能只增加延迟和成本。
- **一开始就组合所有模式**：复杂度会使故障归因和评测变得困难。

## 面试追问

> **面试官：** 什么时候用编排者-执行者而不是固定并行？
>
> **候选人：** 子任务数量或类型无法预先确定，但可以定义工作者能力与汇合协议时适合动态编排。

> **面试官：** Reflection 的退出条件是什么？
>
> **候选人：** 外部测试通过、评价分数达到门槛、改进停滞，或达到轮次、时间和费用预算，任一条件都应能终止。

> **面试官：** 如何判断 Agent 应该退化成 Workflow？
>
> **候选人：** 若线上轨迹长期集中在少数稳定路径，且动态决策在同一评测集上未改善成功率，就应把这些路径固化并减少模型决策点。

## Layout × Style Signals

- Content type: comparison → suggests comparison-matrix
- Tone: 专业、教育、工程导向 → suggests corporate-memphis
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: moderate → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：primary

## Recommended Combinations

1. **comparison-matrix + corporate-memphis** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **binary-comparison + corporate-memphis**: 可作为更强调关系或密度的备选
3. **dense-modules + pop-laboratory**: 可作为更强调工程细节的备选
