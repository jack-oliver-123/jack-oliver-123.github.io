---
title: "17. Structured Outputs、JSON Mode 和 Function Calling 有什么区别？"
description: "区分 Structured Outputs、JSON Mode 和 Function Calling 的约束范围，说明结构化响应与工具调用的选型边界"
tags: ["AI应用开发", "LLM工具调用"]
draft: false
featured: false
---

👔面试官：JSON Mode 已经输出 JSON，为什么还需要 Structured Outputs？

🙋我：JSON Mode 只保证 JSON 语法，不保证字段、类型和枚举符合业务 Schema。

👔面试官：Structured Outputs 能替代 Function Calling 吗？

🙋我：不能。前者约束模型响应形状，后者表达调用外部工具的意图；Function Calling 也可开启严格 Schema。

## 60 秒回答

JSON Mode 约束模型返回可解析 JSON，但不会保证必填字段、类型或枚举。Structured Outputs 让输出符合所提供的 JSON Schema，但只支持供应商声明的 Schema 子集，也要处理拒绝、截断和服务错误。Function Calling 则让模型产生工具名与参数，宿主据此执行外部能力。

需要结构化展示或抽取结果时，用 Structured Outputs；只要求兼容旧模型的合法 JSON 时才退回 JSON Mode；需要查数据或产生动作时，用 Function Calling。它们都不能代替服务端业务校验和授权。

## 详细解析

### 三种机制的约束对象

| 机制 | 约束对象 | 保证范围 | 是否触发外部执行 |
| --- | --- | --- | --- |
| JSON Mode | 文本响应 | JSON 语法 | 否 |
| Structured Outputs | 文本响应 | 支持子集内的 JSON Schema | 否 |
| Function Calling | 工具调用参数 | 由工具 Schema 与 strict 设置决定 | 由宿主决定 |

Function Calling 的“调用”只是一种模型输出。应用可以拒绝、修改或延后执行。Structured Outputs 返回的数据也可能包含错误事实，结构正确不代表内容真实。

### 失败分支

严格结构输出仍可能遇到安全拒绝、达到输出上限、请求取消或供应商错误。应用应先检查响应状态，再解析数据，不能假设每次都有目标对象。

JSON Mode 还需要在提示中明确要求 JSON，并自行验证字段。若解析失败，不要把原始文本直接拼接成可执行参数。

### Schema 是接口契约

Schema 应受版本控制，并与消费端类型和校验器保持一致。修改 required、enum 或嵌套结构可能破坏旧客户端。对于跨供应商系统，要取各家支持 Schema 关键字的交集，不能假定完整 JSON Schema 2020-12 都可用。

## 工程实践与边界

结构化抽取采用“响应状态检查、Schema 校验、业务校验”三层。工具调用再增加主体授权、用户确认、超时、有限重试、幂等、补偿和审计。

不要把模型生成的 URL、SQL、文件路径或命令因为“通过 Schema”就直接执行。Schema 只能约束形状，SSRF、注入、越权与资源状态仍需专门策略。

## 常见误区

- **合法 JSON 等于符合 Schema**：JSON Mode 不验证字段契约
- **符合 Schema 等于事实正确**：模型仍可能填入错误值
- **Function Calling 会自动执行函数**：执行权始终在宿主
- **完整 JSON Schema 都受支持**：不同供应商只支持各自声明的子集

## 面试追问

**追问：什么时候选 Structured Outputs，而不是 Function Calling？**

当目标是让模型返回供 UI 或业务代码消费的结构化答案，而不是请求外部动作时。

**追问：Strict 模式后为什么还要业务校验？**

因为金额上限、资源归属、权限和状态不属于通用 Schema 能表达的全部语义。

## 参考资料

- [OpenAI Structured Outputs 指南](https://platform.openai.com/docs/guides/structured-outputs)
- [OpenAI Function calling 指南](https://platform.openai.com/docs/guides/function-calling)
- [JSON Schema 2020-12](https://json-schema.org/draft/2020-12)
