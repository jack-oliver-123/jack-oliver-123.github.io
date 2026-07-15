Create one publication-ready Chinese technical architecture infographic.

## Output

- Use case: scientific-educational
- Topic: Agent 架构的六类核心职责
- Aspect ratio: 16:9 landscape
- Language: Simplified Chinese
- Layout: structural-breakdown, exploded architecture view
- Style: technical-schematic, light blueprint variant
- Audience: software engineers preparing for AI Agent interviews

## Visual Direction

Use a light gray-white engineering grid background with navy blue structure lines, cyan connectors, and amber highlights. Use clean vector geometry, consistent strokes, precise callout lines, and ample whitespace. Chinese text must be large, crisp, horizontal, and print-like. Avoid microscopic annotations and decorative pseudo-code.

Build an exploded system diagram around a central `编排器 / 状态机`:

- Put `模型与指令` above the center.
- Put `状态与记忆` to the left.
- Put `工具与执行环境` to the right.
- Wrap the main system with a visible protective boundary labeled `安全与治理`.
- Put `可观测与评测` as a feedback foundation below.
- Connect all modules with one clearly numbered execution loop.

The viewer should understand both component responsibilities and the direction of control in under ten seconds.

## Exact On-Image Text

Render only the following Chinese text. Preserve every character exactly. Do not invent additional labels or paragraphs.

Title:
`Agent 架构：六类核心职责`

Module 1:
`模型与指令`
`理解目标 / 生成动作`

Module 2:
`编排器 / 状态机`
`循环 / 预算 / 停止`

Module 3:
`工具与执行环境`
`鉴权 / 超时 / 限流 / 沙箱`

Module 4:
`状态与记忆`
`当前进度 / 可检索历史`

Module 5:
`安全与治理`
`权限 / 校验 / 审批`

Module 6:
`可观测与评测`
`追踪 / 回放 / 质量门禁`

Execution loop, numbered from 1 to 6:
`目标与上下文 → 模型提出动作 → 策略校验 → 工具执行 → 结果写回 → 下一步或停止`

Small callout:
`MCP 提供连接，不替代授权`

## Accuracy Constraints

- The model may propose an action; the runtime must authorize and execute it.
- Planning is a control strategy and does not need to be shown as a mandatory standalone service.
- Keep precise task state distinct from semantic long-term memory.
- Security and observability must visibly surround or support the normal execution path, not appear as optional afterthoughts.

## Avoid

- No dense paragraphs, tiny measurements, pseudo-code, database query text, cloud vendor logos, watermarks, signatures, or citations.
- No extra English except `Agent` and `MCP` already listed above.
- No garbled Chinese, repeated labels, cut-off text, or random alphanumeric annotations.
- No dark low-contrast blueprint, photorealistic hardware, or decorative machinery unrelated to software architecture.
