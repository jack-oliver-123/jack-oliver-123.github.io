---
title: "大模型面试题"
topic: "AI application engineering"
data_type: "overview"
complexity: "complex"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

面向 2026 年 AI 应用开发岗位的 107 篇系统面试专题，覆盖 Agent、RAG、工具调用与大模型工程

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 建立“大模型面试题”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

## Target Audience

- **Knowledge Level**: Intermediate to Expert
- **Context**: 准备 AI 应用开发与大模型工程面试
- **Expectations**: 在短时间内建立可口述、可追问、可落地的答案结构

## Content Type Analysis

- **Data Structure**: overview
- **Key Relationships**: 核心概念、工程实现、边界条件与常见误区之间的关系
- **Visual Opportunities**: 使用原文流程、比较表、组件关系、指标或分区摘要进行可视化

## Key Data Points (Verbatim)

- 先读[大模型与传统 NLP 的区别](./04.大模型工程面试专题/01.什么是大语言模型？和传统 NLP 模型有什么区别？.md)和[Prompt 工程](./04.大模型工程面试专题/16.如何写好 Prompt？分享下 Prompt 工程实践经验？.md)，再完成 Agent 01-08 的概念、范式和记忆。随后学习工具调用 01-23，最后重点复习 Agent 18-22 的评测、持久化、安全、人审和 Computer Use。
- 先完成 RAG 01-14 的索引、Embedding、向量库、混合检索和 Query Rewrite，再读 16-20 的 Graph、评测与更新。生产岗位还应掌握 RAG 21-26 的 Agentic RAG、多模态、权限隔离、Late Interaction、GraphRAG 和长上下文选型。
- 先完成大模型工程 01-16 的架构、训练、后训练、解码、缓存与量化，再读 19-22 的 MoE、部署、评测和模型选型。2026 新题集中在 23-31，覆盖 Test-Time Compute、蒸馏、Speculative Decoding、缓存分层、PD 分离、FP8/FP4、长上下文、多模态和约束解码。

## Source Evidence (Verbatim)

这套内容共 107 页：1 篇总览、4 篇专题介绍和 102 道面试题。它面向 Agent 开发、RAG 工程和大模型工程岗位，也适合需要接入 LLM 的后端与平台工程师。现有题目已独立重写，并补入 2026 年生产系统更常讨论的评测、安全、持久化、MCP 2025-11-25、推理时计算、Prefill/Decode 分离和结构化生成。

每道题提供 60 秒回答、详细解析、工程实践与边界、常见误区、面试追问和官方/原始资料。正文不使用旧稿来源和第三方配图；信息图按统一视觉系统生成，并通过 PicGo 公网链接插入文章。

## 按岗位选择阅读路线

### Agent 应用开发

先读[大模型与传统 NLP 的区别](./04.大模型工程面试专题/01.什么是大语言模型？和传统 NLP 模型有什么区别？.md)和[Prompt 工程](./04.大模型工程面试专题/16.如何写好 Prompt？分享下 Prompt 工程实践经验？.md)，再完成 Agent 01-08 的概念、范式和记忆。随后学习工具调用 01-23，最后重点复习 Agent 18-22 的评测、持久化、安全、人审和 Computer Use。

### RAG 工程

先完成 RAG 01-14 的索引、Embedding、向量库、混合检索和 Query Rewrite，再读 16-20 的 Graph、评测与更新。生产岗位还应掌握 RAG 21-26 的 Agentic RAG、多模态、权限隔离、Late Interaction、GraphRAG 和长上下文选型。

### 大模型工程

先完成大模型工程 01-16 的架构、训练、后训练、解码、缓存与量化，再读 19-22 的 MoE、部署、评测和模型选型。2026 新题集中在 23-31，覆盖 Test-Time Compute、蒸馏、Speculative Decoding、缓存分层、PD 分离、FP8/FP4、长上下文、多模态和约束解码。

## Agent 面试专题

[专题介绍](./01.Agent面试专题/00.专题介绍.md)

