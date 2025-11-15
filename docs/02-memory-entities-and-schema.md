# 实体与数据模型（Convex 版本）

> 注：下面是概念模型 + 贴近 Convex 的 schema 草案。实际代码可以在 Cursor 中生成。

## 1. 核心实体（Core Entities）

1. `users`

   * `id`

   * `externalId`（来自 OpenAI / z.ai / OAuth provider）

   * `profile`（名称、语言偏好、时区…）

2. `rooms`

   * `id`

   * `ownerId`

   * `type`（`"dm" | "group" | "project" | "global"`）

   * `title` / `description`

   * `worldTag`（未来对接 EarthCloud World 的标记，可选）

3. `threads`

   * `id`

   * `roomId`

   * `title`（线程标题，自动或手动）

   * `status`（`"active" | "archived"`）

4. `messages`

   * `id`

   * `roomId`

   * `threadId` (可选：没有 thread 时为 null)

   * `senderType`（`"user" | "mazlo"`）

   * `senderUserId`（用户消息时才有）

   * `content`（原始 text + 结构化 blocks）

   * `createdAt`

> 上面这层是你已经有的 Chat Ultra 结构，只是形式化一下。

---

## 2. 记忆相关实体（Memory Entities）

### 2.1 `memories`（记忆原子单元）

每条记忆都是一条**原子事实 / 规则 / 偏好**，Mazlo 可以引用、更新或遗忘。

字段建议：

* `id`

* `ownerUserId` —— 记忆属于谁（通常是用户，而不是 Room）

* `scope` —— 记忆作用域：

  * `"room"`：与某个 room 强相关

  * `"thread"`：与某个 thread 强相关

  * `"global"`：用户级别长期记忆

  * `"system"`：Mazlo 自身的系统/角色记忆（可只读或限制编辑）

* `roomId`（当 scope 为 `room` 时必填）

* `threadId`（当 scope 为 `thread` 时必填）

* `kind`：

  * `"fact"`（事实）

  * `"preference"`（偏好）

  * `"plan"`（计划 / TODO）

  * `"identity"`（自我描述 / 背景）

  * `"project"`（项目说明）

* `source`：

  * `"user_pin"`（用户手动固定）

  * `"user_edit"`（用户在记忆面板中输入）

  * `"auto_extracted"`（模型自动抽取）

  * `"imported"`（从外部系统导入）

* `content`：string，**已精炼**的记忆文本（1–3 行）。

* `embedding`：向量（用于相似度检索）

* `importance`：0–1 或 1–5 分，自动/手动打分

* `recencyScore`：根据最近使用时间/更新时间衰减

* `usedCount`：在推理中被使用的次数（根据 trace 写回）

* `createdAt` / `updatedAt` / `lastUsedAt`

* `status`：`"active" | "archived" | "deleted"`

### 2.2 `memory_summaries`（多层摘要）

为长线程、重度使用房间建立分层摘要：

* `id`

* `ownerUserId`

* `roomId`

* `threadId`（可选）

* `level`：

  * `0`：最近对话窗口的摘要（短期）

  * `1`：当前线程的阶段性摘要

  * `2`：整个 Room 的项目级摘要

  * `3`：全局跨 Room 主题摘要（比如"Glyphd 项目总况"）

* `timeRange`：`{ from: number, to: number }`

* `tokenBudget`：该摘要应该控制的 token 大小

* `content`：摘要文本

* `embedding`（可选）

* `createdAt` / `updatedAt`

### 2.3 `memory_events`（记忆事件日志）

用于调试 & 解释"为什么 Mazlo 记住了这件事"

* `id`

* `ownerUserId`

* `roomId` / `threadId`

* `type`：`"candidate"` / `"write"` / `"update"` / `"forget"` / `"pin"` / `"summarize"`

* `sourceMessageId`（触发这个事件的 message）

* `memoryId`（如果与某条 memory 绑定）

* `payload`：JSON（详细信息）

* `createdAt`

