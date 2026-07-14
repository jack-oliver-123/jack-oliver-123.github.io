---
title: "18. 怎么量化你的 RAG 效果？"
topic: "RAG engineering"
data_type: "overview"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

系统介绍 RAG 效果评估方法，梳理检索召回、上下文相关性、答案准确性和端到端评测指标的设计

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 建立“怎么量化你的 RAG 效果？”的完整知识框架
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

我会把 RAG 评估拆成数据、检索、生成、端到端和运行质量。检索层在标注的可接受证据集合上看 Recall@K、MRR、nDCG；生成层看答案正确性、对证据的忠实度、引用准确性、拒答与安全；线上还看任务成功、延迟分位数、错误率、成本和知识新鲜度。

评测集按真实查询分层，并包含无答案、权限、冲突和注入样本。模型裁判指标要固定版本和 Prompt，多次运行报告方差，并定期与人工标注校准。RAGAS 提供指标框架，但不存在跨项目通用的“合格固定阈值”。

## 详细解析

### 检索评估

相关性可能是一对多：多个文档都能回答，或答案需要多个证据。标注应记录可接受文档集合与最小证据组合。Recall@K 衡量相关证据是否进入候选；MRR 偏重首个相关结果；nDCG 可处理分级相关性。还要记录 ACL 违规召回和过期文档命中，这些是正确性问题而非普通噪声。

### 生成评估

正确性回答“是否解决问题”，faithfulness 回答“陈述是否受给定上下文支持”，二者不同。引用评估还要检查来源是否真的支持相邻主张。无答案查询关注错误作答率，安全集关注是否服从文档内恶意指令或泄露跨租户数据。

### 线上与实验设计

离线集要保留冻结回归集和持续采样的新鲜集。A/B 测试需防止索引版本、模型和流量分布同时变化。对随机模型裁判使用重复测量、置信区间或至少报告方差，不应用单次小数点分数制造确定性。

## 工程实践与边界

- 每个线上失败回流时先去敏和权限检查，再进入可复现评测集。
- 发布门禁同时设质量与 SLO 条件，不能用质量提升掩盖不可接受的尾延迟。
- 做分层指标：语言、租户、查询类型和风险等级，避免总体均值掩盖退化。
- 保留评测数据版本、裁判模型与 Prompt，评测系统本身也需版本化。

## 常见误区

- **“RAGAS 分数高于某值就能上线”**：阈值需结合业务风险、模型和人工校准。
- **“只看最终答案就够了”**：无法定位检索还是生成导致回归。
- **“Recall@K 越大越好”**：K 增大也带来更多上下文、延迟和噪声。
- **“模型裁判是客观标签”**：它有偏差、随机性和版本漂移。

## 面试追问

1. **没有标注集怎么办？** 从真实日志分层抽样，由领域人员标注最小集合；可用弱监督起步，但必须人工校准。
2. **怎样评估多跳问题？** 标注每一步需要的证据及最终组合，分别测单步召回和证据集合覆盖。
3. **线上点赞能代替正确率吗？** 不能，点赞受交互与曝光偏差影响，可作为业务信号之一。

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
