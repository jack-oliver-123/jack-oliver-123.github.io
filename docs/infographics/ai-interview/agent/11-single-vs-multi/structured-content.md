# 11. 说说 Single-Agent 和 Multi-Agent 的设计方案？

## Overview

对比 Single-Agent 和 Multi-Agent 的系统设计方案，分析任务复杂度、协作成本、状态管理和工程落地差异

## Learning Objectives

The viewer will understand:

1. 建立“说说 Single-Agent 和 Multi-Agent 的设计方案？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

我会先做 Single-Agent 基线，因为它状态集中、链路短、评测和调试成本低。只有出现可证明的边界，例如独立子任务需要并行、不同职责必须隔离上下文或权限、单个上下文长期被无关信息污染，才拆成 Multi-Agent。

设计上，Single-Agent 用受限工具集和外层状态机；Multi-Agent 优先中心编排，明确 Worker 契约、任务图、共享状态和失败语义。最终用同一评测集比较成功率、延迟、成本、安全事件和可恢复性，而不是按“任务复杂”这个模糊标签选型。

## 详细解析

Single-Agent 方案通常包含一个模型决策循环、工具注册表、任务状态和守卫。复杂流程也可以用固定 Workflow 包裹该 Agent，不必因为步骤多就拆角色。其优势是信息无需跨边界复制，错误轨迹容易回放。

Multi-Agent 适合三类需求：

1. **并行性**：多个耗时且相互独立的子任务可同时执行。
2. **缩小暴露面**：数据层、身份和授权层已经强制隔离时，可再把不同业务域或高风险工具拆给不同 Agent，减少单次上下文可见范围；拆角色本身不能替代多租户隔离。
3. **上下文专门化**：每个角色只需要一小部分知识和指令，减少相互干扰。

中心编排方案中，Orchestrator 拥有任务图和全局状态，Worker 只完成有界子任务。Handoff 方案中，要定义转交条件、状态摘要、接收确认和回退路径。去中心化协作可以用于研究或特定分布式场景，但需要解决领导选举、重复任务、消息乱序和全局完成检测，并非天然更灵活。

## 工程实践与边界

- 用一个 Agent 完成最小版本，收集失败轨迹，再按真实瓶颈拆分。
- Worker 返回结构化产物和证据，不直接生成最终用户结论，除非它就是责任主体。
- 限制 Agent 间消息轮数和扇出，检测相互转交循环。
- 跨 Agent 写操作由统一事务边界或 Saga 协调，补偿逻辑不交给模型临时发明。
- 比较架构时固定模型、工具和评测集，避免把模型升级收益误归因于多 Agent。

## 常见误区

- **“任务步骤多就是 Multi-Agent”**：步骤数与角色边界不是同一概念。
- **“多 Agent 总会更快”**：只有关键路径上存在可并行工作，且通信成本可控时才可能降低延迟。
- **“每个 Agent 都要知道全局”**：最小必要上下文更有利于隔离和稳定。
- **“中心编排没有自主性”**：Worker 内部仍可动态决策，中心编排只是约束任务和状态边界。

## 面试追问

> **面试官：** 单 Agent 的上下文过长时是否要拆？
>
> **候选人：** 先尝试上下文筛选、外部状态和工具检索；只有不同职责的上下文能稳定隔离时，拆 Agent 才可能带来收益。

> **面试官：** Orchestrator 失败怎么办？
>
> **候选人：** 将其状态持久化并支持重放，服务层可做高可用；但逻辑上仍保持单一状态所有权，避免多个编排者重复提交副作用。

> **面试官：** 如何评估通信成本？
>
> **候选人：** 记录每次转交的 Token、序列化延迟、等待时间、重试和因上下文丢失产生的返工，再与单 Agent 基线比较。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

我会先做 Single-Agent 基线，因为它状态集中、链路短、评测和调试成本低。只有出现可证明的边界，例如独立子任务需要并行、不同职责必须隔离上下文或权限、单个上下文长期被无关信息污染，才拆成 Multi-Agent。

设计上，Single-Agent 用受限工具集和外层状态机；Multi-Agent 优先中心编排，明确 Worker 契约、任务图、共享状态和失败语义。最终用同一评测集比较成功率、延迟、成本、安全事件和可恢复性，而不是按“任务复杂”这个模糊标签选型。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

Single-Agent 方案通常包含一个模型决策循环、工具注册表、任务状态和守卫。复杂流程也可以用固定 Workflow 包裹该 Agent，不必因为步骤多就拆角色。其优势是信息无需跨边界复制，错误轨迹容易回放。

Multi-Agent 适合三类需求：

1. **并行性**：多个耗时且相互独立的子任务可同时执行。
2. **缩小暴露面**：数据层、身份和授权层已经强制隔离时，可再把不同业务域或高风险工具拆给不同 Agent，减少单次上下文可见范围；拆角色本身不能替代多租户隔离。
3. **上下文专门化**：每个角色只需要一小部分知识和指令，减少相互干扰。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 用一个 Agent 完成最小版本，收集失败轨迹，再按真实瓶颈拆分。
- Worker 返回结构化产物和证据，不直接生成最终用户结论，除非它就是责任主体。
- 限制 Agent 间消息轮数和扇出，检测相互转交循环。
- 跨 Agent 写操作由统一事务边界或 Saga 协调，补偿逻辑不交给模型临时发明。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“任务步骤多就是 Multi-Agent”**：步骤数与角色边界不是同一概念。
- **“多 Agent 总会更快”**：只有关键路径上存在可并行工作，且通信成本可控时才可能降低延迟。
- **“每个 Agent 都要知道全局”**：最小必要上下文更有利于隔离和稳定。
- **“中心编排没有自主性”**：Worker 内部仍可动态决策，中心编排只是约束任务和状态边界。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 本图不使用额外定量数据。

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
