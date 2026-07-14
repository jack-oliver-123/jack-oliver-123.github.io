---
title: "1. 什么是 RAG？详细描述一个完整 RAG 系统的详细工作流程？"
topic: "RAG engineering"
data_type: "process"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

系统介绍 RAG 的检索增强生成原理，拆解离线建库、在线检索、重排和生成输出的完整工作流程

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 复述“什么是 RAG？详细描述一个完整 RAG 系统的详细工作流程？”的关键流程与控制点
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

- 4. 生成稠密向量；需要精确词匹配时，同时建立 BM25 等稀疏索引。

## Source Evidence (Verbatim)

## 60 秒回答

RAG（Retrieval-Augmented Generation，检索增强生成）是在生成模型回答前，从外部知识源检索相关证据，并把证据连同问题交给模型。它把“知识如何更新”与“模型参数如何训练”分开，使私有或频繁变化的知识可以按数据流程更新，也能为答案提供可核验的出处。

完整系统分为离线和在线两条链路。离线链路负责采集、解析、切块、权限标注、向量化和建索引；在线链路负责鉴权、查询理解、候选召回、过滤、融合或重排、上下文组装、生成、引用校验与监控。RAG 不等于向量搜索，也不能保证零幻觉；生产质量取决于数据、检索、生成和评测闭环共同工作。

## 详细解析

### 离线建库

1. 从文档库、数据库或业务 API 采集数据，记录来源、版本、时间和访问控制信息。
2. 解析正文、标题、表格等结构，清洗重复内容，同时保留可追溯的文档 ID。
3. 按语义与版面边界切块，为每个 chunk 生成稳定 ID 和元数据。
4. 生成稠密向量；需要精确词匹配时，同时建立 BM25 等稀疏索引。
5. 将正文、向量和元数据写入索引，通过离线查询集验证召回后再发布版本。

### 在线回答

请求先经过身份认证和租户过滤，再做拼写归一、指代消解或问题改写。系统从一个或多个索引召回候选，应用 ACL 和时效过滤，随后融合并重排。上下文组装器去重、控制 token 预算，并保留来源映射。模型按“只基于证据回答、证据不足时说明不足”的策略生成结果，服务端再校验引用、敏感信息和输出格式。

Lewis 等人的原始 RAG 工作把参数化知识与非参数化检索结合起来；工程系统在此基础上增加了权限、版本、可观测性和回滚能力。

## 工程实践与边界

- 为采集、解析、切块、Embedding、索引分别记录版本，才能定位回归并复现一次回答。
- 监控至少拆成检索命中、重排质量、答案忠实度、端到端延迟和成本，不能只看最终点赞率。
- 发布新索引时先跑固定评测集，再小流量灰度；保留旧索引别名以便回滚。
- 检索不到证据时应降级为澄清、拒答或转人工。仅靠提示词不能补回缺失证据。

## 常见误区

- **“RAG 就是向量数据库”**：向量库只承担部分检索能力，解析、权限、重排和生成同样关键。
- **“把 Top-K 文档塞给模型即可”**：候选可能重复、过时或越权，必须过滤并控制上下文。
- **“用了 RAG 就没有幻觉”**：模型仍可能忽略或曲解证据，引用也可能与陈述不对应。
- **“索引更新后立即全量生效”**：分布式系统存在构建、加载和缓存传播过程，应定义新鲜度 SLO。

## 面试追问

1. **为什么把 ACL 放在检索阶段？** 尽早过滤可减少越权内容进入重排器、模型和日志的机会；生成后过滤不能撤销已经发生的数据暴露。
2. **如何定位答案错误？** 保存查询、候选集、重排结果、最终上下文、模型版本和引用映射，分层判断是数据、检索还是生成问题。
3. **RAG 与搜索系统的区别？** 搜索返回文档，RAG 还会基于文档合成回答，因此多了忠实度、引用和生成安全风险。

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