1. [什么是 Agent？与大模型有什么本质不同？](./01.Agent面试专题/01.什么是 Agent？与大模型有什么本质不同？.md)
2. [Agent 的基本架构由哪些核心组件构成？](./01.Agent面试专题/02.Agent 的基本架构由哪些核心组件构成？.md)
3. [Workflow、Agent、Tools 的概念和区别是什么？](./01.Agent面试专题/03.Workflow，Agent，Tools 这三个的概念和区别介绍一下？.md)
4. [Agent 设计范式与 Workflow 有什么区别？](./01.Agent面试专题/04.了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什么？.md)
5. [Agent 推理模式有哪些？ReAct 怎么实现？](./01.Agent面试专题/05.Agent 推理模式有哪些？ReAct 是啥？具体是怎么实现的？.md)
6. [ReAct、Plan-and-Execute、Reflection 怎么选？](./01.Agent面试专题/06.ReAct、Plan-and-Execute、Reflection 三种范式有什么核心区别？实际项目中该如何选型？.md)
7. [复杂任务如何拆分？](./01.Agent面试专题/07.复杂任务怎么做的任务拆分？为什么要拆分？效果如何提升？.md)
8. [如何设计 Agent 记忆模块？](./01.Agent面试专题/08.请你介绍一下 AI Agent 的记忆机制，并说明在实际开发中应该如何设计记忆模块？.md)
9. [长短期记忆如何存储和使用？](./01.Agent面试专题/09.Agent 的长短期记忆系统怎么做的？记忆是怎么存的？粒度是多少？怎么用的？.md)
10. [什么是 Multi-Agent？](./01.Agent面试专题/10.什么是 Multi-Agent？.md)
11. [Single-Agent 和 Multi-Agent 如何设计？](./01.Agent面试专题/11.说说 Single-Agent 和 Multi-Agent 的设计方案？.md)
12. [Agent 记忆压缩有哪些方法？](./01.Agent面试专题/12.Agent 记忆压缩通常有哪些方法？.md)
13. [为什么有时选择自研 Agent 而不是成熟框架？](./01.Agent面试专题/13.在工程实践中，为什么有时候选择「手搓」Agent，而不是直接用成熟框架？.md)
14. [如何赋予 LLM 规划能力？](./01.Agent面试专题/14.如何赋予 LLM 规划能力？.md)
15. [Agent 反思机制如何实现？](./01.Agent面试专题/15.讲讲 Agent 的反思机制？为什么要用反思？具体怎么实现？.md)
16. [如何设计多 Agent 协作与动态切换？](./01.Agent面试专题/16.如何设计多 Agent 的协作与动态切换机制？.md)
17. [Context Engineering 与 Prompt Engineering 有什么区别？](./01.Agent面试专题/17.Context Engineering 与 Prompt Engineering 有什么区别？.md)
18. [如何系统化评测 Agent？](./01.Agent面试专题/18.如何系统化评测 Agent？.md)
19. [长时运行 Agent 如何持久化、恢复与观测？](./01.Agent面试专题/19.长时运行 Agent 如何做持久化、恢复与可观测性？.md)
20. [如何防范 Prompt Injection、工具滥用与数据泄露？](./01.Agent面试专题/20.如何防范 Prompt Injection、工具滥用与敏感数据泄露？.md)
21. [Human-in-the-Loop 如何设计审批边界？](./01.Agent面试专题/21.Human-in-the-Loop 应该如何设计审批边界？.md)
22. [如何提升 Computer Use Agent 的可靠性？](./01.Agent面试专题/22.如何提升 Computer Use Agent 的可靠性？.md)

## RAG 面试专题

[专题介绍](./02.RAG面试专题/00.专题介绍.md)

