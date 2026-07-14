# 5. MCP 由哪几部分组成？

## Overview

系统介绍 MCP 的组成部分，梳理 Host、Client、Server、Transport、Tools、Resources 和 Prompts 的职责边界

## Learning Objectives

The viewer will understand:

1. 说明“MCP 由哪几部分组成？”的组成部分及其关系
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

👔面试官：MCP 只有 Client 和 Server 两部分吗？

🙋我：还要有 Host。Host 管模型、用户和安全策略，Client 是 Host 内与某个 Server 建立会话的协议组件。

👔面试官：除了 Tools，Server 还能暴露什么？

🙋我：还有 Resources、Prompts 及协商后的实用能力；Client 侧也可提供 Sampling、Elicitation 和 Roots。

## 60 秒回答

MCP 可以从四个维度拆解。第一是角色：Host、MCP Client、MCP Server。第二是数据层：基于 JSON-RPC 的请求、响应、通知、生命周期和能力协商。第三是传输层：2025-11-25 规范定义 stdio 与 Streamable HTTP。第四是能力原语：Server 侧主要有 Tools、Resources、Prompts，Client 侧可有 Sampling、Elicitation、Roots。

Host 才是最终信任边界。它决定连接哪些 Server、向模型暴露哪些工具、何时请求用户确认，以及如何隔离和审计执行。

## 详细解析

### 三个架构角色

- **Host**：承载模型、会话和用户界面，集中实施权限、同意与上下文策略
- **Client**：维护与一个 Server 的状态连接，处理版本协商和消息路由
- **Server**：提供专门的上下文或操作能力，可以是本地子进程，也可以是远程服务

一个 Host 可以管理多个 Client。把 Client 与 Host 混为一谈，会遗漏多 Server 隔离和统一授权这两个关键职责。

### 三类 Server 原语

Tools 面向执行，具有输入 Schema，并可声明输出 Schema。Resources 面向 URI 标识的上下文，支持列举、读取和可选订阅。Prompts 是可发现的消息模板，由应用或用户选择，不等于系统提示词的全部内容。

协议还包含日志、补全、进度、取消、Ping 等实用能力。2025-11-25 规范还把 Tasks 定义为 experimental 能力，用于把部分长时操作表示为可查询任务；它不是稳定核心原语，是否可用取决于双方协商、具体实现和未来规范变化。

### 生命周期与传输

连接先执行 initialize：Client 声明协议版本、能力和实现信息，Server 返回其选择的版本与能力，随后 Client 发送 initialized 通知。正常操作只能使用协商成功的能力。

stdio 由 Client 启动 Server 子进程，消息按行经过标准输入输出。Streamable HTTP 使用单一 MCP 端点处理 POST 与 GET，并可使用 Server-Sent Events（SSE）承载流式消息。

## 工程实践与边界

对每个 Server 建立独立的权限清单、超时预算和审计维度。不要把某个 Server 返回的工具描述直接视为可信配置，工具列表变化后要重新应用允许名单。

Resources 与工具结果都可能含提示注入。Host 应区分数据与指令，限制可用工具，并在写操作前校验参数、身份和资源版本。远程调用还要设计有限重试、幂等键和补偿；本地 Server 要限制环境变量、文件 Roots 与网络权限。

## 常见误区

- **Host 是 Client 的别名**：Host 管产品级策略，Client 管一条协议连接
- **MCP Server 只提供工具**：Resources 和 Prompts 也是标准原语
- **能力协商等于授权**：协商说明协议可用，授权说明当前主体可以执行
- **所有实现都必须支持所有能力**：MCP 通过能力声明允许按需实现

## 面试追问

**追问：为什么 Client 通常与单个 Server 建立专用连接？**

这样可以隔离状态、版本、能力和安全上下文，再由 Host 聚合多个连接。

**追问：Tool 和 Resource 怎样选？**

产生副作用或按参数计算结果用 Tool；按 URI 读取可寻址上下文用 Resource。不能只按“是否返回文本”判断。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

MCP 可以从四个维度拆解。第一是角色：Host、MCP Client、MCP Server。第二是数据层：基于 JSON-RPC 的请求、响应、通知、生命周期和能力协商。第三是传输层：2025-11-25 规范定义 stdio 与 Streamable HTTP。

Host 才是最终信任边界。它决定连接哪些 Server、向模型暴露哪些工具、何时请求用户确认，以及如何隔离和审计执行。

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 三个架构角色
- **Host**：承载模型、会话和用户界面，集中实施权限、同意与上下文策略 - **Client**：维护与一个 Server 的状态连接，处理版本协商和消息路由 - **Server**：提供专门的上下文或操作能力，可以是本地子进程，也可以是远程服务

一个 Host 可以管理多个 Client。把 Client 与 Host 混为一谈，会遗漏多 Server 隔离和统一授权这两个关键职责。

### 三类 Server 原语
Tools 面向执行，具有输入 Schema，并可声明输出 Schema。

协议还包含日志、补全、进度、取消、Ping 等实用能力。2025-11-25 规范还把 Tasks 定义为 experimental 能力，用于把部分长时操作表示为可查询任务；它不是稳定核心原语，是否可用取决于双方协商、具体实现和未来规范变化。

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

对每个 Server 建立独立的权限清单、超时预算和审计维度。不要把某个 Server 返回的工具描述直接视为可信配置，工具列表变化后要重新应用允许名单。

Resources 与工具结果都可能含提示注入。Host 应区分数据与指令，限制可用工具，并在写操作前校验参数、身份和资源版本。远程调用还要设计有限重试、幂等键和补偿；本地 Server 要限制环境变量、文件 Roots 与网络权限。

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **Host 是 Client 的别名**：Host 管产品级策略，Client 管一条协议连接
- **MCP Server 只提供工具**：Resources 和 Prompts 也是标准原语
- **能力协商等于授权**：协商说明协议可用，授权说明当前主体可以执行
- **所有实现都必须支持所有能力**：MCP 通过能力声明允许按需实现

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- MCP 可以从四个维度拆解。第一是角色：Host、MCP Client、MCP Server。第二是数据层：基于 JSON-RPC 的请求、响应、通知、生命周期和能力协商。第三是传输层：2025-11-25 规范定义 stdio 与 Streamable HTTP。第四是能力原语：Server 侧主要有 Tools、Resources、Prompts，Client 侧可有 Sampling、Elicitation、Roots。
- 协议还包含日志、补全、进度、取消、Ping 等实用能力。2025-11-25 规范还把 Tasks 定义为 experimental 能力，用于把部分长时操作表示为可查询任务；它不是稳定核心原语，是否可用取决于双方协商、具体实现和未来规范变化。

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
