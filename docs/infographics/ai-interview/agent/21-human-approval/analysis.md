---
title: "21. Human-in-the-Loop 应该如何设计审批边界？"
topic: "AI Agent engineering"
data_type: "process"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

介绍 Agent 中 Human-in-the-Loop 的风险分级、审批对象、暂停恢复和审计边界

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 复述“Human-in-the-Loop 应该如何设计审批边界？”的关键流程与控制点
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

Human-in-the-Loop 不是在流程末尾加一个“确认”按钮，而是按风险把决策分成自动执行、执行后复核、执行前审批和禁止自动化。涉及资金、不可逆删除、对外发布、权限提升、敏感数据访问或低置信高影响判断时，通常需要执行前审批。

审批必须绑定不可变的动作快照：工具、目标资源、关键参数、数据范围、理由、预期影响、有效期和审批人。任何关键参数被 Agent 修改，原审批立即失效。系统应持久化暂停点，恢复后重新校验身份、权限、版本和外部状态。

## 详细解析

审批边界可由“影响、可逆性、数据敏感度、置信度和异常度”共同决定：

| 风险 | 例子 | 建议控制 |
| --- | --- | --- |
| 低 | 读取公开资料、生成草稿 | 自动执行并记录 |
| 中 | 更新可回滚的内部标签 | 自动或抽样复核 |
| 高 | 对外发信、修改生产配置 | 执行前审批 |
| 禁止 | 获取明文密钥、绕过访问控制 | 拒绝，不提供工具 |

审批界面要让人看得懂真实后果，而不是展示模型计划的模糊摘要。应显示差异、收件人、金额、资源、数据来源和回滚方式。批量审批要明确范围与上限，避免“一次同意”被扩展到后续未知动作。

人审也会出错，因此需要职责分离、双人审批或专业复核用于特定高风险场景。审批负担过高会导致机械点击，应通过改进规则和工具减少无价值请求，而不是取消必要门禁。

## 工程实践与边界

- 生成 approval_id 和动作内容哈希，执行时核对哈希、审批人权限、有效期和资源版本。
- 暂停点包含完整结构化状态，但审批通知只展示最小必要敏感信息。
- 拒绝后记录原因并限制 Agent 重提相同动作，防止换一种表述绕过人审。
- 恢复时检查“检查时与使用时”竞态（TOCTOU）：资源、价格或权限变化后要求重新审批。
- 审批、执行和结果分别写审计记录，支持撤销时使用业务补偿而非删除日志。

## 常见误区

- **“有人点击就安全”**：信息不完整、默认按钮和审批疲劳都会使门禁失效。
- **“审批计划等于审批动作”**：最终参数变化后必须重新确认。
- **“低置信度才需要人审”**：高置信但高影响的操作同样需要审批。
- **“人审可以补救所有模型错误”**：高风险能力仍需最小权限、验证和限制。

## 面试追问

> **面试官：** 审批后 Agent 改了收件人怎么办？
>
> **候选人：** 收件人属于关键参数，动作哈希变化使审批失效，必须重新展示并审批。

> **面试官：** 如何降低审批疲劳？
>
> **候选人：** 按风险分级、合并同类且边界明确的低风险动作、提供清晰差异和推荐理由，并监控审批通过率与误报。

> **面试官：** 人工长时间不响应怎么办？
>
> **候选人：** 任务保持暂停并设置到期、提醒和升级路径；不能因超时自动执行高风险动作。

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
