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

# Agent 面试题介绍

## Overview

覆盖 Agent 基础架构、规划、记忆、多 Agent、评测、持久化、安全、人审与 Computer Use 的 22 道工程面试题

## Learning Objectives

The viewer will understand:

1. 建立“Agent 面试题介绍”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

本专题不仅解释 ReAct 等基础范式，也关注如何把概率性模型接入可审计、可恢复、受权限约束的生产系统。重点包括控制流归属、状态持久化、工具失败处理，以及高风险动作的人工审批边界。

本专题共 22 道题，覆盖基础架构、执行与规划、记忆和多 Agent。本次 2026 修订新增 Context Engineering、系统评测、长时运行、安全、Human-in-the-Loop 和 Computer Use 可靠性。每篇都给出可直接口述的短答，并继续展开工程边界和追问。

## 建议学习路径

| 阶段 | 题目 | 重点 |
| --- | --- | --- |
| 基础概念 | 01-04 | 模型、Agent、Tool、Workflow 的边界 |
| 执行与规划 | 05-07、14-15 | ReAct、计划、任务图、反馈优化 |
| 状态与记忆 | 08-09、12、19 | 记忆写入与召回、压缩、持久化恢复 |
| 架构取舍 | 10-11、13、16 | 单/多 Agent、框架边界、协作协议 |
| 生产治理 | 17-22 | 上下文、评测、安全、人审、Computer Use |

## 题目目录

- [1. 什么是 Agent？与大模型有什么本质不同？](/posts/ai应用开发/01agent面试专题/01什么是-agent与大模型有什么本质不同/)
- [2. Agent 的基本架构由哪些核心组件构成？](/posts/ai应用开发/01agent面试专题/02agent-的基本架构由哪些核心组件构成/)
- [3. Workflow，Agent，Tools 这三个的概念和区别介绍一下？](/posts/ai应用开发/01agent面试专题/03workflowagenttools-这三个的概念和区别介绍一下/)
- [4. 了解哪些其他的 Agent 设计范式？Agent 和 Workflow 的区别是什么？](/posts/ai应用开发/01agent面试专题/04了解哪些其他的-agent-设计范式agent-和-workflow的区别是什么/)
- [5. Agent 推理模式有哪些？ReAct 是啥？具体是怎么实现的？](/posts/ai应用开发/01agent面试专题/05agent-推理模式有哪些react-是啥具体是怎么实现的/)
- [6. ReAct、Plan-and-Execute、Reflection 三种范式有什么核心区别？实际项目中该如何选型？](/posts/ai应用开发/01agent面试专题/06reactplan-and-executereflection-三种范式有什么核心区别实际项目中该如何选型/)
- [7. 复杂任务怎么做任务拆分？为什么要拆分？效果如何提升？](/posts/ai应用开发/01agent面试专题/07复杂任务怎么做的任务拆分为什么要拆分效果如何提升/)
- [8. AI Agent 的记忆机制应该如何设计？](/posts/ai应用开发/01agent面试专题/08请你介绍一下-ai-agent-的记忆机制并说明在实际开发中应该如何设计记忆模块/)
- [9. Agent 的长短期记忆怎么存、怎么取、粒度如何确定？](/posts/ai应用开发/01agent面试专题/09agent-的长短期记忆系统怎么做的记忆是怎么存的粒度是多少怎么用的/)
- [10. 什么是 Multi-Agent？](/posts/ai应用开发/01agent面试专题/10什么是-multi-agent/)
- [11. Single-Agent 和 Multi-Agent 如何选型？](/posts/ai应用开发/01agent面试专题/11说说-single-agent-和-multi-agent-的设计方案/)
- [12. Agent 记忆压缩通常有哪些方法？](/posts/ai应用开发/01agent面试专题/12agent-记忆压缩通常有哪些方法/)
- [13. 为什么有时手写 Agent，而不是直接使用成熟框架？](/posts/ai应用开发/01agent面试专题/13在工程实践中为什么有时候选择手搓agent而不是直接用成熟框架/)
- [14. 如何赋予 LLM 规划能力？](/posts/ai应用开发/01agent面试专题/14如何赋予-llm-规划能力/)
- [15. Agent 的反思机制如何实现？](/posts/ai应用开发/01agent面试专题/15讲讲-agent-的反思机制为什么要用反思具体怎么实现/)
- [16. 如何设计多 Agent 协作与动态切换？](/posts/ai应用开发/01agent面试专题/16如何设计多-agent-的协作与动态切换机制/)
- [17. Context Engineering 与 Prompt Engineering 有什么区别？](/posts/ai应用开发/01agent面试专题/17context-engineering-与-prompt-engineering-有什么区别/)
- [18. 如何系统化评测 Agent？](/posts/ai应用开发/01agent面试专题/18如何系统化评测-agent/)
- [19. 长时运行 Agent 如何做持久化、恢复与可观测性？](/posts/ai应用开发/01agent面试专题/19长时运行-agent-如何做持久化恢复与可观测性/)
- [20. 如何防范 Prompt Injection、工具滥用与敏感数据泄露？](/posts/ai应用开发/01agent面试专题/20如何防范-prompt-injection工具滥用与敏感数据泄露/)
- [21. Human-in-the-Loop 应该如何设计审批边界？](/posts/ai应用开发/01agent面试专题/21human-in-the-loop-应该如何设计审批边界/)
- [22. 如何提升 Computer Use Agent 的可靠性？](/posts/ai应用开发/01agent面试专题/22如何提升-computer-use-agent-的可靠性/)

