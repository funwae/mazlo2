# UI 路由与布局

（Next.js App Router 假设）

## 1. 顶层路由

* `/` → `HomePage`

  * 如果已登录 → 重定向 `/rooms`

  * 未登录 → Landing/marketing（可以简单）

* `/rooms` → `RoomListPage`

* `/rooms/[roomId]` → `RoomPage`

  * query param `threadId` 可选

* `/global` → `MazloGlobalPage`

  * 实际上可映射到 `rooms/[globalRoomId]` 但保留语义化路径

* `/memories` → `GlobalMemoriesPage`

* `/settings` → `SettingsPage`

* `/auth/*` → 交由 Auth provider

## 2. Layout 结构

* `app/layout.tsx`

  * 顶部：AppBar（项目 Logo + Mazlo 小头像）

  * 左侧：Room 列表（可折叠）

  * 内容区域：当前 Page

* `RoomPage` 布局：

  * 左：Thread 列表（垂直 tabs）

  * 中：Message 列表 + 输入框

  * 右：Mazlo Memory Panel（可折叠）

## 3. 路由数据依赖

* `/rooms`：

  * Convex query：`rooms.listForUser`

* `/rooms/[roomId]`：

  * `rooms.get`

  * `threads.listByRoom`

  * `messages.listByRoomAndThread`

  * `presence.listByRoom`

  * `memories.listForRoomAndThread`

  * `memory_summaries.listForRoomAndThread`

* `/global`：

  * 使用 `rooms.getGlobalForUser` + `memories.listGlobal` + `memory_summaries.listGlobal`

* `/memories`：

  * `memories.listAllForUser`（分页）

* `/settings`：

  * `settings.getForUser`

