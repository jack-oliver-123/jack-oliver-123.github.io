# 27. Prefill 和 Decode 为什么要分离？TTFT、TPOT 和吞吐怎么权衡？

## Overview

解释 Prefill 与 Decode 的资源特征、分离部署和 KV 传输，并用 TTFT、TPOT、吞吐和尾延迟做容量决策

## Learning Objectives

The viewer will understand:

1. 建立“Prefill 和 Decode 为什么要分离？TTFT、TPOT 和吞吐怎么权衡？”的完整知识框架
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

Prefill 一次处理全部输入 Token，矩阵乘法规模大，通常更偏计算密集；Decode 每步处理一个新 Token，却要读取模型权重和历史 KV，通常更偏显存带宽与容量。把两阶段分到不同实例池，可分别优化大批次 Prefill 和低抖动 Decode，减少长 Prompt 对正在生成请求的干扰。

分离也有代价：Prefill 结束后要把 KV Cache 传给 Decode 节点，增加网络、调度和故障状态。是否值得取决于请求长度、并发、互连和 SLO。TTFT 衡量首 Token 等待，TPOT 衡量后续 Token 间隔，吞吐衡量单位时间工作量，三者不能只优化一个。

## 详细解析

关键指标定义如下：

- **Time to First Token（TTFT）**：从请求到首个输出 Token，包含排队、Prefill 和调度
- **Time per Output Token（TPOT）**：首 Token 后相邻输出 Token 的平均或分位间隔
- **End-to-End Latency**：完整回答耗时，受输出长度影响
- **Throughput**：每秒请求或输入/输出 Token，必须注明口径

共置部署让同一 GPU 在 Prefill 和 Decode 间连续批处理，结构较简洁，但长 Prompt 的大计算块会干扰 Decode 尾延迟。分离部署为两类阶段建立独立队列和资源池，允许不同并行、批次和硬件配置。

一条分离链路包括：

1. 路由器把请求发送到 Prefill 节点
2. Prefill 生成首 Token 和全部前缀 KV
3. 系统通过高速互连把 KV 传输或暴露给 Decode 节点
4. Decode 节点接管请求并持续流式输出

KV 传输时间与上下文长度、层数、KV 头和精度相关。网络不足时，分离节省的干扰可能被传输抵消。

## 工程实践与边界

先在共置方案上测输入/输出长度矩阵和队头阻塞。只有当 Prefill 干扰已成为 SLO 瓶颈，再评估分离。压测需要包括 KV 传输、节点失效、取消请求和池间背压，而不是只跑稳定状态。

调度器按 Token 预算而不是请求数限流。Prefill 队列控制 TTFT，Decode 容量控制 TPOT；自动扩缩容要考虑模型加载和 KV 状态无法瞬时迁移。

## 常见误区

- **把 Prefill 和 Decode 都按 FLOPs 判断**：Decode 常受带宽与 KV 容量制约
- **认为分离会同时改善全部指标**：KV 传输和额外排队可能增加 TTFT
- **只报平均 TPOT**：交互体验更受 P95/P99 抖动影响
- **按请求数做容量规划**：Token 长度差异会让请求成本相差很大

## 面试追问

**问：为什么连续批处理还会有干扰？**

**答：** 调度器虽能动态加入请求，但大 Prefill 块仍会占用计算和内存资源，延迟 Decode 批次。Chunked Prefill 可缓解，代价是更多调度切片。

**问：分离后 Decode 节点故障怎么办？**

**答：** 需要取消或重放策略。若 KV 没有副本，通常从 Prompt 重新 Prefill；因此应设置幂等请求 ID、流状态和客户端可识别的恢复语义。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

Prefill 一次处理全部输入 Token，矩阵乘法规模大，通常更偏计算密集；Decode 每步处理一个新 Token，却要读取模型权重和历史 KV，通常更偏显存带宽与容量。把两阶段分到不同实例池，可分别优化大批次 Prefill 和低抖动 Decode，减少长 Prompt 对正在生成请求的干扰。

分离也有代价：Prefill 结束后要把 KV Cache 传给 Decode 节点，增加网络、调度和故障状态。是否值得取决于请求长度、并发、互连和 SLO。TTFT 衡量首 Token 等待，TPOT 衡量后续 Token 间隔，吞吐衡量单位时间工作量，三者不能只优化一个。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

关键指标定义如下：

- **Time to First Token（TTFT）**：从请求到首个输出 Token，包含排队、Prefill 和调度
- **Time per Output Token（TPOT）**：首 Token 后相邻输出 Token 的平均或分位间隔
- **End-to-End Latency**：完整回答耗时，受输出长度影响
- **Throughput**：每秒请求或输入/输出 Token，必须注明口径

共置部署让同一 GPU 在 Prefill 和 Decode 间连续批处理，结构较简洁，但长 Prompt 的大计算块会干扰 Decode 尾延迟。分离部署为两类阶段建立独立队列和资源池，允许不同并行、批次和硬件配置。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

先在共置方案上测输入/输出长度矩阵和队头阻塞。只有当 Prefill 干扰已成为 SLO 瓶颈，再评估分离。压测需要包括 KV 传输、节点失效、取消请求和池间背压，而不是只跑稳定状态。

调度器按 Token 预算而不是请求数限流。Prefill 队列控制 TTFT，Decode 容量控制 TPOT；自动扩缩容要考虑模型加载和 KV 状态无法瞬时迁移。

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **把 Prefill 和 Decode 都按 FLOPs 判断**：Decode 常受带宽与 KV 容量制约
- **认为分离会同时改善全部指标**：KV 传输和额外排队可能增加 TTFT
- **只报平均 TPOT**：交互体验更受 P95/P99 抖动影响
- **按请求数做容量规划**：Token 长度差异会让请求成本相差很大

**Visual Element**: Type: modular knowledge card; Subject: 原文关键知识区；Treatment: 不同尺寸的信息块和简洁图标

**Text Labels**:

- Headline: "常见误区"

---

## Data Points (Verbatim)

- **只报平均 TPOT**：交互体验更受 P95/P99 抖动影响

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