## 使用方法

先用“60 秒回答”建立口述骨架，再用“工程实践与边界”补充真实项目取舍。不要背诵内部推理过程，也不要承诺固定成功率或成本降幅；更好的回答是说明指标定义、失败模式、保护措施和验证方式。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 建议学习路径

**Key Concept**: 建议学习路径

**Content**:

| 阶段 | 题目 | 重点 |
| --- | --- | --- |
| 基础概念 | 01-04 | 模型、Agent、Tool、Workflow 的边界 |
| 执行与规划 | 05-07、14-15 | ReAct、计划、任务图、反馈优化 |
| 状态与记忆 | 08-09、12、19 | 记忆写入与召回、压缩、持久化恢复 |
| 架构取舍 | 10-11、13、16 | 单/多 Agent、框架边界、协作协议 |
| 生产治理 | 17-22 | 上下文、评测、安全、人审、Computer Use |

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "建议学习路径"

---

### Visual Section 2: 题目目录

**Key Concept**: 题目目录

**Content**:

- 1. 什么是 Agent？与大模型有什么本质不同？
- 2. Agent 的基本架构由哪些核心组件构成？
- 3. Workflow，Agent，Tools 这三个的概念和区别介绍一下？
- 4. 了解哪些其他的 Agent 设计范式？Agent 和 Workflow 的区别是什么？

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "题目目录"

---

### Visual Section 3: 使用方法

**Key Concept**: 使用方法

**Content**:

先用“60 秒回答”建立口述骨架，再用“工程实践与边界”补充真实项目取舍。不要背诵内部推理过程，也不要承诺固定成功率或成本降幅；更好的回答是说明指标定义、失败模式、保护措施和验证方式。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "使用方法"

---

## Data Points (Verbatim)

