---
title: "大模型工程面试题介绍"
description: "覆盖大模型基础、训练、后训练、推理优化、部署、评测与 2026 年新增工程主题的 31 道面试题"
tags: ["AI应用开发", "大模型工程", "面试题"]
draft: false
featured: false
---

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

## 参考资料

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110)
- [vLLM documentation](https://docs.vllm.ai/)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
