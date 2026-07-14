---
title: "5. 什么是大模型项目的分词器？原理是什么？"
topic: "large language model engineering"
data_type: "system"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

解释 Tokenizer 的训练、编码与解码流程，并比较 BPE、WordPiece、Unigram 和字节回退

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 说明“什么是大模型项目的分词器？原理是什么？”的组成部分及其关系
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

- SentencePiece 能直接在原始句子上训练 BPE 或 Unigram，并将空格作为普通符号处理。许多现代分词器还使用字节级基础符号或 byte fallback，确保任意 UTF-8 输入可编码，代价是罕见字符可能拆成更多 Token。

## Source Evidence (Verbatim)

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
