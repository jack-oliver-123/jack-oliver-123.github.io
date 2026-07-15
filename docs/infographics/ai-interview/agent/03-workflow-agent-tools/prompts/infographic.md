Create one publication-ready Chinese comparison infographic.

## Output

- Use case: infographic-diagram
- Topic: Workflow、Agent、Tool 的概念边界
- Aspect ratio: 16:9 landscape
- Language: Simplified Chinese
- Layout: comparison-matrix, three columns by four comparison rows
- Style: corporate-memphis, restrained professional variant
- Audience: software engineers preparing for AI Agent interviews

## Visual Direction

Use a clean off-white background and three color-coded columns: teal for `Tool`, blue for `Workflow`, and warm orange for `Agent`. Use crisp sans-serif Chinese typography, rounded flat cards, small functional icons, clear grid boundaries, and generous padding. Keep Memphis decoration minimal: only a few small circles, lines, and geometric accents in empty corners. Do not use large people, plants, or decorative objects that reduce matrix space.

The comparison matrix must dominate the image. Add a full-width production pattern strip below the matrix. Do not draw the three concepts as nested boxes or a maturity ladder.

## Exact On-Image Text

Render only the following text. Preserve every character exactly. Do not add prose, scores, checkmarks, or random labels.

Title:
`Workflow、Agent、Tool：区别看控制权`

Subtitle badge:
`协作关系，不是三选一`

Column headers:
`Tool`
`Workflow`
`Agent`

Row headers:
`核心职责`
`控制者`
`主要风险`
`主要测试`

Tool column values:
`执行单项能力`
`调用方`
`参数、权限、副作用`
`契约、集成`

Workflow column values:
`编排已知流程`
`开发者定义`
`分支、状态`
`路径、状态迁移`

Agent column values:
`探索动态路径`
`模型 + 外层策略`
`漂移、循环、成本、安全`
`任务、轨迹、安全`

Bottom strip heading:
`生产中的混合模式`

Bottom strip flow:
`Workflow 约束主流程 → Agent 处理开放决策 → Tool 执行外部动作`

## Accuracy Constraints

- `Tool` is a capability with a contract; it does not decide the business goal.
- A `Workflow` may contain ordinary code, model calls, Tool nodes, or Agent nodes.
- An `Agent` gives the model bounded runtime choice over part of the path.
- Do not imply that Agent is always more advanced or preferable than Workflow.

## Avoid

- No dense paragraphs, long English pattern lists, nested-box hierarchy, maturity arrows, product logos, watermarks, signatures, or citations.
- No extra English beyond `Tool`, `Workflow`, and `Agent` already listed above.
- No `Tools` plural label; consistently use `Tool` as the category name.
- No garbled Chinese, repeated title, tiny text, or decorative text.
- No large characters, plants, 3D objects, photorealism, or excessive Memphis decoration.
