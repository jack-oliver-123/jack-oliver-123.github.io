---
title: "10. SFT 之后还有哪些 Post-Training？RLHF、DPO、GRPO、拒绝采样什么关系？"
topic: "large language model engineering"
data_type: "comparison"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

梳理 SFT、RLHF、PPO、DPO、GRPO、RLAIF 与拒绝采样的目标、数据和组合方式

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 比较“SFT 之后还有哪些 Post-Training？RLHF、DPO、GRPO、拒绝采样什么关系？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

## Target Audience

- **Knowledge Level**: Intermediate to Expert
- **Context**: 准备 AI 应用开发与大模型工程面试
- **Expectations**: 在短时间内建立可口述、可追问、可落地的答案结构

## Content Type Analysis

- **Data Structure**: comparison
- **Key Relationships**: 核心概念、工程实现、边界条件与常见误区之间的关系
- **Visual Opportunities**: 使用原文流程、比较表、组件关系、指标或分区摘要进行可视化

## Key Data Points (Verbatim)

- 原文没有需要单独强调的定量数据或规范关键词。

## Source Evidence (Verbatim)

## 60 秒回答

监督微调（Supervised Fine-Tuning，SFT）用示范回答教模型遵循指令。之后可以收集偏好或可验证奖励继续优化。经典基于人类反馈的强化学习（Reinforcement Learning from Human Feedback，RLHF）先训练奖励模型，再用 PPO 等算法在线采样并更新策略；DPO 直接用偏好对优化策略与参考模型的相对对数概率；GRPO 用同一问题的一组输出估计相对优势，避免单独训练与策略同规模的价值模型。

拒绝采样不是另一种损失。它先生成多个候选，用规则或奖励筛选，再把入选答案用于 SFT 或其他训练。RLAIF 描述反馈来自 AI，而不是指定 PPO、DPO 或 GRPO 其中一种算法。

## 详细解析

这些方法处在不同层级：

| 名称 | 核心数据/信号 | 是否在线采样 | 主要用途 |
|---|---|---:|---|
| SFT | 输入与目标回答 | 否 | 学习任务和输出格式 |
| 奖励模型 | 偏好对或标量评分 | 否 | 近似人类/规则偏好 |
| PPO | 策略采样、奖励、价值估计 | 是 | 受 KL 约束的策略优化 |
| DPO | chosen/rejected 偏好对 | 否 | 直接离线偏好优化 |
| GRPO | 每题成组样本及奖励 | 是 | 用组内相对奖励估计优势 |
| 拒绝采样 | 多候选加筛选器 | 生成阶段需要 | 构造更高质量示范数据 |

PPO 通常需要策略模型、参考模型、奖励模型和价值估计，并控制策略偏离参考模型。DPO 从带 KL 正则的偏好优化问题推导出分类式目标，省去显式奖励模型和在线 RL 环节，但依赖离线偏好数据覆盖。

GRPO 最初在数学推理训练中使用。它对同一个 Prompt 采样一组回答，以组内奖励标准化近似优势。可验证任务可用正确性奖励，开放任务仍需要可靠评分器。组内估计、裁剪和 KL 项的具体实现会影响稳定性。

## 工程实践与边界

先明确奖励来源和失败模式。规则奖励容易被钻空子；模型评分器可能有偏见、位置偏好或被候选文本注入；人工偏好也存在标注分歧。保留原始标注、评分器版本和一致性指标。

训练后同时检查奖励、真实任务成功率、长度偏好、安全和能力回退。奖励上涨不代表产品质量同步提升。对于有唯一可验证答案的任务，可将单元测试或执行结果作为信号；涉及副作用时只能在隔离环境验证。

## 常见误区

- **把 RLHF 等同于 PPO**：RLHF 是反馈和训练流程，PPO 是可选优化算法
- **把 RLAIF 当作一种损失**：它只说明反馈来源可以由 AI 辅助生成
- **认为 DPO 学到正确答案概率**：它优化偏好对的相对得分，不是事实正确率校准
- **把奖励当作目标本身**：不完整的奖励会导致 reward hacking

## 面试追问

**问：为什么做完 SFT 还要偏好优化？**

**答：** SFT 模仿单个示范，未显式利用“哪个回答更好”的比较信号。偏好优化可调整有用性、安全和风格，但前提是偏好数据与目标一致。

**问：拒绝采样和 Best-of-N 在线推理有什么区别？**

**答：** 两者都生成多个候选。拒绝采样常把筛选结果写回训练集；Best-of-N 在请求时选择候选，增加在线延迟和成本但不改权重。

## Layout × Style Signals

- Content type: comparison → suggests comparison-matrix
- Tone: 专业、教育、工程导向 → suggests corporate-memphis
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: moderate → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：primary

## Recommended Combinations

1. **comparison-matrix + corporate-memphis** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **binary-comparison + corporate-memphis**: 可作为更强调关系或密度的备选
3. **dense-modules + pop-laboratory**: 可作为更强调工程细节的备选
