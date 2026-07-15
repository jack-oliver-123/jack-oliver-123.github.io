---
title: "17. 如何规避 RAG 系统中大模型的幻觉？"
topic: "RAG engineering"
data_type: "data"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

介绍 RAG 系统中幻觉产生的原因和缓解方法，梳理检索质量、上下文约束、引用溯源和生成控制的作用

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 识别“如何规避 RAG 系统中大模型的幻觉？”的核心指标、信号与评估边界
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

- 原文没有需要单独强调的定量数据或规范关键词。

## Source Evidence (Verbatim)

## 60 秒回答

RAG 只能缓解部分幻觉，不能保证消除。我要先区分：知识库没有答案、正确证据未召回、噪声或冲突证据进入上下文、模型没有忠实使用证据，以及引用与陈述错配。不同原因对应数据补全、检索优化、重排去重、受证据约束的生成、逐条引用校验和拒答策略。

生产上会标注最小充分证据，分别测检索覆盖、答案正确性、faithfulness 和引用准确性；阈值按模型、领域和风险校准。高风险场景还需要规则校验或人工复核，不能把模型自评当成正确性证明。

## 详细解析

### 先保证证据

如果知识库没有有效答案，扩大 Top-K 只会增加噪声。系统需要检测数据覆盖和文档时效。正确文档存在但未召回时，检查切块、查询、ACL、索引和排序。上下文中的冲突应按版本与权威级别处理，不能任由模型猜测。

### 再约束生成

Prompt 要明确区分系统指令、用户问题和不可信文档，要求证据不足时说明不足，并为每项可核验陈述引用来源。结构化输出有助于后处理，但不保证内容真实。对数字、日期和实体可做程序化比对；对复杂主张可用独立验证模型辅助筛查并人工抽检。

### 设计拒答

拒答条件不能只依赖一个向量分数。可综合检索覆盖、reranker 分数、证据一致性与业务风险，并在验证集上选择策略。分数含义随模型和数据变化，不能照搬固定阈值。

## 工程实践与边界

- 将答案拆成原子陈述，检查每条是否由可访问证据支持。
- 来源链接由服务端根据 chunk ID 生成，模型不得自由编造 URL。
- 文档中的“忽略之前指令”等内容视为数据，隔离于系统指令并限制工具权限。
- 监控拒答率、错误接受与错误拒答，按场景风险分层。

## 常见误区

- **“Prompt 写只基于资料就不会幻觉”**：提示是软约束，仍需验证与评测。
- **“相似度低于某固定值就拒答”**：阈值不跨模型和语料通用。
- **“有引用就不是幻觉”**：引用可能不支持主张，或来源本身过期。
- **“让同一个模型自检即可”**：生成与评审错误可能相关，应结合规则、不同模型和人工标注。

## 面试追问

1. **如何评估引用？** 标注陈述与证据的支持关系，测引用完整性与准确性，并检查用户是否有权访问来源。
2. **冲突资料怎么回答？** 展示冲突、来源和时间，应用预先定义的权威规则；无规则时不擅自裁决。
3. **拒答太多怎么办？** 分析是知识覆盖不足、阈值校准还是查询类型差异，不能只整体降低阈值。

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
