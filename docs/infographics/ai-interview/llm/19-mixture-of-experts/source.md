---
title: "19. MoE 混合专家模型是什么？DeepSeek V3、Qwen 为什么用 MoE？"
description: "解释稀疏 MoE 的路由、激活参数、负载均衡和专家并行，并分析 DeepSeek V3 与 Qwen MoE 的设计动机"
tags: ["AI应用开发", "大模型工程"]
draft: false
featured: false
---

## 60 秒回答

混合专家（Mixture of Experts，MoE）把部分稠密前馈网络替换为多个专家。路由器为每个 Token 选择少量专家，因此模型可以增加总参数容量，而每个 Token 只激活其中一部分。DeepSeek-V3 和 Qwen 的部分型号采用稀疏 MoE，核心动机是在训练与推理计算预算下扩大容量，而不是让全部参数同时参与每个 Token。

MoE 不等于低显存。所有专家权重仍需存放或分布在设备上，路由还带来跨卡通信、负载不均和部署复杂度。比较模型时要同时报告总参数、激活参数、路由策略和硬件拓扑。

## 详细解析

对 Token 表示 $x$，路由器产生专家分数并选择 Top-k：

$$
y=\sum_{i\in TopK(x)}g_i(x)E_i(x)
$$

$E_i$ 是专家 FFN，$g_i$ 是路由权重。共享注意力层通常仍对每个 Token 计算，稀疏性主要发生在专家层。因此，“只激活少量专家”不能直接套用到模型的全部 FLOPs。

MoE 训练要处理以下问题：

- **负载均衡**：热门专家过载，冷门专家训练不足
- **容量限制**：单个专家批次缓冲有限，溢出 Token 需要丢弃、重路由或增加容量
- **All-to-All 通信**：专家并行把 Token 发送到不同设备，网络可能成为瓶颈
- **专家塌缩**：路由长期集中到少量专家，降低有效容量

DeepSeek-V3 技术报告给出的模型规模是 671B 总参数、每 Token 激活 37B 参数，并使用细粒度专家与共享专家。该数字只适用于报告中的具体架构。Qwen 系列同时包含稠密与 MoE 型号；讨论“Qwen 使用 MoE”时应指明型号和模型卡，不能把整个系列概括为一种结构。

## 工程实践与边界

训练监控应包含每个专家的 Token 数、路由概率、溢出率、负载均衡损失和跨卡通信时间。部署时根据专家并行、张量并行和数据并行组合放置权重，并测真实批次下的端到端吞吐。

显存容量按总权重和精度估算，计算量则按激活专家与公共层估算。低并发服务可能无法摊薄专家通信；边缘设备也常缺少容纳总权重的内存，此时稠密小模型更实用。

## 常见误区

- **把总参数当作每 Token 计算量**：稀疏路由只激活部分专家
- **把激活参数当作显存占用**：总专家权重仍需驻留或分片加载
- **认为专家等同于人工定义领域角色**：专家分工由训练和路由形成，未必对应可解释领域
- **忽略通信**：算术 FLOPs 降低后，All-to-All 可能成为主要瓶颈

## 面试追问

**问：MoE 为什么需要负载均衡损失？**

**答：** 只按任务损失训练时，路由可能集中到少量专家。辅助目标或无辅助损失策略用于控制各专家负载，但也会影响主任务优化。

**问：MoE 更适合训练还是推理？**

**答：** 它能在两阶段降低每 Token 的专家计算，但训练和推理都要承担权重容量与通信成本。收益取决于集群互连、批次和实现。

## 参考资料

- [Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer](https://arxiv.org/abs/1701.06538)
- [Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity](https://arxiv.org/abs/2101.03961)
- [DeepSeek-V3 Technical Report](https://arxiv.org/abs/2412.19437)
- [Qwen3 Technical Report](https://arxiv.org/abs/2505.09388)
