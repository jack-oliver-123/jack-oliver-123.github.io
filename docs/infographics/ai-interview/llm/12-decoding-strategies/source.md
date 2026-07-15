---
title: "12. 大模型生成文本时的解码策略有哪些？贪心、Beam Search、采样分别什么时候用？"
description: "比较贪心、Beam Search 与随机采样的目标、复杂度和适用场景，并说明停止条件与可复现边界"
tags: ["AI应用开发", "大模型工程"]
draft: false
featured: false
---

## 60 秒回答

贪心解码每步选择概率最高的 Token，成本低且结果稳定，但局部最优不保证整段序列得分高。Beam Search 同时保留若干高分前缀，更适合翻译、语音识别等输出约束较强且序列概率有意义的任务；开放式对话中，它可能产生重复或过于保守的文本。随机采样按截断后的概率分布取样，配合 Temperature、Top-k 或 Top-p 控制多样性，适合创作和多候选推理。

业务系统还要定义停止 Token、最大长度、重复控制和结构约束。解码策略不能修复模型知识缺失，也不能替代输出验证。

## 详细解析

三种主策略优化的对象不同：

- **Greedy**：每步取 $\arg\max p(x_t\mid x_{<t})$
- **Beam Search**：在宽度 $B$ 的候选前缀中保留累计分数较高者，常配长度惩罚
- **Sampling**：从处理后的分布中随机抽取，允许低于最大概率的合理路径

Beam Search 近似搜索高概率完整序列，但模型的序列概率可能偏好短句，因此需要长度归一化或任务特定约束。增大 Beam 会增加计算和缓存，也不保证业务质量单调上升。

采样可以组合多种 logits 处理器。Temperature 调整分布尖锐程度；Top-k 只保留概率最高的 $k$ 个候选；Top-p 保留累计概率达到阈值的最小候选集合。框架对处理顺序、最小保留数量和边界值的实现可能不同。

结构化生成还可使用语法或 Schema 约束，在每一步屏蔽不可能形成合法输出的 Token。这解决语法有效性，不保证字段语义正确。

## 工程实践与边界

按任务指标做网格或贝叶斯调参，并固定模型、Prompt、数据集和后端版本。事实抽取可从低随机性和 Schema 约束开始；创意生成可提高候选多样性，再用独立评分器或人工选择；代码任务可生成多候选并在沙箱执行测试。

设置随机种子只能改善同一软件栈中的复现。并行归约、内核和服务端升级仍可能改变结果。审计系统应保存模型版本、采样参数和原始输出。

## 常见误区

- **认为贪心找到全局最优序列**：它只做每一步的局部选择
- **认为 Beam 越宽质量越高**：任务目标与模型概率不一致时，搜索更充分也可能更差
- **同时盲目叠加所有采样参数**：每个截断器都会改变候选集合，应通过消融理解影响
- **用最大长度代替停止条件**：缺少 EOS 或业务停止规则会产生截断和无效输出

## 面试追问

**问：开放式聊天为什么较少使用 Beam Search？**

**答：** 高序列概率不等同于有帮助或多样，Beam Search 还可能放大通用、重复表达。采样通常更符合开放生成目标。

**问：如何让 JSON 结果稳定？**

**答：** 使用结构化输出或约束解码，服务端再做 Schema 校验和重试。只把 Temperature 调低不能保证语法有效。

## 参考资料

- [The Curious Case of Neural Text Degeneration](https://arxiv.org/abs/1904.09751)
- [Hugging Face Generation strategies](https://huggingface.co/docs/transformers/main/en/generation_strategies)
- [Sequence to Sequence Learning with Neural Networks](https://arxiv.org/abs/1409.3215)
- [Holtzman et al. nucleus sampling implementation](https://github.com/ari-holtzman/degen)
