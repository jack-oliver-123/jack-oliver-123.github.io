Create a professional infographic following these specifications:

## Image Specifications

- **Type**: Infographic
- **Layout**: structural-breakdown
- **Style**: technical-schematic
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

# structural-breakdown

Internal structure visualization with labeled parts or layers.

## Structure

- Central subject (object, system, body)
- Parts or layers clearly shown
- Labels with callout lines
- Exploded or cutaway view
- Optional zoomed detail sections

## Variants

| Variant | View Type | Visual Emphasis |
|---------|-----------|-----------------|
| **Exploded** | Parts separated outward | Component relationships |
| **Cross-section** | Sliced/cutaway view | Internal layers, composition |

## Best For

- Product part breakdowns
- Anatomy explanations
- System components
- Device teardowns
- Material composition

## Visual Elements

- Main subject clearly rendered
- Callout lines with dots/arrows
- Label boxes at endpoints
- Numbered parts optionally
- Layer boundaries or separation

## Text Placement

- Title at top
- Part/layer labels at callouts
- Brief descriptions in boxes
- Legend for numbered systems
- Depth/thickness if relevant

## Recommended Pairings

- `technical-schematic`: Technical schematics
- `aged-academia`: Classic anatomical style
- `craft-handmade`: Friendly breakdowns


## Style Guidelines

# technical-schematic

Technical diagrams with engineering precision and clean geometry.

## Color Palette

- Primary: Blues (#2563EB), teals, grays, white lines
- Background: Deep blue (#1E3A5F), white, or light gray with grid
- Accents: Amber highlights (#F59E0B), cyan callouts

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Blueprint** | Engineering schematics | White on blue, measurements, grid |
| **Isometric** | 3D spatial representation | 30° angle blocks, clean fills |

## Visual Elements

- Geometric precision throughout
- Grid pattern or isometric angle
- Dimension lines and measurements
- Technical symbols and annotations
- Clean vector shapes
- Consistent stroke weights

## Typography

- Technical stencil or clean sans-serif
- All-caps labels
- Measurement annotations
- Floating labels for isometric

## Best For

Technical architecture, system diagrams, engineering specs, product breakdowns, data visualization


---

Generate the infographic based on the content below:

# 14. KV Cache 是什么？Prompt Caching 的原理是什么？

## Overview

区分单次解码 KV Cache 与跨请求 Prompt/Prefix Cache，并说明容量公式、命中条件和隔离风险

## Learning Objectives

The viewer will understand:

1. 说明“KV Cache 是什么？Prompt Caching 的原理是什么？”的组成部分及其关系
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

KV Cache 保存自回归生成中历史 Token 各层的 Key 和 Value。生成第 $t$ 个 Token 时，只计算新 Token 的投影并读取历史缓存，避免重算整个前缀。Prompt/Prefix Cache 则在请求之间复用相同前缀的 KV 块，减少重复 Prefill；它可以由自托管引擎管理，也可以是 API 供应商提供的产品能力。

两者都不是语义缓存。前缀缓存通常要求模型、适配器、位置和 Token 前缀兼容；语义相似但 Token 不同不会自然命中。缓存还要处理租户隔离、生命周期、计费口径和模型版本失效。

## 详细解析

对于层数 $L$、序列长度 $S$、KV 头数 $H_{kv}$、头维度 $D$、元素字节数 $B$，单序列 KV Cache 的近似容量为：

$
2LSH_{kv}DB
$

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

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

KV Cache 保存自回归生成中历史 Token 各层的 Key 和 Value。生成第 $t$ 个 Token 时，只计算新 Token 的投影并读取历史缓存，避免重算整个前缀。Prompt/Prefix Cache 则在请求之间复用相同前缀的 KV 块，减少重复 Prefill；它可以由自托管引擎管理，也可以是 API 供应商提供的产品能力。

两者都不是语义缓存。前缀缓存通常要求模型、适配器、位置和 Token 前缀兼容；语义相似但 Token 不同不会自然命中。缓存还要处理租户隔离、生命周期、计费口径和模型版本失效。

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

对于层数 $L$、序列长度 $S$、KV 头数 $H_{kv}$、头维度 $D$、元素字节数 $B$，单序列 KV Cache 的近似容量为：

$
2LSH_{kv}DB
$

这里的头数是 KV 头数，不一定等于 Query 头数。分页、对齐、张量并行、量化和框架元数据会带来额外开销。

缓存层次可以这样区分：

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

容量规划按输入/输出长度分布和并发计算，不能只用模型最大窗口乘请求数。PagedAttention 类块管理可以降低碎片，但物理显存仍受限。服务应在达到水位时调度、抢占或拒绝，而不是等待 OOM。

跨租户缓存必须把租户、模型、LoRA、Tokenizer、模板和权限相关上下文纳入隔离或键空间。即便缓存只存隐状态，也不应假设它没有数据泄露风险。更新系统 Prompt 或模型后主动失效旧条目。

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **用 Query 头数计算 GQA 缓存**：容量由 KV 头数决定
- **认为 Prefix Cache 加速 Decode**：它主要省去重复前缀的 Prefill
- **认为相似文本可直接命中**：底层 KV 复用通常要求 Token 前缀一致
- **忽略缓存隔离**：哈希键和复用策略必须包含安全边界

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 2LSH_{kv}DB

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
- 14. KV Cache 是什么？Prompt Caching 的原理是什么？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
