---
title: "15. 了解哪些更复杂的 RAG 范式？"
topic: "RAG engineering"
data_type: "overview"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

介绍 Self-RAG、Corrective RAG、Agentic RAG 等复杂 RAG 范式，梳理自检、纠错和多步检索的增强机制

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 建立“了解哪些更复杂的 RAG 范式？”的完整知识框架
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

- 原文没有需要单独强调的定量数据或规范关键词。

## Source Evidence (Verbatim)

## 60 秒回答

复杂 RAG 的共同点是让“是否检索、检索什么、证据是否足够”变成可迭代决策。Self-RAG 在生成中引入检索与自我反思信号；CRAG 评估检索结果并在不可靠时采用纠正动作；RAPTOR 建立递归聚类与摘要树；GraphRAG 从实体关系与社区摘要支持全局问题；Agentic RAG 则让规划器多步选择查询和数据源。

这些方法不是简单的升级阶梯。它们增加模型调用、索引结构、延迟和失败模式。应先确定基础 RAG 的具体瓶颈，再用消融实验验证复杂机制是否改善目标查询。

## 详细解析

### 生成中的自检与纠正

Self-RAG 原论文通过特殊反思 token 学习何时检索并评价生成；它不等同于随便加一个“请反思”的 Prompt。CRAG 使用检索评估器区分结果质量，并采取知识精炼或补充搜索。实现复现应区分论文方法与工程上的简化版本。

### 层次与图结构

RAPTOR 对文本递归聚类并生成摘要，形成可在不同抽象层级检索的树。GraphRAG 构建实体关系图和社区摘要，适合需要跨文档全局理解的查询，但实体抽取、图更新和摘要生成带来额外成本与误差传播。

### 规划式检索

Agentic RAG 根据中间结果决定继续检索、换数据源或停止。它适合开放式、多跳和异构数据任务；简单 FAQ 使用固定管线通常更稳定、便宜且易评估。

## 工程实践与边界

- 给复杂策略设置最大步数、总 token、并发、工具权限与超时预算。
- 将每一步查询、证据、决策和停止原因写入 trace，支持重放。
- 分别评估基础 RAG 与新增策略，报告失败率和成本，不只报告成功案例。
- 外部网页或文档中的指令必须视为不可信数据，不能控制代理或覆盖系统策略。

## 常见误区

- **“高级范式普遍优于 Naive RAG”**：简单任务可能只增加延迟和错误面。
- **“Self-RAG 就是生成后再问模型一次”**：论文包含专门训练与反思信号。
- **“GraphRAG 等于图数据库加向量搜索”**：其流程还涉及图构建、社区检测与摘要。
- **“反思模型能证明自己正确”**：自评会受模型偏差影响，需要外部标注与人工校准。

## 面试追问

1. **如何选择范式？** 先按查询类型分析基础管线失败原因，再选择能直接处理该原因的机制。
2. **何时停止多步检索？** 结合证据充分度、边际新信息、预算和最大步数，且保留确定性上限。
3. **怎么评估 Agentic RAG？** 除答案质量外，评估步骤成功率、无效循环、工具错误、成本和安全违规。

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
