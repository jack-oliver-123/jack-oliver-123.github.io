---
title: "14. KV Cache 是什么？Prompt Caching 的原理是什么？"
topic: "large language model engineering"
data_type: "system"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

区分单次解码 KV Cache 与跨请求 Prompt/Prefix Cache，并说明容量公式、命中条件和隔离风险

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 说明“KV Cache 是什么？Prompt Caching 的原理是什么？”的组成部分及其关系
2. 说明关键工程边界、失败模式与验证方法

## Target Audience

- **Knowledge Level**: Intermediate to Expert
- **Context**: 准备 AI 应用开发与大模型工程面试
- **Expectations**: 在短时间内建立可口述、可追问、可落地的答案结构

## Content Type Analysis

- **Data Structure**: system
- **Key Relationships**: 核心概念、工程实现、边界条件与常见误区之间的关系
- **Visual Opportunities**: 使用原文流程、比较表、组件关系、指标或分区摘要进行可视化

## Key Data Points (Verbatim)

- 2LSH_{kv}DB

## Source Evidence (Verbatim)

## 60 秒回答

KV Cache 保存自回归生成中历史 Token 各层的 Key 和 Value。生成第 $t$ 个 Token 时，只计算新 Token 的投影并读取历史缓存，避免重算整个前缀。Prompt/Prefix Cache 则在请求之间复用相同前缀的 KV 块，减少重复 Prefill；它可以由自托管引擎管理，也可以是 API 供应商提供的产品能力。

两者都不是语义缓存。前缀缓存通常要求模型、适配器、位置和 Token 前缀兼容；语义相似但 Token 不同不会自然命中。缓存还要处理租户隔离、生命周期、计费口径和模型版本失效。

## 详细解析

对于层数 $L$、序列长度 $S$、KV 头数 $H_{kv}$、头维度 $D$、元素字节数 $B$，单序列 KV Cache 的近似容量为：

$$
2LSH_{kv}DB
$$

这里的头数是 KV 头数，不一定等于 Query 头数。分页、对齐、张量并行、量化和框架元数据会带来额外开销。

缓存层次可以这样区分：

| 机制 | 复用范围 | 命中依据 | 主要收益 |
|---|---|---|---|
| 请求内 KV Cache | 同一次生成 | 已生成 Token | 降低每步 Decode 计算 |
| Prefix Cache | 多请求 | 兼容的 Token 前缀块 | 跳过重复 Prefill |
| Provider Prompt Cache | 由 API 定义 | 供应商规则 | 降低延迟或计费，语义依产品文档 |
| Semantic Cache | 应用层多请求 | 相似度与策略 | 直接复用结果，需控制陈旧和误命中 |

vLLM 的 Automatic Prefix Caching 对 KV 块做哈希并复用已计算块。缓存命中主要改善 Prefill，不会减少新输出 Token 的 Decode 计算。长公共系统指令、固定文档和少样本示例更容易受益。

## 工程实践与边界

容量规划按输入/输出长度分布和并发计算，不能只用模型最大窗口乘请求数。PagedAttention 类块管理可以降低碎片，但物理显存仍受限。服务应在达到水位时调度、抢占或拒绝，而不是等待 OOM。

跨租户缓存必须把租户、模型、LoRA、Tokenizer、模板和权限相关上下文纳入隔离或键空间。即便缓存只存隐状态，也不应假设它没有数据泄露风险。更新系统 Prompt 或模型后主动失效旧条目。

## 常见误区

- **用 Query 头数计算 GQA 缓存**：容量由 KV 头数决定
- **认为 Prefix Cache 加速 Decode**：它主要省去重复前缀的 Prefill
- **认为相似文本可直接命中**：底层 KV 复用通常要求 Token 前缀一致
- **忽略缓存隔离**：哈希键和复用策略必须包含安全边界

## 面试追问

**问：为什么 KV Cache 会随上下文线性增长？**

**答：** 每新增一个 Token，各层都要保存对应的 Key 与 Value；头数、头维度和数据类型固定时，容量与 Token 数成正比。

**问：Prefix Cache 命中后还要计算什么？**

**答：** 引擎仍要处理未命中的后缀，并对所有新生成 Token 执行 Decode。命中只复用兼容前缀的 KV 块。

## Layout × Style Signals

- Content type: system → suggests structural-breakdown
- Tone: 专业、教育、工程导向 → suggests technical-schematic
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: moderate → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：primary

## Recommended Combinations

1. **structural-breakdown + technical-schematic** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **hub-spoke + technical-schematic**: 可作为更强调关系或密度的备选
3. **bento-grid + hand-drawn-edu**: 可作为更强调工程细节的备选
