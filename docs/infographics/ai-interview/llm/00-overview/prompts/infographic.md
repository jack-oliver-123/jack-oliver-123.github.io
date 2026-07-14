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

# 大模型工程面试题介绍

## Overview

覆盖大模型基础、训练、后训练、推理优化、部署、评测与 2026 年新增工程主题的 31 道面试题

## Learning Objectives

The viewer will understand:

1. 建立“大模型工程面试题介绍”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

这套专题面向需要设计、训练、部署或评测大模型应用的工程师。31 道题从 Transformer 基础延伸到推理时计算、Prefill/Decode 分离、FP8/FP4、长上下文、多模态和结构化生成。每篇都提供 60 秒回答、原理、工程边界、误区和追问。

## 建议阅读路线

- **理解模型**：01-08，掌握语言建模、Transformer、注意力、位置编码、分词、训练和微调
- **掌握后训练与生成**：09-18，覆盖 LoRA、偏好优化、解码、缓存、量化、Prompt、CoT 和幻觉
- **负责生产部署**：19-28，关注 MoE、推理框架、评测、选型、Test-Time Compute、蒸馏、推测解码和 PD 分离
- **建设新型能力**：29-31，学习长上下文、多模态与约束解码

## 基础、架构与训练

1. [什么是大语言模型？和传统 NLP 模型有什么区别？](./01.什么是大语言模型？和传统 NLP 模型有什么区别？.md)
2. [讲讲 Transformer 架构基本原理？Encoder 和 Decoder 是什么？](./02.讲讲 Transformer 架构基本原理？Encoder 和 Decoder 是什么？.md)
3. [MHA 有哪些局限？MQA、GQA、Flash Attention 怎么解决？](./03.多头注意力（MHA）有哪些局限？MQA、GQA、Flash Attention 怎么解决？.md)
4. [位置编码有什么作用？sin/cos、RoPE、ALiBi 有什么区别？](./04.大模型的位置编码是干什么用的？sincos、RoPE、ALiBi 有什么区别？.md)
5. [什么是大模型项目的分词器？原理是什么？](./05.什么是大模型项目的分词器？原理是什么？.md)
6. [大模型是怎么训练出来的？](./06.大模型是怎么训练出来的？.md)
7. [什么是 Scaling Law？“涌现能力”是怎么回事？](./07.什么是 Scaling Law？大模型的「涌现能力」是怎么回事？.md)
8. [大模型微调的方案有哪些？](./08.大模型微调的方案有哪些？.md)

## 后训练、解码与可靠性

9. [LoRA 除了减少参数量，还有哪些优点？](./09.请讲一下 LoRA 技术，除了减少参数量，它还有哪些优点？.md)
10. [SFT 后的 RLHF、DPO、GRPO、拒绝采样是什么关系？](./10.SFT 之后还有哪些 Post-Training？RLHF、DPO、GRPO、拒绝采样什么关系？.md)
11. [DPO 和 PPO 有什么区别？](./11.大模型的 DPO 和 PPO 的区别是什么？.md)
12. [贪心、Beam Search、采样分别什么时候用？](./12.大模型生成文本时的解码策略有哪些？贪心、Beam Search、采样分别什么时候用？.md)
13. [Temperature、Top-p、Top-k 怎么设置？](./13.大模型的参数：温度值、Top-P、Top-K 分别是什么？各个场景下的最佳设置是什么？.md)
14. [KV Cache 与 Prompt Caching 的原理是什么？](./14.KV Cache 是什么？Prompt Caching 的原理是什么？.md)
15. [INT8、INT4、AWQ、GPTQ 怎么选？](./15.大模型量化是什么？INT8INT4AWQGPTQ 怎么选？.md)
16. [如何写好 Prompt？](./16.如何写好 Prompt？分享下 Prompt 工程实践经验？.md)
17. [什么是 CoT？它有什么局限？](./17.什么是 CoT？为啥效果好？它有什么缺点或局限性？.md)
18. [大模型为什么出现幻觉？怎么缓解？](./18.大模型为什么会出现幻觉？怎么缓解？.md)

## 部署、评测与 2026 工程主题

