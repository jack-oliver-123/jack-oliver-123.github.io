---
title: "2. 讲讲 Transformer 架构基本原理？Encoder 和 Decoder 是什么？"
topic: "large language model engineering"
data_type: "system"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

解释 Transformer 的注意力、前馈网络、残差和归一化，并比较 Encoder、Decoder 与 Encoder-Decoder

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 说明“讲讲 Transformer 架构基本原理？Encoder 和 Decoder 是什么？”的组成部分及其关系
2. 说明关键工程边界、失败模式与验证方法

## Target Audience

- **Knowledge Level**: Intermediate to Expert
- **Context**: 准备 AI 应用开发与大模型工程面试
- **Expectations**: 在短时间内建立可口述、可追问、可落地的答案结构

## Content Type Analysis

- **Data Structure**: system
- **Key Relationships**: 核心概念、工程实现、边界条件与常见误区之间的关系
- **Visual Opportunities**: 使用原文流程、比较表、组件关系、指标或分区摘要进行可视化

## Key Data Points (Verbatim)

- 标准全注意力对长度 $n$ 的注意力矩阵计算和内存复杂度为 $O(n^2)$。FlashAttention、稀疏注意力和分块策略可改变实际内存访问或计算范围，但不能把所有实现都概括为线性复杂度。

## Source Evidence (Verbatim)

## 60 秒回答

Transformer 用注意力在序列位置之间交换信息，再用逐位置前馈网络变换表示。每层还包含残差连接和归一化。Encoder 能双向读取输入，适合理解和表征；Decoder 使用因果掩码，只读取当前位置之前的 Token，适合自回归生成；Encoder-Decoder 先编码输入，再由 Decoder 通过交叉注意力生成输出，常用于翻译等条件生成任务。

现代 LLM 多采用 Decoder-only，但具体实现会调整归一化位置、激活函数、位置编码和注意力结构。因此，Transformer 是一个架构族，不是一套固定不变的层定义。

## 详细解析

给定隐藏状态 $X$，单个注意力头先做线性投影：

$$
Q=XW_Q,\quad K=XW_K,\quad V=XW_V
$$

然后计算缩放点积注意力：

$$
\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}+M\right)V
$$

$M$ 是掩码。Encoder 通常允许所有有效位置互相注意；Decoder 的因果掩码会屏蔽未来位置。多头注意力并行学习不同投影，再拼接回模型维度。

注意力之后是前馈网络（Feed-Forward Network，FFN）。原始 Transformer 使用两层线性变换和 ReLU，许多 LLM 改用 SwiGLU 等门控 FFN。残差连接保留输入路径，LayerNorm 或 RMSNorm 控制数值尺度。Pre-Norm 把归一化放在子层前，深层训练通常更稳定；Post-Norm 是原始论文结构，两者不能仅凭名称判断效果。

三种主干结构的差异如下：

| 结构 | 可见上下文 | 典型训练目标 | 常见用途 |
|---|---|---|---|
| Encoder-only | 双向输入 | 掩码建模、判别目标 | 表征、分类、检索 |
| Decoder-only | 因果前缀 | 下一个 Token 预测 | 对话、代码、通用生成 |
| Encoder-Decoder | 编码端双向，解码端因果 | 条件生成 | 翻译、摘要、文本转换 |

## 工程实践与边界

标准全注意力对长度 $n$ 的注意力矩阵计算和内存复杂度为 $O(n^2)$。FlashAttention、稀疏注意力和分块策略可改变实际内存访问或计算范围，但不能把所有实现都概括为线性复杂度。

自回归服务通常缓存历史 Key 和 Value，避免每次生成都重算前缀。Encoder 场景则更适合批处理。部署前应结合输入长度、输出长度、批大小和硬件测量吞吐，而不是仅按“Decoder-only 更先进”选型。

## 常见误区

- **把注意力当作解释**：注意力权重是模型计算的一部分，不等同于可靠的人类可解释性
- **忽略 FFN**：FFN 占据大量参数和计算，Transformer 不只有注意力
- **认为 Encoder 不能生成**：它可参与 Encoder-Decoder 生成，只是不按 Decoder 的因果方式独立续写
- **认为所有 LLM 层完全相同**：归一化、门控、位置编码和 KV 头设计存在显著差异

## 面试追问

**问：Decoder 训练时为什么能并行，生成时却逐 Token？**

**答：** 训练时整段目标已知，因果掩码允许并行计算所有位置的损失；生成时下一个 Token 依赖刚生成的结果，因此存在顺序依赖。

**问：残差连接解决什么问题？**

**答：** 它为信号和梯度提供恒等路径，减轻深层优化难度。它不能单独消除数值不稳定，仍需配合初始化、归一化和优化器设置。

## Layout × Style Signals

- Content type: system → suggests structural-breakdown
- Tone: 专业、教育、工程导向 → suggests technical-schematic
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: moderate → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：primary

## Recommended Combinations

1. **structural-breakdown + technical-schematic** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **hub-spoke + technical-schematic**: 可作为更强调关系或密度的备选
3. **bento-grid + hand-drawn-edu**: 可作为更强调工程细节的备选
