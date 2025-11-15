# 测试与验证

## 1. 单元测试（最小集）

* Convex 函数：

  * `messages.send`：权限 + 字段完整性

  * `memory.intakeForMessage`：给定固定 LLM 输出 → 正确写入 memories

  * `memory.retrieveForReply`：给定固定 memories → 返回排序正确的 bundle

## 2. 集成测试（脚本）

* Flow：

  1. 创建用户/Room/Thread

  2. 发送几条消息（包含"记住："）

  3. 模拟 LLM memory plan 输出

  4. 验证 Memory Panel 能显示新记忆

  5. 使用 Mazlo Global 对话 → 确认能引用跨 Room 信息

## 3. 手动验收清单

* 创建 Room / Thread / 消息全部正常

* Mazlo 在 Room 内回答不会"忘记项目目的"

* Mazlo Global 能说出"你当前有 X 个主要项目，每个大概在做什么"

