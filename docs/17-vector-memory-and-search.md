# 向量记忆与搜索

## 1. Embedding 策略

* 对以下内容生成 embedding：

  * `memories.content`

  * `memory_summaries.content`

  * 单条 `messages.content` 视需要

* 使用 Provider 的 embedding 模型（OpenAI / z.ai）

## 2. 存储

* 直接存入 `memories.embedding` & `memory_summaries.embedding`

* 由于 Convex 未内置向量索引，短期采用：

  * 简单线性扫描 + 预过滤（scope / room / thread）+ 余弦相似度

  * 或连接外部向量服务（后续升级）

## 3. 检索

* `memory.retrieveForReply` 中直接实现：

  * 按 scope 分批拉取候选

  * 在内存中计算相似度

  * 选取 top N，在 token 限制下拼成记忆块

