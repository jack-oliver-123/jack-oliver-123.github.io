Create a professional infographic following these specifications:

## Image Specifications

- **Type**: Infographic
- **Layout**: linear-progression
- **Style**: hand-drawn-edu
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

# linear-progression

Sequential progression showing steps, timeline, or chronological events.

## Structure

- Linear arrangement (horizontal or vertical)
- Nodes/markers at key points
- Connecting line or path between nodes
- Clear start and end points
- Directional flow indicators

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Timeline** | Chronological events, dates | Time markers, period labels |
| **Process** | Action steps, numbered sequence | Step numbers, action icons |

## Best For

- Step-by-step tutorials and how-tos
- Historical timelines and evolution
- Project milestones and roadmaps
- Workflow documentation
- Onboarding processes

## Visual Elements

- Numbered steps or date markers
- Arrows or connectors showing direction
- Icons representing each step/event
- Consistent node spacing
- Progress indicators optional

## Text Placement

- Title at top
- Step/event titles at each node
- Brief descriptions below nodes
- Dates or numbers clearly visible

## Recommended Pairings

- `craft-handmade`: Friendly tutorials and timelines
- `ikea-manual`: Clean assembly instructions
- `corporate-memphis`: Business process flows
- `aged-academia`: Historical discoveries


## Style Guidelines

# hand-drawn-edu

Hand-drawn educational infographic with macaron pastel color blocks on warm cream paper texture.

## Color Palette

