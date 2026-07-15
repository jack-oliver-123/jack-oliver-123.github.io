---
title: "10. 你使用 RAG 给大模型一个输入，系统是怎样的工作流程？"
topic: "RAG engineering"
data_type: "process"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

拆解 RAG 在线处理流程，梳理用户输入、Query 改写、向量检索、重排、Prompt 拼接和生成输出的协作链路

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 复述“你使用 RAG 给大模型一个输入，系统是怎样的工作流程？”的关键流程与控制点
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

- 稠密检索擅长语义匹配，BM25 擅长精确词项，结构化查询处理明确字段。各路分数不可直接假定同尺度，可用 RRF 等基于排名的方法融合，再用 cross-encoder 或其他 reranker 排序。ACL 必须在内容进入模型前生效。

## Source Evidence (Verbatim)

## 60 秒回答

在线链路从请求上下文开始，而不是从向量化开始：先认证用户、确定租户与可访问范围，再做输入安全检查和查询理解。系统生成一个或多个检索查询，从稠密、稀疏或结构化数据源召回候选，应用 ACL、版本和时效过滤，融合后重排并去重。

随后在 token 预算内组装带来源 ID 的上下文，提示模型依据证据回答并允许证据不足。服务端校验结构、引用和敏感内容后返回结果，同时记录各阶段 trace、索引与模型版本，用于评测、告警和复现。

## 详细解析

### 请求与检索计划

会话问题可能包含“它”“上一个方案”等指代，系统可以结合有限会话状态生成独立检索查询，但不能让改写改变原意。对于简单事实可直接检索；复合问题可拆分；需要实时数据或动作时应调用权威 API，而不是只搜静态索引。

### 候选处理

稠密检索擅长语义匹配，BM25 擅长精确词项，结构化查询处理明确字段。各路分数不可直接假定同尺度，可用 RRF 等基于排名的方法融合，再用 cross-encoder 或其他 reranker 排序。ACL 必须在内容进入模型前生效。

### 生成与后处理

上下文应标记来源、版本与时间，删除重复片段，并为关键证据保留足够上下文。生成后检查引用是否存在、输出 schema 是否有效，以及回答是否包含不被证据支持的高风险陈述。失败时采用可解释降级，而不是静默回退到无依据生成。

## 工程实践与边界

```text
auth -> normalize -> plan -> retrieve -> ACL/filter -> fuse/rerank
     -> pack context -> generate -> validate/cite -> observe
```

- 给每阶段独立超时和错误策略；重排超时可回退到已过滤候选，但不能绕过 ACL。
- trace 中记录 ID 和哈希，敏感正文按最小必要原则保存。
- 缓存键包含租户、权限、查询、索引版本和模型配置，避免跨权限复用。
- 对索引切换、模型切换和提示模板分别灰度，便于归因与回滚。

## 常见误区

- **“先检索再做权限过滤也没关系”**：候选若已进入不受控日志或模型，风险已经发生。
- **“多 Query 总能提高效果”**：它也会扩大噪声、成本和注入面。
- **“各路分数归一化后可直接相加”**：分数分布和校准不同，需要验证融合方法。
- **“生成失败就直接调用裸模型”**：这可能违反证据与合规契约。

## 面试追问

1. **如何设置超时预算？** 从端到端 SLO 反推各阶段预算，按历史分位数和业务重要性分配，并预留网络与重试空间。
2. **引用如何映射？** 上下文块使用不可歧义的内部 ID，生成结果引用 ID，服务端再解析为用户可访问的来源。
3. **如何处理查询改写失败？** 保留原查询作为一路召回，比较改写与原查询结果，并在低置信度时不改写。

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
