# AI 面试系列 2026 全面升级实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** 独立重写现有 79 篇 AI 面试文章，新增 28 篇 2026 年高价值题目、至少 107 张原创信息图及 PicGo 公开链接和自动内容检查，使 107 篇文章准确、原创、可维护并可通过 Astro 构建。

**Architecture:** 四个专题目录是独立内容工作流，分别完成事实研究、旧文重写、新题新增和专题导航更新。主工作流先提供可按文件运行的内容检查器，再用 baoyu-infographic 按四批生成信息图，通过 PicGo 上传并把 URL 写入文章，最后统一处理跨专题链接和全站验证。

**Tech Stack:** Astro 6、Markdown、Node.js 22、node:test、PowerShell、官方协议/项目文档、原始论文、浏览器 QA。

## Global Constraints

- 规格来源：docs/superpowers/specs/2026-07-11-ai-interview-series-refresh-design.md
- 所有可见内容使用简体中文，技术名称保留官方写法
- 不重命名任何现有文章；文件名和公开 URL 必须稳定
- 按当前工作树继续编辑，不恢复或覆盖用户已有改动
- 关键事实只使用官方规范、官方文档、项目仓库或原始论文
- 文章独立重写后才能删除“小林面试笔记”来源；最终不得残留相关域名或图片
- 普通技术题统一包含：60 秒回答、详细解析、工程实践与边界、常见误区、面试追问、参考资料
- 模拟对话最多 2 至 4 轮，语气专业，不嘲讽候选人
- 数字结论必须说明条件和来源；无法说明时改成定性结论
- 代码块必须标注语言，涉及副作用时说明校验、授权、超时、重试、幂等和注入风险
- MCP 以 2025-11-25 规范及实施时最新稳定规范为准；A2A 以实施时官方 latest specification 为准
- Git 未配置作者身份时不得自行修改配置；跳过提交并在交付说明中记录

---

### Task 1: 建立自动内容检查

**Files:**
- Create: scripts/content-lint/rules.mjs
- Create: scripts/lint-content.mjs
- Create: scripts/__tests__/lint-content.test.mjs
- Modify: package.json

**Interfaces:**
- Consumes: Markdown/MDX 文件路径、UTF-8 正文和检查根目录
- Produces: lintMarkdown(input)、lintNumbering(files)、formatDiagnostic(diagnostic)；CLI 默认扫描整个 AI应用开发 目录，也接受一个或多个文件/目录参数

- [ ] **Step 1: 写失败测试**

使用 Node 内置测试覆盖：合法文章通过；缺 frontmatter；无语言代码围栏；围栏未闭合；原来源或域名残留；无上传记录的远程图片；缺参考资料；缺 PicGo 信息图链接或可复现记录；断裂或重复编号；不存在的本地链接；强断言产生 warning。

~~~javascript
import assert from 'node:assert/strict';
import test from 'node:test';
import { lintMarkdown } from '../content-lint/rules.mjs';

test('flags an untyped code fence', () => {
  const diagnostics = lintMarkdown({
    filePath: '01.example.md',
    content: VALID_FRONTMATTER + '\n## 60 秒回答\n\n~~~\nprint(1)\n~~~',
  });
  assert.ok(diagnostics.some((item) => item.rule === 'typed-code-fence'));
});
~~~

- [ ] **Step 2: 运行测试并确认失败**

Run: npm run test:content

Expected: FAIL，提示 scripts/content-lint/rules.mjs 不存在或导出缺失。

- [ ] **Step 3: 实现规则模块和 CLI**

rules.mjs 负责单文件规则，lint-content.mjs 负责递归枚举、编号检查、相对链接存在性和退出码。Diagnostic 结构固定为：

~~~javascript
{
  severity: 'error' | 'warning',
  rule: 'typed-code-fence',
  filePath: 'src/content/blog/AI应用开发/...',
  line: 42,
  message: '代码块缺少语言标签',
}
~~~

CLI 无参数时扫描全部文章；传入文件或目录时只检查指定正文，但编号检查始终基于完整专题目录。

- [ ] **Step 4: 更新 package.json**

加入 lint:content 和 test:content 两个脚本，不增加第三方依赖。

- [ ] **Step 5: 运行测试**

Run: npm run test:content

Expected: PASS，全部规则测试通过。

- [ ] **Step 6: 记录现有失败基线**

Run: npm run lint:content

Expected: FAIL；至少报告 76 条来源标记、3 张旧第三方图片、100 个无语言标签代码块和 79 篇文章缺少 PicGo 信息图链接。将输出作为后续批次的清理基线。

- [ ] **Step 7: 提交**

~~~bash
git add package.json scripts/content-lint/rules.mjs scripts/lint-content.mjs scripts/__tests__/lint-content.test.mjs
git commit -m "feat: 增加 AI 面试文章内容检查"
~~~

