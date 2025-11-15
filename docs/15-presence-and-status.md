# 在线状态与 Typing 指示

## 1. Presence 模型

* 用户在进入某 Room 时：

  * 调用 `presence.updateStatus({ roomId, status: "online" })`

* 离开或浏览器关闭：

  * 前端可在 `beforeunload` 或心跳断开时调用 `status: "offline"`

* Typing：

  * 输入框有内容 → `presence.setTyping(true)`

  * 停止输入 > N 秒 → `setTyping(false)`

## 2. UI 使用

* 在 Room header 显示：

  * "Mazlo" 永远在线

  * 用户自己 + 其他在线用户（未来多人）

* "正在输入…" 在消息列表顶部/底部显式显示。

