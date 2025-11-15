# 记忆流水线：写入、摘要与遗忘

## 1. 每条消息后的记忆处理流程（Intake Pipeline）

当用户在某个 Room/Thread 中发出一条消息时：

1. **Message 写入 `messages` 表**

2. 触发一个 Convex `action`：`memory.intakeForMessage`

3. 该 action 调用模型（OpenAI / z.ai），使用一个专门的 `system` prompt，让模型输出一个结构化"记忆计划"（Memory Plan），格式可以是 JSON：

   ```json

   {

     "candidates": [

       {

         "scope": "room",

         "kind": "project",

         "importance": 0.9,

         "content": "这个房间是用来设计 ZekeChat 的中英双语界面。",

         "reason": "用户明确说明了房间用途。"

       },

       {

         "scope": "global",

         "kind": "preference",

         "importance": 0.7,

         "content": "用户喜欢用中文编写规格文档。",

         "reason": "用户再次要求使用中文规格。"

       }

     ],

     "shouldSummarizeThread": false,

     "shouldSummarizeRoom": false

   }

   ```

4. Convex 内部逻辑根据规则判断是否真正写入 `memories` 表：

   * importance < 0.6 且用户未显式 pin → 丢弃

   * importance 高或来源为 user_pin → 写入/更新

   * 相似内容已有记忆 → 更新 `usedCount` / `updatedAt`，可合并

5. 生成 `memory_events` 日志，方便 UI 中展示"为什么记住了这条"。

> 关键点：**让模型输出"要不要记/记什么/记到哪里"的计划，而不是直接把对话塞进记忆表。**

---

## 2. 摘要流水线（Summarization Pipelines）

### 2.1 Thread 摘要

触发条件：

* Thread 中 message 数量超过 N（例如 100 条）

* 或 `memory.intakeForMessage` 返回 `shouldSummarizeThread = true`

流程：

1. 创建一个 `summarization_jobs`（可以只是 `memory_events` 的一种类型）

2. 由定时任务（Convex scheduler）或专用 action 异步执行：

   * 从 `messages` 里拉取该 thread 的指定时间段内容

   * 调用模型生成摘要（level 1）

   * 写入/更新 `memory_summaries` 记录

3. 在后续回答中，替换早期原始 message → 摘要 + 最近若干条原文。

### 2.2 Room / Global 摘要

类似，但级别更高：

* Room 摘要：

  * 重点提炼该 Room 的目标、历史关键决策、重要里程碑。

* Global 摘要：

  * 针对一个项目标签 / 主题（例如 "EarthCloud"），聚合多个 Room 的高层摘要。

---

## 3. 遗忘策略（Forgetting / Archiving）

为防止记忆无限膨胀：

* 定期任务（每日 / 每周）扫描 `memories`：

  * `importance` 低 + `usedCount` 很小 + `lastUsedAt` 很久 → 标记为 `"archived"` 或自动删除

* 被归档/删除的记忆仍可在 Memory Manager 中查看一段时间

* 如用户强制"不要再记这个"：

  * 将该条记忆 `status` 设为 `"deleted"`，并在 `memory_events` 中记录，此后新的类似候选可以被模型提示为"不要形成记忆"。

