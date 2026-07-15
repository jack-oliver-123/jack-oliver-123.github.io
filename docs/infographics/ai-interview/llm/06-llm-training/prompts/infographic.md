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

# 6. 大模型是怎么训练出来的？

## Overview

按数据、预训练、后训练、评测和发布解释大模型训练链路，并说明分布式训练与治理边界

## Learning Objectives

The viewer will understand:

1. 复述“大模型是怎么训练出来的？”的关键流程与控制点
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

大模型训练不是一次单独任务，而是一条可追踪流水线：收集并治理数据，训练分词器，做自监督预训练，再做指令微调和偏好对齐，最后经过能力、安全与系统评测发布。预训练让模型学习通用语言分布；后训练让它更好地遵循指令和策略，但不能凭空补回缺失知识。

算力侧会组合数据并行、张量并行、流水线并行和参数分片。训练规模、数据配比和学习率需要联合设计。任何参数量或 FLOPs 数字都要注明模型结构、Token 数、精度和统计口径。

## 详细解析

典型流程包括六个阶段：

1. **数据治理**：记录来源和许可，去重、过滤低质量内容，处理个人信息和评测集污染
2. **预训练**：对大规模 Token 序列优化下一个 Token 预测目标
3. **持续预训练**：按领域或新时间段继续训练，同时控制灾难性遗忘
4. **监督微调**：用指令和高质量回答学习任务格式与对话行为
5. **偏好与安全对齐**：使用人类或规则反馈训练奖励/偏好目标，或直接优化偏好对
6. **评测与发布**：检查能力、安全、偏见、记忆泄露、延迟和成本，再做灰度与回滚

对稠密 Decoder 模型，常见粗略估算把训练计算写成约 $6ND$，其中 $N$ 是非 Embedding 参数量，$D$ 是训练 Token 数。这个估算假设特定前向/反向计算，不包含数据处理、通信、激活重算、稀疏路由和硬件利用率，因此不能直接当作账单。

分布式策略解决不同资源约束。数据并行复制模型并切分样本；张量并行切分层内矩阵；流水线并行切分层；ZeRO/FSDP 类方法分片参数、梯度和优化器状态。实际组合取决于模型是否放得下、网络拓扑和目标吞吐。

## 工程实践与边界

训练必须具备可复现记录：数据快照、清洗版本、代码提交、超参数、随机种子、检查点和评测结果。周期性保存检查点，并验证从检查点恢复后的优化器与数据迭代位置。只保存权重不足以复现训练轨迹。

数据治理应在进入训练前完成。删除请求、许可变化和污染发现需要能定位到数据版本。评测集要与训练数据隔离，并使用隐藏集或污染检测降低“背题”风险。

## 常见误区

- **把后训练当作知识注入主通道**：小规模指令数据更擅长改变行为，知识覆盖仍受数据和容量影响
- **只统计 GPU 理论峰值**：通信、数据加载、重算和故障会降低实际利用率
- **认为损失下降就能发布**：训练损失不能替代能力、安全和系统评测
- **忽略数据权利**：公开可访问不等于允许训练或再分发

## 面试追问

**问：持续预训练和监督微调有什么区别？**

**答：** 持续预训练通常沿用语言建模目标并使用大量领域文本；监督微调使用输入/目标对训练指令行为。两者的数据规模、目标和遗忘风险不同。

**问：为什么需要激活重算？**

**答：** 它在反向传播时重新计算部分前向激活，以额外算力换显存，从而支持更大的模型、序列或批次。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

大模型训练不是一次单独任务，而是一条可追踪流水线：收集并治理数据，训练分词器，做自监督预训练，再做指令微调和偏好对齐，最后经过能力、安全与系统评测发布。预训练让模型学习通用语言分布；后训练让它更好地遵循指令和策略，但不能凭空补回缺失知识。

算力侧会组合数据并行、张量并行、流水线并行和参数分片。训练规模、数据配比和学习率需要联合设计。任何参数量或 FLOPs 数字都要注明模型结构、Token 数、精度和统计口径。

**Visual Element**: Type: numbered process node; Subject: 60 秒回答；Treatment: 从左到右连接并标明第 1 阶段

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

典型流程包括六个阶段：

1. **数据治理**：记录来源和许可，去重、过滤低质量内容，处理个人信息和评测集污染
2. **预训练**：对大规模 Token 序列优化下一个 Token 预测目标
3. **持续预训练**：按领域或新时间段继续训练，同时控制灾难性遗忘
4. **监督微调**：用指令和高质量回答学习任务格式与对话行为

对稠密 Decoder 模型，常见粗略估算把训练计算写成约 $6ND$，其中 $N$ 是非 Embedding 参数量，$D$ 是训练 Token 数。这个估算假设特定前向/反向计算，不包含数据处理、通信、激活重算、稀疏路由和硬件利用率，因此不能直接当作账单。

分布式策略解决不同资源约束。数据并行复制模型并切分样本；张量并行切分层内矩阵；流水线并行切分层；ZeRO/FSDP 类方法分片参数、梯度和优化器状态。实际组合取决于模型是否放得下、网络拓扑和目标吞吐。

**Visual Element**: Type: numbered process node; Subject: 详细解析；Treatment: 从左到右连接并标明第 2 阶段

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

训练必须具备可复现记录：数据快照、清洗版本、代码提交、超参数、随机种子、检查点和评测结果。周期性保存检查点，并验证从检查点恢复后的优化器与数据迭代位置。只保存权重不足以复现训练轨迹。

数据治理应在进入训练前完成。删除请求、许可变化和污染发现需要能定位到数据版本。评测集要与训练数据隔离，并使用隐藏集或污染检测降低“背题”风险。

**Visual Element**: Type: numbered process node; Subject: 工程实践与边界；Treatment: 从左到右连接并标明第 3 阶段

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **把后训练当作知识注入主通道**：小规模指令数据更擅长改变行为，知识覆盖仍受数据和容量影响
- **只统计 GPU 理论峰值**：通信、数据加载、重算和故障会降低实际利用率
- **认为损失下降就能发布**：训练损失不能替代能力、安全和系统评测
- **忽略数据权利**：公开可访问不等于允许训练或再分发

**Visual Element**: Type: numbered process node; Subject: 常见误区；Treatment: 从左到右连接并标明第 4 阶段

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 对稠密 Decoder 模型，常见粗略估算把训练计算写成约 $6ND$，其中 $N$ 是非 Embedding 参数量，$D$ 是训练 Token 数。这个估算假设特定前向/反向计算，不包含数据处理、通信、激活重算、稀疏路由和硬件利用率，因此不能直接当作账单。

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
- 6. 大模型是怎么训练出来的？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
