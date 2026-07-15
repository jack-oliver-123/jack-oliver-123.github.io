Create a professional infographic following these specifications:

## Image Specifications

- **Type**: Infographic
- **Layout**: dashboard
- **Style**: pop-laboratory
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

# dashboard

Multi-metric display with charts, numbers, and KPI indicators.

## Structure

- Multiple data widgets
- Charts, graphs, numbers
- Grid or modular layout
- Key metrics prominent
- Status indicators

## Best For

- KPI summaries
- Performance metrics
- Analytics overviews
- Status reports
- Data snapshots

## Visual Elements

- Chart types (bar, line, pie, gauge)
- Big numbers for KPIs
- Trend arrows (up/down)
- Color-coded status (green/red)
- Clean data visualization

## Text Placement

- Title at top
- Widget titles above each section
- Metric labels and values
- Units clearly shown
- Time period indicated

## Recommended Pairings

- `corporate-memphis`: Business dashboards
- `ui-wireframe`: Technical dashboards
- `cyberpunk-neon`: Futuristic displays


## Style Guidelines

# pop-laboratory

Lab manual precision meets pop art color impact—coordinate systems, technical diagrams, and fluorescent accents on blueprint grid.

## Color Palette

- Background: Professional grayish-white with faint blueprint grid texture (#F2F2F2)
- Primary: Muted teal/sage green (#B8D8BE) for major functional blocks and data zones
- High-alert accent: Vibrant fluorescent pink (#E91E63) strictly for warnings, critical data, or "winner" highlights
- Marker highlights: Vivid lemon yellow (#FFF200) as translucent highlighter effect for keywords
- Line art: Ultra-fine charcoal brown (#2D2926) for technical grids, coordinates, and hairlines

## Visual Elements

- Coordinate-style labels on every module (e.g., R-20, G-02, SEC-08)
- Technical diagrams: exploded views, cross-sections with anchor points, architectural skeletal lines
- Vertical/horizontal rulers with precise markers (0.5mm, 1.8mm, 45°)
- "Marker-over-print" effect: color blocks slightly offset from text, postmodern print feel
- Cross-hair targets, mathematical symbols (Σ, Δ, ∞), directional arrows (X/Y axis)
- Microscopic detail annotations alongside macroscopic bold headers
- Corner metadata: tiny barcodes, timestamps, technical parameters
- High contrast between massive bold headers and tiny 8pt-style annotations

## Typography

- Headers: Bold brutalist characters, high visual impact
- Body: Professional sans-serif or crisp technical print
- Numbers: Large, highlighted with yellow or blue to stand out
- Annotations: Ultra-crisp, small technical labels

## Style Enforcement

- Strictly systematic color usage: only teal, pink, yellow, charcoal—no rainbow palette
- Sufficient fine grid lines and coordinate annotations throughout
- Maintain tension between large impactful headers and small precise parameters
- Lab manual aesthetic: mix of microscopic details and macroscopic data

## Avoid

- Cute or cartoonish doodles
- Soft pastels or generic textures
- Empty white space
- Flat vector stock icons
- Organic or hand-drawn imperfections

## Best For

Technical product guides, specification comparisons, precision-focused data visualization, engineering-adjacent content


---

Generate the infographic based on the content below:

# 24. 知识蒸馏和合成数据在大模型训练中怎么用？有哪些风险？

## Overview

解释 Logit、序列和过程蒸馏及合成数据流水线，覆盖偏差复制、污染、隐私、许可和模型坍缩风险

## Learning Objectives

The viewer will understand:

1. 识别“知识蒸馏和合成数据在大模型训练中怎么用？有哪些风险？”的核心指标、信号与评估边界
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

知识蒸馏让学生模型学习教师模型的分布或输出。经典方法匹配软化后的 Logits；大模型场景还常用教师生成的指令、答案、工具轨迹或可验证推导做 SFT，再以偏好或奖励继续训练。合成数据能扩充长尾、格式和难度，但它只是由模型产生的数据来源，不天然比人工或真实数据可靠。

主要风险包括教师错误和偏见被复制、训练/评测污染、输出缺乏多样性、隐私记忆泄露、来源与许可不清，以及反复用模型生成内容训练导致分布退化。治理重点是数据血缘、独立验证、真实数据锚点、去重和切片评测。

## 详细解析

蒸馏信号可以分为三类：

| 信号 | 学生学习什么 | 适用条件 |
|---|---|---|
| Logit 蒸馏 | 教师完整类别/Token 分布 | 能访问教师 Logits，词表兼容 |
| 序列蒸馏 | 教师生成的最终回答 | 只有 API 输出也可使用 |
| 过程/轨迹蒸馏 | 中间步骤、工具轨迹或偏好 | 中间产物可验证且允许使用 |

经典温度蒸馏把教师和学生 Logits 除以温度 $T$，再最小化两者分布的 KL 散度。软标签包含非目标类别间的相对关系。对生成模型，完整词表分布体积很大，因此工程中更常保存教师采样文本或 Top-k Logits。

合成数据流水线通常包括任务种子、生成、规则过滤、去重、验证、难度分层和混合采样。数学和代码可用执行器验证；开放任务可用多模型评分和人工抽检，但不能让同一个教师同时生成、打分并作为唯一裁判。

反复训练于模型生成分布可能减少尾部覆盖并积累错误。保留有来源的真实数据和人工审查，可降低闭环自我复制风险。

## 工程实践与边界

每条样本记录生成模型版本、Prompt、采样参数、原始来源、过滤器和验证结果。评测集在生成前隔离，并做近重复检测。供应商条款、开源许可证和个人信息要求要在进入训练前审查。

先用小规模混合比例实验，分别评测目标任务、事实性、多样性、安全和真实数据切片。合成数据比例上升时观察收益曲线，不采用固定行业比例。

## 常见误区

- **把蒸馏等同于模型压缩**：它是训练方法，学生也可以与教师规模接近
- **认为教师更强就没有噪声**：教师仍会幻觉、偏置和违反格式
- **用同一模型生成并验收**：相关错误会绕过筛选
- **忽略数据血缘**：没有来源记录就难以删除、审计或复现实验

## 面试追问

**问：只有教师 API，怎么蒸馏？**

**答：** 可做序列级蒸馏，保存教师回答或偏好，再训练学生。无法获得完整 Logits 时，不应声称完成了经典 Logit 蒸馏。

**问：如何防止合成数据污染测试集？**

**答：** 在生成前隔离测试集，使用文本和语义近重复检测，并保留隐藏集。公开基准题还要检查教师是否直接复述已知答案。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

知识蒸馏让学生模型学习教师模型的分布或输出。经典方法匹配软化后的 Logits；大模型场景还常用教师生成的指令、答案、工具轨迹或可验证推导做 SFT，再以偏好或奖励继续训练。合成数据能扩充长尾、格式和难度，但它只是由模型产生的数据来源，不天然比人工或真实数据可靠。

主要风险包括教师错误和偏见被复制、训练/评测污染、输出缺乏多样性、隐私记忆泄露、来源与许可不清，以及反复用模型生成内容训练导致分布退化。治理重点是数据血缘、独立验证、真实数据锚点、去重和切片评测。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

蒸馏信号可以分为三类：

| 信号 | 学生学习什么 | 适用条件 |
|---|---|---|
| Logit 蒸馏 | 教师完整类别/Token 分布 | 能访问教师 Logits，词表兼容 |
| 序列蒸馏 | 教师生成的最终回答 | 只有 API 输出也可使用 |
| 过程/轨迹蒸馏 | 中间步骤、工具轨迹或偏好 | 中间产物可验证且允许使用 |

经典温度蒸馏把教师和学生 Logits 除以温度 $T$，再最小化两者分布的 KL 散度。软标签包含非目标类别间的相对关系。对生成模型，完整词表分布体积很大，因此工程中更常保存教师采样文本或 Top-k Logits。

合成数据流水线通常包括任务种子、生成、规则过滤、去重、验证、难度分层和混合采样。数学和代码可用执行器验证；开放任务可用多模型评分和人工抽检，但不能让同一个教师同时生成、打分并作为唯一裁判。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

每条样本记录生成模型版本、Prompt、采样参数、原始来源、过滤器和验证结果。评测集在生成前隔离，并做近重复检测。供应商条款、开源许可证和个人信息要求要在进入训练前审查。

先用小规模混合比例实验，分别评测目标任务、事实性、多样性、安全和真实数据切片。合成数据比例上升时观察收益曲线，不采用固定行业比例。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **把蒸馏等同于模型压缩**：它是训练方法，学生也可以与教师规模接近
- **认为教师更强就没有噪声**：教师仍会幻觉、偏置和违反格式
- **用同一模型生成并验收**：相关错误会绕过筛选
- **忽略数据血缘**：没有来源记录就难以删除、审计或复现实验

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

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
- 24. 知识蒸馏和合成数据在大模型训练中怎么用？有哪些风险？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
