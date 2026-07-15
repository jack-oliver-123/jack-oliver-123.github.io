Create a professional infographic following these specifications:

## Image Specifications

- **Type**: Infographic
- **Layout**: comparison-matrix
- **Style**: corporate-memphis
- **Aspect Ratio**: 16:9
- **Language**: zh

## Core Principles

- Follow the layout structure precisely for information architecture
- Apply style aesthetics consistently throughout
- If content involves sensitive or copyrighted figures, create stylistically similar alternatives
- Keep information concise, highlight keywords and core concepts
- Use ample whitespace for visual clarity
- Maintain clear visual hierarchy

## Text Requirements

- All text must match the specified style treatment
- Main titles should be prominent and readable
- Key concepts should be visually emphasized
- Labels should be clear and appropriately sized
- Use the specified language for all text content

## Layout Guidelines

# comparison-matrix

Grid-based multi-factor comparison across multiple items.

## Structure

- Table/grid layout
- Rows: items being compared
- Columns: comparison criteria
- Cells: scores, checks, or values
- Header row and column clearly marked

## Best For

- Product feature comparisons
- Tool/software evaluations
- Multi-criteria decisions
- Specification sheets
- Rating comparisons

## Visual Elements

- Clear grid lines or cell boundaries
- Checkmarks, X marks, or scores in cells
- Color coding for quick scanning
- Icons for criteria categories
- Highlight for recommended option

## Text Placement

- Title at top
- Item names in first column
- Criteria in header row
- Brief values in cells
- Legend if using symbols

## Recommended Pairings

- `corporate-memphis`: Business tool comparisons
- `ui-wireframe`: Technical feature matrices
- `blueprint`: Specification comparisons


## Style Guidelines

# corporate-memphis

Flat vector people with vibrant geometric fills

## Color Palette

- Primary: Bright, saturated - purple, orange, teal, yellow
- Background: White or light pastels
- Accents: Gradient fills, geometric patterns

## Visual Elements

- Flat vector illustration
- Disproportionate human figures
- Abstract body shapes
- Floating geometric elements
- No outlines, solid fills
- Plant and object accents

## Typography

- Clean sans-serif
- Bold headings
- Professional but friendly
- Minimal decoration

## Best For

Business presentations, tech products, marketing materials, corporate training


---

Generate the infographic based on the content below:

# 20. 大模型部署有哪些主流方案？vLLM、TGI、llama.cpp、SGLang 实际项目里怎么选？

## Overview

基于硬件、模型支持、吞吐、结构化生成和运维状态比较 vLLM、SGLang、TGI 与 llama.cpp

## Learning Objectives

The viewer will understand:

1. 比较“大模型部署有哪些主流方案？vLLM、TGI、llama.cpp、SGLang 实际项目里怎么选？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

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

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

选择推理引擎要从模型与硬件兼容开始，再比较吞吐、TTFT、TPOT、量化、结构化输出、分布式和可观测性。vLLM 适合 GPU 集群通用服务，提供 PagedAttention、连续批处理、Prefix Cache 和多种并行；SGLang 强调 RadixAttention、结构化生成与复杂 LLM 程序运行时；

Hugging Face 已在 TGI 官方仓库标注维护模式，并推荐新部署评估 vLLM、SGLang 或本地引擎。已有 TGI 系统不需要仓促迁移，但新功能路线、模型支持和安全维护要纳入风险评估。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

四个项目的定位如下：

| 引擎 | 主要场景 | 关键能力 | 选型提醒 |
|---|---|---|---|
| vLLM | 数据中心 GPU/NPU 服务 | 分页 KV、连续批处理、多并行、OpenAI 兼容 API | 功能与后端组合多，需锁版本实测 |
| SGLang | 高吞吐服务与复杂生成程序 | RadixAttention、前缀复用、约束生成、PD 分离 | 部分优化依硬件和模型路径 |
| TGI | 已有 Hugging Face 服务栈 | 流式、张量并行、监控、量化 | 官方处于维护模式 |
| llama.cpp | 本地、边缘、异构硬件 | GGUF、多种量化、CPU/GPU 后端、轻量服务器 | 大规模集群调度能力不是主要定位 |

Automatic Prefix Caching 只在前缀重复时复用 KV，不能把所有请求都加速。vLLM 和 SGLang 的分离 Prefill/Decode、Speculative Decoding 等能力也有版本、模型和部署限制；生产方案应以所锁定版本的官方文档与压测为准。

框架峰值数字很难横向照搬。批大小、输入/输出长度、量化、并行策略、GPU、内核和服务等级目标都会改变结果。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

用真实请求分布构造压测矩阵，至少报告输入/输出长度分位数、并发、TTFT、TPOT、每秒输出 Token、显存和错误率。分别压测短问答、长 Prompt、长输出和结构化生成，不用单一吞吐数决策。

上线前验证模型聊天模板、工具解析、停止 Token、量化精度和流式取消。部署还需限流、超时、健康检查、滚动升级、指标、追踪和回滚。兼容 OpenAI API 只说明接口形状接近，不代表全部参数语义一致。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **按 GitHub 热度选框架**：硬件、模型和负载匹配更重要
- **把 Prefix Cache 当通用加速**：没有重复前缀就难以命中
- **只测吞吐**：交互产品还受首 Token 延迟和尾延迟约束
- **把实验功能当稳定能力**：锁定版本后必须做故障与升级验证

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 本图不使用额外定量数据。

---

## Design Instructions

### Style Preferences

- 使用 manifest 中已确认的版式与风格
- 保持简体中文清晰可读，技术名词按原文拼写

### Layout Preferences

- 横版 16:9
- 标题突出，主要信息区不超过 4 个

### Other Requirements

- 仅使用上面的原文内容，不添加事实、示例、数值或来源
- 不生成品牌标志、水印、页脚引用或装饰性长文


Text labels (in zh):
- 20. 大模型部署有哪些主流方案？vLLM、TGI、llama.cpp、SGLang 实际项目里怎么选？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
