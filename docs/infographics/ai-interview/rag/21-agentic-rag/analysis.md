---
title: "21. 什么是 Agentic RAG？它和传统 RAG 有什么区别？"
topic: "RAG engineering"
data_type: "comparison"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

解析 Agentic RAG 的规划、工具选择、多步检索和停止条件，并对比固定 RAG 管线的工程取舍

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 比较“什么是 Agentic RAG？它和传统 RAG 有什么区别？”涉及的主要方案与选型维度
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

- 原文没有需要单独强调的定量数据或规范关键词。

## Source Evidence (Verbatim)

## 60 秒回答

传统 RAG 通常是预先定义的单次或固定多阶段管线：改写、检索、重排、生成。Agentic RAG 把部分控制流交给规划器，让它根据问题和中间证据决定是否检索、选择哪个数据源、如何拆分子问题、是否继续搜索或停止。

它适合多跳、开放式或跨异构系统的问题，但也增加循环、错误工具选择、延迟、成本和提示注入风险。生产实现必须限定工具权限、最大步数、预算和停止条件，记录每次决策，并与固定管线做消融。简单 FAQ 通常不需要代理化。

## 详细解析

### 从固定 DAG 到动态控制流

固定 RAG 的节点和顺序由工程师预先确定，行为可预测且易设 SLO。Agentic RAG 中，模型可以生成检索计划，执行一步后观察结果，再决定下一步。ReAct 展示了推理轨迹与动作交替的思路；后续 Agentic RAG 将检索器、数据库、网页或业务 API 作为受控工具。

### 核心组件

- **规划器**：识别子问题、依赖关系与数据源。
- **工具网关**：校验参数、权限、超时和返回大小。
- **证据状态**：保存已获取证据、来源与冲突，而非只累积自然语言历史。
- **停止器**：依据证据充分度、边际新信息、最大步数和预算结束。
- **验证器**：检查最终陈述与可访问证据的支持关系。

动态决策不等于完全自治。权限与预算必须由确定性代码强制执行，模型只能在授权集合内选择。

## 工程实践与边界

- 为每类查询设步骤上限、总 token、工具调用和墙钟时间预算。
- 将工具描述与返回内容分隔，外部内容不得修改系统策略。
- 对只需一次检索的问题走快速固定路径，复杂问题才进入代理流程。
- 评估答案、步骤成功率、无效循环、工具错误、安全违规和单位成功成本。

## 常见误区

- **“Agentic RAG 就是多查几次”**：关键是根据观察动态选择动作与停止，而非固定重复。
- **“模型可以自己判断权限”**：ACL 必须由服务端根据身份强制执行。
- **“反思能保证停止”**：模型可能循环，需要硬性步数和预算上限。
- **“复杂问题都要 Agent”**：确定性工作流往往更稳定，也更易测试。

## 面试追问

1. **怎么判断证据足够？** 结合子问题覆盖、来源质量、冲突和预算；模型评分只是信号，仍需硬上限。
2. **如何防止重复检索？** 对规范化查询和结果 ID 去重，跟踪边际新增证据，连续无新增时停止。
3. **怎么回放一次执行？** 保存状态转移、Prompt/模型版本、工具参数、结果哈希和决策原因。

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
