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

# 20. 如何防范 Prompt Injection、工具滥用与敏感数据泄露？

## Overview

系统介绍 Agent 面对提示注入、越权工具调用和敏感数据泄露时的分层防护方案

## Learning Objectives

The viewer will understand:

1. 复述“如何防范 Prompt Injection、工具滥用与敏感数据泄露？”的关键流程与控制点
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

核心原则是把模型视为不可信决策者，把网页、邮件、文档和工具输出视为不可信数据。Prompt 过滤不能单独解决注入；应采用分层控制：指令与数据分离、最小工具集合、运行时鉴权、参数校验、网络与文件沙箱、敏感数据最小化、高风险动作审批，以及完整审计和对抗评测。

模型不应直接持有长期生产凭据。每次工具调用由宿主依据真实用户身份、租户、资源和动作重新授权。即使模型被注入，攻击者也只能触及被明确允许的最小能力。

## 详细解析

直接 Prompt Injection 来自用户输入，间接注入藏在 Agent 读取的网页、文档或消息中。攻击目标通常是改变任务、窃取上下文、诱导调用工具或把数据发送到外部。因为自然语言中的“数据”和“指令”没有天然强隔离，单纯要求模型“忽略恶意内容”不构成安全边界。

防护应覆盖：

1. **输入与上下文**：标记来源和信任级别，隔离外部内容，不把检索文本拼进高优先级政策。
2. **能力**：按任务动态提供所需的最小工具集合；读写分离，参数使用 allowlist 和业务规则校验。
3. **身份与授权**：工具网关依据用户和资源做服务端授权，短期凭据按调用注入。
4. **数据外流**：限制网络目的地、响应大小和敏感字段，阻止跨租户与未授权外发。
5. **副作用**：预览、审批、幂等、速率限制和异常行为检测。

安全失败应默认关闭：授权信息缺失、策略服务不可用或审批过期时拒绝高风险动作，而不是为了可用性放行。

## 工程实践与边界

- 工具参数来自模型也必须按 schema、资源归属和业务策略校验，防止路径穿越、SQL 注入和不安全直接对象引用（IDOR）。
- 搜索、浏览器和代码执行运行在隔离环境，限制文件、网络、进程、CPU、时间和输出。
- 密钥保存在凭据代理，模型只看到工具别名；日志、错误和记忆中清除 secret 与不必要的个人可识别信息（PII）。
- 将数据读取权限与外发权限分开，防止 Agent 读取敏感信息后通过邮件或 HTTP 工具泄露。
- 建立包含越权、间接注入、编码混淆、工具链跳转和跨租户场景的红队与回归集。

## 常见误区

- **“System Prompt 优先级高，所以不会被注入”**：模型仍可能被外部内容误导，真正边界必须在运行时。
- **“检测到关键词就能过滤注入”**：攻击可改写或编码，且正常文档也可能讨论恶意指令。
- **“工具 schema 能保证安全”**：schema 只验证形状，不能替代资源授权和业务规则。
- **“用户点过一次允许就永久可信”**：审批应绑定具体动作、参数、时效和目标。

## 面试追问

> **面试官：** Agent 需要读邮箱又要发邮件，如何降低泄露风险？
>
> **候选人：** 使用不同权限工具，限制收件域和附件，发信前显示最终内容与来源并审批，敏感内容命中策略时阻断。

> **面试官：** 外部网页要求 Agent 忽略规则怎么办？
>
> **候选人：** 把网页作为低信任数据，不执行其中指令；提取事实时保留来源，任何工具动作仍经过独立策略检查。

> **面试官：** 如何测试跨租户隔离？
>
> **候选人：** 构造两个租户的相似资源和记忆，尝试通过自然语言、直接 ID、检索和工具参数越权，并在存储层验证均被拒绝。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

核心原则是把模型视为不可信决策者，把网页、邮件、文档和工具输出视为不可信数据。Prompt 过滤不能单独解决注入；应采用分层控制：指令与数据分离、最小工具集合、运行时鉴权、参数校验、网络与文件沙箱、敏感数据最小化、高风险动作审批，以及完整审计和对抗评测。

模型不应直接持有长期生产凭据。每次工具调用由宿主依据真实用户身份、租户、资源和动作重新授权。即使模型被注入，攻击者也只能触及被明确允许的最小能力。

**Visual Element**: Type: numbered process node; Subject: 60 秒回答；Treatment: 从左到右连接并标明第 1 阶段

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

直接 Prompt Injection 来自用户输入，间接注入藏在 Agent 读取的网页、文档或消息中。攻击目标通常是改变任务、窃取上下文、诱导调用工具或把数据发送到外部。因为自然语言中的“数据”和“指令”没有天然强隔离，单纯要求模型“忽略恶意内容”不构成安全边界。

防护应覆盖：

1. **输入与上下文**：标记来源和信任级别，隔离外部内容，不把检索文本拼进高优先级政策。
2. **能力**：按任务动态提供所需的最小工具集合；读写分离，参数使用 allowlist 和业务规则校验。
3. **身份与授权**：工具网关依据用户和资源做服务端授权，短期凭据按调用注入。
4. **数据外流**：限制网络目的地、响应大小和敏感字段，阻止跨租户与未授权外发。

安全失败应默认关闭：授权信息缺失、策略服务不可用或审批过期时拒绝高风险动作，而不是为了可用性放行。

**Visual Element**: Type: numbered process node; Subject: 详细解析；Treatment: 从左到右连接并标明第 2 阶段

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 工具参数来自模型也必须按 schema、资源归属和业务策略校验，防止路径穿越、SQL 注入和不安全直接对象引用（IDOR）。
- 搜索、浏览器和代码执行运行在隔离环境，限制文件、网络、进程、CPU、时间和输出。
- 密钥保存在凭据代理，模型只看到工具别名；日志、错误和记忆中清除 secret 与不必要的个人可识别信息（PII）。
- 将数据读取权限与外发权限分开，防止 Agent 读取敏感信息后通过邮件或 HTTP 工具泄露。

**Visual Element**: Type: numbered process node; Subject: 工程实践与边界；Treatment: 从左到右连接并标明第 3 阶段

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“System Prompt 优先级高，所以不会被注入”**：模型仍可能被外部内容误导，真正边界必须在运行时。
- **“检测到关键词就能过滤注入”**：攻击可改写或编码，且正常文档也可能讨论恶意指令。
- **“工具 schema 能保证安全”**：schema 只验证形状，不能替代资源授权和业务规则。
- **“用户点过一次允许就永久可信”**：审批应绑定具体动作、参数、时效和目标。

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
- 20. 如何防范 Prompt Injection、工具滥用与敏感数据泄露？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
