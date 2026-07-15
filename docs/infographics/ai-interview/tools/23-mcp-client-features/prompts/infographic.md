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

# 23. MCP 的 Sampling、Elicitation 和 Roots 是什么？

## Overview

介绍 MCP 客户端能力 Sampling、Elicitation 与 Roots 的用途、协商方式和安全边界

## Learning Objectives

The viewer will understand:

1. 建立“MCP 的 Sampling、Elicitation 和 Roots 是什么？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

👔面试官：MCP Server 能直接调用 Host 的模型吗？

🙋我：只有 Client 声明 Sampling 能力后，Server 才能发 sampling/createMessage 请求，最终控制权仍在 Client。

👔面试官：Elicitation 和 Roots 分别解决什么？

🙋我：Elicitation 请求用户补充输入，Roots 让 Client 暴露可见的文件系统根目录边界。

## 60 秒回答

Sampling、Elicitation 和 Roots 是 MCP 的 Client 侧能力，方向与 Server 提供 Tools 不同。Sampling 让 Server 请求 Client 代表它调用模型，模型选择、权限和用户审核留在 Client；2025-11-25 还支持协商带 Tools 的 Sampling。Elicitation 让 Server 通过 Client 请求用户输入，分为结构化表单模式和敏感交互使用的 URL 模式。

Roots 让 Client 返回 file:// URI 形式的文件系统根目录，并可通知列表变化。三者都必须在 initialize 时显式声明，用户可以拒绝请求。它们是能力与范围信号，不会自动授予模型或 Server 操作系统权限。

## 详细解析

### Sampling

Server 发送 sampling/createMessage，请求中包含消息、模型偏好和采样参数。Client 决定实际使用哪个模型、是否修改请求、是否展示给用户，以及是否返回结果。Server 无需持有模型 API key。

规范建议保留 Human-in-the-loop，允许用户查看和拒绝请求。若要在 Sampling 中提供 Tools，Client 必须声明 sampling.tools，Server 不得向未声明该能力的 Client 发送工具化采样请求。

### Elicitation

Form mode 使用受限 JSON Schema 请求普通结构化信息，用户可以 accept、decline 或 cancel。Server 不得用 Form mode 请求密码、API key、access token 或支付凭证。

URL mode 把用户引导到外部页面处理敏感交互。Client 不得预取该 URL；必须在打开前向用户显示完整 URL、突出目标域名，并取得明确导航同意。敏感数据不经过 MCP Client。回到流程后仍要核验状态，不能仅凭重定向假设成功。

### Roots

支持 Roots 的 Client 响应 roots/list，返回当前可见目录。2025-11-25 要求 root URI 使用 file://。如果声明 listChanged，目录变化后 Client 发送 notifications/roots/list_changed。

Roots 帮助 Server 理解工作区边界，但不是完整沙箱。Server 必须规范化路径并防止 ../、符号链接和大小写绕过；Client 的实际文件工具还要强制权限。

## 工程实践与边界

处理 Server 到 Client 的嵌套请求时设置独立超时与并发上限，避免 Tool 调用等待 Elicitation，而界面又阻塞在原请求上。Sampling 的 Prompt、Elicitation 文案和 Roots 名称都来自不可信 Server，展示前要标记来源并过滤恶意内容。

对 Sampling 记录请求来源、用户决定、模型和结果；对 Elicitation 记录同意状态但不记录敏感值；对 Roots 只暴露任务需要的目录。任何副作用仍要参数校验、授权、确认、幂等、补偿和审计。

## 常见误区

- **Sampling 把模型密钥交给 Server**：模型访问留在 Client
- **Elicitation 可以收集任何字段**：敏感凭证必须走 URL mode
- **Roots 等于文件系统权限授予**：它表达范围，实际访问仍需执行控制
- **Client 声明能力后必须接受每次请求**：Client 和用户可以拒绝

## 面试追问

**追问：Sampling 为什么由 Client 选择模型？**

Client 持有模型访问、成本、隐私和用户策略，Server 只能表达偏好，不能绕过这些控制。

**追问：Roots 变化后 Server 怎样处理？**

收到 list_changed 通知后重新调用 roots/list，停止使用已移除目录，并使相关缓存失效。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

Sampling、Elicitation 和 Roots 是 MCP 的 Client 侧能力，方向与 Server 提供 Tools 不同。Sampling 让 Server 请求 Client 代表它调用模型，模型选择、权限和用户审核留在 Client；2025-11-25 还支持协商带 Tools 的 Sampling。

Roots 让 Client 返回 file:// URI 形式的文件系统根目录，并可通知列表变化。三者都必须在 initialize 时显式声明，用户可以拒绝请求。它们是能力与范围信号，不会自动授予模型或 Server 操作系统权限。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### Sampling
Server 发送 sampling/createMessage，请求中包含消息、模型偏好和采样参数。

规范建议保留 Human-in-the-loop，允许用户查看和拒绝请求。若要在 Sampling 中提供 Tools，Client 必须声明 sampling.tools，Server 不得向未声明该能力的 Client 发送工具化采样请求。

### Elicitation
Form mode 使用受限 JSON Schema 请求普通结构化信息，用户可以 accept、decline 或 cancel。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

处理 Server 到 Client 的嵌套请求时设置独立超时与并发上限，避免 Tool 调用等待 Elicitation，而界面又阻塞在原请求上。Sampling 的 Prompt、Elicitation 文案和 Roots 名称都来自不可信 Server，展示前要标记来源并过滤恶意内容。

对 Sampling 记录请求来源、用户决定、模型和结果；对 Elicitation 记录同意状态但不记录敏感值；对 Roots 只暴露任务需要的目录。任何副作用仍要参数校验、授权、确认、幂等、补偿和审计。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **Sampling 把模型密钥交给 Server**：模型访问留在 Client
- **Elicitation 可以收集任何字段**：敏感凭证必须走 URL mode
- **Roots 等于文件系统权限授予**：它表达范围，实际访问仍需执行控制
- **Client 声明能力后必须接受每次请求**：Client 和用户可以拒绝

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- Sampling、Elicitation 和 Roots 是 MCP 的 Client 侧能力，方向与 Server 提供 Tools 不同。Sampling 让 Server 请求 Client 代表它调用模型，模型选择、权限和用户审核留在 Client；2025-11-25 还支持协商带 Tools 的 Sampling。Elicitation 让 Server 通过 Client 请求用户输入，分为结构化表单模式和敏感交互使用的 URL 模式。
- 支持 Roots 的 Client 响应 roots/list，返回当前可见目录。2025-11-25 要求 root URI 使用 file://。如果声明 listChanged，目录变化后 Client 发送 notifications/roots/list_changed。

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
- 23. MCP 的 Sampling、Elicitation 和 Roots 是什么？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
