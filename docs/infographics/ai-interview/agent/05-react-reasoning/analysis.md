---
title: "5. Agent 推理模式有哪些？ReAct 是啥？具体是怎么实现的？"
topic: "AI Agent engineering"
data_type: "overview"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

系统介绍 ReAct 推理模式的 Thought、Action、Observation 循环，拆解 Agent 如何通过工具反馈完成多步推理

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 建立“Agent 推理模式有哪些？ReAct 是啥？具体是怎么实现的？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

## Target Audience

- **Knowledge Level**: Intermediate to Expert
- **Context**: 准备 AI 应用开发与大模型工程面试
- **Expectations**: 在短时间内建立可口述、可追问、可落地的答案结构

## Content Type Analysis

- **Data Structure**: overview
- **Key Relationships**: 核心概念、工程实现、边界条件与常见误区之间的关系
- **Visual Opportunities**: 使用原文流程、比较表、组件关系、指标或分区摘要进行可视化

## Key Data Points (Verbatim)

- 原文没有需要单独强调的定量数据或规范关键词。

## Source Evidence (Verbatim)

## 60 秒回答

Agent 常见的决策方式包括直接生成、分步推理、搜索多条候选路径、ReAct，以及先规划再执行。ReAct 的核心是把推理与外部行动交错：模型根据当前任务和观察选择一个动作，运行时执行工具并返回观察，模型再决定下一步，直到结束。

循环由宿主程序驱动，不是模型自己运行。生产实现通常让模型输出结构化工具调用和简短可审计理由，不要求展示私有思维链。运行时还要负责 schema 校验、权限、超时、重试、幂等、预算和停止条件。

## 详细解析

ReAct 原始论文用 Thought、Action、Observation 描述交错过程。工程上可把它抽象为状态机：

1. 组装当前目标、已验证事实、工具目录和剩余预算。
2. 调用模型，得到最终回答或结构化动作。
3. 对动作做参数、权限和政策校验。
4. 执行工具，将成功结果或可操作错误写入状态。
5. 判断任务是否完成、是否需要重试或是否应转人工。

外层循环才是可靠性的承担者。模型可能给出不存在的工具、错误参数或重复动作，运行时不能直接照做。对于并行工具调用，还要记录每个调用 ID，将结果准确关联到原动作，并定义部分失败时是继续、补偿还是整体终止。

ReAct 的优势是能利用最新观察纠偏，适合搜索、诊断和路径不确定的任务。局限是局部决策可能导致循环、目标漂移和上下文膨胀。任务存在长依赖链时，可以先生成高层计划，再让 ReAct 执行单个步骤。

## 工程实践与边界

- 使用结构化输出表示动作，不从自然语言中用正则解析工具名和参数。
- 工具错误分为参数错误、权限错误、可重试故障和永久故障；不同类型采用不同策略。
- 写操作携带幂等键。超时后先查询外部系统状态，不能盲目重放付款或发送动作。
- 对重复动作、无进展轮次和预算消耗设置程序化守卫。
- 工具结果属于不可信输入；清除无关内容并明确标记其数据来源，防止提示注入。

## 常见误区

- **“模型自己在循环”**：每次模型调用都会结束，循环由应用代码再次发起。
- **“ReAct 必须展示完整 Thought”**：系统只需要动作、观察和足以审计的理由，不应依赖私有思维链。
- **“报错就重试”**：权限拒绝或参数违反业务规则时，重试不会解决问题。
- **“轮数越多越智能”**：无进展的额外轮次只会增加延迟、成本和失控风险。

## 面试追问

> **面试官：** ReAct 如何停止？
>
> **候选人：** 既允许模型返回完成状态，也由运行时强制执行最大步数、时间、费用、重复动作和政策终止条件。

> **面试官：** 工具返回 500 怎么办？
>
> **候选人：** 先看工具是否可安全重试，再采用有限次数的退避重试；写操作还要依赖幂等键或状态查询，超过阈值转降级或人工处理。

> **面试官：** 如何调试错误轨迹？
>
> **候选人：** 记录每步状态摘要、工具调用 ID、参数脱敏摘要、结果状态、延迟、模型和提示版本，再通过固定输入回放。

## Layout × Style Signals

- Content type: overview → suggests bento-grid
- Tone: 专业、教育、工程导向 → suggests hand-drawn-edu
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: moderate → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：primary

## Recommended Combinations

1. **bento-grid + hand-drawn-edu** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **hub-spoke + hand-drawn-edu**: 可作为更强调关系或密度的备选
3. **dense-modules + pop-laboratory**: 可作为更强调工程细节的备选
