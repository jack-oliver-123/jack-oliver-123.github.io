Create a professional infographic following these specifications:

## Image Specifications

- **Type**: Infographic
- **Layout**: structural-breakdown
- **Style**: technical-schematic
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

# structural-breakdown

Internal structure visualization with labeled parts or layers.

## Structure

- Central subject (object, system, body)
- Parts or layers clearly shown
- Labels with callout lines
- Exploded or cutaway view
- Optional zoomed detail sections

## Variants

| Variant | View Type | Visual Emphasis |
|---------|-----------|-----------------|
| **Exploded** | Parts separated outward | Component relationships |
| **Cross-section** | Sliced/cutaway view | Internal layers, composition |

## Best For

- Product part breakdowns
- Anatomy explanations
- System components
- Device teardowns
- Material composition

## Visual Elements

- Main subject clearly rendered
- Callout lines with dots/arrows
- Label boxes at endpoints
- Numbered parts optionally
- Layer boundaries or separation

## Text Placement

- Title at top
- Part/layer labels at callouts
- Brief descriptions in boxes
- Legend for numbered systems
- Depth/thickness if relevant

## Recommended Pairings

- `technical-schematic`: Technical schematics
- `aged-academia`: Classic anatomical style
- `craft-handmade`: Friendly breakdowns


## Style Guidelines

# technical-schematic

Technical diagrams with engineering precision and clean geometry.

## Color Palette

