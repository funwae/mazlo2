# 后端架构

## 1. 总体

* Next.js App Router 前端 + API routes 仅作 edge/proxy（可选）

* Convex = 业务状态 + 业务函数（query/mutation/action）

## 2. 模块分层

Convex 目录建议：

* `convex/schema.ts`（统一 schema）

* `convex/rooms.ts`

* `convex/threads.ts`

* `convex/messages.ts`

* `convex/memory.ts`

* `convex/presence.ts`

* `convex/attachments.ts`

* `convex/settings.ts`

* `convex/provider.ts`

* `convex/scheduler.ts`（定时任务）

前端组合层：

* `/lib/orchestrator/mazlo.ts`（调度与 prompt 构建）

* `/lib/provider/openai.ts`

* `/lib/provider/zai.ts`

* `/lib/memory/buildPrompt.ts`

