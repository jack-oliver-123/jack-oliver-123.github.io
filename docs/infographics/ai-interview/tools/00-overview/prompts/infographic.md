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

# LLM工具调用面试题介绍

## Overview

覆盖 Function Calling、MCP、Agent Skill、A2A、实时通信、网关、OAuth 和安全工具执行的 23 道工程面试题

## Learning Objectives

The viewer will understand:

1. 建立“LLM工具调用面试题介绍”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

LLM 工具调用不是“模型直接执行程序”。模型负责理解意图并产生结构化调用建议，宿主应用负责校验参数、授权、执行和回传结果。Function Calling、模型上下文协议（Model Context Protocol，MCP）、Agent Skill 与 Agent2Agent（A2A）分别位于不同层次，可以组合使用，不能互相替代。

本专题共 23 道题，覆盖模型如何学习工具调用、MCP 2025-11-25 规范、A2A latest specification、流式与实时通信和 LLM 网关。本次 2026 修订新增结构化输出、工具 Schema、可靠执行、MCP OAuth 和客户端能力。每篇都先给出 60 秒回答，再展开协议事实、工程边界和追问思路。

## 学习路线

- **01-03，模型与 Function Calling**：先弄清模型输出什么、能力如何训练，以及训练数据怎样覆盖“不调用、单调用、多调用和失败恢复”
- **04-08，MCP 基础与选型**：理解 Host、Client、Server、能力原语和传输，再判断直接 Function Calling 与 MCP 的使用边界
- **09-12，Skill 与 Agent 协作**：区分操作知识、工具接入和 Agent 间任务协作
- **13-16，通信与基础设施**：比较 stdio、Streamable HTTP、SSE、WebSocket、WebRTC，并解释 LLM 网关的职责
- **17-20，结构化与可靠工具执行**：处理 Schema 约束、并行、超时、幂等、补偿和安全隔离
- **21-23，MCP 进阶**：掌握 OAuth、生命周期、能力协商，以及 Sampling、Elicitation、Roots

## 题目目录

- [1. 什么是 Function Calling？原理是什么？](/posts/ai应用开发/03llm工具调用面试专题/01什么是-function-calling-原理是什么/)
- [2. LLM 是如何学会调用外部工具的？](/posts/ai应用开发/03llm工具调用面试专题/02llm-是如何学会调用外部工具的/)
- [3. 大模型的 Function Call 能力是怎么训练出来的？](/posts/ai应用开发/03llm工具调用面试专题/03大模型的-function-call-能力是怎么训练出来的/)
- [4. 什么是 MCP（模型上下文协议）？讲讲它的核心内容？](/posts/ai应用开发/03llm工具调用面试专题/04什么是-mcp模型上下文协议讲讲它的核心内容/)
- [5. MCP 由哪几部分组成？](/posts/ai应用开发/03llm工具调用面试专题/05mcp-由哪几部分组成/)
- [6. MCP 和 Function Calling 有什么区别？有没有实际跑过 MCP？](/posts/ai应用开发/03llm工具调用面试专题/06mcp-和-function-calling-有什么区别有没有实际跑过-mcp/)
- [7. 什么场景使用 Function Calling，什么场景使用 MCP？](/posts/ai应用开发/03llm工具调用面试专题/07function-calling-也属于工具调用请问什么场景下使用-function-calling什么场景下使用-mcp/)
- [8. 为什么有些特定的推理模型不支持 MCP 协议？](/posts/ai应用开发/03llm工具调用面试专题/08为什么有些特定的推理模型不支持-mcp-协议/)
- [9. Skill 是什么？](/posts/ai应用开发/03llm工具调用面试专题/09skill-是什么/)
- [10. MCP 和 Agent Skill 的区别是什么？](/posts/ai应用开发/03llm工具调用面试专题/10mcp-和-agent-skill-的区别是什么/)
- [11. Function Calling、Skill、MCP 有什么区别？](/posts/ai应用开发/03llm工具调用面试专题/11function-callingskillmcp-这三个有什么区别/)
- [12. 什么是 A2A 协议？它和 MCP 协议的区别是什么？](/posts/ai应用开发/03llm工具调用面试专题/12什么是-a2a-协议它和-mcp-协议的区别是什么/)
- [13. MCP 协议通常采用什么通信方式？](/posts/ai应用开发/03llm工具调用面试专题/13mcp-协议通常采用什么通信方式/)
- [14. WebSocket 和 SSE 有什么区别及局限性？](/posts/ai应用开发/03llm工具调用面试专题/14说说-websocket-和-sse-通信的区别及局限性/)
- [15. WebRTC 和 WebSocket 在 AI 对话流中有什么差异？](/posts/ai应用开发/03llm工具调用面试专题/15为什么要用-webrtc-协议它和-websocketws在-ai-对话流中的核心差异是什么/)
- [16. LLM 网关层解决了什么问题？](/posts/ai应用开发/03llm工具调用面试专题/16有没有用过大模型的网关框架网关层解决了什么问题/)
- [17. Structured Outputs、JSON Mode 和 Function Calling 有什么区别？](/posts/ai应用开发/03llm工具调用面试专题/17structured-outputsjson-mode-和-function-calling-有什么区别/)
- [18. 如何设计高质量的工具 Schema？](/posts/ai应用开发/03llm工具调用面试专题/18如何设计高质量的工具-schema/)
- [19. 并行工具调用中如何处理超时、重试、幂等与补偿？](/posts/ai应用开发/03llm工具调用面试专题/19并行工具调用中如何处理超时重试幂等与补偿/)
- [20. 如何设计安全的工具执行环境？](/posts/ai应用开发/03llm工具调用面试专题/20如何设计安全的工具执行环境/)
- [21. MCP OAuth 授权流程是怎样的？](/posts/ai应用开发/03llm工具调用面试专题/21mcp-oauth-授权流程是怎样的/)
- [22. MCP 如何管理生命周期、能力协商与协议版本？](/posts/ai应用开发/03llm工具调用面试专题/22mcp-如何管理生命周期能力协商与协议版本/)
- [23. MCP 的 Sampling、Elicitation 和 Roots 是什么？](/posts/ai应用开发/03llm工具调用面试专题/23mcp-的-samplingelicitation-和-roots-是什么/)

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 学习路线

