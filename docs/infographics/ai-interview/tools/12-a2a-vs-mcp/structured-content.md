# 12. 什么是 A2A 协议？它和 MCP 协议的区别是什么？

## Overview

介绍 A2A 协议的目标和协作模式，对比它与 MCP 在 Agent 通信、能力暴露和系统集成中的差异

## Learning Objectives

The viewer will understand:

1. 比较“什么是 A2A 协议？它和 MCP 协议的区别是什么？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

👔面试官：A2A 是 Google 用来替代 MCP 的协议吗？

🙋我：不是。A2A 面向 Agent 与 Agent 的任务协作，MCP 面向 Host 与工具或上下文 Server。

👔面试官：A2A 怎样表达长时任务？

🙋我：通过 Message 发起或继续交互，用 Task 状态追踪执行，并用 Artifact 返回产物。

## 60 秒回答

Agent2Agent（A2A）是不同 Agent 系统之间发现能力、发送消息、协作任务和交付产物的开放协议。截至 2026 年 7 月，协议兼容版本是 `1.0`，official specification 页面标注 1.0.0，GitHub 最新补丁发布为 v1.0.1（2026-05-28）；A2A 只用 Major.Minor 做协议兼容协商，规范以 Protobuf 定义为权威来源。Agent Card 描述身份、接口、能力和安全要求；Task 表达可持续、可中断的工作；Artifact 表达任务产物。

MCP 主要连接 AI Host 与 Tools、Resources、Prompts 等能力。A2A 连接具有独立身份、策略和任务状态的 Agent。一个远程 Agent 可以通过 A2A 接任务，并在内部通过 MCP 使用工具。

## 详细解析

### A2A 的核心对象

- **Agent Card**：公布 Agent 的描述、接口、能力、协议版本和安全方案
- **Message**：用户或 Agent 的消息，由一个或多个 Part 组成
- **Task**：带 id、context_id 和状态的长时工作单元
- **Artifact**：Agent 生成的文件、文本或结构化产物

Task 状态包括 submitted、working、completed、failed、canceled、rejected、input-required 和 auth-required 等语义。调用方可以查询、取消或订阅任务，也可以为异步结果配置推送通知。

### A2A 与 MCP 对比

| 维度 | A2A | MCP |
| --- | --- | --- |
| 交互对象 | Agent 与 Agent | Host/Client 与 Server |
| 抽象粒度 | 目标、消息、任务、产物 | 工具、资源、提示词与客户端能力 |
| 状态模型 | 明确的 Task 生命周期 | 请求、通知及可选 Tasks 能力 |
| 能力发现 | Agent Card | initialize 与能力列举 |
| 典型用途 | 委派研究、审批、跨组织协作 | 访问数据库、文件、搜索和业务 API |

### 组合架构

采购 Agent 可以通过 A2A 把合规审查交给独立审查 Agent。审查 Agent 再通过 MCP 读取政策 Resource 和调用风险 Tool。A2A 保留任务与产物边界，MCP 提供内部上下文和操作。

## 工程实践与边界

不要因为对方发布了 Agent Card 就信任它。生产环境要使用 HTTPS/TLS，按 Card 声明的安全方案认证，并在本地实施 Agent、技能和任务级授权。跨组织任务还要约定数据驻留、保留周期和审计责任。

任务重试要基于 task_id 和业务幂等语义，避免重复创建下游资源。对 input-required 与 auth-required 应暂停并请求明确输入，不能让模型伪造用户同意。消息和 Artifact 同样可能含提示注入。

## 常见误区

- **A2A 是另一个工具调用协议**：它传递 Agent 级任务和消息
- **A2A 与 MCP 互斥**：远程 Agent 内部可以使用 MCP
- **Agent Card 是授权凭证**：它是发现与能力元数据，不代表信任
- **Task completed 等于业务成功**：调用方仍要验证 Artifact 和业务不变量

## 面试追问

**追问：为什么不用普通 REST API 调 Agent？**