### Task 2: 重写 Agent 基础与范式文章

**Files:**
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/01.什么是 Agent？与大模型有什么本质不同？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/02.Agent 的基本架构由哪些核心组件构成？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/03.Workflow，Agent，Tools 这三个的概念和区别介绍一下？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/04.了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什么？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/05.Agent 推理模式有哪些？ReAct 是啥？具体是怎么实现的？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/06.ReAct、Plan-and-Execute、Reflection 三种范式有什么核心区别？实际项目中该如何选型？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/07.复杂任务怎么做的任务拆分？为什么要拆分？效果如何提升？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/08.请你介绍一下 AI Agent 的记忆机制，并说明在实际开发中应该如何设计记忆模块？.md

**Interfaces:**
- Consumes: ReAct 原始论文、官方 Agent/Workflow 文档、当前 linter
- Produces: 8 篇独立重写且无来源残留的文章

- [ ] **Step 1: 建立逐篇事实清单**

必须纠正 Workflow“完全可预测”、MCP Tool 仅指副作用、ReAct 必须公开 Thought、动态重规划示例无效、累计 token 成本被误称线性、任务拆分固定收益和记忆容量“无限”等问题。

- [ ] **Step 2: 按统一结构重写 01 至 04**

保留标题与 frontmatter，重写正文并加入 2 至 6 个权威参考资料。

- [ ] **Step 3: 按统一结构重写 05 至 08**

代码示例必须能运行或明确标注为伪代码；DAG、记忆层次和成本表达需要与正文一致。

- [ ] **Step 4: 执行批次检查**

Run: node scripts/lint-content.mjs <以上 8 个文件>

Expected: 0 errors；强断言 warning 已人工确认或消除。

- [ ] **Step 5: 提交**

~~~bash
git add "src/content/blog/AI应用开发/01.Agent面试专题"
git commit -m "docs: 重写 Agent 基础与设计范式"
~~~

### Task 3: 重写 Agent 记忆、多 Agent 与工程文章

**Files:**
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/09.Agent 的长短期记忆系统怎么做的？记忆是怎么存的？粒度是多少？怎么用的？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/10.什么是 Multi-Agent？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/11.说说 Single-Agent 和 Multi-Agent 的设计方案？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/12.Agent 记忆压缩通常有哪些方法？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/13.在工程实践中，为什么有时候选择「手搓」Agent，而不是直接用成熟框架？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/14.如何赋予 LLM 规划能力？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/15.讲讲 Agent 的反思机制？为什么要用反思？具体怎么实现？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/16.如何设计多 Agent 的协作与动态切换机制？.md

**Interfaces:**
- Consumes: 框架官方文档、记忆与多 Agent 原始研究、Task 1 linter
- Produces: 8 篇工程边界完整的文章

- [ ] **Step 1: 修正代码和核心事实**

修复无注释中文导致的 Python 语法错误、跨进程不稳定 hash、上下文自动掉落、Single-Agent 不支持并行、LangGraph State 天然无冲突等错误。

- [ ] **Step 2: 重写 09 至 12**

明确短期/长期/情景/语义记忆是设计选项而非统一标准，并说明租户隔离、PII、删除和注入风险。

- [ ] **Step 3: 重写 13 至 16**

将“手搓必然更稳定”、角色切换自动提升客观性、CoT 等同规划等结论改为带条件的工程取舍。

- [ ] **Step 4: 执行批次检查并提交**

Run: node scripts/lint-content.mjs <以上 8 个文件>

Expected: 0 errors。

### Task 4: 新增 Agent 题目并更新专题介绍

**Files:**
- Create: src/content/blog/AI应用开发/01.Agent面试专题/17.什么是 Context Engineering？它和 Prompt Engineering 有什么区别？.md
- Create: src/content/blog/AI应用开发/01.Agent面试专题/18.如何系统评测 Agent？任务成功率、轨迹质量、成本和安全怎么量化？.md
- Create: src/content/blog/AI应用开发/01.Agent面试专题/19.长时间运行的 Agent 如何做状态持久化、恢复与可观测性？.md
- Create: src/content/blog/AI应用开发/01.Agent面试专题/20.Agent 如何防御 Prompt Injection、工具滥用和敏感数据泄露？.md
- Create: src/content/blog/AI应用开发/01.Agent面试专题/21.什么是 Human-in-the-Loop？哪些 Agent 操作必须人工审批？.md
- Create: src/content/blog/AI应用开发/01.Agent面试专题/22.Computer Use Agent 是怎么工作的？浏览器和桌面自动化如何保证可靠性？.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/00.专题介绍.md

**Interfaces:**
- Consumes: NIST AI RMF、OWASP GenAI Security、Agent 框架官方 tracing/checkpoint/HITL 文档、Computer Use 原始评测
- Produces: 6 篇新文和 00 至 22 连续导航

