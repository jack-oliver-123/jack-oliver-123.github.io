Create a professional infographic following these specifications:

## Image Specifications

- **Type**: Infographic
- **Layout**: dashboard
- **Style**: pop-laboratory
- **Aspect Ratio**: 16:9
- **Language**: zh

## Core Principles

- Follow the layout structure precisely for information architecture
- Apply style aesthetics consistently throughout
- If content involves sensitive or copyrighted figures, create stylistically similar alternatives
- Keep information concise, highlight keywords and core concepts
- Use ample whitespace for visual clarity
- Maintain clear visual hierarchy

## Text Requirements

- All text must match the specified style treatment
- Main titles should be prominent and readable
- Key concepts should be visually emphasized
- Labels should be clear and appropriately sized
- Use the specified language for all text content

## Layout Guidelines

# dashboard

Multi-metric display with charts, numbers, and KPI indicators.

## Structure

- Multiple data widgets
- Charts, graphs, numbers
- Grid or modular layout
- Key metrics prominent
- Status indicators

## Best For

- KPI summaries
- Performance metrics
- Analytics overviews
- Status reports
- Data snapshots

## Visual Elements

- Chart types (bar, line, pie, gauge)
- Big numbers for KPIs
- Trend arrows (up/down)
- Color-coded status (green/red)
- Clean data visualization

## Text Placement

- Title at top
- Widget titles above each section
- Metric labels and values
- Units clearly shown
- Time period indicated

## Recommended Pairings

- `corporate-memphis`: Business dashboards
- `ui-wireframe`: Technical dashboards
- `cyberpunk-neon`: Futuristic displays


## Style Guidelines

# pop-laboratory

Lab manual precision meets pop art color impact—coordinate systems, technical diagrams, and fluorescent accents on blueprint grid.

## Color Palette

