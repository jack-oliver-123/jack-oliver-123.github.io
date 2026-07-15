---
title: "6. 大模型是怎么训练出来的？"
topic: "large language model engineering"
data_type: "process"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

按数据、预训练、后训练、评测和发布解释大模型训练链路，并说明分布式训练与治理边界

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 复述“大模型是怎么训练出来的？”的关键流程与控制点
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

- 对稠密 Decoder 模型，常见粗略估算把训练计算写成约 $6ND$，其中 $N$ 是非 Embedding 参数量，$D$ 是训练 Token 数。这个估算假设特定前向/反向计算，不包含数据处理、通信、激活重算、稀疏路由和硬件利用率，因此不能直接当作账单。

## Source Evidence (Verbatim)

## 60 秒回答

大模型训练不是一次单独任务，而是一条可追踪流水线：收集并治理数据，训练分词器，做自监督预训练，再做指令微调和偏好对齐，最后经过能力、安全与系统评测发布。预训练让模型学习通用语言分布；后训练让它更好地遵循指令和策略，但不能凭空补回缺失知识。

算力侧会组合数据并行、张量并行、流水线并行和参数分片。训练规模、数据配比和学习率需要联合设计。任何参数量或 FLOPs 数字都要注明模型结构、Token 数、精度和统计口径。

## 详细解析

典型流程包括六个阶段：

1. **数据治理**：记录来源和许可，去重、过滤低质量内容，处理个人信息和评测集污染
2. **预训练**：对大规模 Token 序列优化下一个 Token 预测目标
3. **持续预训练**：按领域或新时间段继续训练，同时控制灾难性遗忘
4. **监督微调**：用指令和高质量回答学习任务格式与对话行为
5. **偏好与安全对齐**：使用人类或规则反馈训练奖励/偏好目标，或直接优化偏好对
6. **评测与发布**：检查能力、安全、偏见、记忆泄露、延迟和成本，再做灰度与回滚

对稠密 Decoder 模型，常见粗略估算把训练计算写成约 $6ND$，其中 $N$ 是非 Embedding 参数量，$D$ 是训练 Token 数。这个估算假设特定前向/反向计算，不包含数据处理、通信、激活重算、稀疏路由和硬件利用率，因此不能直接当作账单。

分布式策略解决不同资源约束。数据并行复制模型并切分样本；张量并行切分层内矩阵；流水线并行切分层；ZeRO/FSDP 类方法分片参数、梯度和优化器状态。实际组合取决于模型是否放得下、网络拓扑和目标吞吐。

## 工程实践与边界

训练必须具备可复现记录：数据快照、清洗版本、代码提交、超参数、随机种子、检查点和评测结果。周期性保存检查点，并验证从检查点恢复后的优化器与数据迭代位置。只保存权重不足以复现训练轨迹。

数据治理应在进入训练前完成。删除请求、许可变化和污染发现需要能定位到数据版本。评测集要与训练数据隔离，并使用隐藏集或污染检测降低“背题”风险。

## 常见误区

- **把后训练当作知识注入主通道**：小规模指令数据更擅长改变行为，知识覆盖仍受数据和容量影响
- **只统计 GPU 理论峰值**：通信、数据加载、重算和故障会降低实际利用率
- **认为损失下降就能发布**：训练损失不能替代能力、安全和系统评测
- **忽略数据权利**：公开可访问不等于允许训练或再分发

## 面试追问

**问：持续预训练和监督微调有什么区别？**

**答：** 持续预训练通常沿用语言建模目标并使用大量领域文本；监督微调使用输入/目标对训练指令行为。两者的数据规模、目标和遗忘风险不同。

**问：为什么需要激活重算？**

**答：** 它在反向传播时重新计算部分前向激活，以额外算力换显存，从而支持更大的模型、序列或批次。

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
