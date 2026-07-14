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

# 3. 相比直接微调 LLM，RAG 解决了什么问题？微调和 RAG 各自的优劣势是什么？

## Overview

对比 RAG 与 LLM 微调的原理、成本和适用场景，分析外部知识检索与模型参数更新的取舍关系

## Learning Objectives

The viewer will understand:

1. 建立“相比直接微调 LLM，RAG 解决了什么问题？微调和 RAG 各自的优劣势是什么？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

RAG 与微调改变的是不同环节。RAG 在推理时检索外部知识，适合频繁更新、需要权限过滤和引用追溯的事实；微调更新模型参数，适合稳定地改变行为、格式、术语习惯或任务能力。把业务事实写进参数后很难精确更新和删除，而 RAG 的知识可以按文档版本替换。

两者不是二选一。常见组合是先用提示词或微调让模型稳定遵循任务规范，再用 RAG 提供本次回答需要的证据。最终选择应由离线质量、线上延迟、维护成本和合规要求共同决定。

## 详细解析

### RAG 改变上下文

RAG 不修改基础模型参数。知识更新通常表现为重新解析或索引文档，因此可追踪来源、设置 ACL，也容易回滚某个索引版本。代价是每次请求增加检索、重排和更长上下文的延迟与成本。

### 微调改变参数

监督微调通过训练样本塑造响应模式；参数高效微调可减少需训练的参数量，但仍需要数据治理、训练、评估与部署。微调可能让模型更擅长某类任务，却不保证准确记住所有新事实，也不天然提供引用。

### 组合决策

先做误差分析：若错误来自“没有拿到正确资料”，优先改数据和检索；若资料已在上下文中，但模型持续不按格式或流程执行，再考虑提示词、约束解码或微调。知识和行为混在一个训练集里，后续归因会更困难。

## 工程实践与边界

| 维度 | RAG | 微调 |
| --- | --- | --- |
| 更新对象 | 外部知识与索引 | 模型参数 |
| 适合内容 | 易变事实、私有文档 | 稳定行为、格式、领域任务 |
| 引用 | 可保留来源映射 | 不天然提供 |
| 删除与回滚 | 可按文档或索引版本处理 | 通常需要重训或切换模型 |
| 在线代价 | 检索与上下文开销 | 取决于部署后的模型大小 |

性能和费用不能脱离模型、数据集、硬件与流量直接下结论，应在目标负载上测量。

## 常见误区

- **“微调就是把知识灌进模型”**：微调可影响参数，但对事实的精确写入、更新与遗忘没有数据库式保证。
- **“RAG 只解决知识，微调只解决风格”**：这是有用的经验分类，不是严格边界，两者都可能影响最终任务表现。
- **“微调后不需要检索”**：时效、权限和引用需求仍可能要求 RAG。
- **“两者叠加总会更好”**：复杂度会上升，需要用消融实验验证每一层的收益。

## 面试追问

1. **如何做选型实验？** 建立代表性评测集，至少比较基础模型、RAG、微调、微调加 RAG 四组，并记录质量、延迟和成本。
2. **资料已经召回但模型答错怎么办？** 先检查上下文位置、冲突和提示约束，再评估结构化输出或微调，不要先扩大 Top-K。
3. **怎样回滚？** 模型和索引分别版本化，部署配置明确绑定两者，避免只回滚其中一项导致不兼容。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

RAG 与微调改变的是不同环节。RAG 在推理时检索外部知识，适合频繁更新、需要权限过滤和引用追溯的事实；微调更新模型参数，适合稳定地改变行为、格式、术语习惯或任务能力。把业务事实写进参数后很难精确更新和删除，而 RAG 的知识可以按文档版本替换。

两者不是二选一。常见组合是先用提示词或微调让模型稳定遵循任务规范，再用 RAG 提供本次回答需要的证据。最终选择应由离线质量、线上延迟、维护成本和合规要求共同决定。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### RAG 改变上下文
RAG 不修改基础模型参数。

### 微调改变参数
监督微调通过训练样本塑造响应模式；

### 组合决策
先做误差分析：若错误来自“没有拿到正确资料”，优先改数据和检索；

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

| 维度 | RAG | 微调 |
| --- | --- | --- |
| 更新对象 | 外部知识与索引 | 模型参数 |
| 适合内容 | 易变事实、私有文档 | 稳定行为、格式、领域任务 |
| 引用 | 可保留来源映射 | 不天然提供 |
| 删除与回滚 | 可按文档或索引版本处理 | 通常需要重训或切换模型 |
| 在线代价 | 检索与上下文开销 | 取决于部署后的模型大小 |

性能和费用不能脱离模型、数据集、硬件与流量直接下结论，应在目标负载上测量。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“微调就是把知识灌进模型”**：微调可影响参数，但对事实的精确写入、更新与遗忘没有数据库式保证。
- **“RAG 只解决知识，微调只解决风格”**：这是有用的经验分类，不是严格边界，两者都可能影响最终任务表现。
- **“微调后不需要检索”**：时效、权限和引用需求仍可能要求 RAG。
- **“两者叠加总会更好”**：复杂度会上升，需要用消融实验验证每一层的收益。

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
- 3. 相比直接微调 LLM，RAG 解决了什么问题？微调和 RAG 各自的优劣势是什么？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
