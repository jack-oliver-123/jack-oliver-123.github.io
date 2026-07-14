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

# 22. 对比使用过哪些主流大模型？你们项目中最终选用了哪个模型？为什么？

## Overview

给出不依赖过时排行榜的模型选型框架，覆盖效果、合规、成本、延迟、可用性和多模型路由

## Learning Objectives

The viewer will understand:

1. 比较“对比使用过哪些主流大模型？你们项目中最终选用了哪个模型？为什么？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

我不会先报一个模型名，而会说明业务约束和实验。先按数据驻留、许可证、部署方式、上下文、工具/多模态能力与预算筛出候选，再用真实任务集比较质量、安全、TTFT、TPOT、吞吐和每次成功任务成本。最后选择满足硬约束且在 Pareto 前沿上的方案，并保留回滚和替代模型。

主流模型变化很快，面试中应报告测试日期和具体版本。项目也未必只用一个模型：高风险或复杂请求走强模型，分类、改写和批处理走小模型；路由规则必须可观测并经过同一质量门禁。

## 详细解析

选型流程分四步：

1. **硬约束筛选**：数据能否出域、许可是否允许商用、是否支持目标地区和硬件
2. **能力门槛**：语言、领域、工具调用、结构化输出、视觉和有效上下文是否达标
3. **系统压测**：真实长度与并发下测 TTFT、TPOT、P95/P99、吞吐和失败率
4. **经济评估**：计算单次成功任务成本，而不是只比较每百万 Token 单价

建议用决策表保留证据：

| 维度 | 门槛/指标 | 证据 |
|---|---|---|
| 任务质量 | 关键切片成功率 | 隐藏业务集与人工盲评 |
| 安全合规 | 数据驻留、保留、越狱率 | 合同、架构审查、安全集 |
| 性能 | TTFT、TPOT、尾延迟 | 固定并发与长度压测 |
| 成本 | 每次成功任务总成本 | Token、重试、检索、人工接管 |
| 运维 | 限额、SLA、回滚、可观测性 | 故障演练与供应商条款 |

闭源 API 减少基础设施工作，但受限额、数据条款和版本策略约束；开放权重模型提高部署控制权，却要承担算力、补丁、许可审查和安全运营。两者都需要评测，不能把“可私有化”或“榜单领先”当作完整答案。

## 工程实践与边界

适配层统一消息、工具和错误语义，但要保留各供应商差异，避免把不支持的参数静默丢弃。模型 ID、Prompt、采样参数和路由策略一起版本化，灰度期间按稳定哈希分流并设回滚阈值。

每季度或在模型重大升级后重跑核心集。不要自动追随 `latest` 别名上线；固定可审计版本，确认弃用窗口和输出变化后再迁移。

## 常见误区

- **只看排行榜**：公开基准不覆盖组织数据、系统延迟和合规
- **只比 Token 单价**：失败、长输出、重试和人工接管会改变总成本
- **把上下文窗口当有效记忆**：长上下文利用需要单独评测
- **把多模型路由当免费优化**：路由误判、缓存分裂和运维复杂度也有成本

## 面试追问

**问：面试官坚持问“最终用了哪个”，怎么答？**

**答：** 给出具体版本和测试日期，再用一到两个硬约束及业务指标解释。若不能披露名称，可说明模型类别和可复现决策过程。

**问：如何避免供应商锁定？**

**答：** 保留抽象但不抹平能力差异，维护第二候选的回归结果，定期做故障切换演练，并让业务数据与评测资产独立于供应商。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

我不会先报一个模型名，而会说明业务约束和实验。先按数据驻留、许可证、部署方式、上下文、工具/多模态能力与预算筛出候选，再用真实任务集比较质量、安全、TTFT、TPOT、吞吐和每次成功任务成本。最后选择满足硬约束且在 Pareto 前沿上的方案，并保留回滚和替代模型。

主流模型变化很快，面试中应报告测试日期和具体版本。项目也未必只用一个模型：高风险或复杂请求走强模型，分类、改写和批处理走小模型；路由规则必须可观测并经过同一质量门禁。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

选型流程分四步：

1. **硬约束筛选**：数据能否出域、许可是否允许商用、是否支持目标地区和硬件
2. **能力门槛**：语言、领域、工具调用、结构化输出、视觉和有效上下文是否达标
3. **系统压测**：真实长度与并发下测 TTFT、TPOT、P95/P99、吞吐和失败率
4. **经济评估**：计算单次成功任务成本，而不是只比较每百万 Token 单价

建议用决策表保留证据：

| 维度 | 门槛/指标 | 证据 |
|---|---|---|
| 任务质量 | 关键切片成功率 | 隐藏业务集与人工盲评 |
| 安全合规 | 数据驻留、保留、越狱率 | 合同、架构审查、安全集 |
| 性能 | TTFT、TPOT、尾延迟 | 固定并发与长度压测 |
| 成本 | 每次成功任务总成本 | Token、重试、检索、人工接管 |
| 运维 | 限额、SLA、回滚、可观测性 | 故障演练与供应商条款 |

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

适配层统一消息、工具和错误语义，但要保留各供应商差异，避免把不支持的参数静默丢弃。模型 ID、Prompt、采样参数和路由策略一起版本化，灰度期间按稳定哈希分流并设回滚阈值。

每季度或在模型重大升级后重跑核心集。不要自动追随 `latest` 别名上线；固定可审计版本，确认弃用窗口和输出变化后再迁移。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **只看排行榜**：公开基准不覆盖组织数据、系统延迟和合规
- **只比 Token 单价**：失败、长输出、重试和人工接管会改变总成本
- **把上下文窗口当有效记忆**：长上下文利用需要单独评测
- **把多模型路由当免费优化**：路由误判、缓存分裂和运维复杂度也有成本

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 3. **系统压测**：真实长度与并发下测 TTFT、TPOT、P95/P99、吞吐和失败率

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
- 22. 对比使用过哪些主流大模型？你们项目中最终选用了哪个模型？为什么？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
