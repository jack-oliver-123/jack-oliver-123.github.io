---
title: "17. Context Engineering 与 Prompt Engineering 有什么区别？"
topic: "AI Agent engineering"
data_type: "comparison"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

对比 Context Engineering 与 Prompt Engineering，说明 Agent 如何选择、组织和治理运行时上下文

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 比较“Context Engineering 与 Prompt Engineering 有什么区别？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

## Target Audience

- **Knowledge Level**: Intermediate to Expert
- **Context**: 准备 AI 应用开发与大模型工程面试
- **Expectations**: 在短时间内建立可口述、可追问、可落地的答案结构

## Content Type Analysis

- **Data Structure**: comparison
- **Key Relationships**: 核心概念、工程实现、边界条件与常见误区之间的关系
- **Visual Opportunities**: 使用原文流程、比较表、组件关系、指标或分区摘要进行可视化

## Key Data Points (Verbatim)

- 原文没有需要单独强调的定量数据或规范关键词。

## Source Evidence (Verbatim)

## 60 秒回答

Prompt Engineering 主要优化给模型的指令表达、示例和输出约束；Context Engineering 关注一次模型调用前，系统如何从所有可用信息中选择、组织和治理模型真正看到的工作集。这个工作集包括系统政策、用户请求、工具描述、任务状态、记忆、检索证据和近期观察。

在 Agent 中，问题通常不是“有没有更多上下文”，而是“当前步骤需要哪些可信、最新、最小的信息”。好的 Context Engineering 要控制来源、权限、顺序、预算和生命周期，并防止外部数据中的注入内容被误当成高优先级指令。

## 详细解析

Prompt 是上下文的一部分。Prompt Engineering 会处理角色、任务描述、few-shot 示例、格式和拒答规则；Context Engineering 还包含运行时的数据管道：

1. 根据身份和任务确定可访问的数据与工具。
2. 从会话状态、长期记忆和知识源召回候选信息。
3. 去重、验证时效与来源，按当前步骤排序。
4. 在 Token 预算内组装上下文，并把政策、指令和不可信数据分层。
5. 执行后更新状态，决定哪些内容保留、压缩或删除。

上下文质量有四个维度：相关性、正确性、完整性和安全性。只追求召回更多内容会引入冲突与注意力稀释；只保留最近信息又可能丢失早期硬约束。长上下文窗口扩大容量，但不会自动解决排序、污染和权限问题。

Agent 的工具目录也是上下文。工具过多、描述重叠会使选择更难，因此可以按任务动态暴露最小工具集合，而不是每轮传递全部能力。

## 工程实践与边界

- 建立上下文清单，标明每段内容的 owner、source、trust_level、freshness、sensitivity 和 token_budget。
- 系统政策、用户指令、检索数据和工具观察使用明确分隔，不让网页文本覆盖系统政策。
- 先做租户与权限过滤，再做检索和重排；禁止跨租户候选进入模型上下文。
- 对个人可识别信息（PII）做最小化、脱敏和保留期管理；调试快照不能默认保存完整上下文。
- 用消融评测比较某类上下文加入前后的成功率、延迟和成本，删除无收益信息。

## 常见误区

- **“Context Engineering 是 Prompt Engineering 的新名字”**：前者还覆盖检索、状态、工具、权限与生命周期。
- **“窗口越长，上下文越好”**：无关、矛盾或恶意内容会随容量一起增加。
- **“检索结果可以当指令”**：外部内容是不可信数据，只能作为证据处理。
- **“所有历史都能帮助个性化”**：过期偏好和未授权 PII 可能造成错误与合规风险。

## 面试追问

> **面试官：** 上下文太长时先删什么？
>
> **候选人：** 先移除与当前步骤无关且可重新获取的信息，再压缩旧观察；系统政策、用户硬约束和未完成状态应优先保留。

> **面试官：** 如何发现上下文污染？
>
> **候选人：** 追踪每段上下文来源，建立含冲突、过期和注入内容的评测集，检查模型是否错误采纳低信任信息。

> **面试官：** 工具描述为什么也属于 Context Engineering？
>
> **候选人：** 模型依据描述选择动作；工具数量、重叠和参数说明会直接影响决策质量与上下文预算。

## Layout × Style Signals

- Content type: comparison → suggests comparison-matrix
- Tone: 专业、教育、工程导向 → suggests corporate-memphis
- Audience: AI 工程岗位候选人 → suggests 清晰层级与可扫描标签
- Complexity: moderate → suggests 4 个以内主要信息区

## Design Instructions (from user input)

- 每篇文章至少一张原创信息图，使用简体中文
- 横版 16:9，信息准确，正文链接由 PicGo 提供
- 保留专业技术名称，不添加原文没有的数据或结论
- 当前资产焦点：primary

## Recommended Combinations

1. **comparison-matrix + corporate-memphis** (Recommended): 与该文章的数据结构和已确认的系列视觉方案一致
2. **binary-comparison + corporate-memphis**: 可作为更强调关系或密度的备选
3. **dense-modules + pop-laboratory**: 可作为更强调工程细节的备选
