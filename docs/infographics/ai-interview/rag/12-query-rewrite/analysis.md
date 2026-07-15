---
title: "12. 如何润色用户的 Query（Query Rewrite）？目的是什么？"
topic: "RAG engineering"
data_type: "process"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

介绍 Query Rewrite 的目标和实现方式，梳理指代消解、问题扩写、查询改写与检索效果提升之间的关系

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 复述“如何润色用户的 Query（Query Rewrite）？目的是什么？”的关键流程与控制点
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

Query Rewrite 不是让问题“更好看”，而是把用户表达转换成更适合目标检索器的查询，同时保持原意。常见目标包括指代消解、拼写与实体规范化、补充必要上下文、拆分复合问题、为不同数据源生成查询，以及多查询扩展。

我会保留原查询作为基线或并行召回路，并约束改写器不得臆造实体与条件。上线前按查询类型比较原查询和改写后的 Recall@K、无答案误召、延迟与成本；失败时回退原查询。HyDE、Step-back 和多查询扩展都是可选策略，不应默认对所有请求启用。

## 详细解析

### 规则与模型改写

日期、产品编号和术语可用确定性规则规范化；会话指代和自然语言歧义可由模型处理。改写输出最好是结构化对象，包含独立问题、实体、时间范围、过滤条件与置信信息，并将用户原始约束原样保留。

### 查询扩展与分解

多查询扩展从不同措辞召回候选，适合表达多样的语义问题，但会增加噪声。问题分解适合多跳问题，每个子问题独立检索，再按依赖关系合并。Step-back 生成更抽象的问题以查找背景原则；它可能丢失具体限定，因此应与原查询并行。

HyDE 先生成假想答案或文档，再对其做向量检索。它的价值来自更接近文档分布的表示，不代表假想内容是真实证据；最终回答仍只能依据实际召回文档。

## 工程实践与边界

- 在 Prompt 中把会话历史和检索语料明确分隔，减少文档指令影响改写器。
- 对实体、日期和否定条件做前后校验，检测语义漂移。
- 限制生成查询数量、长度和并发，并对重复查询去重。
- 记录原查询、改写和各自候选，才能定位收益或回归。

## 常见误区

- **“改写越详细越好”**：模型补出的细节可能缩窄召回或改变用户意图。
- **“聊天历史全部拼入查询”**：会引入无关信息和越权上下文。
- **“HyDE 生成的文档可以直接作证据”**：它只是检索中间表示。
- **“Recall 提升就代表端到端提升”**：噪声、延迟和上下文竞争也会增加。

## 面试追问

1. **如何检测语义漂移？** 比较实体、时间、否定词和约束，抽样人工审核，并保留原查询召回作为保护路。
2. **何时使用问题分解？** 问题包含多个实体关系、步骤或必须先得到中间答案时；简单事实不值得增加链路。
3. **改写器被注入怎么办？** 将用户输入视为数据，使用最小权限、结构化输出和长度限制，不允许它直接决定 ACL。

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
