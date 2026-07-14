---
title: "14. RAG 检索优化策略有哪些？"
topic: "RAG engineering"
data_type: "overview"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

介绍 RAG 检索优化的核心策略，梳理 Query 处理、多路召回、Rerank、过滤和上下文拼接的优化思路

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 建立“RAG 检索优化策略有哪些？”的完整知识框架
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

检索优化应按误差链路做，而不是罗列技巧。先建立带相关文档标注的查询集，区分解析失败、索引缺失、查询表达、候选召回、过滤、融合、重排和上下文打包问题。然后从数据治理与切块、Embedding/稀疏索引、查询改写、多路召回、元数据过滤、reranker 和上下文选择逐层做消融。

每次改动同时看 Recall@K、MRR/nDCG、延迟、资源、无答案误召和端到端答案质量。Top-K、chunk 长度、阈值或 ANN 参数都没有通用最佳值，应在固定模型、数据、硬件和负载下选择。

## 详细解析

### 数据和索引层

高质量解析、去重、标题路径、稳定 ID 与版本信息通常比盲目换模型更基础。针对文档类型选择切块；对编号和专名保留稀疏索引；Embedding 变更时重建向量。ANN 参数要通过精确检索基准校准召回损失。

### 查询和召回层

对会话问题做指代消解，对复合问题做受控分解。混合检索利用词法与语义互补，结构化过滤缩小合法范围。过滤不是纯性能选项，它还承担 ACL 与时效正确性。

### 排序和上下文层

reranker 用更高计算成本改善少量候选的排序。上下文打包要去重、合并相邻片段、保留标题与来源，并防止单一文档占满预算。若答案需要多个证据，评测应标注证据集合而非单个 chunk。

## 工程实践与边界

- 建立失败分类看板，每类保留代表样本，优先优化占比和业务损失都高的问题。
- 对每层做可回滚配置和影子实验，避免同时换切块、模型和提示词后无法归因。
- 评测至少重复运行模型裁判类指标，报告方差并定期人工校准。
- 新索引先离线验收，再影子读和小流量灰度；监控质量代理指标及 SLO。

## 常见误区

- **“检索优化就是调 Top-K”**：召回链路包含数据、索引、查询、过滤、融合和排序。
- **“Recall 越高答案越好”**：更多候选也可能带来冲突和上下文噪声。
- **“换榜单更强的 Embedding 就能提升”**：领域、语言和检索配置可能不匹配。
- **“线上点击率足够评估”**：点击受位置与交互偏差影响，且不直接证明答案忠实。

## 面试追问

1. **相关文档没进候选怎么办？** 检查索引覆盖、ACL、查询表示和 ANN 召回，再决定改切块、增加召回路或调搜索参数。
2. **进候选但没进上下文怎么办？** 检查融合、重排、去重和预算策略，用候选阶段指标定位掉点。
3. **如何控制实验污染？** 固定评测快照和版本，一次改变一个主要变量，并隔离在线流量分组。

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