- | 基础概念 | 01-04 | 模型、Agent、Tool、Workflow 的边界 |
- | 执行与规划 | 05-07、14-15 | ReAct、计划、任务图、反馈优化 |
- | 状态与记忆 | 08-09、12、19 | 记忆写入与召回、压缩、持久化恢复 |
- | 架构取舍 | 10-11、13、16 | 单/多 Agent、框架边界、协作协议 |
- | 生产治理 | 17-22 | 上下文、评测、安全、人审、Computer Use |
- [1. 什么是 Agent？与大模型有什么本质不同？](/posts/ai应用开发/01agent面试专题/01什么是-agent与大模型有什么本质不同/)
- [2. Agent 的基本架构由哪些核心组件构成？](/posts/ai应用开发/01agent面试专题/02agent-的基本架构由哪些核心组件构成/)
- [3. Workflow，Agent，Tools 这三个的概念和区别介绍一下？](/posts/ai应用开发/01agent面试专题/03workflowagenttools-这三个的概念和区别介绍一下/)
- [4. 了解哪些其他的 Agent 设计范式？Agent 和 Workflow 的区别是什么？](/posts/ai应用开发/01agent面试专题/04了解哪些其他的-agent-设计范式agent-和-workflow的区别是什么/)
- [5. Agent 推理模式有哪些？ReAct 是啥？具体是怎么实现的？](/posts/ai应用开发/01agent面试专题/05agent-推理模式有哪些react-是啥具体是怎么实现的/)
- [6. ReAct、Plan-and-Execute、Reflection 三种范式有什么核心区别？实际项目中该如何选型？](/posts/ai应用开发/01agent面试专题/06reactplan-and-executereflection-三种范式有什么核心区别实际项目中该如何选型/)
- [7. 复杂任务怎么做任务拆分？为什么要拆分？效果如何提升？](/posts/ai应用开发/01agent面试专题/07复杂任务怎么做的任务拆分为什么要拆分效果如何提升/)
- [8. AI Agent 的记忆机制应该如何设计？](/posts/ai应用开发/01agent面试专题/08请你介绍一下-ai-agent-的记忆机制并说明在实际开发中应该如何设计记忆模块/)
- [9. Agent 的长短期记忆怎么存、怎么取、粒度如何确定？](/posts/ai应用开发/01agent面试专题/09agent-的长短期记忆系统怎么做的记忆是怎么存的粒度是多少怎么用的/)
- [10. 什么是 Multi-Agent？](/posts/ai应用开发/01agent面试专题/10什么是-multi-agent/)
- [11. Single-Agent 和 Multi-Agent 如何选型？](/posts/ai应用开发/01agent面试专题/11说说-single-agent-和-multi-agent-的设计方案/)
- [12. Agent 记忆压缩通常有哪些方法？](/posts/ai应用开发/01agent面试专题/12agent-记忆压缩通常有哪些方法/)
- [13. 为什么有时手写 Agent，而不是直接使用成熟框架？](/posts/ai应用开发/01agent面试专题/13在工程实践中为什么有时候选择手搓agent而不是直接用成熟框架/)
- [14. 如何赋予 LLM 规划能力？](/posts/ai应用开发/01agent面试专题/14如何赋予-llm-规划能力/)
- [15. Agent 的反思机制如何实现？](/posts/ai应用开发/01agent面试专题/15讲讲-agent-的反思机制为什么要用反思具体怎么实现/)
- [16. 如何设计多 Agent 协作与动态切换？](/posts/ai应用开发/01agent面试专题/16如何设计多-agent-的协作与动态切换机制/)
- [17. Context Engineering 与 Prompt Engineering 有什么区别？](/posts/ai应用开发/01agent面试专题/17context-engineering-与-prompt-engineering-有什么区别/)
- [18. 如何系统化评测 Agent？](/posts/ai应用开发/01agent面试专题/18如何系统化评测-agent/)
- [19. 长时运行 Agent 如何做持久化、恢复与可观测性？](/posts/ai应用开发/01agent面试专题/19长时运行-agent-如何做持久化恢复与可观测性/)
- [20. 如何防范 Prompt Injection、工具滥用与敏感数据泄露？](/posts/ai应用开发/01agent面试专题/20如何防范-prompt-injection工具滥用与敏感数据泄露/)
- [21. Human-in-the-Loop 应该如何设计审批边界？](/posts/ai应用开发/01agent面试专题/21human-in-the-loop-应该如何设计审批边界/)
- [22. 如何提升 Computer Use Agent 的可靠性？](/posts/ai应用开发/01agent面试专题/22如何提升-computer-use-agent-的可靠性/)
- 先用“60 秒回答”建立口述骨架，再用“工程实践与边界”补充真实项目取舍。不要背诵内部推理过程，也不要承诺固定成功率或成本降幅；更好的回答是说明指标定义、失败模式、保护措施和验证方式。

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
- Agent 面试题介绍
- 建议学习路径
- 题目目录
- 使用方法
