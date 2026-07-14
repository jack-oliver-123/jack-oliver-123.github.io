---
title: "7. Function Calling 也属于工具调用，请问什么场景下使用 Function Calling，什么场景下使用 MCP？"
description: "介绍 Function Calling 与 MCP 的适用场景，梳理简单工具调用、跨应用集成、上下文管理和协议扩展的选择依据"
tags: ["AI应用开发", "LLM工具调用"]
draft: false
featured: false
---

👔面试官：小项目用 Function Calling，大项目用 MCP，这个判断对吗？

🙋我：不够准确。关键是工具归属、复用范围、是否需要发现与生命周期，而不是代码规模。

👔面试官：同一个系统能同时使用两者吗？

🙋我：可以。模型用 Function Calling 提出意图，Host 通过 MCP 调用外部 Server。

## 60 秒回答

工具只服务于一个应用、接口稳定且由同一团队维护时，直接 Function Calling 的链路更短，权限和错误处理也更容易与业务代码结合。能力需要被多个 AI Host 复用，或需要标准化 Tools、Resources、Prompts、远程授权和生命周期时，适合封装成 MCP Server。

这不是二选一。MCP 管应用到能力提供方的协议，Function Calling 管模型到宿主的调用表达。生产系统常用 Function Calling 做模型决策，用 MCP 做能力接入。

## 详细解析

### 适合直接 Function Calling 的情况

- 工具是应用内部函数，不需要跨 Host 复用
- 调用数量少，Schema 与发布节奏由同一团队控制
- 需要紧贴业务事务、内存状态或低延迟进程内调用
- 不需要 Resources、Prompts 或 Server 到 Client 的反向能力

直接接入并不表示把函数对象交给模型。应用仍需维护工具目录、执行器与安全策略。

### 适合 MCP 的情况

- 数据源或工具由独立团队维护，需要跨客户端复用
- 需要运行时列举能力和版本协商
- 同一能力既提供 Tool，也提供 Resource 或 Prompt
- 本地桌面工具需要 stdio 接入，远程服务需要统一授权
- 希望用标准 Client 与现有 MCP Server 生态互操作

### 用决策问题代替规模判断

可以依次问：

1. 能力是否有独立所有者和发布周期？
2. 是否会被两个以上 Host 使用？
3. 是否需要协议化发现、生命周期或双向能力？
4. 引入 Server、连接和授权的成本是否低于专用适配？

前三项多为“否”时，直接 Function Calling 通常足够。多为“是”时，MCP 更可能降低长期集成成本。

## 工程实践与边界

不要为了“标准化”把每个内部函数都拆成远程 MCP Server。远程边界会引入序列化、网络故障、认证和版本治理成本。也不要把所有 MCP Tools 一次性暴露给模型，Host 应按任务检索和授权。

两种方案都必须处理参数校验、权限、超时、重试、幂等、补偿、审计和提示注入。选 MCP 不会自动获得这些业务保障。

## 常见误区

- **按项目大小选型**：大型单体内部工具也可能适合直接调用
- **按工具数量选型**：数量多只说明需要目录治理，不能据此决定采用 MCP
- **MCP 总是延迟更高**：本地 stdio 与远程 HTTP 的成本不同，需实测
- **选 MCP 后模型自然会调工具**：模型能力和 Host 映射仍要单独完成

## 面试追问

**追问：已有 REST API，都要再包一层 MCP 吗？**

不需要。只有当多个 AI Host 需要统一发现和交互语义时，适配层的收益才可能覆盖维护成本。

**追问：怎样渐进迁移？**

先保留内部执行接口，再把稳定、可复用的能力通过 MCP Adapter 暴露；Host 侧继续复用原有权限与审计策略。

## 参考资料

- [MCP 架构说明](https://modelcontextprotocol.io/specification/2025-11-25/architecture)
- [MCP Tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
- [MCP Resources](https://modelcontextprotocol.io/specification/2025-11-25/server/resources)
- [OpenAI Function calling 指南](https://platform.openai.com/docs/guides/function-calling)
