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

# 19. RAG 知识库如何实现动态与持续更新？

## Overview

介绍 RAG 知识库动态更新的实现方式，梳理增量入库、版本管理、索引刷新和数据一致性的工程方案

## Learning Objectives

The viewer will understand:

1. 复述“RAG 知识库如何实现动态与持续更新？”的关键流程与控制点
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

持续更新的核心是可追溯、幂等的变更流水线。权威源产生新增、修改、删除事件；系统以稳定文档 ID、内容哈希和源版本去重，重新解析受影响文档，生成带版本的 chunk 与向量，并把正文、稀疏索引、向量索引、ACL 和缓存作为同一发布单元管理。

上线不应原地覆盖后立即全量切流。我会构建影子版本，校验数量、抽样内容与回归集，影子读比较后灰度，通过索引别名或版本路由原子切换，并保留旧版本用于回滚。监控更新延迟、失败队列、孤儿 chunk、删除传播和新鲜度 SLO。

## 详细解析

### 变更捕获与幂等

数据源可以通过 CDC、Webhook 或定时扫描提供变更。事件携带源记录 ID 与单调版本；消费者用幂等键避免重放产生重复。内容哈希用于跳过未变化正文，但权限、元数据或解析器版本变化仍可能要求更新派生数据。

### 更新与删除

修改文档时，用文档 ID 找到旧 chunk，生成新版本并在发布边界替换。删除必须传播到正文副本、向量、稀疏索引、图关系、缓存和备份策略。若数据库删除为异步可见，应把可见性延迟纳入合规与新鲜度 SLO。

### 发布与恢复

若正文与索引处于同一事务边界，可用版本字段原子提交。跨数据库、稀疏索引、向量索引和缓存的更新不能因规模小就直接双写；应通过 Transactional Outbox 或 CDC 发布事件，由幂等消费者更新派生数据，并持续对账。大规模切块或模型升级更适合重建新索引。灰度期间按请求固定到同一索引版本，失败时切回旧别名，并保留事件日志以便修复后重放。

## 工程实践与边界

- 记录源版本、解析器、切块、Embedding 和索引版本，支持端到端 lineage。
- 建立死信队列和人工修复工具，不让坏文档阻塞全部更新。
- 在发布门禁检查 ACL、空文本、异常 chunk 数、向量维度和抽样检索。
- 用“源变更到可检索”的分位数定义新鲜度，并针对高优先级数据单独设 SLO。

## 常见误区

- **“增量更新就是 upsert 向量”**：正文、稀疏索引、权限、缓存与关系也要一致更新。
- **“内容哈希没变就什么都不用做”**：ACL、有效期或模型版本可能已变化。
- **“删除数据库记录即可”**：派生索引和缓存可能继续返回旧内容。
- **“双写天然一致”**：任一写入失败都会分叉，需要 outbox、重试和对账。

## 面试追问

1. **Embedding 升级如何上线？** 新空间不能与旧向量混用，重建完整新索引，影子验证后切换查询编码器和索引绑定。
2. **怎样发现漏更新？** 定期按源数据做数量、版本与哈希对账，并抽样从源到索引反向追踪。
3. **回滚后新写入怎么办？** 保留变更日志和兼容写路径，旧版本服务期间继续捕获事件，修复后重放到新版本。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

持续更新的核心是可追溯、幂等的变更流水线。权威源产生新增、修改、删除事件；系统以稳定文档 ID、内容哈希和源版本去重，重新解析受影响文档，生成带版本的 chunk 与向量，并把正文、稀疏索引、向量索引、ACL 和缓存作为同一发布单元管理。

上线不应原地覆盖后立即全量切流。我会构建影子版本，校验数量、抽样内容与回归集，影子读比较后灰度，通过索引别名或版本路由原子切换，并保留旧版本用于回滚。监控更新延迟、失败队列、孤儿 chunk、删除传播和新鲜度 SLO。

**Visual Element**: Type: numbered process node; Subject: 60 秒回答；Treatment: 从左到右连接并标明第 1 阶段

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 变更捕获与幂等
数据源可以通过 CDC、Webhook 或定时扫描提供变更。

### 更新与删除
修改文档时，用文档 ID 找到旧 chunk，生成新版本并在发布边界替换。

### 发布与恢复
若正文与索引处于同一事务边界，可用版本字段原子提交。

**Visual Element**: Type: numbered process node; Subject: 详细解析；Treatment: 从左到右连接并标明第 2 阶段

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 记录源版本、解析器、切块、Embedding 和索引版本，支持端到端 lineage。
- 建立死信队列和人工修复工具，不让坏文档阻塞全部更新。
- 在发布门禁检查 ACL、空文本、异常 chunk 数、向量维度和抽样检索。
- 用“源变更到可检索”的分位数定义新鲜度，并针对高优先级数据单独设 SLO。

**Visual Element**: Type: numbered process node; Subject: 工程实践与边界；Treatment: 从左到右连接并标明第 3 阶段

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“增量更新就是 upsert 向量”**：正文、稀疏索引、权限、缓存与关系也要一致更新。
- **“内容哈希没变就什么都不用做”**：ACL、有效期或模型版本可能已变化。
- **“删除数据库记录即可”**：派生索引和缓存可能继续返回旧内容。
- **“双写天然一致”**：任一写入失败都会分叉，需要 outbox、重试和对账。

**Visual Element**: Type: numbered process node; Subject: 常见误区；Treatment: 从左到右连接并标明第 4 阶段

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
- 19. RAG 知识库如何实现动态与持续更新？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