可以，但 A2A 统一了 Agent Card、消息部件、任务状态、流式订阅和产物语义，减少专用适配。

**追问：怎样处理长任务断线？**

保存 task_id，通过 GetTask 恢复状态，或用 SubscribeToTask 与推送通知接收更新；消费端要去重。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

Agent2Agent（A2A）是不同 Agent 系统之间发现能力、发送消息、协作任务和交付产物的开放协议。截至 2026 年 7 月，协议兼容版本是 `1.0`，official specification 页面标注 1.0.0，GitHub 最新补丁发布为 v1.0.1（2026-05-28）；

MCP 主要连接 AI Host 与 Tools、Resources、Prompts 等能力。A2A 连接具有独立身份、策略和任务状态的 Agent。一个远程 Agent 可以通过 A2A 接任务，并在内部通过 MCP 使用工具。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### A2A 的核心对象
- **Agent Card**：公布 Agent 的描述、接口、能力、协议版本和安全方案 - **Message**：用户或 Agent 的消息，由一个或多个 Part 组成 - **Task**：带 id、context_id 和状态的长时工作单元 - **Artifact**：Agent 生成的文件、文本或结构化产物

Task 状态包括 submitted、working、completed、failed、canceled、rejected、input-required 和 auth-required 等语义。调用方可以查询、取消或订阅任务，也可以为异步结果配置推送通知。

### A2A 与 MCP 对比
| 维度 | A2A | MCP | | --- | --- | --- | | 交互对象 | Agent 与 Agent | Host/Client 与 Server | | 抽象粒度 | 目标、消息、任务、产物 | 工具、资源、提示词与客户端能力 | | 状态模型 | 明确的 Task 生命周期 | 请求、通知及可选 Tasks 能力 | | 能力发现 | Agent Card | initialize 与能力列举 | | 典型用途 | 委派研究、审批、跨组织协作 | 访问数据库、文件、搜索和业务 API |

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

不要因为对方发布了 Agent Card 就信任它。生产环境要使用 HTTPS/TLS，按 Card 声明的安全方案认证，并在本地实施 Agent、技能和任务级授权。跨组织任务还要约定数据驻留、保留周期和审计责任。

任务重试要基于 task_id 和业务幂等语义，避免重复创建下游资源。对 input-required 与 auth-required 应暂停并请求明确输入，不能让模型伪造用户同意。消息和 Artifact 同样可能含提示注入。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **A2A 是另一个工具调用协议**：它传递 Agent 级任务和消息
- **A2A 与 MCP 互斥**：远程 Agent 内部可以使用 MCP
- **Agent Card 是授权凭证**：它是发现与能力元数据，不代表信任
- **Task completed 等于业务成功**：调用方仍要验证 Artifact 和业务不变量

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- Agent2Agent（A2A）是不同 Agent 系统之间发现能力、发送消息、协作任务和交付产物的开放协议。截至 2026 年 7 月，协议兼容版本是 `1.0`，official specification 页面标注 1.0.0，GitHub 最新补丁发布为 v1.0.1（2026-05-28）；A2A 只用 Major.Minor 做协议兼容协商，规范以 Protobuf 定义为权威来源。Agent Card 描述身份、接口、能力和安全要求；Task 表达可持续、可中断的工作；Artifact 表达任务产物。
- MCP 主要连接 AI Host 与 Tools、Resources、Prompts 等能力。A2A 连接具有独立身份、策略和任务状态的 Agent。一个远程 Agent 可以通过 A2A 接任务，并在内部通过 MCP 使用工具。
- ### A2A 的核心对象
- ### A2A 与 MCP 对比
- | 维度 | A2A | MCP |
- 采购 Agent 可以通过 A2A 把合规审查交给独立审查 Agent。审查 Agent 再通过 MCP 读取政策 Resource 和调用风险 Tool。A2A 保留任务与产物边界，MCP 提供内部上下文和操作。
- **A2A 是另一个工具调用协议**：它传递 Agent 级任务和消息
- **A2A 与 MCP 互斥**：远程 Agent 内部可以使用 MCP

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
