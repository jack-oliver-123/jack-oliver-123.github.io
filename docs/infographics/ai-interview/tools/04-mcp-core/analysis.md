---
title: "4. 什么是 MCP（模型上下文协议）？讲讲它的核心内容？"
topic: "LLM tool integration"
data_type: "overview"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

介绍 MCP 模型上下文协议的核心概念，梳理 Host、Client、Server、资源、工具和提示词之间的协作关系

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 建立“什么是 MCP（模型上下文协议）？讲讲它的核心内容？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

## Target Audience

- **Knowledge Level**: Intermediate to Expert
- **Context**: 准备 AI 应用开发与大模型工程面试
- **Expectations**: 在短时间内建立可口述、可追问、可落地的答案结构

## Content Type Analysis

- **Data Structure**: overview
- **Key Relationships**: 核心概念、工程实现、边界条件与常见误区之间的关系
- **Visual Opportunities**: 使用原文流程、比较表、组件关系、指标或分区摘要进行可视化

## Key Data Points (Verbatim)

- 模型上下文协议（Model Context Protocol，MCP）是连接 AI 应用与外部系统的开放协议。按 2025-11-25 规范，它使用 JSON-RPC 2.0 消息，并定义 stdio 与 Streamable HTTP 两种标准传输。协议把连接初始化、版本与能力协商、请求响应、通知和安全边界统一起来。

## Source Evidence (Verbatim)

👔面试官：MCP 是新的 Function Calling 格式吗？

🙋我：不是。MCP 标准化应用如何连接上下文与能力提供方，Function Calling 描述模型如何提出调用。

👔面试官：MCP 的核心对象有哪些？

🙋我：架构角色是 Host、Client、Server；Server 可提供 Tools、Resources、Prompts，Client 还可提供 Sampling、Elicitation、Roots 等能力。

## 60 秒回答

模型上下文协议（Model Context Protocol，MCP）是连接 AI 应用与外部系统的开放协议。按 2025-11-25 规范，它使用 JSON-RPC 2.0 消息，并定义 stdio 与 Streamable HTTP 两种标准传输。协议把连接初始化、版本与能力协商、请求响应、通知和安全边界统一起来。

Host 是承载模型和用户界面的应用，Host 为每个 Server 建立 MCP Client 连接。Server 可暴露工具、资源和提示词；Client 可按协商结果支持采样、信息征询和文件系统根目录。MCP 不规定模型必须怎样推理，也不替宿主执行授权与审批。

## 详细解析

### MCP 解决的集成问题

没有协议时，每个 AI 应用都要为数据源和工具编写专用适配。MCP 统一了能力发现与调用消息，使一个 Server 能被多个兼容 Host 接入。它处理的是应用与能力提供方之间的互操作，不是模型训练标准。

协议分为两层：

- **数据层**：JSON-RPC 生命周期、能力原语和消息语义
- **传输层**：本地进程使用 stdio，远程服务使用 Streamable HTTP，也允许自定义传输

### Server 与 Client 能力

Server 侧核心原语各有定位：

- **Tools**：可执行操作，由模型或应用触发
- **Resources**：按 URI 读取的上下文数据
- **Prompts**：Server 提供的可复用提示模板

Client 侧能力用于反向交互。Sampling 让 Server 请求 Host 侧模型生成；Elicitation 让 Server 经 Client 请求用户补充信息；Roots 让 Client 声明可见的文件系统边界。双方只能使用初始化时成功协商的能力。

### MCP 与模型的关系

Host 可以把 MCP 的 Tools 转换成模型供应商的 Function Calling 定义，也可以由确定性工作流触发调用。模型甚至不需要知道 MCP 的存在。MCP Server 不应取得模型供应商密钥。需要生成能力时，它可通过已协商的 Sampling 请求让 Client 代为采样，模型访问凭据仍留在 Client/Host 侧。

## 工程实践与边界

远程 MCP Server 要做资源级授权，不能只验证“已登录”。本地 Server 也不是天然可信：启动命令、环境变量、文件 Roots 和可执行工具都需要用户同意与最小权限。

工具调用仍要做参数校验、授权、超时、有限重试、幂等、补偿和审计。来自 Resource、Tool 结果或 Prompt 的文本可能包含提示注入，Host 应标记来源并限制其影响范围。

## 常见误区

- **MCP 是框架或模型能力**：它是协议，SDK 和 Host 才是具体实现
- **MCP 取代 Function Calling**：Host 常把 MCP Tool 映射到模型工具调用，两者可以组合
- **Resource 就是只读 Tool**：两者的发现、寻址和交互语义不同
- **连上 Server 就可调用全部能力**：能力协商不等于业务授权

## 面试追问

**追问：为什么需要 Host，而不是 Client 直接等于应用？**

Host 管理用户、模型、权限和多个连接；MCP Client 是 Host 内面向一个 Server 的协议会话。

**追问：MCP 是否限定底层必须使用 HTTP？**

不限定。2025-11-25 标准传输包括 stdio 与 Streamable HTTP，并允许自定义传输。

## Layout × Style Signals

- Content type: overview → suggests bento-grid
- Tone: 专业、教育、工程导向 → suggests hand-drawn-edu
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: moderate → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：primary

## Recommended Combinations

1. **bento-grid + hand-drawn-edu** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **hub-spoke + hand-drawn-edu**: 可作为更强调关系或密度的备选
3. **dense-modules + pop-laboratory**: 可作为更强调工程细节的备选
