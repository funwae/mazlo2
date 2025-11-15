# Convex 函数清单（Query / Mutation / Action）

> 所有函数必须出现在此表中，避免"幽灵函数"。

## rooms.ts

* `rooms.listForUser` (query)

* `rooms.get` (query)

* `rooms.getGlobalForUser` (query)

* `rooms.create` (mutation)

* `rooms.archive` (mutation)

* `rooms.rename` (mutation)

## threads.ts

* `threads.listByRoom` (query)

* `threads.get` (query)

* `threads.create` (mutation)

* `threads.updateStatus` (mutation)

## messages.ts

* `messages.listByRoomAndThread` (query)

* `messages.listRecentForRoom` (query)

* `messages.send` (mutation)

  * 创建 user 消息 / system 消息 / assistant 消息

* `messages.edit` (mutation, 可选)

* `messages.delete` (mutation, 软删)

## memory.ts

* Queries:

  * `memory.listForRoomAndThread`

  * `memory.listSuggestedForRoomAndThread`

  * `memory.listGlobalForUser`

  * `memory.listAllForUser`

* Mutations:

  * `memory.pin`（创建/升级重要记忆）

  * `memory.update`（编辑 content / scope / kind / importance）

  * `memory.forget`（status = deleted）

* Actions:

  * `memory.intakeForMessage`

  * `memory.retrieveForReply`

  * `memory.summarizeThread`

  * `memory.summarizeRoom`

## presence.ts

* `presence.listByRoom` (query)

* `presence.updateStatus` (mutation)

* `presence.setTyping` (mutation)

## attachments.ts

* `attachments.listByRoomAndThread` (query)

* `attachments.upload` (action)

* `attachments.delete` (mutation)

## settings.ts

* `settings.getForUser` (query)

* `settings.update` (mutation)

## provider.ts

* `provider.listForUser` (query)

* `provider.setDefault` (mutation)

## scheduler.ts

* `scheduler.dailyMemoryMaintenance` (action / scheduled)

* `scheduler.periodicSummarize` (scheduled action)

> Orchestrator 层可以是 Convex action 或 Next API route，但所有状态读写必须通过上述函数。