1. [什么是 RAG？完整流程是什么？](./02.RAG面试专题/01.什么是 RAG？详细描述一个完整 RAG 系统的详细工作流程？.md)
2. [RAG 主要解决什么问题？](./02.RAG面试专题/02.大模型的 RAG 主要用来解决什么问题？.md)
3. [RAG 与微调怎么选？](./02.RAG面试专题/03.相比直接微调 LLM，RAG 解决了什么问题？微调和 RAG 各自的优劣势是什么？.md)
4. [RAG 文档如何切分？](./02.RAG面试专题/04.RAG 中的文档是怎么存的？粒度是多大？详细说说文档切割（Chunking）策略？.md)
5. [如何避免切断语义？](./02.RAG面试专题/05.怎么规避语义被切割掉的问题？.md)
6. [如何选择和评估 Embedding 模型？](./02.RAG面试专题/06.在 RAG 中 Embedding 究竟是什么？如何选择和评估一个 Embedding 模型？.md)
7. [Embedding 有哪些算法？](./02.RAG面试专题/07.Embedding 有哪几种算法你了解过吗？.md)
8. [如何对比选型向量数据库？](./02.RAG面试专题/08.什么是向量数据库？有没有做过向量数据库的对比选型？.md)
9. [如何评估向量数据库规模与性能？](./02.RAG面试专题/09.讲讲你用的向量数据库？数据量级是多大？性能如何？遇到过性能瓶颈吗？.md)
10. [RAG 在线工作流是什么？](./02.RAG面试专题/10.你使用 RAG 给大模型一个输入，系统是怎样的工作流程？.md)
11. [向量检索和关键词检索有什么区别？](./02.RAG面试专题/11.请你介绍一下向量检索和关键词检索的区别？.md)
12. [Query Rewrite 的目的和方法是什么？](./02.RAG面试专题/12.如何润色用户的 Query（Query Rewrite）？目的是什么？.md)
13. [什么是多路召回？](./02.RAG面试专题/13.什么是多路召回？具体怎么做？.md)
14. [RAG 检索优化策略有哪些？](./02.RAG面试专题/14.RAG 检索优化策略有哪些？.md)
15. [复杂 RAG 范式有哪些？](./02.RAG面试专题/15.了解哪些更复杂的 RAG 范式？.md)
16. [什么时候用图数据库增强检索？](./02.RAG面试专题/16.在什么场景下，你会选择使用图数据库来增强传统的向量检索？.md)
17. [如何降低 RAG 幻觉？](./02.RAG面试专题/17.如何规避 RAG 系统中大模型的幻觉？.md)
18. [如何量化 RAG 效果？](./02.RAG面试专题/18.怎么量化你的 RAG 效果？.md)
19. [知识库如何动态更新？](./02.RAG面试专题/19.RAG 知识库如何实现动态与持续更新？.md)
20. [RAG 生产落地最难的部分是什么？](./02.RAG面试专题/20.在实际落地中，你觉得 RAG 最难的地方是哪里？.md)
21. [什么是 Agentic RAG？](./02.RAG面试专题/21.什么是 Agentic RAG？它和传统 RAG 有什么区别？.md)
22. [多模态 RAG 如何处理 PDF、表格、图片和 OCR？](./02.RAG面试专题/22.多模态 RAG 如何处理 PDF、表格、图片和 OCR 内容？.md)
23. [RAG 如何做权限隔离并防御注入与投毒？](./02.RAG面试专题/23.RAG 系统如何做权限隔离并防御提示注入与知识库投毒？.md)
24. [Late Interaction 与 ColBERT 何时值得使用？](./02.RAG面试专题/24.什么是 Late Interaction 和多向量检索？什么时候值得使用 ColBERT？.md)
25. [GraphRAG 如何处理消歧、增量更新和成本？](./02.RAG面试专题/25.GraphRAG 如何在生产环境处理实体消歧、增量更新和成本问题？.md)
26. [长上下文模型能替代 RAG 吗？](./02.RAG面试专题/26.长上下文模型能替代 RAG 吗？实际项目中怎么选？.md)

## LLM 工具调用面试专题

[专题介绍](./03.LLM工具调用面试专题/00.专题介绍.md)

