---
title: "20. 如何防范 Prompt Injection、工具滥用与敏感数据泄露？"
topic: "AI Agent engineering"
data_type: "process"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

系统介绍 Agent 面对提示注入、越权工具调用和敏感数据泄露时的分层防护方案

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 复述“如何防范 Prompt Injection、工具滥用与敏感数据泄露？”的关键流程与控制点
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

- 原文没有需要单独强调的定量数据或规范关键词。

## Source Evidence (Verbatim)

## 60 秒回答

核心原则是把模型视为不可信决策者，把网页、邮件、文档和工具输出视为不可信数据。Prompt 过滤不能单独解决注入；应采用分层控制：指令与数据分离、最小工具集合、运行时鉴权、参数校验、网络与文件沙箱、敏感数据最小化、高风险动作审批，以及完整审计和对抗评测。

模型不应直接持有长期生产凭据。每次工具调用由宿主依据真实用户身份、租户、资源和动作重新授权。即使模型被注入，攻击者也只能触及被明确允许的最小能力。

## 详细解析

直接 Prompt Injection 来自用户输入，间接注入藏在 Agent 读取的网页、文档或消息中。攻击目标通常是改变任务、窃取上下文、诱导调用工具或把数据发送到外部。因为自然语言中的“数据”和“指令”没有天然强隔离，单纯要求模型“忽略恶意内容”不构成安全边界。

防护应覆盖：

1. **输入与上下文**：标记来源和信任级别，隔离外部内容，不把检索文本拼进高优先级政策。
2. **能力**：按任务动态提供所需的最小工具集合；读写分离，参数使用 allowlist 和业务规则校验。
3. **身份与授权**：工具网关依据用户和资源做服务端授权，短期凭据按调用注入。
4. **数据外流**：限制网络目的地、响应大小和敏感字段，阻止跨租户与未授权外发。
5. **副作用**：预览、审批、幂等、速率限制和异常行为检测。

安全失败应默认关闭：授权信息缺失、策略服务不可用或审批过期时拒绝高风险动作，而不是为了可用性放行。

## 工程实践与边界

- 工具参数来自模型也必须按 schema、资源归属和业务策略校验，防止路径穿越、SQL 注入和不安全直接对象引用（IDOR）。
- 搜索、浏览器和代码执行运行在隔离环境，限制文件、网络、进程、CPU、时间和输出。
- 密钥保存在凭据代理，模型只看到工具别名；日志、错误和记忆中清除 secret 与不必要的个人可识别信息（PII）。
- 将数据读取权限与外发权限分开，防止 Agent 读取敏感信息后通过邮件或 HTTP 工具泄露。
- 建立包含越权、间接注入、编码混淆、工具链跳转和跨租户场景的红队与回归集。

## 常见误区

- **“System Prompt 优先级高，所以不会被注入”**：模型仍可能被外部内容误导，真正边界必须在运行时。
- **“检测到关键词就能过滤注入”**：攻击可改写或编码，且正常文档也可能讨论恶意指令。
- **“工具 schema 能保证安全”**：schema 只验证形状，不能替代资源授权和业务规则。
- **“用户点过一次允许就永久可信”**：审批应绑定具体动作、参数、时效和目标。

## 面试追问

> **面试官：** Agent 需要读邮箱又要发邮件，如何降低泄露风险？
>
> **候选人：** 使用不同权限工具，限制收件域和附件，发信前显示最终内容与来源并审批，敏感内容命中策略时阻断。

> **面试官：** 外部网页要求 Agent 忽略规则怎么办？
>
> **候选人：** 把网页作为低信任数据，不执行其中指令；提取事实时保留来源，任何工具动作仍经过独立策略检查。

> **面试官：** 如何测试跨租户隔离？
>
> **候选人：** 构造两个租户的相似资源和记忆，尝试通过自然语言、直接 ID、检索和工具参数越权，并在存储层验证均被拒绝。

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
