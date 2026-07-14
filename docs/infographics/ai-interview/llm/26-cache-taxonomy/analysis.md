---
title: "26. Prefix Cache、KV Cache 和 Semantic Cache 有什么区别？"
topic: "large language model engineering"
data_type: "comparison"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

比较请求内 KV Cache、跨请求 Prefix Cache 与应用层 Semantic Cache 的键、收益、一致性和安全边界

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 比较“Prefix Cache、KV Cache 和 Semantic Cache 有什么区别？”涉及的主要方案与选型维度
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

KV Cache 是单次自回归生成的运行状态，保存历史 Token 在每层的 Key/Value，降低后续 Decode 重算。Prefix Cache 在请求之间按 Token 前缀或 KV 块哈希复用已完成的 Prefill，适合公共系统指令、固定文档和重复多轮前缀。Semantic Cache 位于应用层，按 Embedding 或其他相似度判断问题是否足够接近，并复用最终答案或中间结果。

三者的正确性风险逐级增加。KV/Prefix Cache 在模型和位置兼容时复用确定的中间计算；Semantic Cache 把“相似”解释为“可复用”，需要业务阈值、权限、时效和答案一致性策略。

## 详细解析

| 缓存 | 存储内容 | 命中键 | 主要失效条件 |
|---|---|---|---|
| KV Cache | 当前序列各层 K/V | 请求内 Token 位置 | 请求结束、抢占或容量回收 |
| Prefix Cache | 可共享前缀的 KV 块 | Token/块哈希和模型配置 | 模型、模板、适配器或前缀变化 |
| Semantic Cache | 答案、工具结果或 RAG 结果 | 语义向量加业务条件 | 知识版本、权限、时效或策略变化 |

Prefix Cache 是精确前缀复用。文本规范化、聊天模板或特殊 Token 的细小变化都会改变 Token 序列。部分引擎按完整块复用，最后不完整块和新后缀仍要 Prefill。

Semantic Cache 的键不能只有问题 Embedding。用户权限、地区、语言、知识库版本、Prompt、模型、工具状态和时间窗口都可能影响答案。相似度阈值过低导致误命中，过高则命中率不足。

缓存收益也不同：请求内 KV Cache 主要减少每个新 Token 的历史重算；Prefix Cache 减少重复输入的 TTFT 和 Prefill 计算；Semantic Cache 命中时可能跳过整条生成链路。

## 工程实践与边界

所有跨请求缓存都要按租户隔离或把租户加入键，并对敏感数据设更短生命周期。记录命中类型、节省的 Prefill Token、误命中反馈和失效原因。不要在日志输出原始缓存键中的隐私内容。

Semantic Cache 上线前建立相似/不相似标注对，按任务类别选择阈值。政策、价格、库存和权限相关回答应绑定版本或禁用复用。写操作和个性化结果不适合仅凭语义相似复用。

## 常见误区

- **把 Prefix Cache 叫语义缓存**：它匹配 Token 前缀，不理解语义
- **认为缓存只影响性能**：错误隔离和陈旧结果会变成安全与正确性问题
- **只用 Embedding 作 Semantic Key**：业务状态和权限也决定可复用性
- **命中后不记录版本**：无法解释结果来自模型还是旧缓存

## 面试追问

**问：为什么 Prefix Cache 能跨请求复用位置编码后的 KV？**

**答：** 只有当前缀 Token、起始位置、模型和相关配置兼容时，对应层的 K/V 才相同。位置或适配器变化就应视为不同键。

**问：Semantic Cache 如何回滚？**

**答：** 键中加入 Prompt、知识和模型版本，发布时切换命名空间；出现问题可停用新空间并保留旧版本的失效策略。

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
