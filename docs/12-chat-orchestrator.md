# Mazlo 聊天编排（Orchestrator）

## 1. Orchestrator 职责

1. 根据 Room/Thread/模式选择：

   * 使用哪个 Provider

   * 使用哪个 System Prompt（Room / Global）

   * 上下文窗口大小

2. 调用 `memory.retrieveForReply` 拉取记忆与摘要

3. 构造完整 prompt（System + Memory + Summary + Conversation + User）

4. 调用 Provider（OpenAI/z.ai）

5. 写回 `messages`、日志，并异步触发 `memory.intakeForMessage`

## 2. 伪代码流程（Room 模式）

```ts

export async function mazloReplyRoom({ roomId, threadId, userMessageId }) {

  const room = await convexQuery("rooms.get", { roomId });

  const userMessage = await convexQuery("messages.get", { id: userMessageId });

  const recentMessages = await convexQuery("messages.listByRoomAndThread", {

    roomId,

    threadId,

    limit: 40,

  });



  const memoryBundle = await convexAction("memory.retrieveForReply", {

    mode: "room",

    roomId,

    threadId,

    ownerUserId: userMessage.senderUserId,

    recentMessageIds: recentMessages.map(m => m._id),

  });



  const systemPrompt = ROOM_SYSTEM_PROMPT; // from 10-mazlo-room-system-prompt.md

  const prompt = buildPrompt({

    systemPrompt,

    memoryBundle,

    recentMessages,

    userMessage,

  });



  const providerClient = pickProviderForUser(...);

  const completion = await providerClient.chatCompletion(prompt);



  const assistantMessageId = await convexMutation("messages.send", {

    role: "assistant",

    senderType: "mazlo",

    roomId,

    threadId,

    content: completion.content,

    meta: { provider: providerClient.name, ... },

  });



  // async fire-and-forget

  convexAction("memory.intakeForMessage", { messageId: userMessageId });

  convexAction("memory.intakeForMessage", { messageId: assistantMessageId });



  return assistantMessageId;

}

```

## 3. Global 模式差异

* 调用 `memory.retrieveForReply` 时 `mode: "global"`，scope 扩大。

* 使用 `GLOBAL_SYSTEM_PROMPT`。

* 使用 `providerClient` 的"slow / deep" preset。

* 前端 UI 可以显示 "Mazlo 正在深度思考…" 状态。