- [ ] **Step 1: 为 6 道题建立官方来源矩阵**
- [ ] **Step 2: 编写 17 至 19，突出上下文选择、可复现评测、持久化和回放**
- [ ] **Step 3: 编写 20 至 22，突出最小权限、审批策略、环境隔离和动作后验证**
- [ ] **Step 4: 更新专题介绍中的基础、进阶、生产实践路线和全部链接**
- [ ] **Step 5: 运行目录检查**

Run: node scripts/lint-content.mjs "src/content/blog/AI应用开发/01.Agent面试专题"

Expected: 23 篇、编号 00 至 22、0 errors。

### Task 5: 重写 RAG 基础、切分与 Embedding

**Files:**
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/01.什么是 RAG？详细描述一个完整 RAG 系统的详细工作流程？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/02.大模型的 RAG 主要用来解决什么问题？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/03.相比直接微调 LLM，RAG 解决了什么问题？微调和 RAG 各自的优劣势是什么？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/04.RAG 中的文档是怎么存的？粒度是多大？详细说说文档切割（Chunking）策略？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/05.怎么规避语义被切割掉的问题？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/06.在 RAG 中 Embedding 究竟是什么？如何选择和评估一个 Embedding 模型？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/07.Embedding 有哪几种算法你了解过吗？.md

**Interfaces:**
- Consumes: RAG、DPR、Sentence-BERT、ColBERT 原始论文与向量数据库官方文档
- Produces: 7 篇准确区分检索、生成、微调和表征模型的文章

- [ ] **Step 1: 修正 RAG 消除幻觉、微调烧入知识、维度越高越好和 BERT 必为 cross-encoder 等错误**
- [ ] **Step 2: 重写 01 至 04，补索引版本、引用对齐和更新流程**
- [ ] **Step 3: 重写 05 至 07，区分 overlap 经验、bi-encoder、cross-encoder 与 late interaction**
- [ ] **Step 4: 运行批次检查**

Expected: 0 errors，所有阈值均带数据集语境或改为定性结论。

### Task 6: 重写 RAG 检索、优化与复杂范式

**Files:**
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/08.什么是向量数据库？有没有做过向量数据库的对比选型？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/09.讲讲你用的向量数据库？数据量级是多大？性能如何？遇到过性能瓶颈吗？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/10.你使用 RAG 给大模型一个输入，系统是怎样的工作流程？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/11.请你介绍一下向量检索和关键词检索的区别？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/12.如何润色用户的 Query（Query Rewrite）？目的是什么？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/13.什么是多路召回？具体怎么做？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/14.RAG 检索优化策略有哪些？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/15.了解哪些更复杂的 RAG 范式？.md

**Interfaces:**
- Consumes: Elasticsearch/Milvus/Qdrant 官方文档、BM25/RRF/Self-RAG/CRAG/GraphRAG 原始资料
- Produces: 8 篇检索与优化文章

- [ ] **Step 1: 修正数据库默认索引、segment 生命周期、BM25、RRF、余弦范围和 top-k 绝对结论**
- [ ] **Step 2: 重写 08 至 11，加入规模、延迟和召回的测量条件**
- [ ] **Step 3: 重写 12 至 15，补查询漂移、融合策略和复杂 RAG 的失败路径**
- [ ] **Step 4: 执行批次检查，Expected: 0 errors**

### Task 7: 重写 RAG 生产、评测与更新

**Files:**
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/16.在什么场景下，你会选择使用图数据库来增强传统的向量检索？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/17.如何规避 RAG 系统中大模型的幻觉？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/18.怎么量化你的 RAG 效果？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/19.RAG 知识库如何实现动态与持续更新？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/20.在实际落地中，你觉得 RAG 最难的地方是哪里？.md

**Interfaces:**
- Consumes: RAGAS、GraphRAG、向量数据库更新和 LLM-as-a-Judge 原始/官方资料
- Produces: 5 篇生产级 RAG 文章

- [ ] **Step 1: 修正向量检索不能多跳、reranker 分数是概率、固定 RAGAS 阈值和只能整文重建等结论**
- [ ] **Step 2: 重写 16 至 20，补 ACL、评测方差、灰度、回滚、SLO 和数据版本**
- [ ] **Step 3: 执行批次检查，Expected: 0 errors**

### Task 8: 新增 RAG 题目并更新专题介绍

**Files:**
- Create: src/content/blog/AI应用开发/02.RAG面试专题/21.什么是 Agentic RAG？它和传统 RAG 有什么区别？.md
- Create: src/content/blog/AI应用开发/02.RAG面试专题/22.多模态 RAG 如何处理 PDF、表格、图片和 OCR 内容？.md
- Create: src/content/blog/AI应用开发/02.RAG面试专题/23.RAG 系统如何做权限隔离并防御提示注入与知识库投毒？.md
- Create: src/content/blog/AI应用开发/02.RAG面试专题/24.什么是 Late Interaction 和多向量检索？什么时候值得使用 ColBERT？.md
- Create: src/content/blog/AI应用开发/02.RAG面试专题/25.GraphRAG 如何在生产环境处理实体消歧、增量更新和成本问题？.md
- Create: src/content/blog/AI应用开发/02.RAG面试专题/26.长上下文模型能替代 RAG 吗？实际项目中怎么选？.md
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/00.专题介绍.md

