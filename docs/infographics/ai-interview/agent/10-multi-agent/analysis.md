---
title: "10. 什么是 Multi-Agent？"
topic: "AI Agent engineering"
data_type: "overview"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

系统介绍 Multi-Agent 的基本概念、协作方式和角色分工，梳理多智能体系统相比单 Agent 的适用场景

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 建立“什么是 Multi-Agent？”的完整知识框架
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

- **“协议解决协作逻辑”**：Agent2Agent（A2A）等协议提供互操作基础，任务语义和业务治理仍需应用定义。

## Source Evidence (Verbatim)

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
