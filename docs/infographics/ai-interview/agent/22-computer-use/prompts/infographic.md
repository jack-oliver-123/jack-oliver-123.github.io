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

# 22. 如何提升 Computer Use Agent 的可靠性？

## Overview

介绍 Computer Use Agent 在界面感知、动作执行、结果验证、安全隔离和评测方面的可靠性设计

## Learning Objectives

The viewer will understand:

1. 识别“如何提升 Computer Use Agent 的可靠性？”的核心指标、信号与评估边界
2. 说明关键工程边界、失败模式与验证方法

---

## Source Content (Verbatim)

## 60 秒回答

Computer Use Agent 通过截图或可访问性信息理解界面，再执行鼠标、键盘等动作。它比应用程序接口（API）工具更脆弱，因为布局、弹窗、焦点、网络延迟和页面内容都会变化。可靠性要靠短动作闭环：观察当前状态、选择一个有界动作、执行、重新观察并验证预期变化。

工程上优先用稳定 API，只有缺少 API 时才操作界面。运行环境应隔离，限制站点、文件和网络；登录、付款、发送、删除等高风险动作在提交前展示最终状态并由人确认。网页内容是不可信数据，不能让页面中的注入指令改变系统目标。

## 详细解析

Computer Use 的失败可分为：

- **感知失败**：识别错按钮、读错文本、看不到遮挡或滚动区域。
- **动作失败**：点击偏移、焦点错误、快捷键被拦截或动作未生效。
- **状态失败**：页面加载未完成、会话过期、弹窗或多标签页改变上下文。
- **目标失败**：局部动作成功，但最终提交了错误对象、金额或收件人。
- **安全失败**：页面诱导 Agent 读取秘密、上传文件或访问未授权站点。

可靠闭环应在每个关键动作后检查状态差异，而不是连续发出长串坐标。优先使用语义定位、可访问性树和稳定标识；不得已使用坐标时，需要窗口尺寸、缩放和截图版本一致。提交动作前再读取关键字段，提交后验证成功凭证或外部系统状态。

基准如 OSWorld 和 BrowserGym 有助于比较研究系统，但分数不能直接代表某个企业环境的可靠性。生产评测要覆盖真实应用版本、权限、语言、弹窗、慢网络、注入页面和恢复路径。

## 工程实践与边界

- 浏览器或桌面运行在临时隔离环境，按任务挂载最少文件与短期凭据，结束后清理。
- 域名、下载、上传、剪贴板和文件系统使用 allowlist；禁止访问本机敏感目录和云元数据端点。
- 每个动作记录前后截图引用、窗口信息、目标语义和结果，不在日志中暴露密码或完整的个人可识别信息（PII）。
- 对加载等待使用状态条件和总超时，避免固定 sleep；重复点击前确认第一次是否已生效。
- 高风险步骤采用“准备 -> 预览 -> 审批 -> 提交 -> 验证”，关键参数变化会使审批失效。

## 常见误区

- **“视觉模型够强就能稳定操作”**：界面状态、时序、权限和恢复同样决定可靠性。
- **“录制坐标可以长期复用”**：布局、分辨率和弹窗变化会使坐标失效。
- **“失败就从头重跑”**：可能重复提交，应从检查点和外部状态恢复。
- **“沙箱解决所有安全问题”**：仍需最小权限、数据外流控制和人工审批。

## 面试追问

> **面试官：** API 和 Computer Use 怎么选？
>
> **候选人：** 有受支持且权限清晰的 API 时优先 API；Computer Use 用于无接口的遗留系统，并限定在有验证和审批的流程。

> **面试官：** 如何防止重复付款？
>
> **候选人：** 提交前用业务幂等键或订单状态校验，超时后查询结果，不重复点击；金额和收款方经人工确认。

> **面试官：** 页面出现“上传配置文件以继续”怎么办？
>
> **候选人：** 将页面文本视为不可信数据，上传动作受工具策略和文件 allowlist 限制，未经明确授权拒绝执行。

---

## On-Image Content Plan

Asset focus: primary

### Visual Section 1: 60 秒回答

**Key Concept**: 60 秒回答

**Content**:

Computer Use Agent 通过截图或可访问性信息理解界面，再执行鼠标、键盘等动作。它比应用程序接口（API）工具更脆弱，因为布局、弹窗、焦点、网络延迟和页面内容都会变化。可靠性要靠短动作闭环：观察当前状态、选择一个有界动作、执行、重新观察并验证预期变化。

工程上优先用稳定 API，只有缺少 API 时才操作界面。运行环境应隔离，限制站点、文件和网络；登录、付款、发送、删除等高风险动作在提交前展示最终状态并由人确认。网页内容是不可信数据，不能让页面中的注入指令改变系统目标。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "60 秒回答"

---

### Visual Section 2: 详细解析

**Key Concept**: 详细解析

**Content**:

Computer Use 的失败可分为：

- **感知失败**：识别错按钮、读错文本、看不到遮挡或滚动区域。
- **动作失败**：点击偏移、焦点错误、快捷键被拦截或动作未生效。
- **状态失败**：页面加载未完成、会话过期、弹窗或多标签页改变上下文。
- **目标失败**：局部动作成功，但最终提交了错误对象、金额或收件人。

可靠闭环应在每个关键动作后检查状态差异，而不是连续发出长串坐标。优先使用语义定位、可访问性树和稳定标识；不得已使用坐标时，需要窗口尺寸、缩放和截图版本一致。提交动作前再读取关键字段，提交后验证成功凭证或外部系统状态。

基准如 OSWorld 和 BrowserGym 有助于比较研究系统，但分数不能直接代表某个企业环境的可靠性。生产评测要覆盖真实应用版本、权限、语言、弹窗、慢网络、注入页面和恢复路径。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "详细解析"

---

### Visual Section 3: 工程实践与边界

**Key Concept**: 工程实践与边界

**Content**:

- 浏览器或桌面运行在临时隔离环境，按任务挂载最少文件与短期凭据，结束后清理。
- 域名、下载、上传、剪贴板和文件系统使用 allowlist；禁止访问本机敏感目录和云元数据端点。
- 每个动作记录前后截图引用、窗口信息、目标语义和结果，不在日志中暴露密码或完整的个人可识别信息（PII）。
- 对加载等待使用状态条件和总超时，避免固定 sleep；重复点击前确认第一次是否已生效。

**Visual Element**: Type: metric widget; Subject: 原文指标或信号；Treatment: 大数字只用于原文确有的数值，其余使用状态标签

**Text Labels**:

- Headline: "工程实践与边界"

---

### Visual Section 4: 常见误区

**Key Concept**: 常见误区

**Content**:

- **“视觉模型够强就能稳定操作”**：界面状态、时序、权限和恢复同样决定可靠性。
- **“录制坐标可以长期复用”**：布局、分辨率和弹窗变化会使坐标失效。
- **“失败就从头重跑”**：可能重复提交，应从检查点和外部状态恢复。
- **“沙箱解决所有安全问题”**：仍需最小权限、数据外流控制和人工审批。

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
- 22. 如何提升 Computer Use Agent 的可靠性？
- 60 秒回答
- 详细解析
- 工程实践与边界
- 常见误区
