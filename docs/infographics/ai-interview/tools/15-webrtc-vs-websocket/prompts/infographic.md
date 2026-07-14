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

# 15. 为什么要用 WebRTC 协议？它和 WebSocket（WS）在 AI 对话流中的核心差异是什么？

## Overview

分析 WebRTC 与 WebSocket 在 AI 对话流中的差异，梳理低延迟音视频、点对点连接和实时交互场景的协议选择

## Learning Objectives

The viewer will understand:

1. 建立“为什么要用 WebRTC 协议？它和 WebSocket（WS）在 AI 对话流中的核心差异是什么？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

👔面试官：实时语音用 WebRTC，只是因为它走 P2P 吗？

🙋我：不是。关键是它提供完整的实时媒体栈，包括编解码、时钟、抖动缓冲、拥塞控制和丢包处理。

👔面试官：WebRTC 是否只走 UDP？

🙋我：不保证。ICE 会选择可达路径，UDP 通常优先，也可能经 TURN 中继或使用 TCP 类回退路径。

## 60 秒回答

WebSocket 在可靠、有序的传输之上提供双向消息通道，消息可由一个或多个帧组成，适合文本、控制消息和要求完整到达的数据。WebRTC 面向实时音视频：通过 ICE 建连，媒体通常使用加密的 RTP/RTCP，配合编解码、时间戳、抖动缓冲、拥塞控制和丢包恢复，在“等重传”和“及时播放”之间做实时取舍。

AI 实时语音更看重连续性和端到端时延，过期音频即使重传也没有价值，因此 WebRTC 通常更合适。但它不保证端到端 P2P，也不保证只走 UDP。服务端 AI、企业网络和 TURN 中继都可能改变实际路径。

## 详细解析

### WebSocket 的数据语义

WebSocket 建立在可靠有序传输上。某段数据丢失时，后续数据通常要等待重传，这保证完整性，却可能产生队头阻塞。应用需要自行定义音频分片、时间戳、编码、抖动处理、拥塞与回声控制。

它适合会话事件、转写文本、工具调用状态和低频控制，也能传音频，但需要补齐媒体工程能力。

### WebRTC 的媒体语义

WebRTC 通过 ICE 收集并探测候选路径，使用 DTLS-SRTP 等机制保护媒体。RTP 时间戳让接收端按播放时间处理包，RTCP 提供反馈，发送端可据此调整码率。浏览器还提供采集、编解码、回声消除和抖动缓冲接口。

DataChannel 基于 SCTP，可配置有序性与重传策略，适合与媒体同会话的控制或数据。但模型厂商提供的具体 WebRTC API 仍是产品接口，不属于 W3C 规范本身。

### AI 对话的选择

纯文本流和工具事件用 SSE 或 WebSocket 更轻。浏览器双向语音、打断和低延迟播放用 WebRTC。常见系统采用混合方案：WebRTC 承载音频，DataChannel 或 WebSocket 承载事件，后端再连接模型与工具编排。

## 工程实践与边界

上线前测首音延迟、端到端延迟、抖动、丢包、打断成功率和 TURN 使用率。限制会话时长与媒体码率，并处理麦克风授权、录音提示、数据保留和地域合规。

工具调用不应因语音打断重复执行。宿主需要给调用设置状态机、超时和幂等键，高风险动作要求明确确认。转写与模型输出也可能包含提示注入，不能让语音通道绕过授权。

## 常见误区

- **WebRTC 等于 P2P**：AI 服务端和 TURN 中继都可能位于路径中
- **WebRTC 只使用 UDP**：实际候选与回退取决于网络
- **UDP 不重传，所以 WebRTC 不可靠**：媒体层有反馈、选择性恢复和抗丢包机制
- **WebSocket 不能做语音**：可以，但应用要承担更多媒体栈职责

## 面试追问

**追问：为什么实时音频不追求每个包都到达？**

播放截止时间已过的包价值很低。系统更愿意丢弃或掩盖少量缺失，避免重传阻塞后续音频。

**追问：什么时候仍选择 WebSocket 传音频？**

服务端到服务端、网络受控、规模较小，且已有音频分帧与缓冲实现时，WebSocket 的接入成本可能更低。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

WebSocket 在可靠、有序的传输之上提供双向消息通道，消息可由一个或多个帧组成，适合文本、控制消息和要求完整到达的数据。WebRTC 面向实时音视频：通过 ICE 建连，媒体通常使用加密的 RTP/RTCP，配合编解码、时间戳、抖动缓冲、拥塞控制和丢包恢复，在“等重传”和“及时播放”之间做实时取舍。

AI 实时语音更看重连续性和端到端时延，过期音频即使重传也没有价值，因此 WebRTC 通常更合适。但它不保证端到端 P2P，也不保证只走 UDP。服务端 AI、企业网络和 TURN 中继都可能改变实际路径。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### WebSocket 的数据语义
WebSocket 建立在可靠有序传输上。

它适合会话事件、转写文本、工具调用状态和低频控制，也能传音频，但需要补齐媒体工程能力。

### WebRTC 的媒体语义
WebRTC 通过 ICE 收集并探测候选路径，使用 DTLS-SRTP 等机制保护媒体。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

上线前测首音延迟、端到端延迟、抖动、丢包、打断成功率和 TURN 使用率。限制会话时长与媒体码率，并处理麦克风授权、录音提示、数据保留和地域合规。

工具调用不应因语音打断重复执行。宿主需要给调用设置状态机、超时和幂等键，高风险动作要求明确确认。转写与模型输出也可能包含提示注入，不能让语音通道绕过授权。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **WebRTC 等于 P2P**：AI 服务端和 TURN 中继都可能位于路径中
- **WebRTC 只使用 UDP**：实际候选与回退取决于网络
- **UDP 不重传，所以 WebRTC 不可靠**：媒体层有反馈、选择性恢复和抗丢包机制
- **WebSocket 不能做语音**：可以，但应用要承担更多媒体栈职责

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- AI 实时语音更看重连续性和端到端时延，过期音频即使重传也没有价值，因此 WebRTC 通常更合适。但它不保证端到端 P2P，也不保证只走 UDP。服务端 AI、企业网络和 TURN 中继都可能改变实际路径。
- DataChannel 基于 SCTP，可配置有序性与重传策略，适合与媒体同会话的控制或数据。但模型厂商提供的具体 WebRTC API 仍是产品接口，不属于 W3C 规范本身。
- **WebRTC 等于 P2P**：AI 服务端和 TURN 中继都可能位于路径中

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
- 15. 为什么要用 WebRTC 协议？它和 WebSocket（WS）在 AI 对话流中的核心差异是什么？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
