import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
    displayName: v.string(),
    avatarUrl: v.optional(v.string()),
    locale: v.string(),
    timeZone: v.string(),
    createdAt: v.number(),
  }).index("by_externalId", ["externalId"]),

  providerConfigs: defineTable({
    ownerUserId: v.optional(v.id("users")),
    provider: v.string(), // "openai" | "zai"
    apiKeyRef: v.string(),
    defaultModel: v.string(),
    enabled: v.boolean(),
    createdAt: v.number(),
  }).index("by_owner", ["ownerUserId"]),

  rooms: defineTable({
    ownerUserId: v.id("users"),
    type: v.string(), // "dm" | "group" | "project" | "global"
    title: v.string(),
    description: v.optional(v.string()),
    worldTag: v.optional(v.string()),
    archived: v.boolean(),
    createdAt: v.number(),
  }).index("by_owner", ["ownerUserId"]),

  threads: defineTable({
    roomId: v.id("rooms"),
    title: v.string(),
    status: v.string(), // "active" | "paused" | "done"
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_room", ["roomId"]),

  messages: defineTable({
    roomId: v.id("rooms"),
    threadId: v.optional(v.id("threads")),
    senderType: v.string(), // "user" | "mazlo"
    senderUserId: v.optional(v.id("users")),
    role: v.string(), // "user" | "assistant" | "system"
    content: v.string(), // JSON/stringified markdown
    meta: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_room_time", ["roomId", "createdAt"])
    .index("by_thread_time", ["threadId", "createdAt"]),

  memories: defineTable({
    ownerUserId: v.id("users"),
    scope: v.string(), // "room" | "thread" | "global" | "system"
    roomId: v.optional(v.id("rooms")),
    threadId: v.optional(v.id("threads")),
    kind: v.string(), // "fact" | "preference" | "plan" | "identity" | "project"
    source: v.string(), // "user_pin" | "user_edit" | "auto_extracted" | "imported"
    content: v.string(),
    importance: v.number(),
    recencyScore: v.number(),
    usedCount: v.number(),
    status: v.string(), // "active" | "archived" | "deleted"
    createdAt: v.number(),
    updatedAt: v.number(),
    lastUsedAt: v.optional(v.number()),
    embedding: v.optional(v.array(v.number())),
  })
    .index("by_owner_scope", ["ownerUserId", "scope"])
    .index("by_room", ["roomId"])
    .index("by_thread", ["threadId"]),

  memory_summaries: defineTable({
    ownerUserId: v.id("users"),
    roomId: v.optional(v.id("rooms")),
    threadId: v.optional(v.id("threads")),
    level: v.number(), // 0..3
    timeFrom: v.number(),
    timeTo: v.number(),
    content: v.string(),
    embedding: v.optional(v.array(v.number())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner_room_level", ["ownerUserId", "roomId", "level"])
    .index("by_thread_level", ["threadId", "level"]),

  memory_events: defineTable({
    ownerUserId: v.id("users"),
    roomId: v.optional(v.id("rooms")),
    threadId: v.optional(v.id("threads")),
    type: v.string(), // "candidate" | "write" | "update" | "forget" | "pin" | "summarize"
    sourceMessageId: v.optional(v.id("messages")),
    memoryId: v.optional(v.id("memories")),
    payload: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_owner_time", ["ownerUserId", "createdAt"]),

  attachments: defineTable({
    roomId: v.id("rooms"),
    threadId: v.optional(v.id("threads")),
    messageId: v.optional(v.id("messages")),
    ownerUserId: v.id("users"),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    storageId: v.string(), // Convex storage handle
    createdAt: v.number(),
  }).index("by_room", ["roomId"]),

  presence: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    status: v.string(), // "online" | "away" | "offline"
    typing: v.boolean(),
    lastSeenAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_user", ["userId"]),

  settings: defineTable({
    ownerUserId: v.id("users"),
    defaultModel: v.string(),
    defaultProvider: v.string(),
    uiLanguage: v.string(),
    memoryEnabled: v.boolean(),
    showSuggestedMemories: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerUserId"]),
});

