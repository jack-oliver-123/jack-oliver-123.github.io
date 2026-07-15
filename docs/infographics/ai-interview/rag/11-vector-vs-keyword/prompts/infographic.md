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

# 11. 请你介绍一下向量检索和关键词检索的区别？

## Overview

对比向量检索和关键词检索的原理与适用场景，分析语义匹配、精确匹配、混合检索和召回效果之间的互补关系

## Learning Objectives

The viewer will understand:

1. 比较“请你介绍一下向量检索和关键词检索的区别？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

关键词检索通常基于倒排索引和 BM25 等排序函数，利用查询词在文档中的出现、稀有程度与长度归一化打分，擅长型号、错误码、人名和原文短语。向量检索把查询和文档编码为稠密向量，按距离寻找近邻，擅长措辞不同但语义相关的内容。

两者不是替代关系。生产 RAG 常并行召回，再用 RRF 或经验证的分数融合合并，并可交给 reranker 精排。BM25 参数、分词器、Embedding 模型、ANN 参数和融合常数都需要在目标数据上评测，没有跨系统通用的默认最优值。

## 详细解析

### 关键词检索

倒排索引从词项映射到文档。BM25 在概率检索思想上结合词频饱和、逆文档频率和文档长度归一化；它并非简单统计词频。具体公式和 IDF 变体在实现之间可能不同，中文效果还受分词、同义词和字段权重影响。

### 向量检索

稠密检索用训练后的编码器学习语义空间，可以召回不共享字面的相关文档。其弱点包括精确标识符被稀释、领域漂移、难以解释分数，以及 ANN 带来的近似误差。向量相似度阈值必须按模型和语料校准。

### 混合检索

混合检索先保留两种召回器的互补性。RRF 按各列表名次累加 `1 / (k + rank)`，避免直接比较不同分数尺度；`k` 控制靠前名次的相对影响，是待验证参数，不是固定规则。若采用线性分数组合，需要先检查校准与分布稳定性。

## 工程实践与边界

- 评测集要覆盖精确词、同义改写、长问题、拼写错误与无答案查询。
- 分别记录 sparse-only、dense-only、hybrid 和 rerank 的消融结果。
- ACL 与时间过滤应对每路候选一致生效，避免融合后混入越权数据。
- 文档更新时同步稀疏和稠密索引，并用版本避免混合新旧内容。

## 常见误区

- **“BM25 不能处理语义”**：它不直接学习稠密语义，但词项统计、分词与扩展仍可产生强基线。
- **“向量检索总是更先进”**：精确标识符和小语料上，关键词方法可能更合适。
- **“两路分数相加即可”**：分数尺度、方向和分布可能不同。
- **“RRF 的 k 必须等于 60”**：原论文使用特定设置不等于所有数据的最佳值。

## 面试追问

1. **错误码检索怎么设计？** 保留大小写与符号的规范化字段，优先精确或关键词召回，同时保留向量路处理描述性问题。
2. **混合检索为什么可能变差？** 弱召回路会引入噪声并挤占候选，需要调权、按查询路由或重排。
3. **如何判断两路互补？** 分析每路独有的相关文档和 oracle union recall，而非只比较平均分。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

关键词检索通常基于倒排索引和 BM25 等排序函数，利用查询词在文档中的出现、稀有程度与长度归一化打分，擅长型号、错误码、人名和原文短语。向量检索把查询和文档编码为稠密向量，按距离寻找近邻，擅长措辞不同但语义相关的内容。

两者不是替代关系。生产 RAG 常并行召回，再用 RRF 或经验证的分数融合合并，并可交给 reranker 精排。BM25 参数、分词器、Embedding 模型、ANN 参数和融合常数都需要在目标数据上评测，没有跨系统通用的默认最优值。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 关键词检索
倒排索引从词项映射到文档。

### 向量检索
稠密检索用训练后的编码器学习语义空间，可以召回不共享字面的相关文档。

### 混合检索
混合检索先保留两种召回器的互补性。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 评测集要覆盖精确词、同义改写、长问题、拼写错误与无答案查询。
- 分别记录 sparse-only、dense-only、hybrid 和 rerank 的消融结果。
- ACL 与时间过滤应对每路候选一致生效，避免融合后混入越权数据。
- 文档更新时同步稀疏和稠密索引，并用版本避免混合新旧内容。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“BM25 不能处理语义”**：它不直接学习稠密语义，但词项统计、分词与扩展仍可产生强基线。
- **“向量检索总是更先进”**：精确标识符和小语料上，关键词方法可能更合适。
- **“两路分数相加即可”**：分数尺度、方向和分布可能不同。
- **“RRF 的 k 必须等于 60”**：原论文使用特定设置不等于所有数据的最佳值。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 关键词检索通常基于倒排索引和 BM25 等排序函数，利用查询词在文档中的出现、稀有程度与长度归一化打分，擅长型号、错误码、人名和原文短语。向量检索把查询和文档编码为稠密向量，按距离寻找近邻，擅长措辞不同但语义相关的内容。
- 两者不是替代关系。生产 RAG 常并行召回，再用 RRF 或经验证的分数融合合并，并可交给 reranker 精排。BM25 参数、分词器、Embedding 模型、ANN 参数和融合常数都需要在目标数据上评测，没有跨系统通用的默认最优值。
- 倒排索引从词项映射到文档。BM25 在概率检索思想上结合词频饱和、逆文档频率和文档长度归一化；它并非简单统计词频。具体公式和 IDF 变体在实现之间可能不同，中文效果还受分词、同义词和字段权重影响。
- 混合检索先保留两种召回器的互补性。RRF 按各列表名次累加 `1 / (k + rank)`，避免直接比较不同分数尺度；`k` 控制靠前名次的相对影响，是待验证参数，不是固定规则。若采用线性分数组合，需要先检查校准与分布稳定性。
- **“BM25 不能处理语义”**：它不直接学习稠密语义，但词项统计、分词与扩展仍可产生强基线。
- **“RRF 的 k 必须等于 60”**：原论文使用特定设置不等于所有数据的最佳值。

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
- 11. 请你介绍一下向量检索和关键词检索的区别？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
