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

# 16. 有没有用过大模型的网关框架？网关层解决了什么问题？

## Overview

介绍大模型网关层的核心作用，梳理模型路由、鉴权限流、成本统计、缓存、观测和多模型接入的工程价值

## Learning Objectives

The viewer will understand:

1. 建立“有没有用过大模型的网关框架？网关层解决了什么问题？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

👔面试官：LLM 网关就是给模型 API 做负载均衡吗？

🙋我：路由只是一个职责。它还统一供应商协议、身份、配额、成本、观测和内容策略。

👔面试官：有了网关，应用还需要做什么？

🙋我：仍要管理提示、工具权限、业务超时、幂等、补偿和任务级评估。

## 60 秒回答

LLM 网关位于应用与模型供应商之间，把不同认证、请求格式、流式事件和错误码转换成统一接口，并实施模型路由、限流、预算、重试、熔断、观测和策略。它比通用反向代理更理解 token、模型、流式响应、工具调用和供应商错误。

网关适合多团队、多模型与集中治理场景。它不能提升模型质量，也不能代替 Agent 编排和工具授权。是否采用要根据供应商数量、合规要求、运维能力和额外延迟评估。

## 详细解析

### 协议与路由

不同供应商的消息角色、工具调用、流式事件、用量和错误模型不同。网关可以提供统一入口，再按模型能力、地域、成本、延迟和健康状态路由。故障转移必须检查语义兼容，不能把不支持相同工具或上下文长度的模型当作透明备份。

### 治理与成本

网关可集中验证应用身份、分配模型允许名单、限制请求与 token、设置租户预算，并记录供应商用量。密钥放在网关能减少应用侧分发，但网关因此成为高价值信任边界。

### 观测与可靠性

网关可以记录首 token 延迟、总延迟、输入输出 token、错误类型、重试和路由结果。流式请求要区分“尚未收到响应”和“已向客户端发送部分内容”，后者通常不能透明切换供应商。

缓存要谨慎。精确缓存只能复用完全相同且身份、权限和模型配置一致的结果；语义缓存可能返回过期或跨租户内容，不适合高风险和实时数据。

## 工程实践与边界

先用影子流量或回放评估协议兼容和延迟，再逐步接管路由。保留供应商原始错误和 request ID，避免统一错误码抹掉定位信息。日志默认脱敏，敏感 Prompt 与 Tool 参数应可选择不落盘。

涉及工具调用时，网关要原样保持调用 ID 和事件顺序。应用仍需参数校验、工具授权、超时、有限重试、幂等、补偿和审计。不要在网关层自动重放可能产生副作用的完整 Agent 请求。

## 常见误区

- **网关只是 Nginx 换名字**：LLM 网关理解模型、token、流式与工具事件
- **统一接口后模型可以无损替换**：能力、上下文、Schema 支持和安全策略不同
- **所有请求都适合缓存**：身份、时效和随机性会影响正确性
- **网关重试越多越稳定**：长尾延迟、成本和副作用都可能增加

## 面试追问

**追问：你会重点监控哪些指标？**

按模型和租户统计成功率、首 token 延迟、总延迟、token、成本、限流、重试、路由切换和工具事件解析失败。

**追问：怎样避免网关成为单点故障？**

部署无状态副本、外置限流与配置状态、做健康探测和分区降级，并保留经过审计的直连应急路径。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

LLM 网关位于应用与模型供应商之间，把不同认证、请求格式、流式事件和错误码转换成统一接口，并实施模型路由、限流、预算、重试、熔断、观测和策略。它比通用反向代理更理解 token、模型、流式响应、工具调用和供应商错误。

网关适合多团队、多模型与集中治理场景。它不能提升模型质量，也不能代替 Agent 编排和工具授权。是否采用要根据供应商数量、合规要求、运维能力和额外延迟评估。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 协议与路由
不同供应商的消息角色、工具调用、流式事件、用量和错误模型不同。

### 治理与成本
网关可集中验证应用身份、分配模型允许名单、限制请求与 token、设置租户预算，并记录供应商用量。

### 观测与可靠性
网关可以记录首 token 延迟、总延迟、输入输出 token、错误类型、重试和路由结果。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

先用影子流量或回放评估协议兼容和延迟，再逐步接管路由。保留供应商原始错误和 request ID，避免统一错误码抹掉定位信息。日志默认脱敏，敏感 Prompt 与 Tool 参数应可选择不落盘。

涉及工具调用时，网关要原样保持调用 ID 和事件顺序。应用仍需参数校验、工具授权、超时、有限重试、幂等、补偿和审计。不要在网关层自动重放可能产生副作用的完整 Agent 请求。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **网关只是 Nginx 换名字**：LLM 网关理解模型、token、流式与工具事件
- **统一接口后模型可以无损替换**：能力、上下文、Schema 支持和安全策略不同
- **所有请求都适合缓存**：身份、时效和随机性会影响正确性
- **网关重试越多越稳定**：长尾延迟、成本和副作用都可能增加

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
- 16. 有没有用过大模型的网关框架？网关层解决了什么问题？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