**Interfaces:**
- Consumes: Agentic/Multimodal RAG 原始论文、ColBERT、Microsoft GraphRAG、OWASP、长上下文评测
- Produces: 6 篇新文和 00 至 26 连续导航

- [ ] **Step 1: 建立来源矩阵，明确实验结论的模型和数据集**
- [ ] **Step 2: 编写 21 至 23，覆盖控制流、文档解析、租户和注入边界**
- [ ] **Step 3: 编写 24 至 26，覆盖 late interaction、GraphRAG 运维和长上下文取舍**
- [ ] **Step 4: 更新专题介绍并运行目录检查**

Expected: 27 篇、编号 00 至 26、0 errors。

### Task 9: 重写 Function Calling 与 MCP 基础

**Files:**
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/01.什么是 Function Calling ？原理是什么？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/02.LLM 是如何学会调用外部工具的？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/03.大模型的 Function Call 能力是怎么训练出来的？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/04.什么是 MCP（模型上下文协议）？讲讲它的核心内容？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/05.MCP 由哪几部分组成？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/06.MCP 和 Function Calling 有什么区别？有没有实际跑过 MCP？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/07.Function Calling 也属于工具调用，请问什么场景下使用 Function Calling，什么场景下使用 MCP？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/08.为什么有些特定的推理模型不支持 MCP 协议？.md

**Interfaces:**
- Consumes: MCP 规范、模型供应商工具调用文档、后训练原始论文
- Produces: 8 篇不再混淆 MCP 与模型调用机制的文章

- [ ] **Step 1: 以 MCP 官方语义重建概念图**

必须明确 Host/Client/Server、Tools/Resources/Prompts、capability negotiation；MCP 不依赖 Function Calling。

- [ ] **Step 2: 修正 01 至 03 的代码与训练叙述**

修复 finish_reason 位置、strict schema、无工具负例、SFT/DPO/RL/可验证奖励关系。

- [ ] **Step 3: 重写 04 至 08**

删除“Tools 等于有副作用”“stdio 没有安全问题”“Serverless 不能使用 MCP”“推理模型因 KV Cache 不能用工具”等错误。

- [ ] **Step 4: 对低分文章执行独立事实复核**

重点复核 06、07、08；Expected: MCP 与 Function Calling 被描述为可组合但独立的层次。

- [ ] **Step 5: 运行批次检查，Expected: 0 errors**

### Task 10: 重写 Skill、A2A 与通信文章

**Files:**
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/09.Skill 是什么？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/10.MCP 和 Agent Skill 的区别是什么？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/11.Function Calling、Skill、MCP 这三个有什么区别？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/12.什么是 A2A 协议？它和 MCP 协议的区别是什么？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/13.MCP 协议通常采用什么通信方式？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/14.说说 WebSocket 和 SSE 通信的区别及局限性？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/15.为什么要用 WebRTC 协议？它和 WebSocket（WS）在 AI 对话流中的核心差异是什么？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/16.有没有用过大模型的网关框架？网关层解决了什么问题？.md

**Interfaces:**
- Consumes: A2A latest specification、MCP transport spec、Web 标准、网关官方文档
- Produces: 8 篇协议和通信文章

- [ ] **Step 1: 修正 Skill、MCP、Function Calling 的可组合关系**
- [ ] **Step 2: 按 A2A 当前 Message、Task、Agent Card、JSON-RPC/gRPC/HTTP 绑定重写 12**
- [ ] **Step 3: 按 Streamable HTTP 与 stdio 重写 13，并纠正 SSE/WebSocket/WebRTC 绝对结论**
- [ ] **Step 4: 网关文章补租户隔离、路由失败语义、语义缓存权限上下文和供应商差异**
- [ ] **Step 5: 执行批次检查，Expected: 0 errors**

### Task 11: 新增工具调用题目并更新专题介绍

