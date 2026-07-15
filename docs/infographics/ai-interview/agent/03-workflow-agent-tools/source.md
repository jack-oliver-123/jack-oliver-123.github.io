---
title: "3. Workflow，Agent，Tools 这三个的概念和区别介绍一下？"
description: "对比 Workflow、Agent 和 Tools 的概念边界，梳理自动化流程、自主决策系统与工具能力之间的关系"
tags: ["AI应用开发", "Agent"]
draft: false
featured: false
---

## 60 秒回答

Tool 是一个有明确契约的能力单元，例如查询订单或发送邮件；它负责执行，不负责决定业务目标。Workflow 是开发者定义的控制流，可以包含普通代码、模型调用、Tool 和 Agent 节点。Agent 则把一部分“下一步做什么”的决定交给模型，根据运行结果动态选择动作。

三者不是大小嵌套，也不是三选一。更准确的区分维度是控制权：Tool 接受调用，Workflow 的路径主要由代码定义，Agent 的局部路径由模型在运行时选择。生产系统常以 Workflow 约束主流程，在少数开放节点使用 Agent，并通过 Tool 完成外部动作。

## 详细解析

Tool 的核心是契约：输入模式、输出模式、权限范围、错误类型和副作用。它可以是确定性函数，也可以包装搜索、数据库或另一个概率模型，因此不能笼统地把 Tool 视为确定性组件。

Workflow 的核心是可预期的拓扑。即使路由节点由 LLM 做分类，允许走哪些分支、失败后如何处理、何时终止，仍由开发者定义。Prompt chaining、routing、parallelization、orchestrator-workers 和 evaluator-optimizer 都可以实现为 Workflow。

Agent 的核心是模型控制的循环。模型可以根据观察结果改变工具、参数或计划，因此更能处理路径难以穷举的任务，也更难完整测试。所谓“Agentic Workflow”通常指受固定状态机约束、但部分节点允许模型动态决策的混合系统。

| 维度 | Tool | Workflow | Agent |
| --- | --- | --- | --- |
| 主要职责 | 执行单项能力 | 编排已知流程 | 探索未完全预定义的路径 |
| 控制者 | 调用方 | 开发者定义的代码/图 | 模型与外层策略共同控制 |
| 主要风险 | 参数、权限、副作用 | 分支遗漏、状态错误 | 漂移、循环、成本与安全 |
| 主要测试 | 契约与集成测试 | 路径与状态迁移测试 | 任务、轨迹和安全评测 |

## 工程实践与边界

- Tool schema 应精确、参数尽量少，并区分只读、可逆写入和不可逆动作。
- Workflow 节点要有超时、重试政策和幂等约束；并行节点必须明确汇合与部分失败语义。
- Agent 只能看到当前任务必要的工具，不要把整个内部能力目录一次性暴露给模型。
- 外部网页、邮件和文档都是不可信数据；即使由 Tool 返回，也不能升级为系统指令。
- 将模型决策日志与业务审计日志分开，敏感参数做脱敏或哈希。

## 常见误区

- **“Workflow 就是多个 Agent 串联”**：节点可以完全不含 Agent。
- **“Tool 只是函数声明”**：生产 Tool 还包括鉴权、执行、错误契约和审计。
- **“固定流程不能使用 LLM”**：LLM 可以是 Workflow 中受约束的分类、抽取或生成节点。
- **“Agent 比 Workflow 高级”**：二者解决不同的不确定性；可枚举流程通常不需要额外自主性。

## 面试追问

> **面试官：** LLM 路由节点算 Agent 吗？
>
> **候选人：** 不一定。如果它只在开发者预设的有限分支中做一次分类，整体仍是 Workflow；若它持续根据环境选择任意工具和步骤，才更接近 Agent。

> **面试官：** 为什么 Tool 要标注副作用？
>
> **候选人：** 调度器可据此决定是否允许自动重试、是否要求审批，以及失败恢复时能否安全重放。

> **面试官：** 如何从原型演进到生产？
>
> **候选人：** 先追踪 Agent 的真实轨迹，找出稳定重复的部分，把它们固化为 Workflow；只保留确实需要动态判断的节点。

## 参考资料

- [Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents)
- [OpenAI：Function calling](https://platform.openai.com/docs/guides/function-calling)
- [Model Context Protocol：Tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
