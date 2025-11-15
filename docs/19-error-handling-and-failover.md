# 错误处理与降级

## 1. LLM 调用失败

* Orchestrator 捕捉异常：

  * 在 Room 中插入一条 `system` 消息：

    * "Mazlo 这次没有成功连接模型，请重试。"

  * 不阻止用户继续对话

* 可选：自动重试一次

## 2. Memory Pipeline 失败

* `memory.intakeForMessage` 失败时：

  * 只写 `memory_events` 一条 error 日志，不影响主对话

* `memory.retrieveForReply` 失败时：

  * 回退为"无记忆模式"：只使用最近对话进行回答

