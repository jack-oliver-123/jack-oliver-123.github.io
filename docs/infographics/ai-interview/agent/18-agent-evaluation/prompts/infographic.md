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

# 18. 如何系统化评测 Agent？

## Overview

从任务结果、执行轨迹、成本延迟和安全性四个维度介绍 Agent 的系统化评测方法

## Learning Objectives

The viewer will understand:

1. 识别“如何系统化评测 Agent？”的核心指标、信号与评估边界
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

Agent 评测不能只看最终答案。我会分四层：任务结果是否满足业务验收；轨迹中的工具、顺序和恢复是否合理；延迟、Token、工具次数和费用是否可接受；是否出现越权、注入响应、数据泄露或绕过审批。

方法上先从真实流量和失败案例建立分层数据集，优先使用确定性规则和可执行测试，再使用经人工校准的模型评分。离线回归负责发布门禁，影子流量和小比例上线负责发现分布变化，生产追踪负责把失败归因到模型、上下文、工具或编排。

## 详细解析

### 结果指标

结果评测应从业务目标定义，例如工单是否正确分类且完成必要字段、代码是否通过测试、检索答案是否有权威证据。一个模糊的“看起来不错”分数很难指导改进。

### 轨迹指标

同样的正确结果可能来自危险轨迹。需要检查是否选对工具、参数是否合规、是否重复调用、是否遗漏验证、失败后是否采用允许的恢复策略。轨迹评分不要要求模型暴露私有思维链，只评估可观测的动作、状态和证据。

### 效率与安全

记录端到端延迟、关键路径、模型与工具调用数、Token 和费用分布。安全集覆盖直接/间接注入、跨租户访问、敏感数据外发、未经审批的副作用、资源耗尽和审计缺失。

数据集要按任务类型、难度、语言、工具、风险和用户群分层，包含正常、边界、对抗与工具故障样本。平均分可能掩盖高风险小类，应为关键切片设置单独门槛。

## 工程实践与边界

- 每个样本保存输入、环境夹具、期望属性、允许轨迹范围和评分器版本。
- 确定性 grader 用于 schema、测试、权限和引用；模型 grader 用评分量表，并与人工标注校准。
- 评测运行隔离生产副作用，邮件、付款和删除工具使用沙箱或模拟器。
- 版本化模型、提示、工具 schema、检索索引和数据集，确保回归差异可归因。
- 线上抽样日志先脱敏；含个人可识别信息（PII）的 trace 限制访问和保留时间。

## 常见误区

- **“最终答案正确就通过”**：轨迹可能越权、成本失控或依赖偶然错误。
- **“模型裁判等于客观评分”**：评分器也有偏差，需要规则、人工和一致性检查。
- **“一个公开 benchmark 足够”**：公开任务与真实工具、权限和失败模式不同。
- **“平均成功率提高即可发布”**：关键安全切片退化不能被大量简单样本抵消。

## 面试追问

> **面试官：** 任务有多种正确路径怎么评轨迹？
>
> **候选人：** 评价必须满足和禁止的属性，而不是匹配唯一序列，例如必须查权威源、不得调用写工具、最终证据一致。

> **面试官：** 如何评估工具故障恢复？
>
> **候选人：** 在受控环境注入超时、限流、部分成功和错误数据，检查重试、幂等、降级及人工接管是否符合策略。

> **面试官：** 线上指标下降如何定位？
>
> **候选人：** 先按模型、提示、工具版本和任务切片分解，再利用 trace 找到首个偏离节点，并将新失败样本加入回归集。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

Agent 评测不能只看最终答案。我会分四层：任务结果是否满足业务验收；轨迹中的工具、顺序和恢复是否合理；延迟、Token、工具次数和费用是否可接受；是否出现越权、注入响应、数据泄露或绕过审批。

方法上先从真实流量和失败案例建立分层数据集，优先使用确定性规则和可执行测试，再使用经人工校准的模型评分。离线回归负责发布门禁，影子流量和小比例上线负责发现分布变化，生产追踪负责把失败归因到模型、上下文、工具或编排。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 结果指标
结果评测应从业务目标定义，例如工单是否正确分类且完成必要字段、代码是否通过测试、检索答案是否有权威证据。

### 轨迹指标
同样的正确结果可能来自危险轨迹。

### 效率与安全
记录端到端延迟、关键路径、模型与工具调用数、Token 和费用分布。

数据集要按任务类型、难度、语言、工具、风险和用户群分层，包含正常、边界、对抗与工具故障样本。平均分可能掩盖高风险小类，应为关键切片设置单独门槛。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 每个样本保存输入、环境夹具、期望属性、允许轨迹范围和评分器版本。
- 确定性 grader 用于 schema、测试、权限和引用；模型 grader 用评分量表，并与人工标注校准。
- 评测运行隔离生产副作用，邮件、付款和删除工具使用沙箱或模拟器。
- 版本化模型、提示、工具 schema、检索索引和数据集，确保回归差异可归因。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“最终答案正确就通过”**：轨迹可能越权、成本失控或依赖偶然错误。
- **“模型裁判等于客观评分”**：评分器也有偏差，需要规则、人工和一致性检查。
- **“一个公开 benchmark 足够”**：公开任务与真实工具、权限和失败模式不同。
- **“平均成功率提高即可发布”**：关键安全切片退化不能被大量简单样本抵消。

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
- 18. 如何系统化评测 Agent？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
