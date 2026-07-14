---
title: "1. 什么是 Function Calling？原理是什么？"
description: "系统介绍 Function Calling 的原理和调用流程，梳理模型如何生成结构化参数并由外部系统完成工具执行"
tags: ["AI应用开发", "LLM工具调用"]
draft: false
featured: false
---

👔面试官：Function Calling 是模型直接调用 API 吗？

🙋我：不是。模型只生成工具名和结构化参数，宿主应用才真正执行函数。

👔面试官：那一次完整调用有哪些步骤？

🙋我：宿主声明工具，模型选择工具并给出参数，宿主校验和执行，再把结果关联到原调用交回模型。

## 60 秒回答

Function Calling，也叫 Tool Calling，是模型接口与宿主应用约定的一种结构化输出机制。应用把工具名称、用途和参数 Schema 随请求发送给模型；模型可以回答文本，也可以返回一个或多个调用建议。模型不会因此获得网络、数据库或操作系统权限。

宿主收到调用后必须完成参数解析与业务校验、身份授权、超时和幂等控制，再执行真实代码。执行结果要携带调用标识回传，模型才能结合结果生成最终回答。它解决的是“模型如何表达要调用什么”，不是“工具如何部署、发现或安全执行”。

## 详细解析

### 一次调用的闭环

标准流程可以拆成五步：

1. 应用向模型提供工具定义，包括名称、描述和 JSON Schema
2. 模型根据对话决定直接回答、拒绝或产生工具调用
3. 应用解析参数，并执行 Schema 校验与业务规则校验
4. 应用在受控环境中调用函数，把结果与调用 ID 绑定
5. 应用把结果加入会话，模型生成回答或继续提出调用

工具选择通常还能由宿主约束。例如，允许模型自行决定、禁止调用、要求至少调用一次，或限制到一个工具。具体字段随模型 API 而异，不能把某家 API 的字段当成跨厂商协议。

### 结构正确不等于业务正确

Schema 能约束类型、必填字段和枚举，但无法判断“把 10 万元转给这个收款人”是否符合权限与业务规则。即使供应商支持严格 Schema，应用仍要检查账户归属、金额上限、资源版本和用户确认。

模型还可能选择错误工具，或在参数中复述提示注入内容。因此，调用建议始终是不可信输入。

## 工程实践与边界

读操作可以设置短超时和有限重试。写操作要额外设计幂等键、审批、审计和失败补偿。参数日志应做脱敏，工具结果也要限制长度和内容类型，避免把密钥或恶意指令送回模型。

下面这段伪代码强调职责边界：

~~~typescript
const call = validateModelCall(modelOutput, toolSchemas);
authorize(actor, call.name, call.arguments);

const result = await executeWithDeadline(call, {
  idempotencyKey: call.id,
  timeoutMs: 3000,
});

conversation.addToolResult(call.id, sanitize(result));
~~~

宿主也可以不用模型原生 Function Calling，而是用受约束解码或自定义解析器产生结构化意图。但解析器仍不能代替授权和执行控制。

## 常见误区

- **模型会直接联网**：网络和系统权限属于执行环境，不属于语言模型
- **JSON 可解析就能执行**：语法正确不代表参数合法、用户有权或操作安全
- **失败后无限重试**：写操作可能重复扣款、发信或创建资源
- **直接信任工具返回值**：外部内容可能包含提示注入、恶意链接或敏感数据

## 面试追问

**追问：为什么要把工具结果再次发给模型？**

因为执行发生在模型外部。模型只有收到与调用 ID 对应的结果，才能基于真实数据继续推理。

**追问：严格 Schema 后还需要服务端校验吗？**

需要。严格 Schema 只覆盖供应商支持的结构约束，业务权限、资源状态和副作用风险仍由应用负责。

## 参考资料

- [OpenAI Function calling 指南](https://platform.openai.com/docs/guides/function-calling)
- [Anthropic Tool use 文档](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview)
- [JSON Schema 2020-12](https://json-schema.org/draft/2020-12)
