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

# 21. 大模型能力评测指标有哪些？

## Overview

建立从模型质量、任务结果、安全、校准到系统性能的评测框架，并说明 LLM Judge 与统计显著性边界

## Learning Objectives

The viewer will understand:

1. 识别“大模型能力评测指标有哪些？”的核心指标、信号与评估边界
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

大模型评测不能用一个总分概括。模型层可看困惑度和标准基准；任务层按类型使用 Accuracy、Exact Match、F1、ROUGE、pass@k 或工具任务成功率；开放生成可做盲评和成对胜率；风险层测越狱、隐私、偏见和有害输出；系统层测 TTFT、TPOT、吞吐、尾延迟、可用性和每次成功任务成本。

每项指标都要绑定数据集、评分器、Prompt、采样参数和模型版本，并报告样本量与置信区间。LLM-as-a-Judge 可扩大评测规模，但会有位置、长度、风格和自偏好，需要用人工标注校准。

## 详细解析

指标应从产品目标向下拆解：

| 层级 | 指标示例 | 回答的问题 |
|---|---|---|
| 语言模型 | Loss、Perplexity | 对给定分布的预测拟合程度 |
| 封闭任务 | Accuracy、EM、F1 | 标签或答案是否正确 |
| 生成任务 | ROUGE、BLEU、语义相似度 | 与参考答案的重合或接近程度 |
| 代码/工具 | pass@k、执行成功率、参数正确率 | 结果能否实际运行 |
| 偏好 | Pairwise win rate、Bradley-Terry 分数 | 人或 Judge 更偏好哪个输出 |
| 校准 | Brier Score、ECE、选择性准确率 | 置信与正确率是否匹配 |
| 系统 | TTFT、TPOT、P95/P99、吞吐、成本 | 服务是否满足 SLO |

Exact Match 对格式敏感，F1 可给部分重合分；ROUGE 不能稳定衡量事实正确性；pass@k 随采样数增加，比较时必须固定 $k$ 和采样策略。工具 Agent 还要检查轨迹是否越权、是否产生重复副作用以及恢复能力。

成对胜率的基线和顺序会影响结果。若两个候选差异小，应随机左右位置、隐藏模型身份并报告 bootstrap 置信区间。多次查看测试集再调 Prompt 会造成评测过拟合，需要保留隐藏集。

## 工程实践与边界

建立三层数据：开发集用于迭代，回归集覆盖历史故障，隐藏集用于发布门禁。样本按语言、客户、长度、风险和任务难度分层，避免平均分掩盖关键人群退化。

线上指标要连接业务结果，例如每次已解决工单成本，而不是只统计 Token。记录模型拒答、工具错误和人工接管原因，定期把真实失败脱敏后回流到回归集。

## 常见误区

- **把公开榜单当业务结论**：数据分布和评分标准可能不同
- **只报平均值**：尾部延迟和关键切片可能已不满足 SLO
- **把 Judge 分数当客观真值**：Judge 本身也要评测和版本化
- **反复调测试集**：这会把测试集变成训练信号

## 面试追问

**问：两个模型胜率相差 2%，能否直接宣布一个更好？**

**答：** 先看样本量、置信区间、Judge 一致性和业务切片。差异可能来自抽样噪声或位置偏好。

**问：如何评测模型会不会正确拒答？**

**答：** 同时准备应回答与应拒答样本，分别测覆盖率和误拒率，并对不同风险等级设置成本敏感阈值。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

大模型评测不能用一个总分概括。模型层可看困惑度和标准基准；任务层按类型使用 Accuracy、Exact Match、F1、ROUGE、pass@k 或工具任务成功率；开放生成可做盲评和成对胜率；风险层测越狱、隐私、偏见和有害输出；系统层测 TTFT、TPOT、吞吐、尾延迟、可用性和每次成功任务成本。

每项指标都要绑定数据集、评分器、Prompt、采样参数和模型版本，并报告样本量与置信区间。LLM-as-a-Judge 可扩大评测规模，但会有位置、长度、风格和自偏好，需要用人工标注校准。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

指标应从产品目标向下拆解：

| 层级 | 指标示例 | 回答的问题 |
|---|---|---|
| 语言模型 | Loss、Perplexity | 对给定分布的预测拟合程度 |
| 封闭任务 | Accuracy、EM、F1 | 标签或答案是否正确 |
| 生成任务 | ROUGE、BLEU、语义相似度 | 与参考答案的重合或接近程度 |
| 代码/工具 | pass@k、执行成功率、参数正确率 | 结果能否实际运行 |
| 偏好 | Pairwise win rate、Bradley-Terry 分数 | 人或 Judge 更偏好哪个输出 |
| 校准 | Brier Score、ECE、选择性准确率 | 置信与正确率是否匹配 |
| 系统 | TTFT、TPOT、P95/P99、吞吐、成本 | 服务是否满足 SLO |

Exact Match 对格式敏感，F1 可给部分重合分；ROUGE 不能稳定衡量事实正确性；pass@k 随采样数增加，比较时必须固定 $k$ 和采样策略。工具 Agent 还要检查轨迹是否越权、是否产生重复副作用以及恢复能力。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

建立三层数据：开发集用于迭代，回归集覆盖历史故障，隐藏集用于发布门禁。样本按语言、客户、长度、风险和任务难度分层，避免平均分掩盖关键人群退化。

线上指标要连接业务结果，例如每次已解决工单成本，而不是只统计 Token。记录模型拒答、工具错误和人工接管原因，定期把真实失败脱敏后回流到回归集。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **把公开榜单当业务结论**：数据分布和评分标准可能不同
- **只报平均值**：尾部延迟和关键切片可能已不满足 SLO
- **把 Judge 分数当客观真值**：Judge 本身也要评测和版本化
- **反复调测试集**：这会把测试集变成训练信号

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 大模型评测不能用一个总分概括。模型层可看困惑度和标准基准；任务层按类型使用 Accuracy、Exact Match、F1、ROUGE、pass@k 或工具任务成功率；开放生成可做盲评和成对胜率；风险层测越狱、隐私、偏见和有害输出；系统层测 TTFT、TPOT、吞吐、尾延迟、可用性和每次成功任务成本。
- | 封闭任务 | Accuracy、EM、F1 | 标签或答案是否正确 |
- | 系统 | TTFT、TPOT、P95/P99、吞吐、成本 | 服务是否满足 SLO |
- Exact Match 对格式敏感，F1 可给部分重合分；ROUGE 不能稳定衡量事实正确性；pass@k 随采样数增加，比较时必须固定 $k$ 和采样策略。工具 Agent 还要检查轨迹是否越权、是否产生重复副作用以及恢复能力。

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
- 21. 大模型能力评测指标有哪些？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
