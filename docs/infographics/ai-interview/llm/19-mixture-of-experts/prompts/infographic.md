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

# 19. MoE 混合专家模型是什么？DeepSeek V3、Qwen 为什么用 MoE？

## Overview

解释稀疏 MoE 的路由、激活参数、负载均衡和专家并行，并分析 DeepSeek V3 与 Qwen MoE 的设计动机

## Learning Objectives

The viewer will understand:

1. 说明“MoE 混合专家模型是什么？DeepSeek V3、Qwen 为什么用 MoE？”的组成部分及其关系
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

混合专家（Mixture of Experts，MoE）把部分稠密前馈网络替换为多个专家。路由器为每个 Token 选择少量专家，因此模型可以增加总参数容量，而每个 Token 只激活其中一部分。DeepSeek-V3 和 Qwen 的部分型号采用稀疏 MoE，核心动机是在训练与推理计算预算下扩大容量，而不是让全部参数同时参与每个 Token。

MoE 不等于低显存。所有专家权重仍需存放或分布在设备上，路由还带来跨卡通信、负载不均和部署复杂度。比较模型时要同时报告总参数、激活参数、路由策略和硬件拓扑。

## 详细解析

对 Token 表示 $x$，路由器产生专家分数并选择 Top-k：

$
y=\sum_{i\in TopK(x)}g_i(x)E_i(x)
$

$E_i$ 是专家 FFN，$g_i$ 是路由权重。共享注意力层通常仍对每个 Token 计算，稀疏性主要发生在专家层。因此，“只激活少量专家”不能直接套用到模型的全部 FLOPs。

MoE 训练要处理以下问题：

- **负载均衡**：热门专家过载，冷门专家训练不足
- **容量限制**：单个专家批次缓冲有限，溢出 Token 需要丢弃、重路由或增加容量
- **All-to-All 通信**：专家并行把 Token 发送到不同设备，网络可能成为瓶颈
- **专家塌缩**：路由长期集中到少量专家，降低有效容量

DeepSeek-V3 技术报告给出的模型规模是 671B 总参数、每 Token 激活 37B 参数，并使用细粒度专家与共享专家。该数字只适用于报告中的具体架构。Qwen 系列同时包含稠密与 MoE 型号；讨论“Qwen 使用 MoE”时应指明型号和模型卡，不能把整个系列概括为一种结构。

## 工程实践与边界

训练监控应包含每个专家的 Token 数、路由概率、溢出率、负载均衡损失和跨卡通信时间。部署时根据专家并行、张量并行和数据并行组合放置权重，并测真实批次下的端到端吞吐。

显存容量按总权重和精度估算，计算量则按激活专家与公共层估算。低并发服务可能无法摊薄专家通信；边缘设备也常缺少容纳总权重的内存，此时稠密小模型更实用。

## 常见误区

- **把总参数当作每 Token 计算量**：稀疏路由只激活部分专家
- **把激活参数当作显存占用**：总专家权重仍需驻留或分片加载
- **认为专家等同于人工定义领域角色**：专家分工由训练和路由形成，未必对应可解释领域
- **忽略通信**：算术 FLOPs 降低后，All-to-All 可能成为主要瓶颈

## 面试追问

**问：MoE 为什么需要负载均衡损失？**

**答：** 只按任务损失训练时，路由可能集中到少量专家。辅助目标或无辅助损失策略用于控制各专家负载，但也会影响主任务优化。

**问：MoE 更适合训练还是推理？**

**答：** 它能在两阶段降低每 Token 的专家计算，但训练和推理都要承担权重容量与通信成本。收益取决于集群互连、批次和实现。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

混合专家（Mixture of Experts，MoE）把部分稠密前馈网络替换为多个专家。路由器为每个 Token 选择少量专家，因此模型可以增加总参数容量，而每个 Token 只激活其中一部分。DeepSeek-V3 和 Qwen 的部分型号采用稀疏 MoE，核心动机是在训练与推理计算预算下扩大容量，而不是让全部参数同时参与每个 Token。

MoE 不等于低显存。所有专家权重仍需存放或分布在设备上，路由还带来跨卡通信、负载不均和部署复杂度。比较模型时要同时报告总参数、激活参数、路由策略和硬件拓扑。

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

对 Token 表示 $x$，路由器产生专家分数并选择 Top-k：

$
y=\sum_{i\in TopK(x)}g_i(x)E_i(x)
$

$E_i$ 是专家 FFN，$g_i$ 是路由权重。共享注意力层通常仍对每个 Token 计算，稀疏性主要发生在专家层。因此，“只激活少量专家”不能直接套用到模型的全部 FLOPs。

MoE 训练要处理以下问题：

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

训练监控应包含每个专家的 Token 数、路由概率、溢出率、负载均衡损失和跨卡通信时间。部署时根据专家并行、张量并行和数据并行组合放置权重，并测真实批次下的端到端吞吐。

显存容量按总权重和精度估算，计算量则按激活专家与公共层估算。低并发服务可能无法摊薄专家通信；边缘设备也常缺少容纳总权重的内存，此时稠密小模型更实用。

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **把总参数当作每 Token 计算量**：稀疏路由只激活部分专家
- **把激活参数当作显存占用**：总专家权重仍需驻留或分片加载
- **认为专家等同于人工定义领域角色**：专家分工由训练和路由形成，未必对应可解释领域
- **忽略通信**：算术 FLOPs 降低后，All-to-All 可能成为主要瓶颈

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 混合专家（Mixture of Experts，MoE）把部分稠密前馈网络替换为多个专家。路由器为每个 Token 选择少量专家，因此模型可以增加总参数容量，而每个 Token 只激活其中一部分。DeepSeek-V3 和 Qwen 的部分型号采用稀疏 MoE，核心动机是在训练与推理计算预算下扩大容量，而不是让全部参数同时参与每个 Token。
- DeepSeek-V3 技术报告给出的模型规模是 671B 总参数、每 Token 激活 37B 参数，并使用细粒度专家与共享专家。该数字只适用于报告中的具体架构。Qwen 系列同时包含稠密与 MoE 型号；讨论“Qwen 使用 MoE”时应指明型号和模型卡，不能把整个系列概括为一种结构。

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
- 19. MoE 混合专家模型是什么？DeepSeek V3、Qwen 为什么用 MoE？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
