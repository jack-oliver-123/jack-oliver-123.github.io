---
title: "10. MCP 和 Agent Skill 的区别是什么？"
description: "对比 MCP 和 Agent Skill 的定位差异，梳理外部能力接入、操作流程封装和 Agent 使用上下文的关系"
tags: ["AI应用开发", "LLM工具调用"]
draft: false
featured: false
---

👔面试官：MCP 和 Agent Skill 都给 Agent 加能力，它们有什么区别？

🙋我：MCP 标准化“怎样连接和调用能力”，Skill 封装“怎样用这些能力完成一类任务”。

👔面试官：它们能一起使用吗？

🙋我：可以。Skill 可以指导 Agent 按顺序使用一个或多个 MCP Tools。

## 60 秒回答

MCP 是运行时协议，连接 Host 与 Server，定义生命周期、能力发现、调用消息和传输。Agent Skill 是可分发的任务知识包，以 SKILL.md 为入口，可带脚本、参考资料和模板。MCP 提供“能力接口”，Skill 提供“使用方法与流程”。

两者可以组合：MCP Server 暴露查订单、退款等工具，Skill 规定先核验身份、查询订单、判断政策、请求确认，再执行退款。MCP 不负责这段业务流程，Skill 也不负责远程连接和协议协商。

## 详细解析

### 核心差异

| 维度 | MCP | Agent Skill |
| --- | --- | --- |
| 形态 | Client 与 Server 间的运行时协议 | 目录与 Markdown 为主的能力包 |
| 解决问题 | 发现、连接、调用上下文和工具 | 传递领域知识与操作流程 |
| 主要边界 | 网络或进程连接 | Host 的上下文与执行环境 |
| 标准对象 | Tools、Resources、Prompts 等 | SKILL.md、scripts、references、assets |
| 是否执行操作 | Server 可执行 Tool | Skill 自身是说明，附带脚本由 Host 执行 |

### 组合示例

一个“发布版本” Skill 可以要求 Agent 先读变更记录，再调用代码仓库 MCP Server 创建标签，随后调用部署 MCP Server 发布，最后核对监控。Skill 组织跨工具流程，各 MCP Server 维持自己的鉴权和能力边界。

也可以只用其中一个。静态写作规范 Skill 不需要外部工具；一个数据库 MCP Server 也能被确定性应用调用，不需要 Skill。

### 生命周期不同

MCP 连接有初始化、能力协商、操作和关闭。Skill 的生命周期由 Host 决定，可能在发现阶段只加载元数据，命中后加载正文，结束后从上下文移除。不要把 Skill 激活描述成 MCP initialize。

## 工程实践与边界

组合使用时要避免权限放大。Skill 只能引用当前用户获准的 MCP Tools，不能通过指令绕过 Server 授权。Host 要把 Skill 来源、版本、工具调用与用户确认记录在同一审计链。

外部 Skill 与 MCP Resource 都可能携带提示注入。工具结果应视为数据，Skill 指令也要受更高优先级策略约束。写操作仍要校验参数、授权、超时、重试、幂等和补偿。

## 常见误区

- **MCP 与 Skill 是竞争标准**：一个管连接，一个管任务知识
- **Skill 可以替代工具实现**：指令不能替代真实 API 和执行器
- **MCP 会自动编排多步流程**：协议提供消息，不决定业务顺序
- **Skill 引用了工具就获得权限**：权限由 Host 和 Server 联合控制

## 面试追问

**追问：流程应该写在 Skill 还是工作流代码里？**

强合规、强事务和固定分支放代码；需要解释、可调整且低风险的步骤可由 Skill 指导。复杂系统常两者结合。

**追问：怎样给 Skill 做版本治理？**

固定来源与版本，审查指令和脚本差异，并用相同任务集回归工具选择、安全确认和结果质量。

## 参考资料

- [Agent Skills 规范](https://agentskills.io/specification)
- [MCP 2025-11-25 规范](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP 架构说明](https://modelcontextprotocol.io/specification/2025-11-25/architecture)
