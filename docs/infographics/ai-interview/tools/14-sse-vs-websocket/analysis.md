---
title: "14. 说说 WebSocket 和 SSE 通信的区别及局限性？"
topic: "LLM tool integration"
data_type: "comparison"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

对比 WebSocket 和 SSE 的通信机制、连接模型和局限性，梳理它们在实时消息和流式输出场景中的取舍

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 比较“说说 WebSocket 和 SSE 通信的区别及局限性？”涉及的主要方案与选型维度
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

- Server-Sent Events（SSE）使用 text/event-stream，让 Server 在 HTTP 响应中持续发送 UTF-8 文本事件。浏览器 EventSource API 是单向的 Server 到 Client，并内建重连与 Last-Event-ID 语义。WebSocket 先经 HTTP Upgrade 握手，再在一条连接上双向传输文本或二进制帧。

## Source Evidence (Verbatim)

👔面试官：WebSocket 功能更多，所以 AI 流式输出就该选它吗？

🙋我：不能这样判断。单向 token 流用 SSE 更贴合 HTTP；高频双向事件才更适合 WebSocket。

👔面试官：SSE 是 WebSocket 的简化版吗？

🙋我：不是。SSE 是 HTTP 事件流，WebSocket 在握手后使用自己的双向帧协议。

## 60 秒回答

Server-Sent Events（SSE）使用 text/event-stream，让 Server 在 HTTP 响应中持续发送 UTF-8 文本事件。浏览器 EventSource API 是单向的 Server 到 Client，并内建重连与 Last-Event-ID 语义。WebSocket 先经 HTTP Upgrade 握手，再在一条连接上双向传输文本或二进制帧。

LLM 文本生成通常是请求一次、服务端持续返回 token，SSE 易于穿过现有 HTTP 网关和鉴权链。实时协作、客户端中途频繁发送控制事件或双向音频数据时，WebSocket 更合适。两者的应用语义、背压、断线恢复和消息去重都需要单独设计。

## 详细解析

### 协议与方向

浏览器 EventSource 只接收 Server 事件，客户端要另发 HTTP 请求。很多模型 API 在 POST 响应中使用 SSE 格式，此时客户端可以使用其他流式解析器，但事件编码仍是 SSE。

WebSocket 支持双方随时发送帧，能传文本和二进制。它不自带业务请求 ID、重放、权限刷新或消息持久化，这些要在应用协议中定义。

### 可靠性与恢复

两者通常都运行在可靠的 TCP 之上，因此都会受到 TCP 队头阻塞影响。SSE 事件可携带 id，浏览器重连时可发送 Last-Event-ID，但 Server 是否保留可重放历史由应用决定。

WebSocket 断线后通常由客户端自建退避重连、心跳、会话恢复和去重。连接恢复不等于上一条业务操作没有执行。

### 基础设施适配

SSE 保留 HTTP 语义，常能复用反向代理、认证、限流和观测。代理仍可能缓冲响应或触发空闲超时，需要显式关闭缓冲并发送心跳。

WebSocket 需要基础设施支持 Upgrade 和长连接。连接状态会影响负载均衡、扩缩容和部署排空，服务端还要限制帧大小与发送速率。

## 工程实践与边界

先按数据流选择：单向文本流用 SSE；持续双向、二进制或高频控制用 WebSocket。再验证代理超时、背压、重连、鉴权过期和灰度发布。

对于工具调用流，要在重连后按调用 ID 去重。副作用操作不能因连接断开自动重放，必须查询状态或使用幂等键。流中内容可能包含提示注入或敏感信息，日志采样也要脱敏。

## 常见误区

- **WebSocket 功能更多就更好**：额外能力也带来状态治理成本
- **SSE 天然保证不丢事件**：重放取决于 Server 是否保存历史
- **SSE 只能配 GET**：EventSource API 用 GET，但 API 的 POST 响应也可采用 SSE 编码
- **建立长连接后无需超时**：仍需连接、空闲、请求和业务截止时间

## 面试追问

**追问：SSE 断线后怎样避免重复展示 token？**

给事件分配单调 ID，客户端记录最后确认位置，Server 支持从该位置恢复，客户端按 ID 去重。

**追问：为什么 WebSocket 不适合直接重放写请求？**

断线时客户端不知道 Server 是否已执行。应使用幂等键或查询业务状态，而不是按连接状态猜测。

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
