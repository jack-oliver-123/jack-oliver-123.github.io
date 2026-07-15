---
title: "LLM工具调用面试题介绍"
description: "覆盖 Function Calling、MCP、Agent Skill、A2A、实时通信、网关、OAuth 和安全工具执行的 23 道工程面试题"
tags: ["AI应用开发", "LLM工具调用"]
draft: false
featured: false
---

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

## 参考资料

- [OpenAI Function calling 指南](https://platform.openai.com/docs/guides/function-calling)
- [MCP 2025-11-25 规范](https://modelcontextprotocol.io/specification/2025-11-25)
- [Agent Skills 规范](https://agentskills.io/specification)
- [A2A latest specification](https://a2a-protocol.org/latest/specification/)