**Files:**
- Create: src/content/blog/AI应用开发/03.LLM工具调用面试专题/17.Structured Outputs、JSON Mode 和 Function Calling 有什么区别？.md
- Create: src/content/blog/AI应用开发/03.LLM工具调用面试专题/18.如何设计高质量的 Tool Schema？参数、错误和版本兼容怎么处理？.md
- Create: src/content/blog/AI应用开发/03.LLM工具调用面试专题/19.并行工具调用怎么处理依赖、超时、幂等和补偿？.md
- Create: src/content/blog/AI应用开发/03.LLM工具调用面试专题/20.如何安全执行大模型发起的工具调用？沙箱、权限和人工审批怎么设计？.md
- Create: src/content/blog/AI应用开发/03.LLM工具调用面试专题/21.MCP 的授权机制怎么设计？OAuth、资源服务器和客户端注册是什么关系？.md
- Create: src/content/blog/AI应用开发/03.LLM工具调用面试专题/22.MCP 的生命周期、能力协商和版本兼容是怎么工作的？.md
- Create: src/content/blog/AI应用开发/03.LLM工具调用面试专题/23.MCP 的 Sampling、Elicitation 和 Roots 分别解决什么问题？.md
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/00.专题介绍.md

**Interfaces:**
- Consumes: JSON Schema、OAuth 2.1 相关 RFC、MCP authorization/client/server 规范
- Produces: 7 篇新文和 00 至 23 连续导航

- [ ] **Step 1: 建立规范版本与来源矩阵**
- [ ] **Step 2: 编写 17 至 20，示例包含 schema 校验、错误分类、幂等键和审批策略**
- [ ] **Step 3: 编写 21 至 23，严格区分授权、生命周期和客户端能力**
- [ ] **Step 4: 更新专题介绍并运行目录检查**

Expected: 24 篇、编号 00 至 23、0 errors。

### Task 12: 重写大模型基础、架构和训练

**Files:**
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/01.什么是大语言模型？和传统 NLP 模型有什么区别？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/02.讲讲 Transformer 架构基本原理？Encoder 和 Decoder 是什么？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/03.多头注意力（MHA）有哪些局限？MQA、GQA、Flash Attention 怎么解决？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/04.大模型的位置编码是干什么用的？sincos、RoPE、ALiBi 有什么区别？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/05.什么是大模型项目的分词器？原理是什么？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/06.大模型是怎么训练出来的？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/07.什么是 Scaling Law？大模型的「涌现能力」是怎么回事？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/08.大模型微调的方案有哪些？.md

**Interfaces:**
- Consumes: Transformer、FlashAttention、RoPE、Scaling Laws、Chinchilla、LoRA 原始论文
- Produces: 8 篇基础与训练文章

- [ ] **Step 1: 重新核算模型规模、FLOPs、显存和训练数据数字**
- [ ] **Step 2: 重写 01 至 04，补残差、归一化、门控 FFN、MLA/GQA 边界和位置外推限制**
- [ ] **Step 3: 重写 05 至 08，区分 BPE/WordPiece/Unigram、Scaling Law 与评测指标效应**
- [ ] **Step 4: 修正 LoRA 维度相关前置内容并执行批次检查**

Expected: 0 errors；所有矩阵形状和算术可复算。

### Task 13: 重写后训练、解码、缓存和量化

**Files:**
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/09.请讲一下 LoRA 技术，除了减少参数量，它还有哪些优点？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/10.SFT 之后还有哪些 Post-Training？RLHF、DPO、GRPO、拒绝采样什么关系？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/11.大模型的 DPO 和 PPO 的区别是什么？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/12.大模型生成文本时的解码策略有哪些？贪心、Beam Search、采样分别什么时候用？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/13.大模型的参数：温度值、Top-P、Top-K 分别是什么？各个场景下的最佳设置是什么？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/14.KV Cache 是什么？Prompt Caching 的原理是什么？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/15.大模型量化是什么？INT8INT4AWQGPTQ 怎么选？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/16.如何写好 Prompt？分享下 Prompt 工程实践经验？.md

**Interfaces:**
- Consumes: LoRA、DPO、PPO、GRPO、AWQ、GPTQ、vLLM cache 文档和供应商 Prompt Caching 文档
- Produces: 8 篇后训练与推理文章

- [ ] **Step 1: 修正 LoRA 矩阵与初始化、RLAIF 分类、DPO 概率解释和 PPO value head**
- [ ] **Step 2: 修正 Beam Search、采样组合和“最佳参数”绝对结论**
- [ ] **Step 3: KV 显存公式使用 KV head 数；量化文章删除推理优化器状态和 AWQ 1% 高精度误解**
- [ ] **Step 4: Prompt 文章增加 schema、评测集、版本和回归测试**
- [ ] **Step 5: 执行批次检查，Expected: 0 errors**

### Task 14: 重写 CoT、幻觉、MoE、部署与评测

**Files:**
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/17.什么是 CoT？为啥效果好？它有什么缺点或局限性？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/18.大模型为什么会出现幻觉？怎么缓解？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/19.MoE 混合专家模型是什么？DeepSeek V3、Qwen 为什么用 MoE？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/20.大模型部署有哪些主流方案？vLLM、TGI、llama.cpp、SGLang 实际项目里怎么选？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/21.大模型能力评测指标有哪些？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/22.对比使用过哪些主流大模型？你们项目中最终选用了哪个模型？为什么？.md

