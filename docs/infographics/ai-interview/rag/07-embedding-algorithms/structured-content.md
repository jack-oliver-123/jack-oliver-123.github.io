# 7. Embedding 有哪几种算法你了解过吗？

## Overview

介绍常见 Embedding 算法与训练思路，梳理稠密向量、对比学习、双塔模型和语义匹配之间的关系

## Learning Objectives

The viewer will understand:

1. 建立“Embedding 有哪几种算法你了解过吗？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

可以从表示粒度与检索方式来回答。Word2Vec、GloVe、fastText 产生静态词向量；ELMo 和 BERT 产生依上下文变化的 token 表示，其中 BERT 是多层双向 Transformer 编码器。用于语义检索时，Sentence-BERT、DPR、Contriever、E5、BGE 等方法通过双塔和对比学习得到可独立编码的查询、文档向量。

另外还有 SPLADE 这类学习稀疏表示，以及 ColBERT 的 late interaction 多向量表示。它们在效果、索引体积和在线计算之间取舍不同。工程选型应按任务数据评测，而不是把所有方法简单按“代际”排序。

## 详细解析

### 从词到上下文表示

静态词向量为一个词类型提供固定表示，难以区分多义词。ELMo 利用双向语言模型生成上下文化表示。BERT 采用 Transformer 编码器和预训练目标生成上下文 token 表示，但原始 BERT 目标并不是直接优化句子余弦检索。

### 双塔稠密检索

双塔分别编码查询与文档，并用点积或余弦等函数比较，因此文档可预计算。DPR 使用问答数据中的正负段落训练；Sentence-BERT 用孪生或三元组结构降低句对比较成本；E5 等方法把文本嵌入统一为“文本到文本”的对比学习任务。

### 稀疏与多向量表示

SPLADE 学习词表维度上的稀疏权重，保留可解释的词项匹配，并可使用倒排索引。ColBERT 为每个 token 保存向量，在查询时进行 MaxSim late interaction，通常比单向量保留更多细粒度匹配信息，但索引和计算更重。

## 工程实践与边界

- 查询与文档是否共享编码器、是否需要前缀，必须按模型卡执行。
- 困难负样本对检索训练很重要，但错误负样本会把相关内容推远。
- 领域微调前保留通用基准和目标领域基准，观察是否发生能力退化。
- 多向量或稀疏模型需要相应索引能力，不能只替换模型而不改检索链路。

## 常见误区

- **“BERT 是 Embedding 算法的最终形态”**：BERT 是编码器架构与预训练方法，检索还需要合适的池化和训练目标。
- **“上下文向量普遍优于词法检索”**：编号、专有名词和精确短语常由词法检索更稳定命中。
- **“稀疏表示就是 BM25”**：BM25 是经典词项排序函数，SPLADE 是学习得到的稀疏表示。
- **“所有双塔都用余弦”**：模型可能按点积等目标训练，应遵循模型说明。

## 面试追问

1. **Cross-encoder 为什么通常不做全库召回？** 它联合编码查询和文档，难以预计算每个查询对，通常用于少量候选重排。
2. **怎样选负样本？** 混合随机负样本和由当前检索器召回的困难负样本，并过滤可能相关的假负例。
3. **何时考虑 ColBERT？** 当细粒度匹配收益能覆盖更大的索引与在线交互成本时，通过目标数据验证。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

可以从表示粒度与检索方式来回答。Word2Vec、GloVe、fastText 产生静态词向量；ELMo 和 BERT 产生依上下文变化的 token 表示，其中 BERT 是多层双向 Transformer 编码器。

另外还有 SPLADE 这类学习稀疏表示，以及 ColBERT 的 late interaction 多向量表示。它们在效果、索引体积和在线计算之间取舍不同。工程选型应按任务数据评测，而不是把所有方法简单按“代际”排序。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 从词到上下文表示
静态词向量为一个词类型提供固定表示，难以区分多义词。

### 双塔稠密检索
双塔分别编码查询与文档，并用点积或余弦等函数比较，因此文档可预计算。

### 稀疏与多向量表示
SPLADE 学习词表维度上的稀疏权重，保留可解释的词项匹配，并可使用倒排索引。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 查询与文档是否共享编码器、是否需要前缀，必须按模型卡执行。
- 困难负样本对检索训练很重要，但错误负样本会把相关内容推远。
- 领域微调前保留通用基准和目标领域基准，观察是否发生能力退化。
- 多向量或稀疏模型需要相应索引能力，不能只替换模型而不改检索链路。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“BERT 是 Embedding 算法的最终形态”**：BERT 是编码器架构与预训练方法，检索还需要合适的池化和训练目标。
- **“上下文向量普遍优于词法检索”**：编号、专有名词和精确短语常由词法检索更稳定命中。
- **“稀疏表示就是 BM25”**：BM25 是经典词项排序函数，SPLADE 是学习得到的稀疏表示。
- **“所有双塔都用余弦”**：模型可能按点积等目标训练，应遵循模型说明。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 可以从表示粒度与检索方式来回答。Word2Vec、GloVe、fastText 产生静态词向量；ELMo 和 BERT 产生依上下文变化的 token 表示，其中 BERT 是多层双向 Transformer 编码器。用于语义检索时，Sentence-BERT、DPR、Contriever、E5、BGE 等方法通过双塔和对比学习得到可独立编码的查询、文档向量。
- 双塔分别编码查询与文档，并用点积或余弦等函数比较，因此文档可预计算。DPR 使用问答数据中的正负段落训练；Sentence-BERT 用孪生或三元组结构降低句对比较成本；E5 等方法把文本嵌入统一为“文本到文本”的对比学习任务。
- **“稀疏表示就是 BM25”**：BM25 是经典词项排序函数，SPLADE 是学习得到的稀疏表示。

---

## Design Instructions

### Style Preferences

- 使用 manifest 中已确认的版式与风格
- 保持简体中文清晰可读，技术名词按原文拼写

### Layout Preferences

- 横版 16:9
- 标题突出，主要信息区不超过 4 个

### Other Requirements

- 仅使用上面的原文内容，不添加事实、示例、数值或来源
- 不生成品牌标志、水印、页脚引用或装饰性长文