- Background: Warm cream (#F5F0E8) with subtle paper grain texture
- Primary text: Deep charcoal (#2D2D2D) for headlines, outlines
- Macaron Blue: #A8D8EA for cool-toned information zones
- Macaron Mint: #B5E5CF for growth/positive zones
- Macaron Lavender: #D5C6E0 for abstract/concept zones
- Macaron Peach: #FFD5C2 for warm-toned zones
- Accent: Coral Red (#E8655A) for key data, warnings, emphasis
- Muted annotations: Warm gray (#6B6B6B) for secondary labels

## Visual Elements

- Macaron pastel rounded cards as distinct information zones
- Hand-drawn wavy connection lines and arrows with small text labels
- Simple stick-figure characters and cartoon icons to humanize concepts
- Doodle decorations: small stars, underlines, spirals, sparkles
- Color fills don't completely fill outlines — preserve casual hand-drawn feel
- Dashed borders for secondary or contained zones
- Small icon doodles (clipboard, lock, checkmark, lightbulb) to reinforce concepts
- Bold centered quote or takeaway at the bottom
- Slight hand-drawn wobble on all lines and shapes

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Sketch-notes** | Concept mapping | More stick figures, thought bubbles, connecting arrows |
| **Pastel cards** | Structured info | Cleaner macaron blocks, less doodle, more white space |

## Typography

- Main title: Bold hand-drawn lettering with organic strokes, large confident letterforms with slight wobble
- Section headers: Hand-lettered text on or inside macaron color blocks
- Body text: Clear handwritten print style, legible but not mechanical
- Annotations: Warm gray (#6B6B6B), smaller, neat handwritten labels
- Keywords: Bold emphasis within body text

## Style Enforcement

- All lines must have slight hand-drawn wobble — no perfect geometry
- Each information zone uses a distinct macaron color block
- Maintain consistent wobble quality across all shapes and lines
- Include at least one simple cartoon character or stick figure
- Generous white space between zones — each zone should breathe
- Maximum 4 macaron colors per infographic

## Avoid

- Perfect geometric shapes or straight lines
- Photorealistic elements or stock illustration style
- Pure white backgrounds
- Flat vector icons or digital-precision graphics
- Overcrowded layouts — let zones breathe
- Corporate or clinical aesthetic

## Best For

Educational diagrams, process explainers, concept maps, knowledge summaries, tutorial walkthroughs, onboarding visuals


---

Generate the infographic based on the content below:

# 9. 讲讲你用的向量数据库？数据量级是多大？性能如何？遇到过性能瓶颈吗？

## Overview

介绍向量数据库在实际 RAG 项目中的数据规模、性能瓶颈和优化方法，梳理索引、召回和延迟的平衡

## Learning Objectives

The viewer will understand:

1. 复述“讲讲你用的向量数据库？数据量级是多大？性能如何？遇到过性能瓶颈吗？”的关键流程与控制点
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

这道题要用真实项目数据回答，而不是背产品参数。完整答案应包含：为什么选该数据库；向量数、维度、元数据与增长率；索引和距离配置；读写比例与过滤特征；测试硬件、并发、Recall@K、P50/P95/P99 延迟；最后说明遇到的瓶颈、定位证据和优化后的对照结果。

如果没有生产数据，应坦诚说明实验范围。可以讲基准设计和观察到的趋势，但不要虚构“千万级、毫秒级”数字。性能只有连同数据集、版本、硬件、并发和质量约束一起才有意义。

## 详细解析

### 回答框架

1. **背景与选型**：是否已有 PostgreSQL，是否需要独立扩缩、混合检索或托管服务。
2. **数据画像**：有效向量数、维度、数据类型、日增量、删除率、租户和过滤字段基数。
3. **服务目标**：目标并发、延迟分位数、召回底线、可用性与新鲜度 SLO。
4. **瓶颈证据**：CPU、内存、磁盘、网络、过滤命中、队列时间与索引构建指标。
5. **改进验证**：改变一个因素，保留对照，并说明质量与资源代价。

### 常见瓶颈

索引无法驻留导致随机 I/O；过滤选择性与 ANN 不匹配；查询并发超过线程或连接池；大批量更新触发索引维护；副本加载和 compaction 造成尾延迟；Embedding 服务反而成为端到端瓶颈。定位时必须把检索服务内部延迟与网络、编码和重排拆开。

## 工程实践与边界

- 基准脚本、数据快照、数据库版本和配置入库，结果才可复现。
- 同时画 Recall@K 与 P95 延迟，不能用降低搜索强度换速度后只报告延迟。
- 预留节点故障、备份和重建期间的容量，稳态压测不足以证明生产可用。
- 对多租户分别观察大租户与长尾租户，平均值会掩盖热点。

## 常见误区

- **“面试必须给出漂亮数字”**：不可核验的数字比清楚的实验边界更糟。
- **“慢就是索引参数问题”**：Embedding、网络、过滤、反序列化和重排都可能占主要时间。
- **“增加副本可线性提升吞吐”**：还受路由、缓存、共享存储和协调开销影响。
- **“压测 QPS 可以代表线上体验”**：还需要查询分布、尾延迟、错误率和召回质量。

## 面试追问

1. **如何构造 ground truth？** 在可承受规模上用精确距离搜索，或由人工标注可接受文档集合。
2. **怎么证明优化有效？** 固定数据与查询，报告置信区间或多次运行方差，并确认质量没有退化。
3. **容量怎么估算？** 从向量、索引、元数据、副本和构建临时空间分项测量，再加故障冗余与增长窗口。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

这道题要用真实项目数据回答，而不是背产品参数。完整答案应包含：为什么选该数据库；向量数、维度、元数据与增长率；索引和距离配置；读写比例与过滤特征；测试硬件、并发、Recall@K、P50/P95/P99 延迟；最后说明遇到的瓶颈、定位证据和优化后的对照结果。

如果没有生产数据，应坦诚说明实验范围。可以讲基准设计和观察到的趋势，但不要虚构“千万级、毫秒级”数字。性能只有连同数据集、版本、硬件、并发和质量约束一起才有意义。

**Visual Element**: Type: numbered process node; Subject: 60 秒回答；Treatment: 从左到右连接并标明第 1 阶段

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 回答框架
1. **背景与选型**：是否已有 PostgreSQL，是否需要独立扩缩、混合检索或托管服务。

### 常见瓶颈
索引无法驻留导致随机 I/O；

**Visual Element**: Type: numbered process node; Subject: 详细解析；Treatment: 从左到右连接并标明第 2 阶段

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 基准脚本、数据快照、数据库版本和配置入库，结果才可复现。
- 同时画 Recall@K 与 P95 延迟，不能用降低搜索强度换速度后只报告延迟。
- 预留节点故障、备份和重建期间的容量，稳态压测不足以证明生产可用。
- 对多租户分别观察大租户与长尾租户，平均值会掩盖热点。

**Visual Element**: Type: numbered process node; Subject: 工程实践与边界；Treatment: 从左到右连接并标明第 3 阶段

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“面试必须给出漂亮数字”**：不可核验的数字比清楚的实验边界更糟。
- **“慢就是索引参数问题”**：Embedding、网络、过滤、反序列化和重排都可能占主要时间。
- **“增加副本可线性提升吞吐”**：还受路由、缓存、共享存储和协调开销影响。
- **“压测 QPS 可以代表线上体验”**：还需要查询分布、尾延迟、错误率和召回质量。

**Visual Element**: Type: numbered process node; Subject: 常见误区；Treatment: 从左到右连接并标明第 4 阶段

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 这道题要用真实项目数据回答，而不是背产品参数。完整答案应包含：为什么选该数据库；向量数、维度、元数据与增长率；索引和距离配置；读写比例与过滤特征；测试硬件、并发、Recall@K、P50/P95/P99 延迟；最后说明遇到的瓶颈、定位证据和优化后的对照结果。
- 同时画 Recall@K 与 P95 延迟，不能用降低搜索强度换速度后只报告延迟。

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
- 9. 讲讲你用的向量数据库？数据量级是多大？性能如何？遇到过性能瓶颈吗？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
