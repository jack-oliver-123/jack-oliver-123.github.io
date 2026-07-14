---
title: "17. Structured Outputs、JSON Mode 和 Function Calling 有什么区别？"
topic: "LLM tool integration"
data_type: "comparison"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

区分 Structured Outputs、JSON Mode 和 Function Calling 的约束范围，说明结构化响应与工具调用的选型边界

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 比较“Structured Outputs、JSON Mode 和 Function Calling 有什么区别？”涉及的主要方案与选型维度
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

- Schema 应受版本控制，并与消费端类型和校验器保持一致。修改 required、enum 或嵌套结构可能破坏旧客户端。对于跨供应商系统，要取各家支持 Schema 关键字的交集，不能假定完整 JSON Schema 2020-12 都可用。

## Source Evidence (Verbatim)

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
