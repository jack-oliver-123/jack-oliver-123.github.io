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

# 13. MCP 协议通常采用什么通信方式？

## Overview

系统介绍 MCP 的常见通信方式，梳理 stdio、HTTP、SSE 等传输形态在本地集成和远程服务中的适用场景

## Learning Objectives

The viewer will understand:

1. 建立“MCP 协议通常采用什么通信方式？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

👔面试官：MCP 默认通过 WebSocket 双向通信吗？

🙋我：不是。2025-11-25 规范的标准传输是 stdio 和 Streamable HTTP。

👔面试官：Streamable HTTP 与 SSE 是什么关系？

🙋我：它用 HTTP POST 和 GET；Server 可用 SSE 在一个响应或独立 GET 流中发送多条消息。

## 60 秒回答

MCP 数据层使用 UTF-8 编码的 JSON-RPC 2.0 消息。2025-11-25 规范定义两种标准传输：本地 Server 常用 stdio，由 Client 启动子进程并通过标准输入输出交换按行分隔的消息；远程 Server 常用 Streamable HTTP，通过单一 MCP 端点处理 POST 和 GET，并可用 Server-Sent Events（SSE）流式发送消息。

WebSocket 不是标准传输，但实现可以扩展自定义传输。旧版 HTTP+SSE 已被 Streamable HTTP 取代，只保留向后兼容流程。

## 详细解析

### stdio

Client 启动 MCP Server 子进程。Server 从 stdin 读取 JSON-RPC，从 stdout 写回消息，每条消息以换行分隔且自身不能包含嵌入换行。日志可以写 stderr，stdout 不能混入普通日志，否则会破坏协议解析。

stdio 不经过网络，适合本地文件、IDE 与命令行集成。安全边界仍包括启动命令、环境变量、工作目录、文件权限与子进程网络访问。

### Streamable HTTP

Server 提供一个 MCP endpoint。Client 用 POST 发送 JSON-RPC；Server 可返回普通 JSON，也可返回 text/event-stream。Client 还可用 GET 打开 SSE 流，以接收 Server 主动请求和通知。

Server 可以在初始化响应中分配 MCP-Session-Id，Client 随后的请求必须携带它。会话结束时，Client 应尝试发送带会话 ID 的 DELETE；Server 可以不支持主动删除。

### 传输安全

Streamable HTTP Server 必须校验 Origin，以防 DNS rebinding；本地服务应只绑定 localhost，并实施认证。远程授权按 MCP HTTP 授权规范处理，不能把访问令牌放在 URL query 中。

## 工程实践与边界

本地优先 stdio，减少端口暴露；跨机器与多客户端优先 Streamable HTTP。设置消息大小、连接、请求和空闲超时。流断开后是否恢复、请求是否重试，要结合事件 ID 和业务幂等设计。

传输重试不能盲目重放 tools/call。读操作可以有限重试；写操作要用业务幂等键、状态查询和补偿。日志要关联 JSON-RPC id、session id 与业务 trace，并对参数和结果脱敏。

## 常见误区

- **MCP 必须使用 WebSocket**：WebSocket 只能作为自定义传输
- **SSE 是独立于 HTTP 的协议栈**：SSE 是 HTTP 上的事件流格式
- **stdio 没有安全风险**：本地进程可能读取文件、密钥或访问网络
- **HTTP 成功状态等于工具成功**：还要解析 JSON-RPC 与工具级结果

## 面试追问

**追问：为什么 Streamable HTTP 同时需要 POST 和 GET？**

POST 承载 Client 请求，GET 可建立接收 Server 主动消息的 SSE 流；具体使用取决于 Server 能力。

**追问：旧 HTTP+SSE Client 怎样兼容新 Server？**

规范给出了版本检测与回退流程，但新实现应优先按 Streamable HTTP 行为实现。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

MCP 数据层使用 UTF-8 编码的 JSON-RPC 2.0 消息。2025-11-25 规范定义两种标准传输：本地 Server 常用 stdio，由 Client 启动子进程并通过标准输入输出交换按行分隔的消息；

WebSocket 不是标准传输，但实现可以扩展自定义传输。旧版 HTTP+SSE 已被 Streamable HTTP 取代，只保留向后兼容流程。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### stdio
Client 启动 MCP Server 子进程。

stdio 不经过网络，适合本地文件、IDE 与命令行集成。安全边界仍包括启动命令、环境变量、工作目录、文件权限与子进程网络访问。

### Streamable HTTP
Server 提供一个 MCP endpoint。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

本地优先 stdio，减少端口暴露；跨机器与多客户端优先 Streamable HTTP。设置消息大小、连接、请求和空闲超时。流断开后是否恢复、请求是否重试，要结合事件 ID 和业务幂等设计。

传输重试不能盲目重放 tools/call。读操作可以有限重试；写操作要用业务幂等键、状态查询和补偿。日志要关联 JSON-RPC id、session id 与业务 trace，并对参数和结果脱敏。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **MCP 必须使用 WebSocket**：WebSocket 只能作为自定义传输
- **SSE 是独立于 HTTP 的协议栈**：SSE 是 HTTP 上的事件流格式
- **stdio 没有安全风险**：本地进程可能读取文件、密钥或访问网络
- **HTTP 成功状态等于工具成功**：还要解析 JSON-RPC 与工具级结果

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- MCP 数据层使用 UTF-8 编码的 JSON-RPC 2.0 消息。2025-11-25 规范定义两种标准传输：本地 Server 常用 stdio，由 Client 启动子进程并通过标准输入输出交换按行分隔的消息；远程 Server 常用 Streamable HTTP，通过单一 MCP 端点处理 POST 和 GET，并可用 Server-Sent Events（SSE）流式发送消息。

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
- 13. MCP 协议通常采用什么通信方式？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
