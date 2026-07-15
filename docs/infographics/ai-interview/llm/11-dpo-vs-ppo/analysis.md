---
title: "11. 大模型的 DPO 和 PPO 的区别是什么？"
topic: "large language model engineering"
data_type: "comparison"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

比较 DPO 与 PPO 的目标、数据依赖、训练组件和分布偏移风险，并给出偏好优化选型方法

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 比较“大模型的 DPO 和 PPO 的区别是什么？”涉及的主要方案与选型维度
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

- \mathbb{E}\left[\min(r_tA_t,\operatorname{clip}(r_t,1-\epsilon,1+\epsilon)A_t)\right]

## Source Evidence (Verbatim)

## 60 秒回答

近端策略优化（Proximal Policy Optimization，PPO）是在线强化学习算法：当前策略生成回答，奖励模型或环境给分，价值模型估计优势，再用裁剪目标更新策略并限制其偏离参考模型。直接偏好优化（Direct Preference Optimization，DPO）使用离线的 chosen/rejected 偏好对，通过策略和参考模型的序列对数概率差直接训练，不需要显式奖励模型或在线采样循环。

DPO 训练链路较短、稳定性通常更容易管理，但受离线数据覆盖和分布偏移限制。PPO 能探索当前策略的新输出，也更容易遭遇奖励利用、训练不稳定和高资源成本。选型要看奖励是否可在线获得、任务是否需要探索以及团队能否运营 RL 基础设施。

## 详细解析

PPO 在每轮收集策略轨迹，并根据优势 $A_t$ 优化裁剪目标：

$$
\mathbb{E}\left[\min(r_tA_t,\operatorname{clip}(r_t,1-\epsilon,1+\epsilon)A_t)\right]
$$

$r_t$ 是新旧策略对动作概率的比值。LLM RLHF 通常还加入对参考策略的 KL 惩罚，并训练 value head 或独立价值模型。裁剪限制单次更新幅度，但不保证训练不会崩溃。

DPO 把偏好模型与 KL 正则策略优化联系起来。其目标鼓励 chosen 相对 rejected 在策略中的对数概率优势，大于参考模型中的对应优势。它比较的是整段回答的条件概率，长度归一化、截断和聊天模板都会影响结果。

| 维度 | PPO | DPO |
|---|---|---|
| 数据 | 当前策略在线轨迹 | 固定偏好对 |
| 模型组件 | 策略、参考、奖励、价值 | 策略、参考 |
| 探索 | 有 | 受离线数据限制 |
| 主要风险 | 奖励利用、方差、系统复杂度 | 分布外行为、标签噪声、偏好覆盖 |

## 工程实践与边界

无论用哪种方法，都要锁定参考模型、Tokenizer 和聊天模板。偏好对要检查长度偏差、风格捷径和标注一致性。DPO 的 $\beta$ 与 PPO 的 KL 系数都控制偏离参考模型的程度，但数值含义不同，不能直接换算。

评测应脱离训练奖励，包括人工盲评、任务结果、安全集、长度分布和校准。PPO 训练还要监控 KL、熵、优势、value loss 和奖励分解；DPO 要监控 chosen/rejected margin 与验证集过拟合。

## 常见误区

- **认为 DPO 不需要参考模型**：标准目标依赖参考策略的对数概率
- **认为 PPO 必须逐 Token 人工打分**：奖励可在序列级给出，优势再分配到动作
- **把偏好概率当事实概率**：模型更偏好某回答不代表该回答事实正确
- **只比较训练成本**：数据获取、评分质量和上线回归也属于总成本

## 面试追问

**问：DPO 为什么不显式训练奖励模型？**

**答：** 它在特定偏好模型和 KL 正则假设下，把最优策略与隐式奖励的关系代入目标，从偏好对直接优化策略。

**问：什么场景更值得用 PPO？**

**答：** 环境能提供可验证在线奖励、需要探索当前策略未覆盖的行为，并且团队能稳定运行采样和 RL 训练时，PPO 类方法更有价值。

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