- Background: Professional grayish-white with faint blueprint grid texture (#F2F2F2)
- Primary: Muted teal/sage green (#B8D8BE) for major functional blocks and data zones
- High-alert accent: Vibrant fluorescent pink (#E91E63) strictly for warnings, critical data, or "winner" highlights
- Marker highlights: Vivid lemon yellow (#FFF200) as translucent highlighter effect for keywords
- Line art: Ultra-fine charcoal brown (#2D2926) for technical grids, coordinates, and hairlines

## Visual Elements

- Coordinate-style labels on every module (e.g., R-20, G-02, SEC-08)
- Technical diagrams: exploded views, cross-sections with anchor points, architectural skeletal lines
- Vertical/horizontal rulers with precise markers (0.5mm, 1.8mm, 45°)
- "Marker-over-print" effect: color blocks slightly offset from text, postmodern print feel
- Cross-hair targets, mathematical symbols (Σ, Δ, ∞), directional arrows (X/Y axis)
- Microscopic detail annotations alongside macroscopic bold headers
- Corner metadata: tiny barcodes, timestamps, technical parameters
- High contrast between massive bold headers and tiny 8pt-style annotations

## Typography

- Headers: Bold brutalist characters, high visual impact
- Body: Professional sans-serif or crisp technical print
- Numbers: Large, highlighted with yellow or blue to stand out
- Annotations: Ultra-crisp, small technical labels

## Style Enforcement

- Strictly systematic color usage: only teal, pink, yellow, charcoal—no rainbow palette
- Sufficient fine grid lines and coordinate annotations throughout
- Maintain tension between large impactful headers and small precise parameters
- Lab manual aesthetic: mix of microscopic details and macroscopic data

## Avoid

- Cute or cartoonish doodles
- Soft pastels or generic textures
- Empty white space
- Flat vector stock icons
- Organic or hand-drawn imperfections

## Best For

Technical product guides, specification comparisons, precision-focused data visualization, engineering-adjacent content


---

Generate the infographic based on the content below:

# 20. 如何设计安全的工具执行环境？

## Overview

介绍安全工具执行的分层防护，覆盖提示注入、最小权限、沙箱、网络出口、审批与审计

## Learning Objectives

The viewer will understand:

1. 识别“如何设计安全的工具执行环境？”的核心指标、信号与评估边界
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

👔面试官：工具参数通过 JSON Schema 后，可以直接执行吗？

🙋我：不可以。还要做业务校验、主体授权、风险审批和执行隔离。

👔面试官：最大的威胁只是模型幻觉吗？

🙋我：还包括提示注入、越权代理、命令与路径注入、SSRF、数据外泄和恶意工具供应链。

## 60 秒回答

安全工具执行要采用分层控制。入口只暴露当前主体获准的工具；参数先做 Schema 与业务校验；授权按用户、租户、资源和动作判定；高风险副作用要求明确确认。执行器使用最小权限身份，在沙箱中限制文件、进程、网络出口、CPU、内存和时间。

工具结果也不可信，要限制大小、标注来源、脱敏并防止其文本改变高优先级策略。写操作使用幂等键和审计，失败采用有限重试与补偿。密钥放在执行环境，不进入模型上下文。

## 详细解析

### 威胁模型

提示注入可能来自网页、文件、邮件、MCP Resource 或 Tool 结果，诱导 Agent 泄露数据或调用高权限工具。模型还可能成为 confused deputy：攻击者没有权限，却借 Host 的服务身份执行操作。

参数层还要防路径穿越、命令注入、SQL 注入、服务端请求伪造（SSRF）和超大输入。安装本地 MCP Server 或 Skill 脚本时，还存在供应链和启动命令风险。

### 防护链

1. 按主体和任务生成工具允许名单
2. 用严格 Schema 解析，再做业务语义校验
3. 在执行点做资源级授权，不信任模型传入的身份
4. 对外发消息、付款、删除和权限变更请求用户确认
5. 在隔离环境限制文件、进程、网络和资源
6. 对结果做大小限制、脱敏、内容类型与来源标记
7. 记录决策、批准、调用、结果和补偿

确认界面要展示真实动作、目标与影响，不能只问“是否继续”。批量批准要限定工具、参数范围和有效期。

### 密钥与网络

为每个工具分配最小权限凭证，短期令牌优于长期共享密钥。禁止令牌透传给下游未知服务。网络出口使用域名或服务允许名单，并在 DNS 解析后再次检查目标，防止访问元数据和内网地址。

## 工程实践与边界

把执行策略放在模型外的确定性代码中。为每个工具声明风险等级、数据分类、默认超时、是否可重试、是否幂等和是否需审批。用恶意文档、混淆 URL、越权资源 ID 和并发写冲突做回归测试。

沙箱不能代替授权，人工确认也不能代替参数校验。多层控制要让任一层失误时仍难以造成不可逆损失。

## 常见误区

- **系统提示能阻止所有注入**：不可信内容仍可能影响模型决策
- **只读工具没有风险**：它可能读取并泄露敏感数据
- **人工确认解决全部问题**：用户可能看不到被隐藏或误述的参数
- **本地 Server 天然可信**：它继承的文件、环境和网络权限可能过大

## 面试追问

**追问：怎样防止工具结果中的注入继续影响模型？**

标记来源，把结果作为数据而非指令，裁剪内容，并由确定性策略限制后续可调用工具与参数。

**追问：审计日志至少记录什么？**

主体、会话、工具版本、规范化参数摘要、授权决策、确认、幂等键、执行结果、重试与补偿，同时对敏感值脱敏。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

安全工具执行要采用分层控制。入口只暴露当前主体获准的工具；参数先做 Schema 与业务校验；授权按用户、租户、资源和动作判定；高风险副作用要求明确确认。执行器使用最小权限身份，在沙箱中限制文件、进程、网络出口、CPU、内存和时间。

工具结果也不可信，要限制大小、标注来源、脱敏并防止其文本改变高优先级策略。写操作使用幂等键和审计，失败采用有限重试与补偿。密钥放在执行环境，不进入模型上下文。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

### 威胁模型
提示注入可能来自网页、文件、邮件、MCP Resource 或 Tool 结果，诱导 Agent 泄露数据或调用高权限工具。

参数层还要防路径穿越、命令注入、SQL 注入、服务端请求伪造（SSRF）和超大输入。安装本地 MCP Server 或 Skill 脚本时，还存在供应链和启动命令风险。

### 防护链
1. 按主体和任务生成工具允许名单 2. 用严格 Schema 解析，再做业务语义校验 3. 在执行点做资源级授权，不信任模型传入的身份 4. 对外发消息、付款、删除和权限变更请求用户确认 5. 在隔离环境限制文件、进程、网络和资源 6. 对结果做大小限制、脱敏、内容类型与来源标记 7. 记录决策、批准、调用、结果和补偿

确认界面要展示真实动作、目标与影响，不能只问“是否继续”。批量批准要限定工具、参数范围和有效期。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

把执行策略放在模型外的确定性代码中。为每个工具声明风险等级、数据分类、默认超时、是否可重试、是否幂等和是否需审批。用恶意文档、混淆 URL、越权资源 ID 和并发写冲突做回归测试。

沙箱不能代替授权，人工确认也不能代替参数校验。多层控制要让任一层失误时仍难以造成不可逆损失。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **系统提示能阻止所有注入**：不可信内容仍可能影响模型决策
- **只读工具没有风险**：它可能读取并泄露敏感数据
- **人工确认解决全部问题**：用户可能看不到被隐藏或误述的参数
- **本地 Server 天然可信**：它继承的文件、环境和网络权限可能过大

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

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


Text labels (in zh):
- 20. 如何设计安全的工具执行环境？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
