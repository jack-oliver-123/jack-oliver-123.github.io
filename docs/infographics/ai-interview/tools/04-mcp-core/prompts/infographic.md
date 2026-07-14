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

# 4. 什么是 MCP（模型上下文协议）？讲讲它的核心内容？

## Overview

介绍 MCP 模型上下文协议的核心概念，梳理 Host、Client、Server、资源、工具和提示词之间的协作关系

## Learning Objectives

The viewer will understand:

1. 建立“什么是 MCP（模型上下文协议）？讲讲它的核心内容？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

👔面试官：MCP 是新的 Function Calling 格式吗？

🙋我：不是。MCP 标准化应用如何连接上下文与能力提供方，Function Calling 描述模型如何提出调用。

👔面试官：MCP 的核心对象有哪些？

🙋我：架构角色是 Host、Client、Server；Server 可提供 Tools、Resources、Prompts，Client 还可提供 Sampling、Elicitation、Roots 等能力。

## 60 秒回答

模型上下文协议（Model Context Protocol，MCP）是连接 AI 应用与外部系统的开放协议。按 2025-11-25 规范，它使用 JSON-RPC 2.0 消息，并定义 stdio 与 Streamable HTTP 两种标准传输。协议把连接初始化、版本与能力协商、请求响应、通知和安全边界统一起来。

Host 是承载模型和用户界面的应用，Host 为每个 Server 建立 MCP Client 连接。Server 可暴露工具、资源和提示词；Client 可按协商结果支持采样、信息征询和文件系统根目录。MCP 不规定模型必须怎样推理，也不替宿主执行授权与审批。

## 详细解析

### MCP 解决的集成问题

没有协议时，每个 AI 应用都要为数据源和工具编写专用适配。MCP 统一了能力发现与调用消息，使一个 Server 能被多个兼容 Host 接入。它处理的是应用与能力提供方之间的互操作，不是模型训练标准。

协议分为两层：

- **数据层**：JSON-RPC 生命周期、能力原语和消息语义
- **传输层**：本地进程使用 stdio，远程服务使用 Streamable HTTP，也允许自定义传输

### Server 与 Client 能力

Server 侧核心原语各有定位：

- **Tools**：可执行操作，由模型或应用触发
- **Resources**：按 URI 读取的上下文数据
- **Prompts**：Server 提供的可复用提示模板

Client 侧能力用于反向交互。Sampling 让 Server 请求 Host 侧模型生成；Elicitation 让 Server 经 Client 请求用户补充信息；Roots 让 Client 声明可见的文件系统边界。双方只能使用初始化时成功协商的能力。

### MCP 与模型的关系

Host 可以把 MCP 的 Tools 转换成模型供应商的 Function Calling 定义，也可以由确定性工作流触发调用。模型甚至不需要知道 MCP 的存在。MCP Server 不应取得模型供应商密钥。需要生成能力时，它可通过已协商的 Sampling 请求让 Client 代为采样，模型访问凭据仍留在 Client/Host 侧。

## 工程实践与边界

远程 MCP Server 要做资源级授权，不能只验证“已登录”。本地 Server 也不是天然可信：启动命令、环境变量、文件 Roots 和可执行工具都需要用户同意与最小权限。

工具调用仍要做参数校验、授权、超时、有限重试、幂等、补偿和审计。来自 Resource、Tool 结果或 Prompt 的文本可能包含提示注入，Host 应标记来源并限制其影响范围。

## 常见误区

- **MCP 是框架或模型能力**：它是协议，SDK 和 Host 才是具体实现
- **MCP 取代 Function Calling**：Host 常把 MCP Tool 映射到模型工具调用，两者可以组合
- **Resource 就是只读 Tool**：两者的发现、寻址和交互语义不同
- **连上 Server 就可调用全部能力**：能力协商不等于业务授权

## 面试追问

**追问：为什么需要 Host，而不是 Client 直接等于应用？**

Host 管理用户、模型、权限和多个连接；MCP Client 是 Host 内面向一个 Server 的协议会话。

**追问：MCP 是否限定底层必须使用 HTTP？**

不限定。2025-11-25 标准传输包括 stdio 与 Streamable HTTP，并允许自定义传输。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

模型上下文协议（Model Context Protocol，MCP）是连接 AI 应用与外部系统的开放协议。按 2025-11-25 规范，它使用 JSON-RPC 2.0 消息，并定义 stdio 与 Streamable HTTP 两种标准传输。协议把连接初始化、版本与能力协商、请求响应、通知和安全边界统一起来。

Host 是承载模型和用户界面的应用，Host 为每个 Server 建立 MCP Client 连接。Server 可暴露工具、资源和提示词；Client 可按协商结果支持采样、信息征询和文件系统根目录。MCP 不规定模型必须怎样推理，也不替宿主执行授权与审批。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### MCP 解决的集成问题
没有协议时，每个 AI 应用都要为数据源和工具编写专用适配。

协议分为两层：

- **数据层**：JSON-RPC 生命周期、能力原语和消息语义
- **传输层**：本地进程使用 stdio，远程服务使用 Streamable HTTP，也允许自定义传输

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

远程 MCP Server 要做资源级授权，不能只验证“已登录”。本地 Server 也不是天然可信：启动命令、环境变量、文件 Roots 和可执行工具都需要用户同意与最小权限。

工具调用仍要做参数校验、授权、超时、有限重试、幂等、补偿和审计。来自 Resource、Tool 结果或 Prompt 的文本可能包含提示注入，Host 应标记来源并限制其影响范围。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **MCP 是框架或模型能力**：它是协议，SDK 和 Host 才是具体实现
- **MCP 取代 Function Calling**：Host 常把 MCP Tool 映射到模型工具调用，两者可以组合
- **Resource 就是只读 Tool**：两者的发现、寻址和交互语义不同
- **连上 Server 就可调用全部能力**：能力协商不等于业务授权

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 模型上下文协议（Model Context Protocol，MCP）是连接 AI 应用与外部系统的开放协议。按 2025-11-25 规范，它使用 JSON-RPC 2.0 消息，并定义 stdio 与 Streamable HTTP 两种标准传输。协议把连接初始化、版本与能力协商、请求响应、通知和安全边界统一起来。

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
- 4. 什么是 MCP（模型上下文协议）？讲讲它的核心内容？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
