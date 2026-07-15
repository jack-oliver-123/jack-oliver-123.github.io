---
title: "8. 大模型微调的方案有哪些？"
topic: "large language model engineering"
data_type: "overview"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

比较全量微调、监督微调、LoRA、Adapter、Prefix Tuning 与偏好优化，并给出工程选型边界

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 建立“大模型微调的方案有哪些？”的完整知识框架
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

大模型微调可按“更新哪些参数”和“优化什么目标”两条轴理解。全量微调更新全部权重，容量高但显存与运维成本大；参数高效微调（Parameter-Efficient Fine-Tuning，PEFT）只训练 LoRA、Adapter 或软前缀等少量参数。监督微调（Supervised Fine-Tuning，SFT）学习输入到目标回答，DPO、PPO 等偏好方法则优化回答之间的偏好。

选型先判断问题类型。需要最新事实时优先考虑检索；需要调用外部动作时使用工具；需要稳定改变格式、语气或领域任务行为时再微调。微调不自动保证事实正确，也不能替代权限和输出校验。

## 详细解析

常见方案如下：

| 方案 | 训练参数 | 适合场景 | 主要代价 |
|---|---:|---|---|
| 全量微调 | 全部权重 | 大规模领域迁移、充分预算 | 优化器状态和检查点体积大，遗忘风险高 |
| LoRA | 低秩增量矩阵 | 指令、风格和任务适配 | 秩、目标层与数据质量需调优 |
| Adapter | 层间小模块 | 多任务模块化切换 | 推理路径增加模块 |
| Prefix/Prompt Tuning | 可训练连续前缀 | 轻量任务控制 | 小数据或复杂迁移时能力受限 |
| QLoRA | 量化基座加 LoRA | 单机显存受限的微调 | 训练内核、量化和合并流程更复杂 |

LoRA 对原权重 $W\in\mathbb{R}^{d_{out}\times d_{in}}$ 增加低秩更新：

$$
W'=W+\frac{\alpha}{r}BA
$$

其中 $A\in\mathbb{R}^{r\times d_{in}}$，$B\in\mathbb{R}^{d_{out}\times r}$，且 $r$ 远小于输入和输出维度。可训练参数与 $r(d_{in}+d_{out})$ 成正比，但训练激活、数据和前向计算仍存在，不能把“参数少”理解为成本按同一比例下降。

SFT、持续预训练和偏好优化也不能混为一类。持续预训练使用语言建模目标吸收领域分布；SFT 学习示范；偏好优化比较候选回答。实际流水线可以组合，但每一步都要单独评测遗忘与安全回归。

## 工程实践与边界

先建立无需训练的基线，包括 Prompt、结构化输出和 RAG。微调数据应去重、分训练/验证/测试集，并保留来源、许可和版本。训练后同时检查目标任务、通用能力、安全、校准和长尾样本。

多个 LoRA 适配器可降低模型复制成本，但仍要管理基座版本、Tokenizer、目标层和合并状态。基座升级后不能假设旧适配器兼容，应重新评测或训练。

## 常见误区

- **把所有训练都叫 SFT**：持续预训练、监督学习和偏好优化的目标不同
- **认为 LoRA 只训练少量参数就几乎不耗显存**：激活、量化基座和运行时缓冲仍占显存
- **用微调更新频繁变化的事实**：检索通常更便于更新、引用和删除
- **只测目标任务**：过拟合和灾难性遗忘可能损害其他能力

## 面试追问

**问：什么时候选择全量微调而不是 LoRA？**

**答：** 当领域分布变化大、数据和算力充足，并且 PEFT 基线无法达到目标时再考虑。决策要基于同一评测集，而不是预设全量微调更强。

**问：LoRA 可以在推理前合并吗？**

**答：** 形状和精度兼容时可把增量合入基座，减少额外计算。合并后失去动态切换便利，还要保留可追踪的原始基座和适配器版本。

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
