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

# 26. 长上下文模型能替代 RAG 吗？实际项目中怎么选？

## Overview

比较长上下文、RAG 与混合方案在质量、权限、时效、延迟和成本上的工程取舍

## Learning Objectives

The viewer will understand:

1. 比较“长上下文模型能替代 RAG 吗？实际项目中怎么选？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

长上下文不会普遍替代 RAG。它适合一次输入规模可控、需要全局阅读或跨段关系、文档集合相对稳定的任务；RAG 适合大规模且持续变化的语料，需要 ACL、来源追溯、删除和低平均输入成本的场景。模型标称上下文长度也不等于能稳定利用每个位置的信息。

实际选型要在真实任务上比较 full-context、RAG 和混合方案，测答案质量、引用、P95 延迟、输入 token、缓存命中、更新新鲜度和权限风险。常见混合方式是先检索缩小范围，再把完整候选文档或章节放入长上下文模型。

## 详细解析

### 长上下文的优势与限制

把整份合同、代码库子集或会议记录交给模型，可避免切块遗漏，并支持跨段整合。但输入越长，预填充计算、传输和上下文管理成本通常越高。Lost in the Middle、LongBench 和 RULER 等研究表明，有效上下文能力需要通过具体模型和任务测量，不能由最大 token 数直接推断。

### RAG 的优势与限制

RAG 只选择少量候选，便于更新、删除、ACL 和引用，但可能因解析、切块或检索错误漏掉关键证据。它还需要维护索引与评测链路。若问题需要通读全文结构，过度切块会破坏全局信息。

### 混合策略

先用元数据和检索选择文档集合，再把选中文档的完整章节装入上下文；或先做长上下文摘要，再通过 RAG 引用原文。路由器可按语料规模、查询类型和权限决定路径，但应保留确定性预算上限与回退。

## 工程实践与边界

- 用目标模型、真实文档长度和硬件/服务配置压测，不引用脱离条件的速度数字。
- full-context 也必须在输入前执行 ACL，不能把无权内容交给模型后再删答案。
- 缓存可能降低重复前缀成本，但缓存键需绑定租户、权限和数据版本。
- 评测集合包含关键信息位于开头、中间、结尾及跨文档的样本。

## 常见误区

- **“上下文窗口装得下就能用好”**：可容纳长度与有效检索、推理能力不同。
- **“RAG 总是更便宜”**：检索、重排和运维也有成本，应按真实流量测量。
- **“长上下文不需要引用”**：用户仍需要定位原始证据，尤其是高风险回答。
- **“只能二选一”**：检索缩小范围加长上下文阅读通常是有价值的候选方案。

## 面试追问

1. **怎样设计选型实验？** 固定模型与查询集，对三种路径做配对比较，并报告质量、延迟、token、失败类型与方差。
2. **什么时候优先 full-context？** 文档数量少、一次性分析、全局结构重要，且权限与预算可控时。
3. **什么时候必须保留 RAG？** 语料大且常更新、需要细粒度 ACL、删除、新鲜度或可审计引用时。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

长上下文不会普遍替代 RAG。它适合一次输入规模可控、需要全局阅读或跨段关系、文档集合相对稳定的任务；RAG 适合大规模且持续变化的语料，需要 ACL、来源追溯、删除和低平均输入成本的场景。模型标称上下文长度也不等于能稳定利用每个位置的信息。

实际选型要在真实任务上比较 full-context、RAG 和混合方案，测答案质量、引用、P95 延迟、输入 token、缓存命中、更新新鲜度和权限风险。常见混合方式是先检索缩小范围，再把完整候选文档或章节放入长上下文模型。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 长上下文的优势与限制
把整份合同、代码库子集或会议记录交给模型，可避免切块遗漏，并支持跨段整合。

### RAG 的优势与限制
RAG 只选择少量候选，便于更新、删除、ACL 和引用，但可能因解析、切块或检索错误漏掉关键证据。

### 混合策略
先用元数据和检索选择文档集合，再把选中文档的完整章节装入上下文；

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 用目标模型、真实文档长度和硬件/服务配置压测，不引用脱离条件的速度数字。
- full-context 也必须在输入前执行 ACL，不能把无权内容交给模型后再删答案。
- 缓存可能降低重复前缀成本，但缓存键需绑定租户、权限和数据版本。
- 评测集合包含关键信息位于开头、中间、结尾及跨文档的样本。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“上下文窗口装得下就能用好”**：可容纳长度与有效检索、推理能力不同。
- **“RAG 总是更便宜”**：检索、重排和运维也有成本，应按真实流量测量。
- **“长上下文不需要引用”**：用户仍需要定位原始证据，尤其是高风险回答。
- **“只能二选一”**：检索缩小范围加长上下文阅读通常是有价值的候选方案。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 实际选型要在真实任务上比较 full-context、RAG 和混合方案，测答案质量、引用、P95 延迟、输入 token、缓存命中、更新新鲜度和权限风险。常见混合方式是先检索缩小范围，再把完整候选文档或章节放入长上下文模型。

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
- 26. 长上下文模型能替代 RAG 吗？实际项目中怎么选？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