**Interfaces:**
- Consumes: CoT 忠实度研究、MoE 原始论文、vLLM/SGLang/TGI/llama.cpp 官方文档、评测论文
- Produces: 6 篇应用、部署与评测文章

- [ ] **Step 1: 区分可见 rationale、内部推理和可验证中间产物**
- [ ] **Step 2: 幻觉文章区分知识、推理、检索、解码和校准问题**
- [ ] **Step 3: 修正 MoE 年份与显存容量；部署文章加入 vLLM APC 和实验功能状态**
- [ ] **Step 4: 评测与选型文章加入 EM/F1、win rate、校准、安全、成本、TTFT/TPOT、SLA 和真实决策模板**
- [ ] **Step 5: 执行批次检查，Expected: 0 errors**

### Task 15: 新增大模型工程题目并更新专题介绍

**Files:**
- Create: src/content/blog/AI应用开发/04.大模型工程面试专题/23.什么是推理模型和 Test-Time Compute？为什么增加推理计算能提升效果？.md
- Create: src/content/blog/AI应用开发/04.大模型工程面试专题/24.知识蒸馏和合成数据在大模型训练中怎么用？有哪些风险？.md
- Create: src/content/blog/AI应用开发/04.大模型工程面试专题/25.什么是 Speculative Decoding？Draft Model、验证和加速比怎么理解？.md
- Create: src/content/blog/AI应用开发/04.大模型工程面试专题/26.Prefix Cache、KV Cache 和 Semantic Cache 有什么区别？.md
- Create: src/content/blog/AI应用开发/04.大模型工程面试专题/27.Prefill 和 Decode 为什么要分离？TTFT、TPOT 和吞吐怎么权衡？.md
- Create: src/content/blog/AI应用开发/04.大模型工程面试专题/28.FP8、FP4 和 INT4 有什么区别？训练与推理量化怎么选？.md
- Create: src/content/blog/AI应用开发/04.大模型工程面试专题/29.长上下文模型是怎么扩展的？如何评测有效上下文长度？.md
- Create: src/content/blog/AI应用开发/04.大模型工程面试专题/30.多模态大模型如何对齐文本、图像、音频和视频？.md
- Create: src/content/blog/AI应用开发/04.大模型工程面试专题/31.什么是约束解码和结构化生成？如何保证输出满足 Schema？.md
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/00.专题介绍.md

**Interfaces:**
- Consumes: 推理扩展、蒸馏、Speculative Decoding、量化、长上下文、多模态和约束解码原始论文及官方文档
- Produces: 9 篇新文和 00 至 31 连续导航

- [ ] **Step 1: 建立论文和官方实现矩阵，区分论文能力、实现状态和产品行为**
- [ ] **Step 2: 编写 23 至 25，给出效果与延迟的测量条件**
- [ ] **Step 3: 编写 26 至 28，区分三类缓存、PD 分离指标和数值格式**
- [ ] **Step 4: 编写 29 至 31，区分声明上下文与有效上下文、模态对齐和语法约束**
- [ ] **Step 5: 更新专题介绍并运行目录检查**

Expected: 32 篇、编号 00 至 31、0 errors。

### Task 16: 建立信息图清单并确认视觉系统

**Files:**
- Verify: .baoyu-skills/baoyu-infographic/EXTEND.md
- Modify: .gitignore
- Modify: package.json
- Create: docs/infographics/ai-interview/manifest.json
- Create: scripts/upload-infographics.mjs
- Create: scripts/__tests__/upload-infographics.test.mjs
- Modify: scripts/__tests__/lint-content.test.mjs

**Interfaces:**
- Consumes: 107 篇最终文章路径、baoyu-infographic 偏好和信息结构
- Produces: 107 条唯一 manifest 记录；每条包含 article、series、slug、workDir、localPath、uploadRecordPath、remoteUrl、layout、style、aspect、language、backend 和状态；提供按专题批量上传并回写记录的 CLI

- [ ] **Step 1: 读取 baoyu-infographic 和 imagegen 的完整技能说明**

确认 prompt 文件、备份、后端、重试和禁止位图文字覆盖等规则；完整读取 picgo-upload、GUI 上传和错误分流规则。

- [ ] **Step 2: 生成 107 条 manifest**

映射必须覆盖 Root 1、Agent 23、RAG 27、工具调用 24、大模型工程 32。主图名与文章编号和稳定 slug 对应，不能仅使用中文标题哈希。

把 `docs/infographics/ai-interview/**/infographic*.png` 加入 `.gitignore`；分析、prompt、manifest 和 upload 记录不得忽略。

- [ ] **Step 3: 为上传包装脚本写失败测试**

测试 dry-run 不触网、按 series 筛选、批次不超过 5、PicGo JSON 与输入顺序一一对应、部分失败不丢记录、upload.json 不包含密钥、manifest 只在成功后更新 URL。

