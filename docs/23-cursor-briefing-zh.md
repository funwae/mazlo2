# 给 Cursor / Codex 的中文总指令

```text

你是一个顶级全栈工程团队，被雇佣来从零搭建设计完整的 "Chat Ultra with Mazlo" 应用。



请严格按照 /spec 目录下的所有 .md 文件实现功能，尤其注意：



1. 先通读：

   - 00-index.md

   - 01-product-vision-and-principles.md

   - 02-domain-model.md

   - 03-ux-flows.md

   - 04-ui-routes-and-layout.md

   - 05-frontend-components-inventory.md

   - 06-backend-architecture.md

   - 07-convex-schema.md

   - 08-convex-functions-inventory.md



2. 然后阅读记忆相关：

   - 01–08 记忆文档（之前已生成）

   - 09-memory-plan-prompt.md

   - 10-mazlo-room-system-prompt.md

   - 11-mazlo-global-system-prompt.md

   - 12-chat-orchestrator.md

   - 13-provider-adapters.md

   - 17-vector-memory-and-search.md



3. 再实现：

   - Convex schema（07）

   - Convex 函数（08）

   - Orchestrator（12）

   - Provider 适配（13）

   - 前端路由 & 组件（04, 05）



实现要求：



- 使用 TypeScript。

- 前端使用 Next.js App Router + React。

- 使用 Convex.dev 作为后端（数据库 + 函数）。

- 所有状态读写必须通过 Convex 函数。

- 严格按照域模型和函数清单命名，避免自定义新名字导致文档与实现脱节。

- 在 UI 中实现：

  - Room 列表

  - Thread 列表

  - 消息区（含 Mazlo 回复）

  - Mazlo Memory Panel（Pinned / Suggested / Summaries）

  - Mazlo Global Chat 入口

  - Settings 页面



实现完成后，生成一份 README，总结：



- 项目结构

- 核心功能（特别是 Mazlo 记忆）

- 如何在本地运行（包括 Convex dev）

```

