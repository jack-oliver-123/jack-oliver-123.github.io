---
title: "14. RAG 检索优化策略有哪些？"
description: "介绍 RAG 检索优化的核心策略，梳理 Query 处理、多路召回、Rerank、过滤和上下文拼接的优化思路"
tags: ["AI应用开发", "RAG"]
draft: false
featured: false
---

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

## 参考资料

- [Dense Passage Retrieval for Open-Domain Question Answering](https://arxiv.org/abs/2004.04906)
- [ColBERTv2: Effective and Efficient Retrieval via Lightweight Late Interaction](https://arxiv.org/abs/2112.01488)
- [BEIR: A Heterogeneous Benchmark for Zero-shot Evaluation of Information Retrieval Models](https://arxiv.org/abs/2104.08663)
- [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172)
