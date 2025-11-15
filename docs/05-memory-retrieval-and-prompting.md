# 记忆检索与提示词设计

## 1. 检索流程（给某次回复准备上下文）

当 Mazlo 在 Room/Thread 中生成回复时：

1. 收集**短期对话上下文**

   * 例如最近 20–40 条 message（可按token预算调整）

2. 计算**查询向量**

   * 将用户最新消息 + 最近若干条对话串起来

   * 经 embedding 模型转换为向量

3. 从 `memories` 表中检索候选

   * 先按 scope 过滤（thread → room → global）

   * 再按 embedding 相似度 + keyword filter

   * 再按 importance / recency 排序

   * 控制总 token 数（例如记忆部分最多 512 或 1024 tokens）

4. 从 `memory_summaries` 表中检索

   * 根据 scope 和时间范围选择 1–3 条高层摘要

   * 将 "长期图景" 放在 context 开头（比原子事实更靠前）

5. 构造最终 prompt：

   ```text

   [System] Mazlo 的角色、风格与安全边界设定

   [Memory: Room / Thread / Global]

   - 已知事实 1: ...

   - 已知事实 2: ...

   - ...

   [Summary]

   - 线程摘要: ...

   - 房间摘要: ...

   - 全局/项目摘要: ...

   [Conversation History]

   U: ...

   M: ...

   U: ...

   ```

6. 调用模型生成回复。

---

## 2. 不同模式的 Prompt 差异

### 2.1 普通 Room 模式

* 使用轻量模型（或者快速 preset）

* 记忆部分以当前 Room/Thread 为主；全局记忆仅在非常相关时才加入

* 指令倾向：

  * 优先解决当前任务

  * 输出可以稍长，但不要做"人生总规划"

### 2.2 Mazlo Global 模式

* 使用大上下文 / 更慢的模型 preset

* 记忆检索的 priority 调整为：

  * Global + 跨 room 摘要 > 当前 room

* 系统指令中写明：

  * 输出**简短但高层次**的建议 / meta 反思

  * 把用户当作"在审阅人生与项目总图"的人，而不是只处理一条任务

---

## 3. 记忆安全与过滤

在 prompt 构建时加入过滤逻辑：

* 不将标记为 `"deleted"` 的记忆放入 context

* 对标记为 `"sensitive"` 的记忆做额外限制（例如只在特定模式 / 用户确认后可用）

* 对旧的、可能已无效的信息，在摘要中注明"可能过时"，而不是直接当事实使用

