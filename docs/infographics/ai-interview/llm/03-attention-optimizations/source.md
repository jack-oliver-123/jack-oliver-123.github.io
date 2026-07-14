---
title: "3. 多头注意力（MHA）有哪些局限？MQA、GQA、Flash Attention 怎么解决？"
description: "比较 MHA、MQA、GQA 与 FlashAttention，说明它们分别优化 KV Cache、带宽和注意力计算的边界"
tags: ["AI应用开发", "大模型工程"]
draft: false
featured: false
---

## 60 秒回答

多头注意力（Multi-Head Attention，MHA）为每个查询头配置独立的 Key/Value 头，表达能力强，但自回归解码要保存较大的 KV Cache，并从显存反复读取。多查询注意力（Multi-Query Attention，MQA）让所有查询头共享一组 Key/Value，缓存最小；分组查询注意力（Grouped-Query Attention，GQA）让若干查询头共享一组 Key/Value，在质量和带宽之间取中间点。

FlashAttention 解决的是另一层问题。它通过分块和在线 softmax 减少高带宽内存读写，计算结果仍是精确注意力。它不会把 MHA 自动变成 GQA，也不会消除长期保存的 KV Cache。

## 详细解析

若每层序列长度为 $S$、KV 头数为 $H_{kv}$、每头维度为 $D$、元素字节数为 $B$，单请求单层 KV Cache 近似为：

$$
2\times S\times H_{kv}\times D\times B
$$

其中 2 代表 Key 和 Value。完整缓存还要乘层数和批内序列数，并考虑分页、对齐或量化等实现开销。MHA 通常有 $H_{kv}=H_q$，MQA 有 $H_{kv}=1$，GQA 则满足 $1<H_{kv}<H_q$。

三类优化针对的瓶颈不同：

| 方法 | 改变模型头结构 | 主要收益 | 主要代价 |
|---|---:|---|---|
| MQA | 是 | 最小化 KV Cache 与解码带宽 | 共享程度高，质量需实测 |
| GQA | 是 | 在缓存、吞吐和质量间折中 | 需要匹配模型训练或转换策略 |
| FlashAttention | 否 | 降低注意力中间量的显存读写 | 受硬件、数据类型和内核支持约束 |

FlashAttention 不是近似稀疏注意力。它把 $QK^\top$ 分块，在片上存储中维护 softmax 的统计量，避免把完整注意力矩阵写回高带宽内存。理论算术复杂度仍为标准密集注意力的量级，实际速度来自 I/O 感知算法和融合内核。

多头潜在注意力（Multi-Head Latent Attention，MLA）还会把 KV 表示压缩到潜在空间。它与 MQA/GQA 的参数化不同，不能只按 KV 头数量等同处理。

## 工程实践与边界

先用请求分布判断瓶颈。长 Prompt 的 Prefill 可能受算力和注意力内核限制；长输出 Decode 更容易受 KV Cache 容量和显存带宽限制。记录输入/输出长度分位数、批大小、TTFT、TPOT 和显存占用，再决定采用何种模型或内核。

模型已经训练为 MHA 时，直接强行共享 KV 可能损失质量。已有工作可通过继续训练转换为 GQA，但仍需在业务集上回归。FlashAttention 的可用版本也取决于 GPU 架构和推理框架。

## 常见误区

- **认为 FlashAttention 压缩 KV Cache**：它主要优化注意力计算过程的内存访问
- **认为 MQA 无损**：共享 KV 会改变表达能力，质量差异依模型和任务而定
- **只算单层缓存**：容量规划必须乘层数、并发序列和数据类型字节数
- **把训练加速等同于解码加速**：Prefill 与 Decode 的瓶颈不同

## 面试追问

**问：GQA 为什么常用于在线推理？**

**答：** 它减少 KV 头数量，因此降低缓存容量和每步读取带宽，同时比单组 MQA 保留更多 KV 表示。实际收益需要结合并发和输出长度测量。

**问：FlashAttention 为什么能精确计算 softmax？**

**答：** 分块算法维护每行最大值与归一化因子，并在读取新块时重标定已有结果，从而无需物化完整分数矩阵。

## 参考资料

- [Fast Transformer Decoding: One Write-Head is All You Need](https://arxiv.org/abs/1911.02150)
- [GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints](https://arxiv.org/abs/2305.13245)
- [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135)
- [DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model](https://arxiv.org/abs/2405.04434)
