---
title: "14. 如何赋予 LLM 规划能力？"
topic: "AI Agent engineering"
data_type: "process"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

介绍赋予 LLM 规划能力的常见方式，梳理任务分解、计划生成、动态调整和执行反馈在 Agent 中的作用

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 复述“如何赋予 LLM 规划能力？”的关键流程与控制点
2. 说明关键工程边界、失败模式与验证方法

## Target Audience

- **Knowledge Level**: Intermediate to Expert
- **Context**: 准备 AI 应用开发与大模型工程面试
- **Expectations**: 在短时间内建立可口述、可追问、可落地的答案结构

## Content Type Analysis

- **Data Structure**: process
- **Key Relationships**: 核心概念、工程实现、边界条件与常见误区之间的关系
- **Visual Opportunities**: 使用原文流程、比较表、组件关系、指标或分区摘要进行可视化

## Key Data Points (Verbatim)

- 原文没有需要单独强调的定量数据或规范关键词。

## Source Evidence (Verbatim)

## 60 秒回答

规划能力不是在 Prompt 里加“一步步思考”就完成了。工程上需要让模型产出可执行的结构化计划：步骤、依赖、输入输出、所需能力、验收条件和预算；调度器根据用户身份与外部策略计算实际工具权限，只执行计划请求与授权集合的交集，并根据观察更新状态。

提升规划可以从示例和约束、任务分解、候选计划搜索、外部规划器以及执行反馈五个方向入手。思维链（CoT）、思维树（ToT）和思维图（GoT）是研究中的推理组织方法，但生产系统更关注计划能否验证、恢复和受权限约束，而不是公开完整推理过程。

## 详细解析

规划至少包含三个层次：

1. **目标建模**：明确成功条件、硬约束、资源和不可接受结果。
2. **任务图生成**：将目标转成有依赖的步骤，并为每步定义契约。
3. **执行控制**：调度就绪步骤、验证结果、更新剩余计划并处理失败。

Few-shot 示例和结构化输出能让模型生成更一致的计划。ToT 通过探索、评价和剪枝多个候选状态改善单一路径局限；GoT 允许中间结果形成更一般的图结构。它们会增加模型调用与搜索空间，是否有收益取决于任务和评价函数。

对于具有正式动作和约束的领域，可以让 LLM 把自然语言目标转成规划问题，再交给确定性求解器；模型负责接口转换，求解器负责搜索可行路径。对于开放任务，则常用高层计划加受限 ReAct，并把关键约束保存在外部状态中。

## 工程实践与边界

- 计划 schema 包含 step_id、dependencies、inputs、expected_output、requested_tools、status 和 acceptance_criteria。`requested_tools` 只是模型声明的候选能力，模型不可修改的运行时 allowlist 才是授权边界。
- 对任务图做环检测、节点数和深度限制，防止模型生成无限拆分。
- 硬约束由策略引擎校验，不能因重规划而被模型删除。
- 在执行前审批高风险步骤的目标与参数范围；执行中超出范围必须重新审批。
- 用计划有效率、重规划率、无效步骤率和端到端成功率评测，不把计划写得长当成能力强。

## 常见误区

- **“CoT 等于规划”**：分步推理不等于可调度、可恢复的执行计划。
- **“计划越详细越好”**：过早锁定低层细节会增加计划过期和返工。
- **“ToT/GoT 优于线性计划”**：没有可靠评价函数时，多路径搜索只会扩大成本。
- **“重规划可以重做一切”**：已产生副作用的步骤必须按真实外部状态处理。

## 面试追问

> **面试官：** 高层计划和低层动作如何分工？
>
> **候选人：** 高层计划保留目标、依赖和验收；执行器根据当前观察选择低层动作，偏离计划边界时返回 Planner。

> **面试官：** 如何判断需要重规划？
>
> **候选人：** 前置条件失效、关键工具不可用、结果未达验收或用户约束变化时触发；普通成功步骤不必重复规划。

> **面试官：** 计划生成错误怎么发现？
>
> **候选人：** 先做 schema 和图校验，再检查约束覆盖与工具可用性，关键计划通过模拟、规则或人工审批。

## Layout × Style Signals

- Content type: process → suggests linear-progression
- Tone: 专业、教育、工程导向 → suggests hand-drawn-edu
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: moderate → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：primary

## Recommended Combinations

1. **linear-progression + hand-drawn-edu** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **winding-roadmap + hand-drawn-edu**: 可作为更强调关系或密度的备选
3. **circular-flow + technical-schematic**: 可作为更强调工程细节的备选