- [ ] **Step 4: 实现上传包装脚本**

命令接口固定为：

```bash
node scripts/upload-infographics.mjs --series agent --batch-size 5
node scripts/upload-infographics.mjs --series rag --batch-size 5 --dry-run
```

脚本调用 `$HOME/.agents/skills/picgo-upload/scripts/gui-upload.mjs`。GUI 不可达时明确停止并提示启动 PicGo；不自动安装 CLI、不触发浏览器登录。网络错误最多重试一次，登录、配额、类型和配置错误立即停止。

- [ ] **Step 5: 按信息结构推荐 3 至 5 个布局与风格组合**

至少覆盖流程、比较、架构、指标、分类和专题路线。默认横版 16:9、简体中文、`imagegen` 后端。

- [ ] **Step 6: 执行 baoyu-infographic 确认门**

向用户一次性展示全系列组合映射、比例、语言和后端。用户确认前不得生成任何图片；批次内偏离已确认映射时单独说明。

- [ ] **Step 7: 测试 manifest 和上传包装脚本**

Run: npm run test:content

Expected: 107 条记录，article/workDir/uploadRecordPath 均唯一，所有文章被覆盖；remoteUrl 在上传前为空。

Run: node scripts/upload-infographics.mjs --series agent --batch-size 5 --dry-run

Expected: 列出 23 个 Agent 输入，分为 5 批，不发起上传。

### Task 17: 更新总览并执行跨专题文本一致性复核

**Files:**
- Modify: src/content/blog/AI应用开发/00.大模型面试题总览.md
- Review: src/content/blog/AI应用开发/**/*.md

**Interfaces:**
- Consumes: 四个已完成专题和 107 篇文章清单
- Produces: 全系列入口、岗位阅读路线、跨专题链接和统一术语

- [ ] **Step 1: 独立重写总览**

列出 107 篇文章，按 Agent、RAG、工具调用和大模型工程分组；提供 Agent 开发、RAG 工程、大模型工程三条阅读路线。

- [ ] **Step 2: 建立术语表并全局扫描**

统一 Function Calling、Tool、MCP、A2A、Skill、Embedding、Reranker、KV Cache、Prefix Cache、Post-Training 等写法。

- [ ] **Step 3: 清除旧来源和第三方资产**

Run: rg -n "原文来源|小林面试笔记|xiaolinnote\.com|xiaolincoding\.com" src/content/blog/AI应用开发

Expected: 无输出。

- [ ] **Step 4: 验证文件数和编号**

Run: rg --files src/content/blog/AI应用开发 -g "*.md" -g "*.mdx"

Expected: 107 个文件；Root 1、Agent 23、RAG 27、工具调用 24、大模型工程 32。

- [ ] **Step 5: 运行全量文本检查**

Run: npm run lint:content

Expected: 除信息图及其可复现记录尚未生成外，其他 error 为 0；warning 均有人工复核记录。

### Task 18: 生成总览与 Agent 信息图

