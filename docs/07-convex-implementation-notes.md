# Convex 实现笔记（简要）

> 这里只给大致结构，具体代码交给 Cursor。

## 1. Schema 草图

```ts

// convex/schema.ts

export default defineSchema({

  users: defineTable({

    externalId: v.string(),

    profile: v.optional(v.any()),

  }).index("by_externalId", ["externalId"]),

  rooms: defineTable({

    ownerUserId: v.id("users"),

    type: v.string(), // "dm" | "group" | "project" | "global"

    title: v.string(),

    description: v.optional(v.string()),

    worldTag: v.optional(v.string()),

  }).index("by_owner", ["ownerUserId"]),

  threads: defineTable({

    roomId: v.id("rooms"),

    title: v.string(),

    status: v.string(),

  }).index("by_room", ["roomId"]),

  messages: defineTable({

    roomId: v.id("rooms"),

    threadId: v.optional(v.id("threads")),

    senderType: v.string(),

    senderUserId: v.optional(v.id("users")),

    content: v.string(), // or serialized blocks

    createdAt: v.number(),

  }).index("by_room_time", ["roomId", "createdAt"]),

  memories: defineTable({

    ownerUserId: v.id("users"),

    scope: v.string(), // "room" | "thread" | "global" | "system"

    roomId: v.optional(v.id("rooms")),

    threadId: v.optional(v.id("threads")),

    kind: v.string(),

    source: v.string(),

    content: v.string(),

    importance: v.number(),

    recencyScore: v.number(),

    usedCount: v.number(),

    status: v.string(),

    createdAt: v.number(),

    updatedAt: v.number(),

    lastUsedAt: v.optional(v.number()),

    embedding: v.optional(v.array(v.number())),

  }).index("by_owner_scope", ["ownerUserId", "scope"]),

  memory_summaries: defineTable({

    ownerUserId: v.id("users"),

    roomId: v.optional(v.id("rooms")),

    threadId: v.optional(v.id("threads")),

    level: v.number(),

    timeFrom: v.number(),

    timeTo: v.number(),

    content: v.string(),

    embedding: v.optional(v.array(v.number())),

    createdAt: v.number(),

    updatedAt: v.number(),

  }).index("by_owner_room_level", ["ownerUserId", "roomId", "level"]),

  memory_events: defineTable({

    ownerUserId: v.id("users"),

    roomId: v.optional(v.id("rooms")),

    threadId: v.optional(v.id("threads")),

    type: v.string(),

    sourceMessageId: v.optional(v.id("messages")),

    memoryId: v.optional(v.id("memories")),

    payload: v.optional(v.any()),

    createdAt: v.number(),

  }).index("by_owner_time", ["ownerUserId", "createdAt"]),

});

```

## 2. 核心 Convex 函数

* `memory.intakeForMessage`（action）

  * 输入：`messageId`

  * 从 DB 读取必要上下文

  * 调用 LLM 生成 Memory Plan

  * 根据 Plan 更新 `memories` / `memory_events`

* `memory.retrieveForReply`（query or internalAction）

  * 输入：`roomId`, `threadId`, `ownerUserId`, `latestMessageIds`

  * 输出：`{ memorySnippets, summaries }` 给 orchestrator 用于构造 prompt

* `memory.summarizeThread` / `memory.summarizeRoom`（action）

  * 输入：对应 Id + 范围

  * 调用 LLM 生成摘要，写入 `memory_summaries`

* `memory.pin`, `memory.unpin`, `memory.forget`（mutations）

  * 被 UI 直接调用，用于手动管理记忆

* `scheduler.dailyMemoryMaintenance`（定时任务）

  * 实现遗忘/归档策略

