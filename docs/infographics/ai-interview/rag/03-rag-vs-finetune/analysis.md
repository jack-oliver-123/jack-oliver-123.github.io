---
title: "3. 相比直接微调 LLM，RAG 解决了什么问题？微调和 RAG 各自的优劣势是什么？"
topic: "RAG engineering"
data_type: "overview"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

对比 RAG 与 LLM 微调的原理、成本和适用场景，分析外部知识检索与模型参数更新的取舍关系

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 建立“相比直接微调 LLM，RAG 解决了什么问题？微调和 RAG 各自的优劣势是什么？”的完整知识框架
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

RAG 与微调改变的是不同环节。RAG 在推理时检索外部知识，适合频繁更新、需要权限过滤和引用追溯的事实；微调更新模型参数，适合稳定地改变行为、格式、术语习惯或任务能力。把业务事实写进参数后很难精确更新和删除，而 RAG 的知识可以按文档版本替换。

两者不是二选一。常见组合是先用提示词或微调让模型稳定遵循任务规范，再用 RAG 提供本次回答需要的证据。最终选择应由离线质量、线上延迟、维护成本和合规要求共同决定。

## 详细解析

### RAG 改变上下文

RAG 不修改基础模型参数。知识更新通常表现为重新解析或索引文档，因此可追踪来源、设置 ACL，也容易回滚某个索引版本。代价是每次请求增加检索、重排和更长上下文的延迟与成本。

### 微调改变参数

监督微调通过训练样本塑造响应模式；参数高效微调可减少需训练的参数量，但仍需要数据治理、训练、评估与部署。微调可能让模型更擅长某类任务，却不保证准确记住所有新事实，也不天然提供引用。

### 组合决策

先做误差分析：若错误来自“没有拿到正确资料”，优先改数据和检索；若资料已在上下文中，但模型持续不按格式或流程执行，再考虑提示词、约束解码或微调。知识和行为混在一个训练集里，后续归因会更困难。

## 工程实践与边界

| 维度 | RAG | 微调 |
| --- | --- | --- |
| 更新对象 | 外部知识与索引 | 模型参数 |
| 适合内容 | 易变事实、私有文档 | 稳定行为、格式、领域任务 |
| 引用 | 可保留来源映射 | 不天然提供 |
| 删除与回滚 | 可按文档或索引版本处理 | 通常需要重训或切换模型 |
| 在线代价 | 检索与上下文开销 | 取决于部署后的模型大小 |

性能和费用不能脱离模型、数据集、硬件与流量直接下结论，应在目标负载上测量。

## 常见误区

- **“微调就是把知识灌进模型”**：微调可影响参数，但对事实的精确写入、更新与遗忘没有数据库式保证。
- **“RAG 只解决知识，微调只解决风格”**：这是有用的经验分类，不是严格边界，两者都可能影响最终任务表现。
- **“微调后不需要检索”**：时效、权限和引用需求仍可能要求 RAG。
- **“两者叠加总会更好”**：复杂度会上升，需要用消融实验验证每一层的收益。

## 面试追问

1. **如何做选型实验？** 建立代表性评测集，至少比较基础模型、RAG、微调、微调加 RAG 四组，并记录质量、延迟和成本。
2. **资料已经召回但模型答错怎么办？** 先检查上下文位置、冲突和提示约束，再评估结构化输出或微调，不要先扩大 Top-K。
3. **怎样回滚？** 模型和索引分别版本化，部署配置明确绑定两者，避免只回滚其中一项导致不兼容。

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
