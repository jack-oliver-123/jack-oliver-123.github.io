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

# 26. Prefix Cache、KV Cache 和 Semantic Cache 有什么区别？

## Overview

比较请求内 KV Cache、跨请求 Prefix Cache 与应用层 Semantic Cache 的键、收益、一致性和安全边界

## Learning Objectives

The viewer will understand:

1. 比较“Prefix Cache、KV Cache 和 Semantic Cache 有什么区别？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

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

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

KV Cache 是单次自回归生成的运行状态，保存历史 Token 在每层的 Key/Value，降低后续 Decode 重算。Prefix Cache 在请求之间按 Token 前缀或 KV 块哈希复用已完成的 Prefill，适合公共系统指令、固定文档和重复多轮前缀。

三者的正确性风险逐级增加。KV/Prefix Cache 在模型和位置兼容时复用确定的中间计算；Semantic Cache 把“相似”解释为“可复用”，需要业务阈值、权限、时效和答案一致性策略。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

| 缓存 | 存储内容 | 命中键 | 主要失效条件 |
|---|---|---|---|
| KV Cache | 当前序列各层 K/V | 请求内 Token 位置 | 请求结束、抢占或容量回收 |
| Prefix Cache | 可共享前缀的 KV 块 | Token/块哈希和模型配置 | 模型、模板、适配器或前缀变化 |
| Semantic Cache | 答案、工具结果或 RAG 结果 | 语义向量加业务条件 | 知识版本、权限、时效或策略变化 |

Prefix Cache 是精确前缀复用。文本规范化、聊天模板或特殊 Token 的细小变化都会改变 Token 序列。部分引擎按完整块复用，最后不完整块和新后缀仍要 Prefill。

Semantic Cache 的键不能只有问题 Embedding。用户权限、地区、语言、知识库版本、Prompt、模型、工具状态和时间窗口都可能影响答案。相似度阈值过低导致误命中，过高则命中率不足。

缓存收益也不同：请求内 KV Cache 主要减少每个新 Token 的历史重算；Prefix Cache 减少重复输入的 TTFT 和 Prefill 计算；Semantic Cache 命中时可能跳过整条生成链路。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

所有跨请求缓存都要按租户隔离或把租户加入键，并对敏感数据设更短生命周期。记录命中类型、节省的 Prefill Token、误命中反馈和失效原因。不要在日志输出原始缓存键中的隐私内容。

Semantic Cache 上线前建立相似/不相似标注对，按任务类别选择阈值。政策、价格、库存和权限相关回答应绑定版本或禁用复用。写操作和个性化结果不适合仅凭语义相似复用。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **把 Prefix Cache 叫语义缓存**：它匹配 Token 前缀，不理解语义
- **认为缓存只影响性能**：错误隔离和陈旧结果会变成安全与正确性问题
- **只用 Embedding 作 Semantic Key**：业务状态和权限也决定可复用性
- **命中后不记录版本**：无法解释结果来自模型还是旧缓存

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
- 26. Prefix Cache、KV Cache 和 Semantic Cache 有什么区别？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