1. [什么是 Function Calling？](./03.LLM工具调用面试专题/01.什么是 Function Calling ？原理是什么？.md)
2. [LLM 如何学会调用工具？](./03.LLM工具调用面试专题/02.LLM 是如何学会调用外部工具的？.md)
3. [Function Call 能力如何训练？](./03.LLM工具调用面试专题/03.大模型的 Function Call 能力是怎么训练出来的？.md)
4. [什么是 MCP？](./03.LLM工具调用面试专题/04.什么是 MCP（模型上下文协议）？讲讲它的核心内容？.md)
5. [MCP 由哪些部分组成？](./03.LLM工具调用面试专题/05.MCP 由哪几部分组成？.md)
6. [MCP 和 Function Calling 有什么区别？](./03.LLM工具调用面试专题/06.MCP 和 Function Calling 有什么区别？有没有实际跑过 MCP？.md)
7. [Function Calling 和 MCP 如何选？](./03.LLM工具调用面试专题/07.Function Calling 也属于工具调用，请问什么场景下使用 Function Calling，什么场景下使用 MCP？.md)
8. [推理模型与 MCP 支持是什么关系？](./03.LLM工具调用面试专题/08.为什么有些特定的推理模型不支持 MCP 协议？.md)
9. [Skill 是什么？](./03.LLM工具调用面试专题/09.Skill 是什么？.md)
10. [MCP 和 Agent Skill 有什么区别？](./03.LLM工具调用面试专题/10.MCP 和 Agent Skill 的区别是什么？.md)
11. [Function Calling、Skill、MCP 有什么区别？](./03.LLM工具调用面试专题/11.Function Calling、Skill、MCP 这三个有什么区别？.md)
12. [A2A 和 MCP 有什么区别？](./03.LLM工具调用面试专题/12.什么是 A2A 协议？它和 MCP 协议的区别是什么？.md)
13. [MCP 采用什么通信方式？](./03.LLM工具调用面试专题/13.MCP 协议通常采用什么通信方式？.md)
14. [WebSocket 和 SSE 有什么区别？](./03.LLM工具调用面试专题/14.说说 WebSocket 和 SSE 通信的区别及局限性？.md)
15. [WebRTC 和 WebSocket 在 AI 对话流中有什么区别？](./03.LLM工具调用面试专题/15.为什么要用 WebRTC 协议？它和 WebSocket（WS）在 AI 对话流中的核心差异是什么？.md)
16. [LLM 网关解决什么问题？](./03.LLM工具调用面试专题/16.有没有用过大模型的网关框架？网关层解决了什么问题？.md)
17. [Structured Outputs、JSON Mode 和 Function Calling 有什么区别？](./03.LLM工具调用面试专题/17.Structured Outputs、JSON Mode 和 Function Calling 有什么区别？.md)
18. [如何设计高质量工具 Schema？](./03.LLM工具调用面试专题/18.如何设计高质量的工具 Schema？.md)
19. [并行工具调用如何处理超时、重试、幂等与补偿？](./03.LLM工具调用面试专题/19.并行工具调用中如何处理超时、重试、幂等与补偿？.md)
20. [如何设计安全工具执行环境？](./03.LLM工具调用面试专题/20.如何设计安全的工具执行环境？.md)
21. [MCP OAuth 授权流程是什么？](./03.LLM工具调用面试专题/21.MCP OAuth 授权流程是怎样的？.md)
22. [MCP 如何管理生命周期、能力协商与版本？](./03.LLM工具调用面试专题/22.MCP 如何管理生命周期、能力协商与协议版本？.md)
23. [MCP 的 Sampling、Elicitation 和 Roots 是什么？](./03.LLM工具调用面试专题/23.MCP 的 Sampling、Elicitation 和 Roots 是什么？.md)

## 大模型工程面试专题

[专题介绍](./04.大模型工程面试专题/00.专题介绍.md)

