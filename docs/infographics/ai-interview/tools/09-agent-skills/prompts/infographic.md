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

# 9. Skill 是什么？

## Overview

系统介绍 Agent Skill 的模块化机制，梳理指令、脚本、模板和资源如何打包成可复用的 Agent 能力

## Learning Objectives

The viewer will understand:

1. 建立“Skill 是什么？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

👔面试官：Agent Skill 是一段保存起来的 Prompt 吗？

🙋我：指令是核心，但规范化 Skill 是一个目录包，至少含 SKILL.md，还可以附带脚本、参考资料和资源。

👔面试官：Skill 会自动获得执行权限吗？

🙋我：不会。是否加载、能调用哪些工具、脚本在哪里运行，都由 Agent Host 决定。

## 60 秒回答

Agent Skill 是把完成某类任务所需的操作知识和配套资源封装成可发现、可按需加载的目录。Agent Skills 规范要求目录至少包含带 YAML frontmatter 的 SKILL.md，其中 name 和 description 用于发现，正文提供执行说明；scripts、references、assets 等目录是可选的。

Skill 主要解决“Agent 应该怎样完成任务”，不定义远程工具连接，也不等于模型原生能力。Host 先用元数据判断是否相关，再加载详细指令和所需资源。脚本仍要在受控执行环境中运行。

## 详细解析

### 规范结构

一个 Skill 的最小结构如下：

~~~text
skill-name/
├── SKILL.md
├── scripts/
├── references/
└── assets/
~~~

SKILL.md 的 frontmatter 至少声明 name 与 description。名称有字符和长度约束，description 应同时说明“做什么”和“何时使用”。正文可以写工作流、边界、校验步骤和资源路由。

### 渐进式披露

Skill 的价值之一是按需加载。Host 可以先索引所有 Skill 的名称与描述，只在命中任务时读取正文，再按正文引用加载脚本或资料。这样能控制上下文长度，也能让同一能力包同时包含简短入口和深度参考。

“按需加载”是 Host 的实现行为。仅把目录放到磁盘不保证任何 Agent 都会发现或遵循它。

### 指令、资源与执行

Skill 可以指导 Agent 调用现有工具，也可以附带确定性脚本。前者依赖 Agent 的模型和工具环境，后者依赖运行时。模板、示例和领域资料适合放在 assets 或 references，避免把全部内容塞进主指令。

## 工程实践与边界

把 Skill 当成代码供应链处理。安装前检查来源、许可证、脚本和外部引用；运行时限制文件、网络、进程和密钥权限。升级要固定版本并做差异审查，不能因为内容是 Markdown 就视为无害。

Skill 中涉及副作用的步骤要明确参数校验、授权、用户确认、超时、有限重试、幂等、补偿和审计。外部文档可能包含提示注入，正文应说明可信来源和冲突处理规则。

## 常见误区

- **Skill 只是 Prompt 收藏夹**：规范允许组合指令、脚本、参考资料和资源
- **安装 Skill 就增加模型参数能力**：它提供上下文与流程，不修改模型权重
- **Skill 是远程调用协议**：它不定义 Client、Server 或传输
- **脚本比自然语言可靠，所以可以放开权限**：确定性执行同样需要沙箱和授权

## 面试追问

**追问：description 为什么重要？**

Host 常先用元数据做发现。描述过宽会误触发，过窄会漏掉应使用的任务。

**追问：什么时候把内容放 scripts，而不是正文？**

重复、可验证、对格式敏感的步骤适合脚本；需要判断和解释的流程保留在正文。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

Agent Skill 是把完成某类任务所需的操作知识和配套资源封装成可发现、可按需加载的目录。Agent Skills 规范要求目录至少包含带 YAML frontmatter 的 SKILL.md，其中 name 和 description 用于发现，正文提供执行说明；scripts、references、assets 等目录是可选的。

Skill 主要解决“Agent 应该怎样完成任务”，不定义远程工具连接，也不等于模型原生能力。Host 先用元数据判断是否相关，再加载详细指令和所需资源。脚本仍要在受控执行环境中运行。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 规范结构
一个 Skill 的最小结构如下：

~~~text
skill-name/
├── SKILL.md
├── scripts/
├── references/
└── assets/
~~~

SKILL.md 的 frontmatter 至少声明 name 与 description。名称有字符和长度约束，description 应同时说明“做什么”和“何时使用”。正文可以写工作流、边界、校验步骤和资源路由。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

把 Skill 当成代码供应链处理。安装前检查来源、许可证、脚本和外部引用；运行时限制文件、网络、进程和密钥权限。升级要固定版本并做差异审查，不能因为内容是 Markdown 就视为无害。

Skill 中涉及副作用的步骤要明确参数校验、授权、用户确认、超时、有限重试、幂等、补偿和审计。外部文档可能包含提示注入，正文应说明可信来源和冲突处理规则。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **Skill 只是 Prompt 收藏夹**：规范允许组合指令、脚本、参考资料和资源
- **安装 Skill 就增加模型参数能力**：它提供上下文与流程，不修改模型权重
- **Skill 是远程调用协议**：它不定义 Client、Server 或传输
- **脚本比自然语言可靠，所以可以放开权限**：确定性执行同样需要沙箱和授权

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
- 9. Skill 是什么？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
