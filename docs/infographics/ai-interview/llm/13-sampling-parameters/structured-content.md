# 13. 大模型的参数：温度值、Top-P、Top-K 分别是什么？各个场景下的最佳设置是什么？

## Overview

解释 Temperature、Top-p 与 Top-k 如何改变采样分布，并给出基于评测而非固定最佳值的调参方法

## Learning Objectives

The viewer will understand:

1. 比较“大模型的参数：温度值、Top-P、Top-K 分别是什么？各个场景下的最佳设置是什么？”涉及的主要方案与选型维度
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

Temperature 用 $T$ 缩放 logits：$p_i=\operatorname{softmax}(z_i/T)$。$T$ 较小会让分布更尖，较大则增加多样性。Top-k 只保留概率最高的 $k$ 个 Token；Top-p，也叫 nucleus sampling，保留累计概率达到 $p$ 的最小候选集合。

不存在跨模型、Prompt 和任务通用的固定设置。抽取与工具参数偏向低随机性并配合 Schema；开放创作可增加随机性；推理任务可生成多个候选再验证。供应商对 `temperature=0`、参数组合和默认值的实现不同，部署前要阅读对应 API 并做业务评测。

## 详细解析

三者作用位置不同：

1. 模型先输出词表 logits
2. Temperature 调整整个分布的相对差距
3. Top-k 和 Top-p 按实现顺序截断候选集合
4. 对剩余概率重新归一化并采样

Top-k 的集合大小固定，但在模型非常确定时可能保留很多几乎为零的候选；Top-p 的集合随不确定性变化，分布集中时集合小，分布平坦时集合大。二者可组合，但组合后的有效候选是交集，调参空间也更复杂。

可按目标建立起始区间，而不是“标准答案”：

| 场景 | 调参方向 | 还需配合 |
|---|---|---|
| 结构化抽取 | 降低随机性 | Schema、字段校验、重试 |
| 客服问答 | 控制多样性 | 检索引用、拒答与事实评测 |
| 创意写作 | 提高候选多样性 | 人工选择、风格与安全检查 |
| 可验证推理 | 多次采样 | 测试、执行器或结果投票 |

Temperature 只重分配已有概率，不能增加模型未学到的知识。Top-k/Top-p 只裁剪下一 Token 候选，也不会自动防止整段回答偏题。

## 工程实践与边界

把参数当作版本化配置，与模型、Prompt 和评测集一起发布。离线记录任务成功率、事实性、格式通过率、重复率、延迟和 Token 数；线上再用小流量比较。不要只看主观“更自然”。

对需要审计的任务保存实际生效参数。若 API 不支持某参数或会忽略冲突组合，应在适配层显式校验，避免客户端以为配置已生效。

## 常见误区

- **把 Temperature 当作事实开关**：低温仍可能稳定地产生错误答案
- **认为 Top-p 是固定数量**：它按累计概率动态确定候选数
- **照搬另一个模型的参数**：不同模型的 logits 校准和 API 语义可能不同
- **只跑单次样本调参**：随机策略需要多次运行并报告方差

## 面试追问

**问：Temperature 越高，所有 Token 概率会更高吗？**

**答：** 概率总和仍为 1。升温让分布更平坦，低概率 Token 的相对概率上升，而最高概率 Token 的概率通常下降。

**问：Top-k 和 Top-p 应该同时开吗？**

**答：** 可以，但没有默认收益。先单独建立基线，再根据候选规模和任务指标决定是否组合。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

Temperature 用 $T$ 缩放 logits：$p_i=\operatorname{softmax}(z_i/T)$。$T$ 较小会让分布更尖，较大则增加多样性。Top-k 只保留概率最高的 $k$ 个 Token；Top-p，也叫 nucleus sampling，保留累计概率达到 $p$ 的最小候选集合。

不存在跨模型、Prompt 和任务通用的固定设置。抽取与工具参数偏向低随机性并配合 Schema；开放创作可增加随机性；推理任务可生成多个候选再验证。供应商对 `temperature=0`、参数组合和默认值的实现不同，部署前要阅读对应 API 并做业务评测。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

三者作用位置不同：

1. 模型先输出词表 logits
2. Temperature 调整整个分布的相对差距
3. Top-k 和 Top-p 按实现顺序截断候选集合
4. 对剩余概率重新归一化并采样

Top-k 的集合大小固定，但在模型非常确定时可能保留很多几乎为零的候选；Top-p 的集合随不确定性变化，分布集中时集合小，分布平坦时集合大。二者可组合，但组合后的有效候选是交集，调参空间也更复杂。

可按目标建立起始区间，而不是“标准答案”：

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

把参数当作版本化配置，与模型、Prompt 和评测集一起发布。离线记录任务成功率、事实性、格式通过率、重复率、延迟和 Token 数；线上再用小流量比较。不要只看主观“更自然”。

对需要审计的任务保存实际生效参数。若 API 不支持某参数或会忽略冲突组合，应在适配层显式校验，避免客户端以为配置已生效。

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **把 Temperature 当作事实开关**：低温仍可能稳定地产生错误答案
- **认为 Top-p 是固定数量**：它按累计概率动态确定候选数
- **照搬另一个模型的参数**：不同模型的 logits 校准和 API 语义可能不同
- **只跑单次样本调参**：随机策略需要多次运行并报告方差

**Visual Element**: Type: comparison grid; Subject: 原文方案与维度；Treatment: 清晰表头、短标签、重点列高亮

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- 不存在跨模型、Prompt 和任务通用的固定设置。抽取与工具参数偏向低随机性并配合 Schema；开放创作可增加随机性；推理任务可生成多个候选再验证。供应商对 `temperature=0`、参数组合和默认值的实现不同，部署前要阅读对应 API 并做业务评测。

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
