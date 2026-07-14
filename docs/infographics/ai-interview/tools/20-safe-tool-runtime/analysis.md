---
title: "20. 如何设计安全的工具执行环境？"
topic: "LLM tool integration"
data_type: "data"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

介绍安全工具执行的分层防护，覆盖提示注入、最小权限、沙箱、网络出口、审批与审计

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 识别“如何设计安全的工具执行环境？”的核心指标、信号与评估边界
2. 说明关键工程边界、失败模式与验证方法

## Target Audience

- **Knowledge Level**: Intermediate to Expert
- **Context**: 准备 AI 应用开发与大模型工程面试
- **Expectations**: 在短时间内建立可口述、可追问、可落地的答案结构

## Content Type Analysis

- **Data Structure**: data
- **Key Relationships**: 核心概念、工程实现、边界条件与常见误区之间的关系
- **Visual Opportunities**: 使用原文流程、比较表、组件关系、指标或分区摘要进行可视化

## Key Data Points (Verbatim)

- 原文没有需要单独强调的定量数据或规范关键词。

## Source Evidence (Verbatim)

👔面试官：工具参数通过 JSON Schema 后，可以直接执行吗？

🙋我：不可以。还要做业务校验、主体授权、风险审批和执行隔离。

👔面试官：最大的威胁只是模型幻觉吗？

🙋我：还包括提示注入、越权代理、命令与路径注入、SSRF、数据外泄和恶意工具供应链。

## 60 秒回答

安全工具执行要采用分层控制。入口只暴露当前主体获准的工具；参数先做 Schema 与业务校验；授权按用户、租户、资源和动作判定；高风险副作用要求明确确认。执行器使用最小权限身份，在沙箱中限制文件、进程、网络出口、CPU、内存和时间。

工具结果也不可信，要限制大小、标注来源、脱敏并防止其文本改变高优先级策略。写操作使用幂等键和审计，失败采用有限重试与补偿。密钥放在执行环境，不进入模型上下文。

## 详细解析

### 威胁模型

提示注入可能来自网页、文件、邮件、MCP Resource 或 Tool 结果，诱导 Agent 泄露数据或调用高权限工具。模型还可能成为 confused deputy：攻击者没有权限，却借 Host 的服务身份执行操作。

参数层还要防路径穿越、命令注入、SQL 注入、服务端请求伪造（SSRF）和超大输入。安装本地 MCP Server 或 Skill 脚本时，还存在供应链和启动命令风险。

### 防护链

1. 按主体和任务生成工具允许名单
2. 用严格 Schema 解析，再做业务语义校验
3. 在执行点做资源级授权，不信任模型传入的身份
4. 对外发消息、付款、删除和权限变更请求用户确认
5. 在隔离环境限制文件、进程、网络和资源
6. 对结果做大小限制、脱敏、内容类型与来源标记
7. 记录决策、批准、调用、结果和补偿

确认界面要展示真实动作、目标与影响，不能只问“是否继续”。批量批准要限定工具、参数范围和有效期。

### 密钥与网络

为每个工具分配最小权限凭证，短期令牌优于长期共享密钥。禁止令牌透传给下游未知服务。网络出口使用域名或服务允许名单，并在 DNS 解析后再次检查目标，防止访问元数据和内网地址。

## 工程实践与边界

把执行策略放在模型外的确定性代码中。为每个工具声明风险等级、数据分类、默认超时、是否可重试、是否幂等和是否需审批。用恶意文档、混淆 URL、越权资源 ID 和并发写冲突做回归测试。

沙箱不能代替授权，人工确认也不能代替参数校验。多层控制要让任一层失误时仍难以造成不可逆损失。

## 常见误区

- **系统提示能阻止所有注入**：不可信内容仍可能影响模型决策
- **只读工具没有风险**：它可能读取并泄露敏感数据
- **人工确认解决全部问题**：用户可能看不到被隐藏或误述的参数
- **本地 Server 天然可信**：它继承的文件、环境和网络权限可能过大

## 面试追问

**追问：怎样防止工具结果中的注入继续影响模型？**

标记来源，把结果作为数据而非指令，裁剪内容，并由确定性策略限制后续可调用工具与参数。

**追问：审计日志至少记录什么？**

主体、会话、工具版本、规范化参数摘要、授权决策、确认、幂等键、执行结果、重试与补偿，同时对敏感值脱敏。

## Layout × Style Signals

- Content type: data → suggests dashboard
- Tone: 专业、教育、工程导向 → suggests pop-laboratory
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: moderate → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：primary

## Recommended Combinations

1. **dashboard + pop-laboratory** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **dense-modules + pop-laboratory**: 可作为更强调关系或密度的备选
3. **bento-grid + corporate-memphis**: 可作为更强调工程细节的备选