- Primary: Blues (#2563EB), teals, grays, white lines
- Background: Deep blue (#1E3A5F), white, or light gray with grid
- Accents: Amber highlights (#F59E0B), cyan callouts

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Blueprint** | Engineering schematics | White on blue, measurements, grid |
| **Isometric** | 3D spatial representation | 30° angle blocks, clean fills |

## Visual Elements

- Geometric precision throughout
- Grid pattern or isometric angle
- Dimension lines and measurements
- Technical symbols and annotations
- Clean vector shapes
- Consistent stroke weights

## Typography

- Technical stencil or clean sans-serif
- All-caps labels
- Measurement annotations
- Floating labels for isometric

## Best For

Technical architecture, system diagrams, engineering specs, product breakdowns, data visualization


---

Generate the infographic based on the content below:

# 5. 什么是大模型项目的分词器？原理是什么？

## Overview

解释 Tokenizer 的训练、编码与解码流程，并比较 BPE、WordPiece、Unigram 和字节回退

## Learning Objectives

The viewer will understand:

1. 说明“什么是大模型项目的分词器？原理是什么？”的组成部分及其关系
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

分词器（Tokenizer）把原始文本转换为模型词表中的 Token ID，并把生成的 ID 解码回文本。它通常包含 Unicode 规范化、预分词、子词切分、特殊 Token 和聊天模板。字节对编码（Byte Pair Encoding，BPE）、WordPiece 与 Unigram 都用有限词表覆盖开放文本，但训练目标和切分规则不同。

分词器是模型协议的一部分。词表或特殊 Token 对不上，即使模型权重正确也会输出异常。词表越大不代表效果越好，它会在序列长度、Embedding 参数、稀有词覆盖和多语言公平性之间产生取舍。

## 详细解析

BPE 从基础符号开始，反复合并训练语料中高频的相邻符号对，最终用合并规则编码。WordPiece 也构造子词词表，但经典实现按语言模型似然或相关评分选择候选合并。Unigram 从较大的候选词表出发，基于概率模型逐步删除影响较小的片段，并可通过动态规划寻找高概率切分。

SentencePiece 能直接在原始句子上训练 BPE 或 Unigram，并将空格作为普通符号处理。许多现代分词器还使用字节级基础符号或 byte fallback，确保任意 UTF-8 输入可编码，代价是罕见字符可能拆成更多 Token。

生产编码链路通常包括：

1. 规范化 Unicode 与可选空白规则
2. 按模型规则做预分词
3. 应用子词模型得到 Token
4. 插入 BOS、EOS、角色和工具等特殊 Token
5. 映射为整数 ID，并生成注意力掩码

聊天模板也属于输入协议。相同消息使用不同角色标记或终止符，会改变模型看到的 Token 序列。

## 工程实践与边界

评估分词器时，按真实语料统计每字符 Token 数、截断率、不同语言和代码的膨胀率，并检查数字、URL、JSON 与领域术语。训练新词表后通常需要调整模型 Embedding，并重新训练或适配，不能只替换配置文件。

日志不要直接记录含个人信息的原文。服务端还应限制编码后长度，因为短字符串可能在特殊字符或罕见脚本下展开为大量 Token。

## 常见误区

- **把 Token 等同于单词**：中文、代码和罕见字符常按子词或字节切分
- **认为词表越大越省成本**：大词表可能缩短序列，也会增加输出层参数与稀疏词学习难度
- **忽略聊天模板**：角色标记和终止符错误会直接影响行为
- **用字符数估算上下文**：计费和窗口通常以模型 Token 为单位

## 面试追问

**问：为什么同一句话在两个模型中 Token 数不同？**

**答：** 两者可能使用不同规范化、预分词、词表和合并规则。Token ID 只在对应模型协议内有意义。

**问：字节回退解决什么问题？**

**答：** 它让未登录字符仍可由字节序列表示，避免未知 Token，但可能增加序列长度并降低罕见文本效率。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

分词器（Tokenizer）把原始文本转换为模型词表中的 Token ID，并把生成的 ID 解码回文本。它通常包含 Unicode 规范化、预分词、子词切分、特殊 Token 和聊天模板。字节对编码（Byte Pair Encoding，BPE）、WordPiece 与 Unigram 都用有限词表覆盖开放文本，但训练目标和切分规则不同。

分词器是模型协议的一部分。词表或特殊 Token 对不上，即使模型权重正确也会输出异常。词表越大不代表效果越好，它会在序列长度、Embedding 参数、稀有词覆盖和多语言公平性之间产生取舍。

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

BPE 从基础符号开始，反复合并训练语料中高频的相邻符号对，最终用合并规则编码。WordPiece 也构造子词词表，但经典实现按语言模型似然或相关评分选择候选合并。Unigram 从较大的候选词表出发，基于概率模型逐步删除影响较小的片段，并可通过动态规划寻找高概率切分。

SentencePiece 能直接在原始句子上训练 BPE 或 Unigram，并将空格作为普通符号处理。许多现代分词器还使用字节级基础符号或 byte fallback，确保任意 UTF-8 输入可编码，代价是罕见字符可能拆成更多 Token。

生产编码链路通常包括：

1. 规范化 Unicode 与可选空白规则
2. 按模型规则做预分词
3. 应用子词模型得到 Token
4. 插入 BOS、EOS、角色和工具等特殊 Token

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

评估分词器时，按真实语料统计每字符 Token 数、截断率、不同语言和代码的膨胀率，并检查数字、URL、JSON 与领域术语。训练新词表后通常需要调整模型 Embedding，并重新训练或适配，不能只替换配置文件。

日志不要直接记录含个人信息的原文。服务端还应限制编码后长度，因为短字符串可能在特殊字符或罕见脚本下展开为大量 Token。

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **把 Token 等同于单词**：中文、代码和罕见字符常按子词或字节切分
- **认为词表越大越省成本**：大词表可能缩短序列，也会增加输出层参数与稀疏词学习难度
- **忽略聊天模板**：角色标记和终止符错误会直接影响行为
- **用字符数估算上下文**：计费和窗口通常以模型 Token 为单位

**Visual Element**: Type: labeled system component; Subject: 原文组件与关系；Treatment: 中心结构配合标注线

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- SentencePiece 能直接在原始句子上训练 BPE 或 Unigram，并将空格作为普通符号处理。许多现代分词器还使用字节级基础符号或 byte fallback，确保任意 UTF-8 输入可编码，代价是罕见字符可能拆成更多 Token。

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
- 5. 什么是大模型项目的分词器？原理是什么？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
