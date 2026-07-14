---
title: "22. MCP 如何管理生命周期、能力协商与协议版本？"
topic: "LLM tool integration"
data_type: "process"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

介绍 MCP 连接初始化、协议版本协商、能力声明、正常操作、超时和关闭流程

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 复述“MCP 如何管理生命周期、能力协商与协议版本？”的关键流程与控制点
2. 说明关键工程边界、失败模式与验证方法

## Target Audience

- **Knowledge Level**: Intermediate to Expert
- **Context**: 准备 AI 应用开发与大模型工程面试
- **Expectations**: 在短时间内建立可口述、可追问、可落地的答案结构

## Content Type Analysis

- **Data Structure**: process
- **Key Relationships**: 核心概念、工程实现、边界条件与常见误区之间的关系
- **Visual Opportunities**: 使用原文流程、比较表、组件关系、指标或分区摘要进行可视化

## Key Data Points (Verbatim)

- 连接池按 Server、身份、协议版本和会话隔离。保存协商结果，发送每个请求前检查能力。Streamable HTTP 的 SSE 流中断后，Client 可在同一会话中携带 `MCP-Session-Id`，并用 `Last-Event-ID` 恢复消息，无需重新初始化；只有会话 ID 返回 HTTP 404、Server 已丢失会话状态或 Client 明确建立新会话时，才重新发送 `initialize`，且不得沿用旧能力缓存。
- **MCP 有统一 shutdown RPC**：2025-11-25 通过传输关闭

## Source Evidence (Verbatim)

👔面试官：Client 连上 MCP Server 后，可以先调用 tools/list 再初始化吗？

🙋我：不可以。initialize 必须是首个协议交互，随后 Client 发送 initialized，才进入正常操作。

👔面试官：双方版本不同怎么办？

🙋我：Server 返回它支持的版本；Client 不支持该版本时应断开，不能猜测兼容。

## 60 秒回答

MCP 生命周期分初始化、正常操作和关闭。Client 先发送 initialize，包含自己支持的 protocolVersion、capabilities 和 implementation 信息。Server 若支持请求版本就回同一版本，否则回它支持的另一个版本。Client 不支持 Server 所选版本时应断开；接受后发送 notifications/initialized。

能力是显式协商的。Client 可能声明 Roots、Sampling、Elicitation，Server 可能声明 Tools、Resources、Prompts 等。双方只能使用成功协商的能力。HTTP 后续请求还必须携带 MCP-Protocol-Version header。关闭没有专用 JSON-RPC 消息，而是由底层传输完成。

## 详细解析

### 初始化顺序

initialize 建立三类共同信息：

- **协议版本**：决定消息和字段语义
- **能力**：决定可发送哪些可选请求与通知
- **实现信息**：用于标识 Client 与 Server 软件

Client 在 Server 返回 initialize 结果前，除 Ping 外不应发送其他请求。Server 收到 initialized 后才进入正常操作。乱序初始化会导致状态与能力判断不一致。

### 版本协商

Client 应发送自己支持的最新版本。Server 支持时必须原样返回；不支持时返回自己支持的版本，通常也是其最新版本。Client 必须显式判断是否支持。

MCP 核心版本采用日期标识。SDK 版本与协议版本是两件事，升级 npm 或 PyPI 包不代表远端自动切换协议。兼容测试应按协商后的协议版本运行。

### 能力协商

能力字段的存在代表支持，对应子字段可声明 listChanged 或 Sampling tools 等细分能力。运行时列表变化通知只在相应能力声明后发送。能力协商说明“协议会说这种消息”，不说明“当前用户获准使用具体工具”。

### 超时与关闭

所有请求都应有超时，收到进度通知可以延长等待，但不能无限延长。取消通知表达不再需要结果，执行端是否能撤销副作用仍取决于业务。

stdio 通过关闭输入流并等待子进程退出完成关闭；HTTP 通过关闭连接，并可按 Streamable HTTP 会话规则发 DELETE。规范没有 MCP 专用 shutdown 消息。

## 工程实践与边界

连接池按 Server、身份、协议版本和会话隔离。保存协商结果，发送每个请求前检查能力。Streamable HTTP 的 SSE 流中断后，Client 可在同一会话中携带 `MCP-Session-Id`，并用 `Last-Event-ID` 恢复消息，无需重新初始化；只有会话 ID 返回 HTTP 404、Server 已丢失会话状态或 Client 明确建立新会话时，才重新发送 `initialize`，且不得沿用旧能力缓存。

版本升级使用契约测试覆盖 tools/list、参数 Schema、通知、错误和取消。调用执行仍需授权、超时、重试、幂等、补偿与审计，协议版本协商不会解决业务兼容。

## 常见误区

- **连接建立就等于初始化完成**：还要完成 initialize 与 initialized
- **Server 必须接受 Client 的版本**：不支持时可以返回另一个版本
- **能力声明就是用户授权**：协议支持与业务权限分离
- **MCP 有统一 shutdown RPC**：2025-11-25 通过传输关闭

## 面试追问

**追问：为什么 HTTP 请求要带 MCP-Protocol-Version？**

它让无状态或多请求的 HTTP Server 按已协商版本解析后续消息。

**追问：Server 新增工具，需要重新初始化吗？**

若已协商工具列表变化通知，可以通知 Client 重新列举；协议能力本身改变则应建立新会话并重新初始化。

## Layout × Style Signals

- Content type: process → suggests linear-progression
- Tone: 专业、教育、工程导向 → suggests hand-drawn-edu
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: moderate → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：primary

## Recommended Combinations

1. **linear-progression + hand-drawn-edu** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **winding-roadmap + hand-drawn-edu**: 可作为更强调关系或密度的备选
3. **circular-flow + technical-schematic**: 可作为更强调工程细节的备选
