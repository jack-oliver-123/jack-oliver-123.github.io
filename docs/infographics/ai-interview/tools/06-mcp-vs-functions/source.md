---
title: "6. MCP 和 Function Calling 有什么区别？有没有实际跑过 MCP？"
description: "对比 MCP 和 Function Calling 的设计目标与使用方式，分析协议化上下文接入与单次工具调用之间的工程差异"
tags: ["AI应用开发", "LLM工具调用"]
draft: false
featured: false
---

👔面试官：MCP 是 Function Calling 的升级版吗？

🙋我：不是。Function Calling 是模型接口的结构化调用通道，MCP 是 Host 与能力提供方之间的连接协议。

👔面试官：实际跑 MCP 时，模型在哪里参与？

🙋我：Host 列举 MCP Tools 后把候选工具映射给模型；模型提出调用，Host 再通过 MCP Client 发起 tools/call。

## 60 秒回答

Function Calling 解决“模型如何表达调用意图”：模型根据工具 Schema 产生工具名和参数。MCP 解决“应用如何发现、连接和调用外部能力”：它定义 Host、Client、Server、生命周期、能力和传输。两者位于不同接口，可以组合，也可以分别使用。

实际运行的最小链路是：Client 与 Server 完成 initialize 和 initialized，调用 tools/list 获取工具，再调用 tools/call。若由模型决定工具，Host 把工具定义转换成模型 API 的格式；若由确定性工作流决定，整个流程甚至不需要 Function Calling。

## 详细解析

### 对比维度

| 维度 | Function Calling | MCP |
| --- | --- | --- |
| 接口两端 | 模型 API 与宿主应用 | MCP Client 与 MCP Server |
| 核心对象 | 工具定义、调用建议、工具结果 | Tools、Resources、Prompts 与 Client 能力 |
| 发现与连接 | 通常由应用自行实现 | 协议定义列举、调用与生命周期 |
| 传输 | 由模型供应商 API 决定 | stdio 或 Streamable HTTP |
| 执行责任 | 宿主应用 | Server 执行，Host 仍负责授权与审批 |

### 一次可复现的 MCP 验证

工程上可以用官方 SDK 写一个只暴露 read-only 工具的 Server，再用 MCP Inspector 或最小 Client 完成以下步骤：

1. 发送 initialize，核对协商后的 protocolVersion
2. 发送 notifications/initialized
3. 调用 tools/list，检查名称与 inputSchema
4. 用合法和非法参数分别调用 tools/call
5. 测试超时、取消、Server 退出和重新连接

这比只演示“工具返回成功”更有说服力，因为它验证了生命周期、Schema、错误路径与清理行为。

### 两种组合方式

常见 Agent Host 会把 MCP Tool 映射为模型工具。模型输出调用后，Host 先做策略检查，再调用 MCP Server。另一种方式是工作流直接调用 MCP，例如每天固定读取报表 Resource，无需让模型决策。

## 工程实践与边界

不要把 MCP Server 的 tools/list 结果无条件暴露给模型。Host 应根据用户、租户和会话裁剪工具，再限制参数和结果大小。工具列表变化时要刷新缓存并重新审核高风险能力。

写操作失败后，Host 与 Server 要约定超时、有限重试、幂等和补偿。MCP 标准化消息，不会自动提供这些业务语义。调用和结果日志要关联 trace、MCP request ID、模型 tool call ID 与业务幂等键。

## 常见误区

- **MCP 出现后不再需要 Function Calling**：许多 Host 正是用 Function Calling 驱动 MCP Tools
- **MCP 只是统一的 JSON Schema**：它还定义生命周期、传输、原语与双向能力
- **连通 tools/call 就算生产可用**：还要验证授权、错误、取消、审计和恢复
- **Server 负责执行，所以 Host 不用管安全**：Host 决定用户意图能否转化为调用

## 面试追问

**追问：不用原生 Function Calling 能接 MCP 吗？**

能。Host 可通过规则、工作流或其他结构化解析方式触发 MCP 请求，但要自行保证解析可靠。

**追问：怎样证明你理解“实际跑过”？**

说明初始化、工具列举、调用、错误处理和连接关闭，并给出一次参数失败或超时的定位过程。

## 参考资料

- [MCP 2025-11-25 规范](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [OpenAI Function calling 指南](https://platform.openai.com/docs/guides/function-calling)
