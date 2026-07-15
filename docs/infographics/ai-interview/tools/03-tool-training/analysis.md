---
title: "3. 大模型的 Function Call 能力是怎么训练出来的？"
topic: "LLM tool integration"
data_type: "process"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

系统介绍大模型 Function Call 能力的训练流程，梳理数据构造、函数选择、参数生成和调用结果反馈的关键环节

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 复述“大模型的 Function Call 能力是怎么训练出来的？”的关键流程与控制点
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

👔面试官：如果让你训练 Function Call 能力，数据只放成功调用够吗？

🙋我：不够，还要覆盖不调用、缺参数、并行调用、工具报错和危险请求。

👔面试官：训练完成后怎样证明它能上线？

🙋我：分层评估格式、选工具、参数、执行和任务结果，再做权限与注入红队测试。

## 60 秒回答

一条典型训练样本包含系统指令、工具定义、用户请求、助手的结构化调用、工具结果和最终回答。监督微调让模型学习特殊角色或控制 token 下的工具名与参数；后续可以用偏好数据、可执行校验器或强化学习，提高有效调用的收益并惩罚误选、非法参数和不必要调用。

训练集要包含单工具、多工具、并行与串行依赖、缺失参数、空结果、超时、权限拒绝和注入样本。上线前不能只测 JSON 合法率，还要测调用决策、参数语义、执行成功、任务成功和安全违规。

## 详细解析

### 数据构造

先定义稳定的工具目录和 Schema，再从真实任务或合成任务构造轨迹。高质量轨迹要明确每个调用为什么发生，并保留工具错误。合成数据需要经过 Schema 校验、沙箱执行或人工抽检，避免把不存在的参数和错误工具名教给模型。

训练样本通常覆盖三种输出：

1. 普通自然语言回答
2. 一个或多个结构化调用
3. 读取工具结果后的回答或下一次调用

模型必须学会调用 ID 与结果的对应关系。并行调用还要覆盖结果乱序返回，串行调用则要体现后一步依赖前一步输出。

### 训练目标与反馈

监督微调可以对整段助手输出计算自回归损失，也可按实现对工具调用 token 加权。结构化解码能减少语法错误，但无法替代语义训练。

后训练阶段可以比较两条候选轨迹，或用执行器给出可验证奖励。例如，Schema 通过、调用成功和任务完成分别计分；越权调用、高风险误操作和伪造结果应给予强惩罚。奖励设计若只看“调用成功”，模型会倾向于多调用。

### 分层评估

离线评估要固定工具版本和模拟后端，避免外部服务波动污染结论。建议逐层定位：

- 格式层：输出能否解析并满足 Schema
- 决策层：该不该调用、选哪个工具
- 参数层：值是否来自正确上下文
- 执行层：真实或模拟工具能否完成
- 任务层：最终目标是否达成
- 安全层：是否越权、泄露或接受注入

## 工程实践与边界

数据划分要按工具族和任务模板隔离，防止同义改写泄漏到测试集。对动态 API，要保存文档版本并定期重放回归集。

工具调用能力还依赖推理接口。模型权重可能具备该能力，但服务端没有暴露工具字段；相反，服务端提供字段也不代表任意模型都能稳定使用。生产系统仍需运行时校验、授权、超时、重试、幂等、补偿与审计。

## 常见误区

- **预训练代码足以代替工具微调**：代码知识不能覆盖产品约定的多轮调用协议
- **合成数据越多越好**：未经执行验证的数据会放大错误 Schema 和伪造结果
- **JSON 合法率就是成功率**：参数可能结构正确但对象、时间或权限错误
- **训练能消除运行时风险**：模型输出始终要作为不可信输入处理

## 面试追问

**追问：如何评估模型面对新工具的泛化？**

按工具族留出从未出现在训练集的工具，只给文档和 Schema，测选择、参数和执行结果。

**追问：并行调用样本为什么重要？**

它训练模型识别无依赖任务，同时也检验宿主能否用调用 ID 正确合并乱序结果。

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
