Create a professional infographic following these specifications:

## Image Specifications

- **Type**: Infographic
- **Layout**: bento-grid
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

# bento-grid

Modular grid layout with varied cell sizes, like a bento box.

## Structure

- Grid of rectangular cells
- Mixed cell sizes (1x1, 2x1, 1x2, 2x2)
- No strict symmetry required
- Hero cell for main point
- Supporting cells around it

## Best For

- Multiple topic overview
- Feature highlights
- Dashboard summaries
- Portfolio displays
- Mixed content types

## Visual Elements

- Clear cell boundaries
- Varied cell backgrounds
- Icons or illustrations per cell
- Consistent padding/margins
- Visual hierarchy through size

## Text Placement

- Main title at top
- Cell titles within each cell
- Brief content per cell
- Minimal text, maximum visual
- CTA or summary in prominent cell

## Recommended Pairings

- `craft-handmade`: Friendly overviews (default)
- `corporate-memphis`: Business summaries
- `pixel-art`: Retro feature grids


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

# 18. 怎么量化你的 RAG 效果？

## Overview

系统介绍 RAG 效果评估方法，梳理检索召回、上下文相关性、答案准确性和端到端评测指标的设计

## Learning Objectives

The viewer will understand:

1. 建立“怎么量化你的 RAG 效果？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

我会把 RAG 评估拆成数据、检索、生成、端到端和运行质量。检索层在标注的可接受证据集合上看 Recall@K、MRR、nDCG；生成层看答案正确性、对证据的忠实度、引用准确性、拒答与安全；线上还看任务成功、延迟分位数、错误率、成本和知识新鲜度。

评测集按真实查询分层，并包含无答案、权限、冲突和注入样本。模型裁判指标要固定版本和 Prompt，多次运行报告方差，并定期与人工标注校准。RAGAS 提供指标框架，但不存在跨项目通用的“合格固定阈值”。

## 详细解析

### 检索评估

相关性可能是一对多：多个文档都能回答，或答案需要多个证据。标注应记录可接受文档集合与最小证据组合。Recall@K 衡量相关证据是否进入候选；MRR 偏重首个相关结果；nDCG 可处理分级相关性。还要记录 ACL 违规召回和过期文档命中，这些是正确性问题而非普通噪声。

### 生成评估

正确性回答“是否解决问题”，faithfulness 回答“陈述是否受给定上下文支持”，二者不同。引用评估还要检查来源是否真的支持相邻主张。无答案查询关注错误作答率，安全集关注是否服从文档内恶意指令或泄露跨租户数据。

### 线上与实验设计

离线集要保留冻结回归集和持续采样的新鲜集。A/B 测试需防止索引版本、模型和流量分布同时变化。对随机模型裁判使用重复测量、置信区间或至少报告方差，不应用单次小数点分数制造确定性。

## 工程实践与边界

- 每个线上失败回流时先去敏和权限检查，再进入可复现评测集。
- 发布门禁同时设质量与 SLO 条件，不能用质量提升掩盖不可接受的尾延迟。
- 做分层指标：语言、租户、查询类型和风险等级，避免总体均值掩盖退化。
- 保留评测数据版本、裁判模型与 Prompt，评测系统本身也需版本化。

## 常见误区

- **“RAGAS 分数高于某值就能上线”**：阈值需结合业务风险、模型和人工校准。
- **“只看最终答案就够了”**：无法定位检索还是生成导致回归。
- **“Recall@K 越大越好”**：K 增大也带来更多上下文、延迟和噪声。
- **“模型裁判是客观标签”**：它有偏差、随机性和版本漂移。

## 面试追问

1. **没有标注集怎么办？** 从真实日志分层抽样，由领域人员标注最小集合；可用弱监督起步，但必须人工校准。
2. **怎样评估多跳问题？** 标注每一步需要的证据及最终组合，分别测单步召回和证据集合覆盖。
3. **线上点赞能代替正确率吗？** 不能，点赞受交互与曝光偏差影响，可作为业务信号之一。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

我会把 RAG 评估拆成数据、检索、生成、端到端和运行质量。检索层在标注的可接受证据集合上看 Recall@K、MRR、nDCG；生成层看答案正确性、对证据的忠实度、引用准确性、拒答与安全；线上还看任务成功、延迟分位数、错误率、成本和知识新鲜度。

评测集按真实查询分层，并包含无答案、权限、冲突和注入样本。模型裁判指标要固定版本和 Prompt，多次运行报告方差，并定期与人工标注校准。RAGAS 提供指标框架，但不存在跨项目通用的“合格固定阈值”。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 检索评估
相关性可能是一对多：多个文档都能回答，或答案需要多个证据。

### 生成评估
正确性回答“是否解决问题”，faithfulness 回答“陈述是否受给定上下文支持”，二者不同。

### 线上与实验设计
离线集要保留冻结回归集和持续采样的新鲜集。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 每个线上失败回流时先去敏和权限检查，再进入可复现评测集。
- 发布门禁同时设质量与 SLO 条件，不能用质量提升掩盖不可接受的尾延迟。
- 做分层指标：语言、租户、查询类型和风险等级，避免总体均值掩盖退化。
- 保留评测数据版本、裁判模型与 Prompt，评测系统本身也需版本化。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“RAGAS 分数高于某值就能上线”**：阈值需结合业务风险、模型和人工校准。
- **“只看最终答案就够了”**：无法定位检索还是生成导致回归。
- **“Recall@K 越大越好”**：K 增大也带来更多上下文、延迟和噪声。
- **“模型裁判是客观标签”**：它有偏差、随机性和版本漂移。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

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
- 18. 怎么量化你的 RAG 效果？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
