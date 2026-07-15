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

# 16. 如何写好 Prompt？分享下 Prompt 工程实践经验？

## Overview

给出可评测、可版本化的 Prompt 设计流程，覆盖指令、上下文、示例、Schema、安全与回归测试

## Learning Objectives

The viewer will understand:

1. 复述“如何写好 Prompt？分享下 Prompt 工程实践经验？”的关键流程与控制点
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

可靠 Prompt 先定义任务、输入边界和验收标准，再写清指令、上下文、示例、输出 Schema 与失败行为。把可信系统指令和不可信业务数据分开，使用清晰分隔符，并要求模型在证据不足时返回可处理的状态。结构化任务优先使用供应商的 Structured Outputs 或约束解码，服务端仍要做 Schema 与业务校验。

Prompt 需要像代码一样版本化。建立覆盖正常、边界、对抗和拒答样本的评测集，记录模型与采样参数，改动后运行回归。Prompt 能降低错误率，但不能代替权限检查、事实来源、工具参数验证和安全隔离。

## 详细解析

一个可维护的 Prompt 通常包含以下组件：

1. **目标**：用可验证动作描述任务，例如“从合同中抽取字段”
2. **输入契约**：说明数据来源、字段含义和允许缺失的情况
3. **决策规则**：给出优先级、边界和冲突处理
4. **示例**：覆盖容易混淆的正例和反例，避免只展示理想输入
5. **输出契约**：定义 Schema、枚举、引用和错误状态
6. **工具规则**：说明何时调用、允许的参数和需要审批的动作

长 Prompt 不是目标。每条规则都应对应已知失败模式或验收项。指令冲突时，应由应用层明确层级；不要依赖模型猜测最近一句或最长一段更重要。

Few-shot 示例会同时传递格式和隐含决策边界。示例分布偏窄时，模型可能模仿表面模式。对分类或抽取任务，应按类别和边界样本做消融，检查删除某个示例后的变化。

## 工程实践与边界

将 Prompt 模板、模型 ID、工具 Schema 和评测集版本绑定发布。指标至少包含任务正确率、格式通过率、事实引用、安全攻击成功率、延迟和 Token 成本。对随机生成运行多次并报告方差。

Prompt Injection 的根因是不可信文本与指令共享模型上下文。缓解方式包括最小权限工具、来源标记、检索内容隔离、参数白名单、人审和动作后验证。禁止把“忽略前文”一类防御句当作安全边界。

## 常见误区

- **堆叠角色形容词**：“你是资深专家”不能替代任务规则和评测标准
- **要求模型输出内部思维链**：生产系统更适合请求简短依据、引用或可验证中间结果
- **用 JSON 提示代替约束**：自然语言要求仍可能生成非法 JSON
- **只测几个成功案例**：Prompt 改动可能修复一类输入并破坏另一类

## 面试追问

**问：系统 Prompt 能防止用户覆盖规则吗？**

**答：** 指令层级能降低部分冲突，但不能形成强安全隔离。权限、数据访问和副作用必须由模型外的代码控制。

**问：Prompt 版本怎么灰度？**

**答：** 先跑固定离线集，再按稳定哈希分流小比例请求，比较质量、延迟和安全指标，并保留一键回滚到旧模板和模型的能力。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

可靠 Prompt 先定义任务、输入边界和验收标准，再写清指令、上下文、示例、输出 Schema 与失败行为。把可信系统指令和不可信业务数据分开，使用清晰分隔符，并要求模型在证据不足时返回可处理的状态。结构化任务优先使用供应商的 Structured Outputs 或约束解码，服务端仍要做 Schema 与业务校验。

Prompt 需要像代码一样版本化。建立覆盖正常、边界、对抗和拒答样本的评测集，记录模型与采样参数，改动后运行回归。Prompt 能降低错误率，但不能代替权限检查、事实来源、工具参数验证和安全隔离。

**Visual Element**: Type: numbered process node; Subject: 60 秒回答；Treatment: 从左到右连接并标明第 1 阶段

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

一个可维护的 Prompt 通常包含以下组件：

1. **目标**：用可验证动作描述任务，例如“从合同中抽取字段”
2. **输入契约**：说明数据来源、字段含义和允许缺失的情况
3. **决策规则**：给出优先级、边界和冲突处理
4. **示例**：覆盖容易混淆的正例和反例，避免只展示理想输入

长 Prompt 不是目标。每条规则都应对应已知失败模式或验收项。指令冲突时，应由应用层明确层级；不要依赖模型猜测最近一句或最长一段更重要。

Few-shot 示例会同时传递格式和隐含决策边界。示例分布偏窄时，模型可能模仿表面模式。对分类或抽取任务，应按类别和边界样本做消融，检查删除某个示例后的变化。

**Visual Element**: Type: numbered process node; Subject: 详细解析；Treatment: 从左到右连接并标明第 2 阶段

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

将 Prompt 模板、模型 ID、工具 Schema 和评测集版本绑定发布。指标至少包含任务正确率、格式通过率、事实引用、安全攻击成功率、延迟和 Token 成本。对随机生成运行多次并报告方差。

Prompt Injection 的根因是不可信文本与指令共享模型上下文。缓解方式包括最小权限工具、来源标记、检索内容隔离、参数白名单、人审和动作后验证。禁止把“忽略前文”一类防御句当作安全边界。

**Visual Element**: Type: numbered process node; Subject: 工程实践与边界；Treatment: 从左到右连接并标明第 3 阶段

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **堆叠角色形容词**：“你是资深专家”不能替代任务规则和评测标准
- **要求模型输出内部思维链**：生产系统更适合请求简短依据、引用或可验证中间结果
- **用 JSON 提示代替约束**：自然语言要求仍可能生成非法 JSON
- **只测几个成功案例**：Prompt 改动可能修复一类输入并破坏另一类

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
- 16. 如何写好 Prompt？分享下 Prompt 工程实践经验？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
