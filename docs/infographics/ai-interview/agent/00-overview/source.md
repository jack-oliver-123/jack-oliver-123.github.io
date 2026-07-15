---
title: "Agent 面试题介绍"
description: "覆盖 Agent 基础架构、规划、记忆、多 Agent、评测、持久化、安全、人审与 Computer Use 的 22 道工程面试题"
tags: ["AI应用开发", "Agent"]
draft: false
featured: false
---

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

## 参考资料

- [Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents)
- [OpenAI：Agents SDK 指南](https://platform.openai.com/docs/guides/agents)
- [Model Context Protocol：Specification](https://modelcontextprotocol.io/specification/2025-11-25)
