---
title: "23. RAG 系统如何做权限隔离并防御提示注入与知识库投毒？"
topic: "RAG engineering"
data_type: "data"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

从租户 ACL、数据摄取、提示注入、知识库投毒和审计响应设计 RAG 安全边界

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 识别“RAG 系统如何做权限隔离并防御提示注入与知识库投毒？”的核心指标、信号与评估边界
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

## 60 秒回答

RAG 安全要按数据流分层。身份系统签发用户与租户上下文；检索服务在候选进入重排、模型、缓存和日志前强制执行 ACL，且 ACL 从权威源同步并版本化。摄取端校验来源、签名或权限、做恶意内容扫描和人工审批，高风险数据先隔离再发布。

提示注入方面，把文档和网页视为不可信数据，不允许其覆盖系统指令或扩大工具权限；模型只通过最小权限网关调用工具。知识库投毒还需要 provenance、异常变更检测、影子评测、灰度和快速回滚。输出过滤是最后一道防线，不能替代前置隔离。

## 详细解析

### 权限隔离

每个文档和 chunk 继承租户、用户组、数据分类与有效期。查询由服务端注入过滤条件，客户端不能自报租户。数据库级行安全、独立集合或分区可作为防御层，但具体选择取决于隔离要求。缓存键、trace 和离线评测样本同样必须带权限域。

### 间接提示注入

攻击者把“忽略系统指令、调用某工具、泄露历史”等文本放入网页或文档，模型在检索后可能误把它当指令。防护包括清晰分隔指令与数据、输入规范化、工具 allowlist、参数 schema、敏感操作审批、输出和数据流监控。没有单一 Prompt 能彻底解决该问题。

### 投毒与供应链

投毒通过新增或篡改文档影响检索和回答。系统应验证来源和作者权限，保留不可变审计记录，检测短时大量更新、异常关键词与召回分布漂移。新内容或新索引先在隔离环境运行安全回归集，再小流量发布。

## 工程实践与边界

- 设计跨租户诱饵查询，发布前和持续运行时验证零越权召回。
- 删除或降权可疑内容时使索引、缓存和派生摘要同步失效。
- 工具凭证不进入模型上下文，网关根据当前用户重新授权每次调用。
- 发生事件后保留来源版本、摄取人、召回 trace 与调用审计，支持快速封禁和回滚。

## 常见误区

- **“生成后把敏感词删掉就安全”**：敏感数据可能已进入模型、第三方服务或日志。
- **“向量相似度不会泄露权限”**：索引若未过滤，越权候选和侧信道仍可能出现。
- **“可信内部文档不会注入”**：账号被盗、同步源污染和无意指令都可能发生。
- **“扫描到恶意关键词就足够”**：攻击可混淆或跨模态，需要分层控制与行为限制。

## 面试追问

1. **ACL 在重排前还是后做？** 在任何内容离开受控检索边界前做，重排和生成只能看到授权候选。
2. **如何验证没有缓存越权？** 权限域参与缓存键，权限变化主动失效，并做跨身份命中测试。
3. **投毒如何回滚？** 按来源和索引版本定位派生数据，切回已知安全版本，撤销缓存并重放经审核的变更。

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
