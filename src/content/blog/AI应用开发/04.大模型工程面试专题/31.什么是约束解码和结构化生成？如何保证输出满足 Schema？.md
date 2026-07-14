---
title: "31. 什么是约束解码和结构化生成？如何保证输出满足 Schema？"
description: "解释 CFG、正则和 JSON Schema 如何约束 Token 候选，并区分语法有效、Schema 合法与业务正确"
tags: ["AI应用开发", "大模型工程"]
draft: false
featured: false
---

## 60 秒回答

约束解码在每一步根据正则、上下文无关文法（Context-Free Grammar，CFG）或 JSON Schema 计算允许的 Token，并把其他 Token 的 Logit 屏蔽后再采样。这样可以保证生成序列满足受支持的语法或 Schema，比在 Prompt 中要求“只输出 JSON”可靠。

它只保证结构，不保证字段语义、权限或事实正确。服务端仍要做 Schema 验证、枚举和范围检查、跨字段规则、授权以及工具执行前确认。Schema 太复杂或 Tokenizer 适配低效也会增加首轮编译和每 Token 开销。

## 详细解析

结构化生成可以分三层：

1. **格式提示**：自然语言或示例要求特定格式，没有硬约束
2. **约束解码**：解码器维护自动机或解析器状态，只允许合法 Token
3. **应用验证**：解析结果后检查 Schema、业务规则、权限与副作用

JSON 的递归对象和嵌套结构通常需要 CFG 或等价解析机制；简单枚举和模式可用有限状态机。JSON Schema 还包含数值范围、引用、条件和格式等关键字，具体引擎可能只支持子集，不能只看 API 参数名称。

Tokenizer 会让一个语法终结符对应多个 Token，单个 Token 也可能包含多字符。高效引擎预编译文法，并在每步把解析状态映射到 Token 掩码。首次 Schema 编译可缓存，缓存键要包含规范化 Schema、Tokenizer 和引擎版本。

对工具调用，结构化输出生成的是“调用建议”。宿主应用解析并验证工具名和参数，再根据用户授权决定是否执行。返回成功 JSON 不代表外部动作已完成。

## 工程实践与边界

Schema 采用 `additionalProperties: false` 等明确约束，字段使用稳定枚举和可处理的错误状态。生成后使用标准 JSON Schema 验证器，并把验证失败、业务失败与工具失败分开记录。

涉及写操作时加入幂等键、超时、重试策略、审批和动作后读取验证。外部文本可能诱导模型选择危险参数，因此参数白名单和授权必须在模型外执行。

## 常见误区

- **认为低 Temperature 保证 JSON**：随机性降低不构成语法约束
- **把可解析等同于符合 Schema**：合法 JSON 仍可能缺字段或类型错误
- **把 Schema 合法等同于业务安全**：金额和收件人可能合法但未授权
- **假设所有 JSON Schema 关键字受支持**：应查对应引擎版本并测试

## 面试追问

**问：约束解码会降低模型质量吗？**

**答：** 它从候选中删除不合法 Token，能提高格式成功率；若 Schema 与任务不符或过窄，也会排除正确表达。需要同时测结构通过率和任务正确率。

**问：流式 JSON 怎么消费？**

**答：** 在对象完成前把片段视为未验证数据。可用增量解析显示进度，但只有完整解析和业务校验后才触发副作用。

## 参考资料

- [JSON Schema specification](https://json-schema.org/specification)
- [XGrammar: Flexible and Efficient Structured Generation Engine for Large Language Models](https://arxiv.org/abs/2411.15100)
- [Outlines structured generation](https://github.com/dottxt-ai/outlines)
- [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
