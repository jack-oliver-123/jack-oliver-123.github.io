---
title: "25. 什么是 Speculative Decoding？Draft Model、验证和加速比怎么理解？"
topic: "large language model engineering"
data_type: "overview"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

解释 Draft Model 提案、Target Model 并行验证和拒绝采样校正，并分析接受率、延迟与硬件边界

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 建立“什么是 Speculative Decoding？Draft Model、验证和加速比怎么理解？”的完整知识框架
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

- 3. 对每个候选按 $\min(1,p(x)/q(x))$ 的接受概率依次判断

## Source Evidence (Verbatim)

## 60 秒回答

推测解码（Speculative Decoding）让成本较低的 Draft Model 连续提出多个 Token，再由 Target Model 一次前向并行验证。目标模型接受匹配其分布的前缀，在第一个不接受位置按校正分布采样，然后进入下一轮。标准算法在正确实现下保持 Target Model 的输出分布，而不是用小模型结果近似替换大模型。

速度取决于接受率、一次提案长度、Draft 成本、Target 并行验证效率和硬件利用率。Draft 太弱会频繁拒绝，太强又可能本身很贵；批量服务中，额外调度和显存也可能抵消收益。

## 详细解析

一轮标准流程如下：

1. Draft 根据当前前缀生成 $\gamma$ 个候选 Token，并记录其概率 $q$
2. Target 对这 $\gamma$ 个位置做一次并行前向，得到概率 $p$
3. 对每个候选按 $\min(1,p(x)/q(x))$ 的接受概率依次判断
4. 在首个拒绝位置从校正分布采样，保证最终分布与 Target 自回归采样一致

若整段候选都接受，还可从 Target 的下一位置分布额外采样一个 Token。一次 Target 调用因此可能产出多个 Token，减少串行 Decode 步数。

加速比不是“提案长度倍数”。粗略看，它由每轮接受的 Token 数除以 Draft 与验证耗时决定。高接受率、内存带宽受限的 Target 和低成本 Draft 更有利；若 Target 已在大批次下充分利用 GPU，推测解码的相对收益可能下降。

Draft 不一定是独立小模型。N-gram、Prompt Lookup、多 Token 预测头和 EAGLE 类特征预测都可提供候选，但它们的分布校正与实现边界不同。

## 工程实践与边界

压测要按输入/输出长度、批大小和采样策略分层，记录接受率、每轮接受 Token、TPOT、吞吐和额外显存。Draft 与 Target 的 Tokenizer 必须兼容，聊天模板和停止规则也要一致。

质量回归不仅看最终文本，还要确认所用框架是否实现无偏校正。某些“speculative”模式为追求速度采用近似接受，可能改变输出分布，必须按产品文档区分。

## 常见误区

- **认为小模型替大模型作答**：最终候选由 Target 验证并校正
- **认为质量不会变化是所有实现的保证**：只适用于满足算法条件的精确实现
- **只追求高接受率**：更大的 Draft 可能提高接受率，却增加每轮成本
- **忽略批量场景**：单请求加速不等于集群吞吐提升

## 面试追问

**问：Draft 和 Target 越相似越好吗？**

**答：** 相似通常提高接受率，但 Draft 成本也可能上升。应优化端到端延迟，而不是单独优化接受率。

**问：为什么 Target 能一次验证多个 Token？**

**答：** 候选序列已由 Draft 给出，Target 可像教师强制训练一样并行计算这些位置的条件分布，再按顺序执行接受判断。

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
