---
title: "28. FP8、FP4 和 INT4 有什么区别？训练与推理量化怎么选？"
topic: "large language model engineering"
data_type: "comparison"
complexity: "moderate"
point_count: 4
source_language: "zh"
user_language: "zh"
---

## Main Topic

比较低位浮点和整数格式的动态范围、缩放、硬件支持及训练推理场景，给出可复现选型方法

## Learning Objectives

After viewing this infographic, the viewer should understand:

1. 比较“FP8、FP4 和 INT4 有什么区别？训练与推理量化怎么选？”涉及的主要方案与选型维度
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

- FP8 用指数和尾数表示数值，常见 E4M3、E5M2 在精度与动态范围间取舍，已用于训练和推理矩阵计算。FP4 进一步减少位数，通常依赖块级缩放和特定硬件格式；INT4 是离散整数网格，也依赖缩放因子，可用于 Weight-only 或权重/激活量化。
- | FP8 | 8-bit 浮点，多个指数/尾数组合 | 训练 GEMM、推理权重与激活 | 溢出、缩放和格式选择 |
- | FP4 元素 | 常见 E2M1 只定义 4-bit 元素编码 | 作为块量化方案的数据元素 | 单独的元素格式未定义缩放粒度 |
- | MXFP4 | OCP MX 规范中的 E2M1 元素加共享块级 scale | 开放微缩放训练/推理格式 | 块大小、scale 和累加路径要匹配实现 |
- | NVFP4 | E2M1 元素加 NVIDIA 定义的两级块缩放 | 支持硬件上的低精度训练/推理 | 依赖对应 GPU、驱动和内核 |
- | INT4 | 4-bit 整数加 scale/zero-point | 推理 Weight-only、W4A4 | 异常值、分组误差和内核兼容 |
- FP8 E4M3 提供更多尾数精度，E5M2 提供更大指数范围。实际训练框架会按前向、反向张量选择格式，并使用 delayed scaling 或动态缩放。FP4/E2M1 只是元素编码；MXFP4、NVFP4 等方案还定义块大小、scale 表示和缩放层级，不能只按“4 位浮点”推断统一数值范围。
- INT4 的数值含义由对称/非对称、分组大小、零点和校准共同决定。两个都标为 W4A16 的检查点可能无法由同一内核读取。
- 先从硬件矩阵开始：确认计算单元、驱动和框架版本支持的具体格式。再固定模型、校准集、批次和长度，对 FP16/BF16 基线做逐层或端到端对比。记录溢出、NaN、Loss 曲线和任务切片。
- **把 FP4 当作单一标准格式**：指数、尾数和微缩放约定可能不同

## Source Evidence (Verbatim)

## 60 秒回答

FP8 用指数和尾数表示数值，常见 E4M3、E5M2 在精度与动态范围间取舍，已用于训练和推理矩阵计算。FP4 进一步减少位数，通常依赖块级缩放和特定硬件格式；INT4 是离散整数网格，也依赖缩放因子，可用于 Weight-only 或权重/激活量化。

位数相同不代表数值行为或速度相同。选择要看对象是权重、激活还是 KV Cache，训练还是推理，硬件是否原生支持该格式，以及框架的分组、缩放和累加精度。最终用业务质量、吞吐、延迟和显存实测。

## 详细解析

浮点格式把位分配给符号、指数和尾数，指数提供较宽动态范围；整数格式在缩放后的固定范围内均匀或近似均匀表示。低位训练常保留更高精度的累加、主权重或优化器状态，并对张量或块动态缩放。

| 格式 | 表示特点 | 常见用途 | 主要风险 |
|---|---|---|---|
| FP8 | 8-bit 浮点，多个指数/尾数组合 | 训练 GEMM、推理权重与激活 | 溢出、缩放和格式选择 |
| FP4 元素 | 常见 E2M1 只定义 4-bit 元素编码 | 作为块量化方案的数据元素 | 单独的元素格式未定义缩放粒度 |
| MXFP4 | OCP MX 规范中的 E2M1 元素加共享块级 scale | 开放微缩放训练/推理格式 | 块大小、scale 和累加路径要匹配实现 |
| NVFP4 | E2M1 元素加 NVIDIA 定义的两级块缩放 | 支持硬件上的低精度训练/推理 | 依赖对应 GPU、驱动和内核 |
| INT4 | 4-bit 整数加 scale/zero-point | 推理 Weight-only、W4A4 | 异常值、分组误差和内核兼容 |

FP8 E4M3 提供更多尾数精度，E5M2 提供更大指数范围。实际训练框架会按前向、反向张量选择格式，并使用 delayed scaling 或动态缩放。FP4/E2M1 只是元素编码；MXFP4、NVFP4 等方案还定义块大小、scale 表示和缩放层级，不能只按“4 位浮点”推断统一数值范围。

INT4 的数值含义由对称/非对称、分组大小、零点和校准共同决定。两个都标为 W4A16 的检查点可能无法由同一内核读取。

## 工程实践与边界

先从硬件矩阵开始：确认计算单元、驱动和框架版本支持的具体格式。再固定模型、校准集、批次和长度，对 FP16/BF16 基线做逐层或端到端对比。记录溢出、NaN、Loss 曲线和任务切片。

训练时优先保证稳定性和可恢复性；推理时再按显存或吞吐目标降低位宽。关键输出层、Embedding、路由器或少数敏感层可保留更高精度，但是否保留要由消融决定。

## 常见误区

- **把 FP4 当作单一标准格式**：指数、尾数和微缩放约定可能不同
- **认为浮点总比整数准确**：取决于分布、缩放、粒度和任务
- **只看理论 TOPS**：数据搬运、反量化和回退内核会影响端到端性能
- **推理量化优化器状态**：在线推理通常没有训练优化器状态

## 面试追问

**问：为什么 FP8 训练仍保留高精度累加？**

**答：** 大量低精度乘积求和会积累舍入误差，更高精度累加和主权重有助于保持更新稳定。

**问：INT4 什么时候优先于 FP8？**

**答：** 显存或权重带宽是主要瓶颈、硬件有高效 INT4 内核且业务集质量通过时。训练稳定性优先或激活动态范围大时，FP8 可能更匹配。

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
