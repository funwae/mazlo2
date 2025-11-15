# 记忆层级与作用域

## 1. 四个记忆层级

1. **短期对话记忆（Short-Term Context）**

   * 最近 N 条 message

   * 某些即时指令（例如 "稍后提醒我..." 但未被正式固化为 TODO 时）

   * 存在于对话上下文，不强制写入 `memories` 表

2. **局部长期记忆：Room / Thread Scoped**

   * 某个 Room 专属事实与偏好：

     * 例：Room "ZekeChat 设计" 里记住 "这个项目面向中英双语用户"。

   * 某个 Thread 专属任务状态：

     * 例：Thread "Logo 最终修订" 中的待办项。

3. **全局长期记忆：Global Scoped**

   * 与用户整体画像相关：

     * 语言、风格偏好

     * 长期关注的项目

     * 工作方式（喜欢长答案 / 短答案，有没有"把我当高级开发者"之类）

4. **系统 / Mazlo 自身记忆：System Scoped**

   * Mazlo 的角色设定、价值观、约束规则

   * 不随用户变化或只由开发者升级

---

## 2. 作用域优先级（Resolution Priority）

当 Mazlo 回答某个 Room/Thread 内的问题时，记忆检索顺序大致为：

1. Thread-Scoped（如果当前在某个线程内）

2. Room-Scoped

3. Global-Scoped

4. System-Scoped

同时，为避免 token 爆炸，每一层都必须经过：

* 相关度过滤（相似度 + 关键词）

* 重要度 / 新鲜度排序

* token 预算限制（比如总共 2k tokens 给记忆）

---

## 3. "Mazlo Global Chat" 模式

Mazlo Global 是一个特殊 Room：

* Room 类型：`type = "global"`

* 这里的记忆检索顺序变成：

  1. Global-Scoped

  2. 所有关联 Room 的高层总结（`memory_summaries` level 2/3）

* 行为特征：

  * **更慢**：允许调用更昂贵、更长上下文的模型

  * **更短回答**：虽然 context 大，但输出刻意简短（总结型 / meta 指导）

  * 更像"人生与项目的总监盘"而不是普通聊天

