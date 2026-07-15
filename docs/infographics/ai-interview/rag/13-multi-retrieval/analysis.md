---
title: "13. 什么是多路召回？具体怎么做？"
topic: "RAG engineering"
data_type: "process"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

系统介绍多路召回的设计方法，梳理向量检索、关键词检索、结构化过滤和结果融合在 RAG 中的配合

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 复述“什么是多路召回？具体怎么做？”的关键流程与控制点
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

- 多路召回是让不同检索器并行产生候选，利用它们的互补性提高相关证据进入候选集的概率。常见路包括 BM25、稠密向量、字段或图查询，以及不同查询改写。每路先应用租户、ACL、版本和时间过滤，再按文档或 chunk ID 去重，通过 RRF、学习排序或经校准的分数融合，最后由 reranker 精排。
- **“多路召回等于向量加 BM25”**：这是常见组合，不是定义；结构化、图或多模态检索也可以是一条路。

## Source Evidence (Verbatim)

## 60 秒回答

多路召回是让不同检索器并行产生候选，利用它们的互补性提高相关证据进入候选集的概率。常见路包括 BM25、稠密向量、字段或图查询，以及不同查询改写。每路先应用租户、ACL、版本和时间过滤，再按文档或 chunk ID 去重，通过 RRF、学习排序或经校准的分数融合，最后由 reranker 精排。

关键不是路数越多越好，而是测量每路的独有贡献。应报告单路、候选并集、融合后和重排后的 Recall@K、nDCG、延迟与成本，并按查询类型路由弱项不同的召回器。

## 详细解析

### 候选生成

关键词路覆盖专名、编号和精确短语；稠密路覆盖语义改写；结构化路适合明确字段、时间或实体关系。多查询可以作为同一召回器的多个入口，但要限制数量并去重。每一路都要有独立超时，某一路失败时系统应明确降级状态。

### 融合与重排

候选统一为包含 `document_id`、`chunk_id`、来源路、原始名次和版本的记录。RRF 使用名次，避免跨检索器直接比较不可校准分数。学习融合需要带标签数据和稳定特征。合并后可用 cross-encoder 对查询与候选联合打分，再按 token 预算选择上下文。

### 评估贡献

先看 union recall：如果新增一路几乎不带来独有相关文档，它可能只增加成本。再看融合损失：相关文档进入并集却在融合后掉出 Top-K，说明排序策略有问题。最后评估重排是否改善前列质量。

## 工程实践与边界

- 为各路设置配额，避免高产噪声路淹没其他候选。
- 统一稳定 ID 和版本，否则同一内容难以去重。
- 融合参数与候选深度通过验证集选择，并在查询分布变化后重新校准。
- 超时降级要记录实际启用的召回路，避免将不完整请求混入正常指标。

## 常见误区

- **“多路召回等于向量加 BM25”**：这是常见组合，不是定义；结构化、图或多模态检索也可以是一条路。
- **“候选取并集就完成了”**：仍需去重、融合、重排与预算控制。
- **“RRF 不需要调参”**：常数和每路候选深度会影响结果。
- **“某路失败不影响正确性”**：对依赖该路的查询可能是显著降级，应被监控。

## 面试追问

1. **如何分配每路 Top-K？** 从独有召回贡献、延迟和重排容量出发，用验证集选择，而不是平均分配。
2. **为什么不直接拼接分数？** 不同检索器分数的范围、方向和校准可能不同。
3. **如何做查询路由？** 用可解释规则或分类器识别编号、自然语言和关系查询，并保留离线混淆分析与兜底路。

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
