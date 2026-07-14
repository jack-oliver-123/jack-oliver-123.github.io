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

# 15. 大模型量化是什么？INT8/INT4/AWQ/GPTQ 怎么选？

## Overview

解释权重、激活与 KV Cache 量化，比较 INT8、INT4、GPTQ、AWQ 的校准方式和硬件边界

## Learning Objectives

The viewer will understand:

1. 比较“大模型量化是什么？INT8/INT4/AWQ/GPTQ 怎么选？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

量化用更低位宽表示权重、激活或 KV Cache，以减少存储、显存带宽和部分计算。INT8 通常更稳健，INT4 压缩更大但对异常值和内核更敏感。GPTQ 是基于校准数据、逐层近似重构误差的权重量化方法；AWQ 根据激活统计识别敏感权重通道，并通过缩放降低权重量化误差。

选型不能只看文件大小。先确认硬件和框架是否有对应内核，再在真实 Prompt 长度和并发下测质量、TTFT、TPOT、吞吐与显存。低位格式若需要频繁反量化或回退内核，速度可能没有改善。

## 详细解析

对称均匀量化常把浮点值 $x$ 映射到整数：

$
q=\operatorname{clip}(\operatorname{round}(x/s),q_{min},q_{max}),\quad \hat{x}=sq
$

$s$ 是缩放因子。非对称量化还使用零点。粒度可按张量、通道或分组设置；分组更细通常降低误差，但需要更多缩放元数据。

需要区分三个对象：

- **Weight-only**：权重低位存储，计算时配合专用内核或反量化
- **Weight-Activation**：权重和激活都量化，更依赖异常值处理与硬件支持
- **KV Cache**：降低长上下文和并发缓存容量，可能影响注意力质量

GPTQ 利用少量校准输入近似二阶信息，逐块量化并补偿误差。AWQ 观察激活幅度来保护对输出更敏感的权重通道，通常通过等价缩放改善量化。它不是简单地把固定比例权重永久保存为高精度。

量化感知训练（Quantization-Aware Training，QAT）在训练中模拟量化误差，成本高于训练后量化（Post-Training Quantization，PTQ），但在低位或敏感任务中可能更稳。

## 工程实践与边界

校准集要覆盖部署语料、长度和语言。评测同时检查困惑度或任务指标、结构化输出、安全与长上下文；只测短英文基准可能漏掉量化退化。

记录格式、位宽、分组大小、对称性、校准集、内核和硬件。名称同为“INT4”的模型可能采用不同布局，不能假设跨框架兼容。优化器状态只存在训练阶段，推理权重量化不会通过“压缩优化器”节省在线显存。

## 常见误区

- **把位宽减半等同于延迟减半**：瓶颈、元数据和内核决定实际速度
- **认为 AWQ 固定保留一部分 FP16 权重**：核心是激活感知的缩放和量化策略
- **只评估模型文件大小**：运行时还包含 KV Cache、激活和框架缓冲
- **忽略校准分布**：不匹配的校准数据会放大量化误差

## 面试追问

**问：为什么激活量化通常比权重量化更难？**

**答：** 激活随输入动态变化并可能含异常值，固定缩放范围更难覆盖。SmoothQuant 等方法会在权重和激活之间迁移量化难度。

**问：INT4 模型为什么可能比 FP16 慢？**

**答：** 若硬件没有高效低位内核，运行时要解包、反量化或回退到低效路径，额外开销会抵消带宽收益。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

量化用更低位宽表示权重、激活或 KV Cache，以减少存储、显存带宽和部分计算。INT8 通常更稳健，INT4 压缩更大但对异常值和内核更敏感。GPTQ 是基于校准数据、逐层近似重构误差的权重量化方法；AWQ 根据激活统计识别敏感权重通道，并通过缩放降低权重量化误差。

选型不能只看文件大小。先确认硬件和框架是否有对应内核，再在真实 Prompt 长度和并发下测质量、TTFT、TPOT、吞吐与显存。低位格式若需要频繁反量化或回退内核，速度可能没有改善。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

对称均匀量化常把浮点值 $x$ 映射到整数：

$
q=\operatorname{clip}(\operatorname{round}(x/s),q_{min},q_{max}),\quad \hat{x}=sq
$

$s$ 是缩放因子。非对称量化还使用零点。粒度可按张量、通道或分组设置；分组更细通常降低误差，但需要更多缩放元数据。

需要区分三个对象：

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

校准集要覆盖部署语料、长度和语言。评测同时检查困惑度或任务指标、结构化输出、安全与长上下文；只测短英文基准可能漏掉量化退化。

记录格式、位宽、分组大小、对称性、校准集、内核和硬件。名称同为“INT4”的模型可能采用不同布局，不能假设跨框架兼容。优化器状态只存在训练阶段，推理权重量化不会通过“压缩优化器”节省在线显存。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **把位宽减半等同于延迟减半**：瓶颈、元数据和内核决定实际速度
- **认为 AWQ 固定保留一部分 FP16 权重**：核心是激活感知的缩放和量化策略
- **只评估模型文件大小**：运行时还包含 KV Cache、激活和框架缓冲
- **忽略校准分布**：不匹配的校准数据会放大量化误差

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 量化用更低位宽表示权重、激活或 KV Cache，以减少存储、显存带宽和部分计算。INT8 通常更稳健，INT4 压缩更大但对异常值和内核更敏感。GPTQ 是基于校准数据、逐层近似重构误差的权重量化方法；AWQ 根据激活统计识别敏感权重通道，并通过缩放降低权重量化误差。
- 记录格式、位宽、分组大小、对称性、校准集、内核和硬件。名称同为“INT4”的模型可能采用不同布局，不能假设跨框架兼容。优化器状态只存在训练阶段，推理权重量化不会通过“压缩优化器”节省在线显存。
- **认为 AWQ 固定保留一部分 FP16 权重**：核心是激活感知的缩放和量化策略

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
- 15. 大模型量化是什么？INT8/INT4/AWQ/GPTQ 怎么选？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
