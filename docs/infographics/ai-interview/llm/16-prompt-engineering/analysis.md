---
title: "16. 如何写好 Prompt？分享下 Prompt 工程实践经验？"
topic: "large language model engineering"
data_type: "process"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

给出可评测、可版本化的 Prompt 设计流程，覆盖指令、上下文、示例、Schema、安全与回归测试

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 复述“如何写好 Prompt？分享下 Prompt 工程实践经验？”的关键流程与控制点
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

可靠 Prompt 先定义任务、输入边界和验收标准，再写清指令、上下文、示例、输出 Schema 与失败行为。把可信系统指令和不可信业务数据分开，使用清晰分隔符，并要求模型在证据不足时返回可处理的状态。结构化任务优先使用供应商的 Structured Outputs 或约束解码，服务端仍要做 Schema 与业务校验。

Prompt 需要像代码一样版本化。建立覆盖正常、边界、对抗和拒答样本的评测集，记录模型与采样参数，改动后运行回归。Prompt 能降低错误率，但不能代替权限检查、事实来源、工具参数验证和安全隔离。

## 详细解析

一个可维护的 Prompt 通常包含以下组件：

1. **目标**：用可验证动作描述任务，例如“从合同中抽取字段”
2. **输入契约**：说明数据来源、字段含义和允许缺失的情况
3. **决策规则**：给出优先级、边界和冲突处理
4. **示例**：覆盖容易混淆的正例和反例，避免只展示理想输入
5. **输出契约**：定义 Schema、枚举、引用和错误状态
6. **工具规则**：说明何时调用、允许的参数和需要审批的动作

长 Prompt 不是目标。每条规则都应对应已知失败模式或验收项。指令冲突时，应由应用层明确层级；不要依赖模型猜测最近一句或最长一段更重要。

Few-shot 示例会同时传递格式和隐含决策边界。示例分布偏窄时，模型可能模仿表面模式。对分类或抽取任务，应按类别和边界样本做消融，检查删除某个示例后的变化。

## 工程实践与边界

将 Prompt 模板、模型 ID、工具 Schema 和评测集版本绑定发布。指标至少包含任务正确率、格式通过率、事实引用、安全攻击成功率、延迟和 Token 成本。对随机生成运行多次并报告方差。

Prompt Injection 的根因是不可信文本与指令共享模型上下文。缓解方式包括最小权限工具、来源标记、检索内容隔离、参数白名单、人审和动作后验证。禁止把“忽略前文”一类防御句当作安全边界。

## 常见误区

- **堆叠角色形容词**：“你是资深专家”不能替代任务规则和评测标准
- **要求模型输出内部思维链**：生产系统更适合请求简短依据、引用或可验证中间结果
- **用 JSON 提示代替约束**：自然语言要求仍可能生成非法 JSON
- **只测几个成功案例**：Prompt 改动可能修复一类输入并破坏另一类

## 面试追问

**问：系统 Prompt 能防止用户覆盖规则吗？**

**答：** 指令层级能降低部分冲突，但不能形成强安全隔离。权限、数据访问和副作用必须由模型外的代码控制。

**问：Prompt 版本怎么灰度？**

**答：** 先跑固定离线集，再按稳定哈希分流小比例请求，比较质量、延迟和安全指标，并保留一键回滚到旧模板和模型的能力。

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
