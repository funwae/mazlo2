# 领域模型（Domain Model）

核心实体（英文名称用于代码，中文解释）：

## 1. User

* `id`

* `externalId`（来自 Auth provider）

* `displayName`

* `avatarUrl`

* `locale`（`"zh-CN"` / `"en-US"`）

* `timeZone`

* `createdAt`

## 2. ProviderConfig

* 代表用户或系统与 OpenAI / z.ai 的连接配置。

* 字段：

  * `id`

  * `ownerUserId`（可选：null 表示系统级）

  * `provider`：`"openai" | "zai"`

  * `apiKeyRef`（密钥引用，实际存储在安全配置中）

  * `defaultModel`

  * `enabled`（是否可用）

## 3. Room

* 一个工作空间 / 聊天室。

* 字段：

  * `id`

  * `ownerUserId`

  * `type`：`"dm" | "group" | "project" | "global"`

  * `title`

  * `description`

  * `worldTag`（未来 EarthCloud 接入标签）

  * `createdAt`

  * `archived`（bool）

## 4. Thread

* Room 内的子话题或子任务。

* 字段：

  * `id`

  * `roomId`

  * `title`

  * `status`：`"active" | "paused" | "done"`

  * `createdAt`

  * `updatedAt`

## 5. Message

* 字段：

  * `id`

  * `roomId`

  * `threadId?`

  * `senderType`：`"user" | "mazlo"`

  * `senderUserId?`

  * `role`：`"user" | "assistant" | "system"`

  * `content`：富文本 JSON 或 markdown string

  * `meta`：如 traceId, runId

  * `createdAt`

## 6. Memory / MemorySummary / MemoryEvent

> 按你已有的 02/03/04 记忆规格；此处只标注逻辑关系。

* **Memory**：原子事实/偏好/计划（Room / Thread / Global / System scope）

* **MemorySummary**：对 Thread / Room / Project / Global 的多层摘要

* **MemoryEvent**：记录记忆如何产生/修改/删除

## 7. Attachment

* `id`

* `roomId`

* `threadId?`

* `messageId?`

* `ownerUserId`

* `fileName`

* `fileType`

* `fileSize`

* `storageId`（Convex file storage）

* `createdAt`

## 8. Presence

* `id`

* `roomId`

* `userId`

* `status`：`"online" | "away" | "offline"`

* `typing`：bool

* `lastSeenAt`

## 9. Settings / Preferences

* 每个用户的偏好：

  * 默认模型

  * 默认语言

  * 是否启用 Global 记忆

  * 是否展示"建议记忆"等

