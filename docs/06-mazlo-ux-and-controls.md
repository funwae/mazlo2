# Mazlo 记忆的 UX 与交互

## 1. Room 侧边栏：Memory Panel

在每个 Room 的侧边栏增加一个 "Mazlo Memory" 区域，分为：

1. **Pinned / 重要记忆**

   * 列出该 Room/Thread 的 active memories（`scope = room/thread`）

   * 每条允许：

     * 编辑文本

     * "升级为全局记忆"（scope: room → global）

     * "降级为仅本线程"

     * 删除 / 忘记

2. **自动建议记忆（Suggested）**

   * 由 `memory_events` 中 type=`"candidate"` 的记录驱动

   * UI 显示："Mazlo 认为这一条可以记住，是否保存？"

   * 用户点击"保存"则写入 `memories`，作为 `user_pin` / `user_accept` 来源。

3. **摘要区块（Summaries）**

   * 展示 thread / room 摘要（只读）

   * 提供一个"重新生成摘要"按钮 → 调用 summarize action

---

## 2. Mazlo Global 入口

* 在主导航中增加 "Mazlo Global" Chat

* 描述文案：

  * "这是一间知道你所有项目与偏好的'总监办公室'。"

  * "回答会更慢，但更有全局视角。"

---

## 3. 明确的"教 Mazlo 记忆"语法（自然语言指令）

支持以下自然语言触发器：

* "记住：…"

* "在这个房间里，你以后要记得…"

* "全局记住：我以后都希望…"

解析逻辑：

* 通过额外一个意图识别模型或规则识别"记忆指令"

* 直接创建 high-importance 的 memory，`source="user_pin"`，不必经过 candidate 流水线。

---

## 4. "忘记"与隐私

* "忘记这件事 / 不要再记这个":

  * 将对应 memory 标记为 `"deleted"`

  * 在 `memory_events` 中记录"forbidden pattern"，后续 memory plan 生成时提示模型避开

* "清空本房间记忆":

  * 将 scope=room 的 active memories 全部 archived/deleted

* "清空全局记忆":

  * 更高风险的操作，需要双重确认