19. [MoE 是什么？DeepSeek V3、Qwen 为什么使用 MoE？](./19.MoE 混合专家模型是什么？DeepSeek V3、Qwen 为什么用 MoE？.md)
20. [vLLM、TGI、llama.cpp、SGLang 怎么选？](./20.大模型部署有哪些主流方案？vLLM、TGI、llama.cpp、SGLang 实际项目里怎么选？.md)
21. [大模型能力评测指标有哪些？](./21.大模型能力评测指标有哪些？.md)
22. [项目中如何对比和选择主流模型？](./22.对比使用过哪些主流大模型？你们项目中最终选用了哪个模型？为什么？.md)
23. [什么是推理模型和 Test-Time Compute？](./23.什么是推理模型和 Test-Time Compute？为什么增加推理计算能提升效果？.md)
24. [知识蒸馏和合成数据怎么用？有哪些风险？](./24.知识蒸馏和合成数据在大模型训练中怎么用？有哪些风险？.md)
25. [什么是 Speculative Decoding？](./25.什么是 Speculative Decoding？Draft Model、验证和加速比怎么理解？.md)
26. [Prefix Cache、KV Cache 和 Semantic Cache 有什么区别？](./26.Prefix Cache、KV Cache 和 Semantic Cache 有什么区别？.md)
27. [Prefill 和 Decode 为什么要分离？](./27.Prefill 和 Decode 为什么要分离？TTFT、TPOT 和吞吐怎么权衡？.md)
28. [FP8、FP4 和 INT4 有什么区别？](./28.FP8、FP4 和 INT4 有什么区别？训练与推理量化怎么选？.md)
29. [长上下文模型如何扩展和评测？](./29.长上下文模型是怎么扩展的？如何评测有效上下文长度？.md)
30. [多模态大模型如何对齐文本、图像、音频和视频？](./30.多模态大模型如何对齐文本、图像、音频和视频？.md)
31. [什么是约束解码和结构化生成？](./31.什么是约束解码和结构化生成？如何保证输出满足 Schema？.md)

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 建议阅读路线

**Key Concept**: 建议阅读路线

**Content**:

- **理解模型**：01-08，掌握语言建模、Transformer、注意力、位置编码、分词、训练和微调
- **掌握后训练与生成**：09-18，覆盖 LoRA、偏好优化、解码、缓存、量化、Prompt、CoT 和幻觉
- **负责生产部署**：19-28，关注 MoE、推理框架、评测、选型、Test-Time Compute、蒸馏、推测解码和 PD 分离
- **建设新型能力**：29-31，学习长上下文、多模态与约束解码

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "建议阅读路线"

---

### Visual Section 2: 基础、架构与训练

**Key Concept**: 基础、架构与训练

**Content**:

1. 什么是大语言模型？和传统 NLP 模型有什么区别？
2. 讲讲 Transformer 架构基本原理？Encoder 和 Decoder 是什么？
3. MHA 有哪些局限？MQA、GQA、Flash Attention 怎么解决？
4. 位置编码有什么作用？sin/cos、RoPE、ALiBi 有什么区别？

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "基础、架构与训练"

---

### Visual Section 3: 后训练、解码与可靠性

**Key Concept**: 后训练、解码与可靠性

**Content**:

9. LoRA 除了减少参数量，还有哪些优点？
10. SFT 后的 RLHF、DPO、GRPO、拒绝采样是什么关系？
11. DPO 和 PPO 有什么区别？
12. 贪心、Beam Search、采样分别什么时候用？

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "后训练、解码与可靠性"

---

### Visual Section 4: 部署、评测与 2026 工程主题

**Key Concept**: 部署、评测与 2026 工程主题

**Content**:

19. MoE 是什么？DeepSeek V3、Qwen 为什么使用 MoE？
20. vLLM、TGI、llama.cpp、SGLang 怎么选？
21. 大模型能力评测指标有哪些？
22. 项目中如何对比和选择主流模型？

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "部署、评测与 2026 工程主题"

---

## Data Points (Verbatim)

- **理解模型**：01-08，掌握语言建模、Transformer、注意力、位置编码、分词、训练和微调
- **掌握后训练与生成**：09-18，覆盖 LoRA、偏好优化、解码、缓存、量化、Prompt、CoT 和幻觉
- **负责生产部署**：19-28，关注 MoE、推理框架、评测、选型、Test-Time Compute、蒸馏、推测解码和 PD 分离
- **建设新型能力**：29-31，学习长上下文、多模态与约束解码

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
- 大模型工程面试题介绍
- 建议阅读路线
- 基础、架构与训练
- 后训练、解码与可靠性
- 部署、评测与 2026 工程主题
