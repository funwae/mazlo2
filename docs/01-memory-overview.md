# Chat Ultra / Mazlo 记忆系统总览

## 1. 设计目标

Mazlo 不是"有个大 context"的普通聊天壳，而是一个带有**分级、可控、可解释**记忆系统的 AI 伴随者。

记忆系统的核心目标：

1. **按空间记忆（Space-Aware）**

   * Room（房间）

   * Thread（线程 / 子话题）

   * Global（全局用户）

     Mazlo 必须"知道自己在哪里说话"，并只在需要时带入对应的记忆。

2. **选择性记忆（Selective）**

   * 不是所有对话都写入长期记忆。

   * 部分由用户显式标记（pin / star），部分由模型根据规则筛选。

   * 有"可忘记"的机制，避免记忆杂乱。

3. **不同模式不同记忆视图（Mode-Specific Memory View）**

   * 普通 Room 聊天：轻量、快速、上下文有限。

   * "Mazlo Global" 聊天：拥有全局记忆图谱，回答更深，但可以故意简短输出。

   * Memory Manager 视图：让用户可检查、编辑、删除记忆。

4. **透明与可控（Transparent & Controllable）**

   * 可在 UI 中看到这个 Room / Thread 当前"已知的事实 / 假设"。

   * 用户可以：

     * Pin 成为长期记忆

     * 降级为临时记忆

     * 彻底忘记某条记忆

5. **技术匹配 Convex / 2026-style Stack**

   * 用 Convex 作为**实时记忆图谱存储**：tables + reactive queries + actions + vector search。

   * 全部逻辑用 TypeScript/JavaScript 实现，可在 Cursor 中一键生成和重构。

