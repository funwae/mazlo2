# 前端组件清单

组件 ≈ 无死角列出，避免"神秘组件"。

## 1. 布局级

* `AppShell`

* `SidebarRooms`

* `TopBar`

* `RoomLayout`

* `GlobalLayout`

## 2. Room / Thread

* `RoomListItem`

* `ThreadList`

* `ThreadListItem`

* `NewThreadButton`

* `RoomHeader`（标题 + 描述 + 状态）

## 3. 消息区

* `MessageList`

* `MessageItem`

* `MessageAvatar`

* `MessageMeta`（时间、trace button 等）

* `MessageComposer`（输入框 + 发送按钮 + 快捷指令）

## 4. Mazlo Memory Panel

* `MazloMemoryPanel`

* `MemorySectionPinned`

* `MemorySectionSuggested`

* `MemorySectionSummaries`

* `MemoryItemRow`

* `MemoryScopeTag`

* `MemoryImportanceBadge`

* `MemoryEditDialog`

* `MemoryForgetConfirmDialog`

## 5. Global / Settings

* `GlobalSummaryCard`

* `ProjectSummaryList`

* `SettingsFormGeneral`

* `SettingsFormProvider`

* `SettingsFormMemory`

每个组件在实现时：

* 以 props 明确声明**依赖数据**（props 不从全局随便拿）

* 需要数据的地方统一通过 hooks 调用 Convex（例如 `useQuery(api.rooms.listForUser)`）