**Files:**
- Create: docs/infographics/ai-interview/overview/**
- Create: docs/infographics/ai-interview/agent/**
- Modify: src/content/blog/AI应用开发/00.大模型面试题总览.md
- Modify: src/content/blog/AI应用开发/01.Agent面试专题/*.md

**Interfaces:**
- Consumes: 已确认 manifest、1 篇根总览和 23 篇 Agent 文章
- Produces: 至少 24 个 PicGo 公开 URL 和 24 组 source/analysis/structured-content/prompt/infographic/upload 记录

- [ ] **Step 1: 逐篇保存最终正文为 source.md，并按技能模板生成 analysis.md 和 structured-content.md**
- [ ] **Step 2: 按 manifest 读取对应 layout/style reference 和 base prompt**
- [ ] **Step 3: 在 prompts/infographic.md 落盘后调用 imagegen，失败自动重试一次**
- [ ] **Step 4: 逐张检查中文文字、数据、构图和 16:9 裁切；错误图通过新 prompt 重新生成**
- [ ] **Step 5: 运行 `node scripts/upload-infographics.mjs --series overview --batch-size 5` 和 `--series agent` 上传通过验收的 PNG**
- [ ] **Step 6: 将公开 URL 和描述性 alt 插入 24 篇文章，并更新 manifest remoteUrl/status**
- [ ] **Step 7: 运行批次 linter，Expected: overview 和 Agent 图片规则 0 errors**

### Task 19: 生成 RAG 信息图

**Files:**
- Create: docs/infographics/ai-interview/rag/**
- Modify: src/content/blog/AI应用开发/02.RAG面试专题/*.md

**Interfaces:**
- Consumes: 已确认 manifest 和 27 篇 RAG 文章
- Produces: 至少 27 个 PicGo 公开 URL 和 27 组完整可复现记录

- [ ] **Step 1: 为 27 篇文章生成 source、analysis、structured-content 和 prompt**
- [ ] **Step 2: 调用 imagegen 分小批生成，每批不超过 5 张**
- [ ] **Step 3: 每批逐张验收文字与事实，上一批未通过时不得继续**
- [ ] **Step 4: 运行 `node scripts/upload-infographics.mjs --series rag --batch-size 5`，保存 upload.json，并把 URL 插入文章；复杂 RAG 流程可增加 -02 图**
- [ ] **Step 5: 运行批次 linter，Expected: RAG 图片规则 0 errors**

### Task 20: 生成工具调用信息图

**Files:**
- Create: docs/infographics/ai-interview/tools/**
- Modify: src/content/blog/AI应用开发/03.LLM工具调用面试专题/*.md

**Interfaces:**
- Consumes: 已确认 manifest 和 24 篇工具调用文章
- Produces: 至少 24 个 PicGo 公开 URL 和 24 组完整可复现记录

- [ ] **Step 1: 为 24 篇文章生成 source、analysis、structured-content 和 prompt**
- [ ] **Step 2: 调用 imagegen 分小批生成，每批不超过 5 张**
- [ ] **Step 3: 重点检查 MCP/A2A 名称、箭头方向、授权参与方和协议层次**
- [ ] **Step 4: 运行 `node scripts/upload-infographics.mjs --series tools --batch-size 5`，保存 upload.json，并把 URL 插入文章；复杂授权或并行调用可增加 -02 图**
- [ ] **Step 5: 运行批次 linter，Expected: 工具调用图片规则 0 errors**

### Task 21: 生成大模型工程信息图

**Files:**
- Create: docs/infographics/ai-interview/llm/**
- Modify: src/content/blog/AI应用开发/04.大模型工程面试专题/*.md

**Interfaces:**
- Consumes: 已确认 manifest 和 32 篇大模型工程文章
- Produces: 至少 32 个 PicGo 公开 URL 和 32 组完整可复现记录

- [ ] **Step 1: 为 32 篇文章生成 source、analysis、structured-content 和 prompt**
- [ ] **Step 2: 调用 imagegen 分小批生成，每批不超过 5 张**
- [ ] **Step 3: 重点检查公式、矩阵形状、单位、缓存关系和训练/推理阶段**
- [ ] **Step 4: 运行 `node scripts/upload-infographics.mjs --series llm --batch-size 5`，保存 upload.json，并把 URL 插入文章；复杂架构或比较可增加 -02 图**
- [ ] **Step 5: 运行批次 linter，Expected: 大模型工程图片规则 0 errors**

### Task 22: 全站验证与浏览器 QA

**Files:**
- Modify: README.md
- Modify: CLAUDE.md
- Verify: .baoyu-skills/baoyu-infographic/EXTEND.md
- Verify: package.json
- Verify: src/content/blog/AI应用开发/**/*.md
- Verify: docs/infographics/ai-interview/**
- Verify: dist/**

**Interfaces:**
- Consumes: 完整内容升级结果
- Produces: 可构建站点和验证记录

- [ ] **Step 1: 运行内容测试和 Astro 检查**

Run: npm run test:content

Expected: PASS。

Run: npm run lint:content

Expected: 0 errors。

Run: npm run check

Expected: 0 errors。

- [ ] **Step 2: 更新维护文档**

在 README.md 和 CLAUDE.md 记录 `npm run lint:content`、baoyu-infographic prompt 留档、PicGo 公开 URL、禁止提交本地生成 PNG 和上传失败处理。

- [ ] **Step 3: 构建站点**

Run: npm run build

Expected: exit 0，全部 107 篇文章生成页面。

- [ ] **Step 4: 检查差异**

Run: git diff --check

Expected: 无空白错误。

Run: git status --short

Expected: 仅出现本任务文件和用户原有改动，没有临时文件或构建产物。

- [ ] **Step 5: 检查公开图片并启动浏览器 QA**

先通过 contact sheet 和本地原图逐一检查不少于 107 张信息图的文字与事实，再按 upload.json 对公开 URL 做一次可访问性检查。随后检查桌面和移动端的总览、每专题 3 篇旧文、2 篇新文以及所有包含第 2 张图的文章，确认 TOC、代码块、表格、远程图片、内部链接和长标题不重叠。

- [ ] **Step 6: 对时效性内容做最终官方来源复核**

重点复核 MCP、A2A、OAuth、vLLM/SGLang、推理模型、量化和长上下文文章。发现规范或实验状态变化时先修正文和对应信息图，再重跑 Task 22 的全部命令。

- [ ] **Step 7: 提交**

~~~bash
git add .baoyu-skills/baoyu-infographic/EXTEND.md .gitignore README.md CLAUDE.md package.json scripts src/content/blog/AI应用开发 docs/infographics/ai-interview
git commit -m "docs: 全面升级 2026 AI 面试系列"
~~~
