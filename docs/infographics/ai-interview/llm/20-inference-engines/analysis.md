---
title: "20. 大模型部署有哪些主流方案？vLLM、TGI、llama.cpp、SGLang 实际项目里怎么选？"
topic: "large language model engineering"
data_type: "comparison"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

基于硬件、模型支持、吞吐、结构化生成和运维状态比较 vLLM、SGLang、TGI 与 llama.cpp

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 比较“大模型部署有哪些主流方案？vLLM、TGI、llama.cpp、SGLang 实际项目里怎么选？”涉及的主要方案与选型维度
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

选择推理引擎要从模型与硬件兼容开始，再比较吞吐、TTFT、TPOT、量化、结构化输出、分布式和可观测性。vLLM 适合 GPU 集群通用服务，提供 PagedAttention、连续批处理、Prefix Cache 和多种并行；SGLang 强调 RadixAttention、结构化生成与复杂 LLM 程序运行时；llama.cpp 适合 GGUF 量化和 CPU、Apple Silicon、消费级 GPU 等本地/边缘环境。

Hugging Face 已在 TGI 官方仓库标注维护模式，并推荐新部署评估 vLLM、SGLang 或本地引擎。已有 TGI 系统不需要仓促迁移，但新功能路线、模型支持和安全维护要纳入风险评估。

## 详细解析

四个项目的定位如下：

| 引擎 | 主要场景 | 关键能力 | 选型提醒 |
|---|---|---|---|
| vLLM | 数据中心 GPU/NPU 服务 | 分页 KV、连续批处理、多并行、OpenAI 兼容 API | 功能与后端组合多，需锁版本实测 |
| SGLang | 高吞吐服务与复杂生成程序 | RadixAttention、前缀复用、约束生成、PD 分离 | 部分优化依硬件和模型路径 |
| TGI | 已有 Hugging Face 服务栈 | 流式、张量并行、监控、量化 | 官方处于维护模式 |
| llama.cpp | 本地、边缘、异构硬件 | GGUF、多种量化、CPU/GPU 后端、轻量服务器 | 大规模集群调度能力不是主要定位 |

Automatic Prefix Caching 只在前缀重复时复用 KV，不能把所有请求都加速。vLLM 和 SGLang 的分离 Prefill/Decode、Speculative Decoding 等能力也有版本、模型和部署限制；生产方案应以所锁定版本的官方文档与压测为准。

框架峰值数字很难横向照搬。批大小、输入/输出长度、量化、并行策略、GPU、内核和服务等级目标都会改变结果。

## 工程实践与边界

用真实请求分布构造压测矩阵，至少报告输入/输出长度分位数、并发、TTFT、TPOT、每秒输出 Token、显存和错误率。分别压测短问答、长 Prompt、长输出和结构化生成，不用单一吞吐数决策。

上线前验证模型聊天模板、工具解析、停止 Token、量化精度和流式取消。部署还需限流、超时、健康检查、滚动升级、指标、追踪和回滚。兼容 OpenAI API 只说明接口形状接近，不代表全部参数语义一致。

## 常见误区

- **按 GitHub 热度选框架**：硬件、模型和负载匹配更重要
- **把 Prefix Cache 当通用加速**：没有重复前缀就难以命中
- **只测吞吐**：交互产品还受首 Token 延迟和尾延迟约束
- **把实验功能当稳定能力**：锁定版本后必须做故障与升级验证

## 面试追问

**问：为什么高吞吐配置可能让用户感觉更慢？**

**答：** 为扩大批次而排队可提高总吞吐，却增加 TTFT。调度器需要在吞吐和交互延迟 SLO 之间权衡。

**问：什么时候优先 llama.cpp？**

**答：** 模型能用 GGUF 表示，目标是本地隐私、离线运行或异构边缘硬件，并且并发需求有限时，它的部署面更匹配。

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