**Key Concept**: 学习路线

**Content**:

- **01-03，模型与 Function Calling**：先弄清模型输出什么、能力如何训练，以及训练数据怎样覆盖“不调用、单调用、多调用和失败恢复”
- **04-08，MCP 基础与选型**：理解 Host、Client、Server、能力原语和传输，再判断直接 Function Calling 与 MCP 的使用边界
- **09-12，Skill 与 Agent 协作**：区分操作知识、工具接入和 Agent 间任务协作
- **13-16，通信与基础设施**：比较 stdio、Streamable HTTP、SSE、WebSocket、WebRTC，并解释 LLM 网关的职责

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "学习路线"

---

### Visual Section 2: 题目目录

**Key Concept**: 题目目录

**Content**:

- 1. 什么是 Function Calling？原理是什么？
- 2. LLM 是如何学会调用外部工具的？
- 3. 大模型的 Function Call 能力是怎么训练出来的？
- 4. 什么是 MCP（模型上下文协议）？讲讲它的核心内容？

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "题目目录"

---

## Data Points (Verbatim)

- **01-03，模型与 Function Calling**：先弄清模型输出什么、能力如何训练，以及训练数据怎样覆盖“不调用、单调用、多调用和失败恢复”
- **04-08，MCP 基础与选型**：理解 Host、Client、Server、能力原语和传输，再判断直接 Function Calling 与 MCP 的使用边界
- **09-12，Skill 与 Agent 协作**：区分操作知识、工具接入和 Agent 间任务协作
- **13-16，通信与基础设施**：比较 stdio、Streamable HTTP、SSE、WebSocket、WebRTC，并解释 LLM 网关的职责
- **17-20，结构化与可靠工具执行**：处理 Schema 约束、并行、超时、幂等、补偿和安全隔离
- **21-23，MCP 进阶**：掌握 OAuth、生命周期、能力协商，以及 Sampling、Elicitation、Roots
- [1. 什么是 Function Calling？原理是什么？](/posts/ai应用开发/03llm工具调用面试专题/01什么是-function-calling-原理是什么/)
- [2. LLM 是如何学会调用外部工具的？](/posts/ai应用开发/03llm工具调用面试专题/02llm-是如何学会调用外部工具的/)
- [3. 大模型的 Function Call 能力是怎么训练出来的？](/posts/ai应用开发/03llm工具调用面试专题/03大模型的-function-call-能力是怎么训练出来的/)
- [4. 什么是 MCP（模型上下文协议）？讲讲它的核心内容？](/posts/ai应用开发/03llm工具调用面试专题/04什么是-mcp模型上下文协议讲讲它的核心内容/)
- [5. MCP 由哪几部分组成？](/posts/ai应用开发/03llm工具调用面试专题/05mcp-由哪几部分组成/)
- [6. MCP 和 Function Calling 有什么区别？有没有实际跑过 MCP？](/posts/ai应用开发/03llm工具调用面试专题/06mcp-和-function-calling-有什么区别有没有实际跑过-mcp/)
- [7. 什么场景使用 Function Calling，什么场景使用 MCP？](/posts/ai应用开发/03llm工具调用面试专题/07function-calling-也属于工具调用请问什么场景下使用-function-calling什么场景下使用-mcp/)
- [8. 为什么有些特定的推理模型不支持 MCP 协议？](/posts/ai应用开发/03llm工具调用面试专题/08为什么有些特定的推理模型不支持-mcp-协议/)
- [9. Skill 是什么？](/posts/ai应用开发/03llm工具调用面试专题/09skill-是什么/)
- [10. MCP 和 Agent Skill 的区别是什么？](/posts/ai应用开发/03llm工具调用面试专题/10mcp-和-agent-skill-的区别是什么/)
- [11. Function Calling、Skill、MCP 有什么区别？](/posts/ai应用开发/03llm工具调用面试专题/11function-callingskillmcp-这三个有什么区别/)
- [12. 什么是 A2A 协议？它和 MCP 协议的区别是什么？](/posts/ai应用开发/03llm工具调用面试专题/12什么是-a2a-协议它和-mcp-协议的区别是什么/)
- [13. MCP 协议通常采用什么通信方式？](/posts/ai应用开发/03llm工具调用面试专题/13mcp-协议通常采用什么通信方式/)
- [14. WebSocket 和 SSE 有什么区别及局限性？](/posts/ai应用开发/03llm工具调用面试专题/14说说-websocket-和-sse-通信的区别及局限性/)
- [15. WebRTC 和 WebSocket 在 AI 对话流中有什么差异？](/posts/ai应用开发/03llm工具调用面试专题/15为什么要用-webrtc-协议它和-websocketws在-ai-对话流中的核心差异是什么/)
- [16. LLM 网关层解决了什么问题？](/posts/ai应用开发/03llm工具调用面试专题/16有没有用过大模型的网关框架网关层解决了什么问题/)
- [17. Structured Outputs、JSON Mode 和 Function Calling 有什么区别？](/posts/ai应用开发/03llm工具调用面试专题/17structured-outputsjson-mode-和-function-calling-有什么区别/)
- [18. 如何设计高质量的工具 Schema？](/posts/ai应用开发/03llm工具调用面试专题/18如何设计高质量的工具-schema/)
- [19. 并行工具调用中如何处理超时、重试、幂等与补偿？](/posts/ai应用开发/03llm工具调用面试专题/19并行工具调用中如何处理超时重试幂等与补偿/)
- [20. 如何设计安全的工具执行环境？](/posts/ai应用开发/03llm工具调用面试专题/20如何设计安全的工具执行环境/)
- [21. MCP OAuth 授权流程是怎样的？](/posts/ai应用开发/03llm工具调用面试专题/21mcp-oauth-授权流程是怎样的/)
- [22. MCP 如何管理生命周期、能力协商与协议版本？](/posts/ai应用开发/03llm工具调用面试专题/22mcp-如何管理生命周期能力协商与协议版本/)
- [23. MCP 的 Sampling、Elicitation 和 Roots 是什么？](/posts/ai应用开发/03llm工具调用面试专题/23mcp-的-samplingelicitation-和-roots-是什么/)

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
- LLM工具调用面试题介绍
- 学习路线
- 题目目录
