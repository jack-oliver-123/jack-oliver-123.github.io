---
title: "21. MCP OAuth 授权流程是怎样的？"
topic: "LLM tool integration"
data_type: "process"
complexity: "complex"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

介绍 MCP 2025-11-25 的 OAuth 授权流程，覆盖资源发现、授权服务器发现、PKCE、令牌使用和工具级授权

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 复述“MCP OAuth 授权流程是怎样的？”的关键流程与控制点
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

- MCP 授权对实现是可选的，但使用 HTTP 传输并支持授权时，应遵循 2025-11-25 规范。MCP Server 充当 OAuth resource server，MCP Client 充当 OAuth client，authorization server 负责用户授权和签发 token。Client 先通过 RFC 9728 Protected Resource Metadata 找到授权服务器，再通过 RFC 8414 或 OpenID Connect Discovery 获取端点。
- 授权码流程必须使用 PKCE，并在技术可行时使用 S256。Client 获取面向该 MCP resource 的 access token，通过 Authorization Bearer header 发送，不能放在 query string。Server 要验证签发方、受众、有效期和 scope，并继续执行工具级授权。
- 当未授权请求收到 401，Client 根据 WWW-Authenticate 或标准位置获取 Protected Resource Metadata。该文档必须包含 `authorization_servers`，且至少列出一个授权服务器；可以列出多个候选，Client 再按策略选择并读取相应授权服务器元数据。

## Source Evidence (Verbatim)

👔面试官：远程 MCP Server 是不是拿一个 API Key 就够了？

🙋我：可以有实现自定义认证，但 2025-11-25 HTTP 授权规范基于 OAuth 2.1 体系，支持代表资源所有者授权。

👔面试官：拿到 access token 后能调用所有工具吗？

🙋我：不能。token 只提供身份与 scope，Server 仍要对每个资源和动作授权。

## 60 秒回答

MCP 授权对实现是可选的，但使用 HTTP 传输并支持授权时，应遵循 2025-11-25 规范。MCP Server 充当 OAuth resource server，MCP Client 充当 OAuth client，authorization server 负责用户授权和签发 token。Client 先通过 RFC 9728 Protected Resource Metadata 找到授权服务器，再通过 RFC 8414 或 OpenID Connect Discovery 获取端点。

授权码流程必须使用 PKCE，并在技术可行时使用 S256。Client 获取面向该 MCP resource 的 access token，通过 Authorization Bearer header 发送，不能放在 query string。Server 要验证签发方、受众、有效期和 scope，并继续执行工具级授权。

## 详细解析

### 发现与注册

当未授权请求收到 401，Client 根据 WWW-Authenticate 或标准位置获取 Protected Resource Metadata。该文档必须包含 `authorization_servers`，且至少列出一个授权服务器；可以列出多个候选，Client 再按策略选择并读取相应授权服务器元数据。

Client 获取 client_id 的优先策略包括：

1. 使用预注册信息
2. 在服务器支持时使用 Client ID Metadata Document
3. 在支持时使用 Dynamic Client Registration
4. 无自动方式时请用户输入客户端信息

这解决的是 OAuth Client 身份，不是最终用户对某个工具的业务权限。

### 授权码与 PKCE

Client 生成 code_verifier 和 code_challenge，在浏览器发起授权请求，并携带目标 resource。回调收到 authorization code 后，Client 用 code_verifier 换 token。PKCE 防止截获的授权码被其他客户端兑换。

Client 应选择最小 scope。Server 返回 insufficient_scope 时，可在用户知情下发起增量授权，不能静默扩大权限。

### 令牌使用

Client 在每个受保护请求的 Authorization header 中发送 Bearer token。MCP Server 必须把自己视为 token 的目标资源，不能把收到的 token 透传给下游 API。下游访问应使用单独的 token exchange 或服务凭证设计。

## 工程实践与边界

token 存储要加密并按用户、Server 与 resource 隔离，日志不得记录 token。处理刷新、撤销、过期和账号切换，防止一个会话复用另一用户的凭证。

OAuth 不替代参数校验、资源级授权、用户确认、超时、有限重试、幂等、补偿和审计。stdio Server 不应套用该 HTTP 流程，规范建议从环境中取得凭证，并由 Host 管控进程权限。

## 常见误区

- **OAuth 负责工具发现**：它负责授权，工具发现由 MCP 能力完成
- **有 token 就能调用全部工具**：Server 必须按 scope、主体和资源继续授权
- **access token 可以传给下游服务**：token passthrough 会破坏受众边界
- **stdio 也通过浏览器走同一流程**：规范的 OAuth 流程针对 HTTP 传输

## 面试追问

**追问：为什么先发现 Protected Resource Metadata？**

Client 需要确认目标资源对应哪些授权服务器，并把 token 绑定到正确 resource，避免把凭证发错服务。

**追问：为什么 MCP 要强制 PKCE？**

它把授权码与发起流程的 Client 实例绑定，降低授权码截获和注入风险。

## Layout × Style Signals

- Content type: process → suggests linear-progression
- Tone: 专业、教育、工程导向 → suggests hand-drawn-edu
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: complex → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：primary

## Recommended Combinations

1. **linear-progression + hand-drawn-edu** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **winding-roadmap + hand-drawn-edu**: 可作为更强调关系或密度的备选
3. **circular-flow + technical-schematic**: 可作为更强调工程细节的备选
