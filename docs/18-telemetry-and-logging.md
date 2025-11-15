# 埋点与日志

## 1. 客户端事件（前端）

* `ui.room.open`

* `ui.thread.open`

* `ui.memory.panel.open`

* `ui.memory.pin`

* `ui.memory.forget`

* `ui.global.open`

## 2. Mazlo 级事件（后端）

* `ai.run.started`

* `ai.run.completed`

* `ai.run.failed`

* `memory.intake.created`

* `memory.intake.updated`

* `memory.summary.created`

## 3. 存储

* 最小可行方案：

  * 在 Convex 新建 `logs` 表（如需要）

  * 或写到外部日志系统（Sentry/Logtail）

目标：**追踪 Mazlo 记忆系统是否工作如预期**，例如：

* 每日新增记忆数量

* 被用户 pin 的比例

* 被遗忘的数量

* Global Chat 使用频率