1. [什么是大语言模型？和传统 NLP 有什么区别？](./04.大模型工程面试专题/01.什么是大语言模型？和传统 NLP 模型有什么区别？.md)
2. [Transformer、Encoder 和 Decoder 的原理是什么？](./04.大模型工程面试专题/02.讲讲 Transformer 架构基本原理？Encoder 和 Decoder 是什么？.md)
3. [MHA、MQA、GQA、Flash Attention 有什么区别？](./04.大模型工程面试专题/03.多头注意力（MHA）有哪些局限？MQA、GQA、Flash Attention 怎么解决？.md)
4. [sin/cos、RoPE、ALiBi 有什么区别？](./04.大模型工程面试专题/04.大模型的位置编码是干什么用的？sincos、RoPE、ALiBi 有什么区别？.md)
5. [大模型分词器的原理是什么？](./04.大模型工程面试专题/05.什么是大模型项目的分词器？原理是什么？.md)
6. [大模型如何训练？](./04.大模型工程面试专题/06.大模型是怎么训练出来的？.md)
7. [Scaling Law 和涌现能力是什么？](./04.大模型工程面试专题/07.什么是 Scaling Law？大模型的「涌现能力」是怎么回事？.md)
8. [大模型微调方案有哪些？](./04.大模型工程面试专题/08.大模型微调的方案有哪些？.md)
9. [LoRA 的原理和优点是什么？](./04.大模型工程面试专题/09.请讲一下 LoRA 技术，除了减少参数量，它还有哪些优点？.md)
10. [SFT、RLHF、DPO、GRPO、拒绝采样是什么关系？](./04.大模型工程面试专题/10.SFT 之后还有哪些 Post-Training？RLHF、DPO、GRPO、拒绝采样什么关系？.md)
11. [DPO 和 PPO 有什么区别？](./04.大模型工程面试专题/11.大模型的 DPO 和 PPO 的区别是什么？.md)
12. [贪心、Beam Search 和采样怎么选？](./04.大模型工程面试专题/12.大模型生成文本时的解码策略有哪些？贪心、Beam Search、采样分别什么时候用？.md)
13. [Temperature、Top-p、Top-k 怎么设置？](./04.大模型工程面试专题/13.大模型的参数：温度值、Top-P、Top-K 分别是什么？各个场景下的最佳设置是什么？.md)
14. [KV Cache 和 Prompt Caching 是什么？](./04.大模型工程面试专题/14.KV Cache 是什么？Prompt Caching 的原理是什么？.md)
15. [INT8、INT4、AWQ、GPTQ 怎么选？](./04.大模型工程面试专题/15.大模型量化是什么？INT8INT4AWQGPTQ 怎么选？.md)
16. [如何做好 Prompt 工程？](./04.大模型工程面试专题/16.如何写好 Prompt？分享下 Prompt 工程实践经验？.md)
17. [CoT 的作用和局限是什么？](./04.大模型工程面试专题/17.什么是 CoT？为啥效果好？它有什么缺点或局限性？.md)
18. [大模型幻觉如何治理？](./04.大模型工程面试专题/18.大模型为什么会出现幻觉？怎么缓解？.md)
19. [MoE 的路由、计算和部署边界是什么？](./04.大模型工程面试专题/19.MoE 混合专家模型是什么？DeepSeek V3、Qwen 为什么用 MoE？.md)
20. [vLLM、TGI、llama.cpp、SGLang 怎么选？](./04.大模型工程面试专题/20.大模型部署有哪些主流方案？vLLM、TGI、llama.cpp、SGLang 实际项目里怎么选？.md)
21. [大模型评测指标有哪些？](./04.大模型工程面试专题/21.大模型能力评测指标有哪些？.md)
22. [项目如何选择主流模型？](./04.大模型工程面试专题/22.对比使用过哪些主流大模型？你们项目中最终选用了哪个模型？为什么？.md)
23. [什么是推理模型和 Test-Time Compute？](./04.大模型工程面试专题/23.什么是推理模型和 Test-Time Compute？为什么增加推理计算能提升效果？.md)
24. [知识蒸馏和合成数据如何使用？](./04.大模型工程面试专题/24.知识蒸馏和合成数据在大模型训练中怎么用？有哪些风险？.md)
25. [Speculative Decoding 如何加速？](./04.大模型工程面试专题/25.什么是 Speculative Decoding？Draft Model、验证和加速比怎么理解？.md)
26. [Prefix、KV 和 Semantic Cache 有什么区别？](./04.大模型工程面试专题/26.Prefix Cache、KV Cache 和 Semantic Cache 有什么区别？.md)
27. [Prefill 和 Decode 为什么分离？](./04.大模型工程面试专题/27.Prefill 和 Decode 为什么要分离？TTFT、TPOT 和吞吐怎么权衡？.md)
28. [FP8、FP4 和 INT4 有什么区别？](./04.大模型工程面试专题/28.FP8、FP4 和 INT4 有什么区别？训练与推理量化怎么选？.md)
29. [长上下文如何扩展和评测？](./04.大模型工程面试专题/29.长上下文模型是怎么扩展的？如何评测有效上下文长度？.md)
30. [多模态大模型如何对齐？](./04.大模型工程面试专题/30.多模态大模型如何对齐文本、图像、音频和视频？.md)
31. [约束解码如何保证 Schema？](./04.大模型工程面试专题/31.什么是约束解码和结构化生成？如何保证输出满足 Schema？.md)

## Layout × Style Signals

- Content type: overview → suggests bento-grid
- Tone: 专业、教育、工程导向 → suggests hand-drawn-edu
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: complex → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：primary

## Recommended Combinations

1. **bento-grid + hand-drawn-edu** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **hub-spoke + hand-drawn-edu**: 可作为更强调关系或密度的备选
3. **dense-modules + pop-laboratory**: 可作为更强调工程细节的备选
