# 用户体验流程

## 1. 初次使用（Onboarding）

1. 用户登录 / 注册

2. 引导选择：

   * 界面语言（中/英）

   * 首个 Room 模板（例如 "个人项目实验室"）

3. 自动创建：

   * 一个 `global` 类型 Room：**"Mazlo Global"**

   * 一个示范 Room：**"Welcome / 入门房间"**

4. 首条系统消息解释：

   * Room / Thread / Mazlo 记忆如何运作

   * "记住：" / "忘记：" 指令

## 2. 创建 Room

* 操作：点击 "+ New Room"

* 步骤：

  1. 输入标题（必填） + 描述（选填）

  2. 选择类型：`project` | `dm` | `group`

  3. 选择默认模型预设（可以跟随全局）

* 结果：

  * 新建 Room

  * 自动创建默认 Thread："General"

## 3. 创建 Thread

* 在某个 Room 中点击 "New Thread" 或从消息中"分支成线程"。

* 必要字段：title

* 在 UI 中作为侧边栏或上方 tab 展示。

## 4. 发送消息 & Mazlo 回答（Room 模式）

1. 用户输入消息并发送

2. 前端：

   * 调用 `messages.send` mutation（写 DB）

   * 然后触发 `mazlo.reply` action（或 orchestrator API）

3. 后端 orchestrator：

   * 加载最近对话 + `memory.retrieveForReply`

   * 构造 prompt（包含 Room Memory & Summary）

   * 调用 provider → 得到 Mazlo 回复

   * 写入 `messages`

   * 异步触发 `memory.intakeForMessage`（对用户消息和 Mazlo 回复都可）

## 5. Mazlo Global 模式

* 进入特殊 Room：`type = "global"`

* 流程与 Room 相似，但：

  * `memory.retrieveForReply` 用 global 模式

  * 使用不同的 system prompt（Global）

  * 使用较慢/更大上下文模型 preset

  * 回答刻意简短

## 6. 记忆管理 UX

* 在 Room 内打开 "Mazlo Memory" 侧边栏：

  * 查看当前 Room/Thread 的记忆列表

  * 手动编辑 & Pin & Forget

  * 查看"建议记忆"（候选）

* 在全局 "Memories" 页面：

  * 查看所有 Global 记忆

  * 按项目标签过滤

