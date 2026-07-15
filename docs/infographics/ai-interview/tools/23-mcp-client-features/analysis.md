---
title: "23. MCP 的 Sampling、Elicitation 和 Roots 是什么？"
topic: "LLM tool integration"
data_type: "overview"
complexity: "complex"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

介绍 MCP 客户端能力 Sampling、Elicitation 与 Roots 的用途、协商方式和安全边界

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 建立“MCP 的 Sampling、Elicitation 和 Roots 是什么？”的完整知识框架
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

- Sampling、Elicitation 和 Roots 是 MCP 的 Client 侧能力，方向与 Server 提供 Tools 不同。Sampling 让 Server 请求 Client 代表它调用模型，模型选择、权限和用户审核留在 Client；2025-11-25 还支持协商带 Tools 的 Sampling。Elicitation 让 Server 通过 Client 请求用户输入，分为结构化表单模式和敏感交互使用的 URL 模式。
- 支持 Roots 的 Client 响应 roots/list，返回当前可见目录。2025-11-25 要求 root URI 使用 file://。如果声明 listChanged，目录变化后 Client 发送 notifications/roots/list_changed。

## Source Evidence (Verbatim)

👔面试官：MCP Server 能直接调用 Host 的模型吗？

🙋我：只有 Client 声明 Sampling 能力后，Server 才能发 sampling/createMessage 请求，最终控制权仍在 Client。

👔面试官：Elicitation 和 Roots 分别解决什么？

🙋我：Elicitation 请求用户补充输入，Roots 让 Client 暴露可见的文件系统根目录边界。

## 60 秒回答

Sampling、Elicitation 和 Roots 是 MCP 的 Client 侧能力，方向与 Server 提供 Tools 不同。Sampling 让 Server 请求 Client 代表它调用模型，模型选择、权限和用户审核留在 Client；2025-11-25 还支持协商带 Tools 的 Sampling。Elicitation 让 Server 通过 Client 请求用户输入，分为结构化表单模式和敏感交互使用的 URL 模式。

Roots 让 Client 返回 file:// URI 形式的文件系统根目录，并可通知列表变化。三者都必须在 initialize 时显式声明，用户可以拒绝请求。它们是能力与范围信号，不会自动授予模型或 Server 操作系统权限。

## 详细解析

### Sampling

Server 发送 sampling/createMessage，请求中包含消息、模型偏好和采样参数。Client 决定实际使用哪个模型、是否修改请求、是否展示给用户，以及是否返回结果。Server 无需持有模型 API key。

规范建议保留 Human-in-the-loop，允许用户查看和拒绝请求。若要在 Sampling 中提供 Tools，Client 必须声明 sampling.tools，Server 不得向未声明该能力的 Client 发送工具化采样请求。

### Elicitation

Form mode 使用受限 JSON Schema 请求普通结构化信息，用户可以 accept、decline 或 cancel。Server 不得用 Form mode 请求密码、API key、access token 或支付凭证。

URL mode 把用户引导到外部页面处理敏感交互。Client 不得预取该 URL；必须在打开前向用户显示完整 URL、突出目标域名，并取得明确导航同意。敏感数据不经过 MCP Client。回到流程后仍要核验状态，不能仅凭重定向假设成功。

### Roots

支持 Roots 的 Client 响应 roots/list，返回当前可见目录。2025-11-25 要求 root URI 使用 file://。如果声明 listChanged，目录变化后 Client 发送 notifications/roots/list_changed。

Roots 帮助 Server 理解工作区边界，但不是完整沙箱。Server 必须规范化路径并防止 ../、符号链接和大小写绕过；Client 的实际文件工具还要强制权限。

## 工程实践与边界

处理 Server 到 Client 的嵌套请求时设置独立超时与并发上限，避免 Tool 调用等待 Elicitation，而界面又阻塞在原请求上。Sampling 的 Prompt、Elicitation 文案和 Roots 名称都来自不可信 Server，展示前要标记来源并过滤恶意内容。

对 Sampling 记录请求来源、用户决定、模型和结果；对 Elicitation 记录同意状态但不记录敏感值；对 Roots 只暴露任务需要的目录。任何副作用仍要参数校验、授权、确认、幂等、补偿和审计。

## 常见误区

- **Sampling 把模型密钥交给 Server**：模型访问留在 Client
- **Elicitation 可以收集任何字段**：敏感凭证必须走 URL mode
- **Roots 等于文件系统权限授予**：它表达范围，实际访问仍需执行控制
- **Client 声明能力后必须接受每次请求**：Client 和用户可以拒绝

## 面试追问

**追问：Sampling 为什么由 Client 选择模型？**

Client 持有模型访问、成本、隐私和用户策略，Server 只能表达偏好，不能绕过这些控制。

**追问：Roots 变化后 Server 怎样处理？**

收到 list_changed 通知后重新调用 roots/list，停止使用已移除目录，并使相关缓存失效。

## Layout × Style Signals

- Content type: overview → suggests bento-grid
- Tone: 专业、教育、工程导向 → suggests hand-drawn-edu
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: complex → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：primary

## Recommended Combinations

1. **bento-grid + hand-drawn-edu** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **hub-spoke + hand-drawn-edu**: 可作为更强调关系或密度的备选
3. **dense-modules + pop-laboratory**: 可作为更强调工程细节的备选
