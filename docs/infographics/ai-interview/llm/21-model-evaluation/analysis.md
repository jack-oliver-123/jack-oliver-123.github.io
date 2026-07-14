---
title: "21. 大模型能力评测指标有哪些？"
topic: "large language model engineering"
data_type: "data"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

建立从模型质量、任务结果、安全、校准到系统性能的评测框架，并说明 LLM Judge 与统计显著性边界

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 识别“大模型能力评测指标有哪些？”的核心指标、信号与评估边界
2. 说明关键工程边界、失败模式与验证方法

## Target Audience

- **Knowledge Level**: Intermediate to Expert
- **Context**: 准备 AI 应用开发与大模型工程面试
- **Expectations**: 在短时间内建立可口述、可追问、可落地的答案结构

## Content Type Analysis

- **Data Structure**: data
- **Key Relationships**: 核心概念、工程实现、边界条件与常见误区之间的关系
- **Visual Opportunities**: 使用原文流程、比较表、组件关系、指标或分区摘要进行可视化

## Key Data Points (Verbatim)

- 大模型评测不能用一个总分概括。模型层可看困惑度和标准基准；任务层按类型使用 Accuracy、Exact Match、F1、ROUGE、pass@k 或工具任务成功率；开放生成可做盲评和成对胜率；风险层测越狱、隐私、偏见和有害输出；系统层测 TTFT、TPOT、吞吐、尾延迟、可用性和每次成功任务成本。
- | 封闭任务 | Accuracy、EM、F1 | 标签或答案是否正确 |
- | 系统 | TTFT、TPOT、P95/P99、吞吐、成本 | 服务是否满足 SLO |
- Exact Match 对格式敏感，F1 可给部分重合分；ROUGE 不能稳定衡量事实正确性；pass@k 随采样数增加，比较时必须固定 $k$ 和采样策略。工具 Agent 还要检查轨迹是否越权、是否产生重复副作用以及恢复能力。

## Source Evidence (Verbatim)

## 60 秒回答

大模型评测不能用一个总分概括。模型层可看困惑度和标准基准；任务层按类型使用 Accuracy、Exact Match、F1、ROUGE、pass@k 或工具任务成功率；开放生成可做盲评和成对胜率；风险层测越狱、隐私、偏见和有害输出；系统层测 TTFT、TPOT、吞吐、尾延迟、可用性和每次成功任务成本。

每项指标都要绑定数据集、评分器、Prompt、采样参数和模型版本，并报告样本量与置信区间。LLM-as-a-Judge 可扩大评测规模，但会有位置、长度、风格和自偏好，需要用人工标注校准。

## 详细解析

指标应从产品目标向下拆解：

| 层级 | 指标示例 | 回答的问题 |
|---|---|---|
| 语言模型 | Loss、Perplexity | 对给定分布的预测拟合程度 |
| 封闭任务 | Accuracy、EM、F1 | 标签或答案是否正确 |
| 生成任务 | ROUGE、BLEU、语义相似度 | 与参考答案的重合或接近程度 |
| 代码/工具 | pass@k、执行成功率、参数正确率 | 结果能否实际运行 |
| 偏好 | Pairwise win rate、Bradley-Terry 分数 | 人或 Judge 更偏好哪个输出 |
| 校准 | Brier Score、ECE、选择性准确率 | 置信与正确率是否匹配 |
| 系统 | TTFT、TPOT、P95/P99、吞吐、成本 | 服务是否满足 SLO |

Exact Match 对格式敏感，F1 可给部分重合分；ROUGE 不能稳定衡量事实正确性；pass@k 随采样数增加，比较时必须固定 $k$ 和采样策略。工具 Agent 还要检查轨迹是否越权、是否产生重复副作用以及恢复能力。

成对胜率的基线和顺序会影响结果。若两个候选差异小，应随机左右位置、隐藏模型身份并报告 bootstrap 置信区间。多次查看测试集再调 Prompt 会造成评测过拟合，需要保留隐藏集。

## 工程实践与边界

建立三层数据：开发集用于迭代，回归集覆盖历史故障，隐藏集用于发布门禁。样本按语言、客户、长度、风险和任务难度分层，避免平均分掩盖关键人群退化。

线上指标要连接业务结果，例如每次已解决工单成本，而不是只统计 Token。记录模型拒答、工具错误和人工接管原因，定期把真实失败脱敏后回流到回归集。

## 常见误区

- **把公开榜单当业务结论**：数据分布和评分标准可能不同
- **只报平均值**：尾部延迟和关键切片可能已不满足 SLO
- **把 Judge 分数当客观真值**：Judge 本身也要评测和版本化
- **反复调测试集**：这会把测试集变成训练信号

## 面试追问

**问：两个模型胜率相差 2%，能否直接宣布一个更好？**

**答：** 先看样本量、置信区间、Judge 一致性和业务切片。差异可能来自抽样噪声或位置偏好。

**问：如何评测模型会不会正确拒答？**

**答：** 同时准备应回答与应拒答样本，分别测覆盖率和误拒率，并对不同风险等级设置成本敏感阈值。

## Layout × Style Signals

- Content type: data → suggests dashboard
- Tone: 专业、教育、工程导向 → suggests pop-laboratory
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: moderate → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：primary

## Recommended Combinations

1. **dashboard + pop-laboratory** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **dense-modules + pop-laboratory**: 可作为更强调关系或密度的备选
3. **bento-grid + corporate-memphis**: 可作为更强调工程细节的备选
