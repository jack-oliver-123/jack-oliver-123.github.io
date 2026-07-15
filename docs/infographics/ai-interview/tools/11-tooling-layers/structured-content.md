# 11. Function Calling、Skill、MCP 这三个有什么区别？

## Overview

对比 Function Calling、Skill 和 MCP 的能力边界，梳理工具调用、流程封装和协议化上下文接入的不同层次

## Learning Objectives

The viewer will understand:

1. 比较“Function Calling、Skill、MCP 这三个有什么区别？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

👔面试官：Function Calling、Skill、MCP 是三种工具调用方案吗？

🙋我：不是同层方案。Function Calling 是模型表达调用意图的接口，MCP 是能力接入协议，Skill 是任务知识包。

👔面试官：请用一条执行链串起来。

🙋我：Skill 给出退款流程，模型用 Function Calling 选择退款工具，Host 再通过 MCP 调用订单系统。

## 60 秒回答

Function Calling 面向模型与宿主：模型返回工具名和参数，宿主执行。MCP 面向 Host 与能力提供方：Client 与 Server 协商并调用 Tools、Resources 等能力。Agent Skill 面向 Agent 的任务上下文：它打包步骤、规则、脚本和参考资料。

三者经常组成分层系统，但都不自动提供业务安全。Host 仍要裁剪工具、校验参数、授权、审批、设置超时和重试，并为副作用设计幂等、补偿与审计。

## 详细解析

### 三层职责

| 层次 | 关键问题 | 典型产物 |
| --- | --- | --- |
| Skill | 这类任务应该怎样完成 | 流程、规则、脚本、模板 |
| Function Calling | 模型现在建议调用什么 | 工具名、参数、调用 ID |
| MCP | Host 怎样连接并调用能力提供方 | 初始化、列举、调用、结果 |

这个顺序不是固定调用栈。确定性工作流可以绕过 Function Calling 直接用 MCP；Function Calling 也可以调用进程内函数，不经过 MCP；Skill 可以只指导文本工作。

### 端到端例子

处理退款时，Skill 先规定核验身份和退款政策。Host 根据当前用户只向模型暴露 order.read 与 refund.create。模型先提出查询调用，Host 通过 MCP 读取订单；模型根据结果提出退款调用。Host 再次检查金额与订单版本，请求用户确认后执行。

这里 Skill 没有授予权限，Function Calling 没有执行退款，MCP 也没有决定退款政策。每层只承担自己的职责。

### 接口失败如何定位

模型选错工具，检查 Schema、提示和模型评测；MCP tools/list 失败，检查连接、版本与能力；Server 返回权限错误，检查身份和 scope；流程顺序错误，检查 Skill 或工作流。按层定位比笼统归因“Agent 不稳定”更有效。

## 工程实践与边界

建立统一工具注册表，把模型侧名称、MCP Server 与业务权限映射起来。调用链路至少关联模型请求 ID、tool call ID、MCP request ID、业务幂等键和审计主体。

所有外部文本都可能提示注入。Skill 要固定可信来源，MCP 内容要标记来源，Function Calling 参数要经过 Schema 与业务校验。高风险动作必须经过确定性策略和明确确认。

## 常见误区

- **三者只能选一个**：它们可以独立，也可以组合
- **Function Calling 是 OpenAI 专属概念**：不同供应商都有相似工具调用接口，字段并不完全一致
- **MCP Tool 就等于模型 Tool**：Host 需要做格式映射和权限裁剪
- **Skill 是最高权限指令**：Host 的系统策略和用户授权优先

## 面试追问

**追问：哪一层适合做参数 Schema？**

模型工具定义和 MCP Tool 都可声明 Schema，Host 还要执行统一业务校验，避免两边约束漂移。

**追问：怎样减少跨层不一致？**

从一个受版本控制的工具契约生成模型与 MCP 定义，并用契约测试验证名称、参数和错误映射。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

Function Calling 面向模型与宿主：模型返回工具名和参数，宿主执行。MCP 面向 Host 与能力提供方：Client 与 Server 协商并调用 Tools、Resources 等能力。Agent Skill 面向 Agent 的任务上下文：它打包步骤、规则、脚本和参考资料。

三者经常组成分层系统，但都不自动提供业务安全。Host 仍要裁剪工具、校验参数、授权、审批、设置超时和重试，并为副作用设计幂等、补偿与审计。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 三层职责
| 层次 | 关键问题 | 典型产物 | | --- | --- | --- | | Skill | 这类任务应该怎样完成 | 流程、规则、脚本、模板 | | Function Calling | 模型现在建议调用什么 | 工具名、参数、调用 ID | | MCP | Host 怎样连接并调用能力提供方 | 初始化、列举、调用、结果 |

这个顺序不是固定调用栈。确定性工作流可以绕过 Function Calling 直接用 MCP；Function Calling 也可以调用进程内函数，不经过 MCP；Skill 可以只指导文本工作。

### 端到端例子
处理退款时，Skill 先规定核验身份和退款政策。

这里 Skill 没有授予权限，Function Calling 没有执行退款，MCP 也没有决定退款政策。每层只承担自己的职责。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

建立统一工具注册表，把模型侧名称、MCP Server 与业务权限映射起来。调用链路至少关联模型请求 ID、tool call ID、MCP request ID、业务幂等键和审计主体。

所有外部文本都可能提示注入。Skill 要固定可信来源，MCP 内容要标记来源，Function Calling 参数要经过 Schema 与业务校验。高风险动作必须经过确定性策略和明确确认。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **三者只能选一个**：它们可以独立，也可以组合
- **Function Calling 是 OpenAI 专属概念**：不同供应商都有相似工具调用接口，字段并不完全一致
- **MCP Tool 就等于模型 Tool**：Host 需要做格式映射和权限裁剪
- **Skill 是最高权限指令**：Host 的系统策略和用户授权优先

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 本图不使用额外定量数据。

---

## Design Instructions

### Style Preferences

- 使用 manifest 中已确认的版式与风格
- 保持简体中文清晰可读，技术名词按原文拼写

### Layout Preferences

- 横版 16:9
- 标题突出，主要信息区不超过 4 个

### Other Requirements

- 仅使用上面的原文内容，不添加事实、示例、数值或来源
- 不生成品牌标志、水印、页脚引用或装饰性长文
