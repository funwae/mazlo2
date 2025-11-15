import { query, mutation, action, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Helper function to calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Queries
export const listForRoomAndThread = query({
  args: {
    ownerUserId: v.id("users"),
    roomId: v.id("rooms"),
    threadId: v.optional(v.id("threads")),
  },
  handler: async (ctx, args) => {
    let memories = await ctx.db
      .query("memories")
      .withIndex("by_owner_scope", (q) =>
        q.eq("ownerUserId", args.ownerUserId)
      )
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // Filter by scope
    memories = memories.filter((m) => {
      if (args.threadId && m.scope === "thread") {
        return m.threadId === args.threadId;
      }
      if (m.scope === "room") {
        return m.roomId === args.roomId;
      }
      if (m.scope === "global") {
        return true;
      }
      return false;
    });

    return memories.sort((a, b) => b.importance - a.importance);
  },
});

export const listSuggestedForRoomAndThread = query({
  args: {
    ownerUserId: v.id("users"),
    roomId: v.id("rooms"),
    threadId: v.optional(v.id("threads")),
  },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("memory_events")
      .withIndex("by_owner_time", (q) =>
        q.eq("ownerUserId", args.ownerUserId)
      )
      .filter((q) => q.eq(q.field("type"), "candidate"))
      .order("desc")
      .take(20);

    const suggested = [];
    for (const event of events) {
      if (
        event.roomId === args.roomId &&
        (!args.threadId || event.threadId === args.threadId)
      ) {
        if (event.memoryId) {
          const memory = await ctx.db.get(event.memoryId);
          if (memory) {
            suggested.push({ ...memory, eventId: event._id });
          }
        } else if (event.payload) {
          suggested.push({ ...event.payload, eventId: event._id });
        }
      }
    }
    return suggested;
  },
});

export const listGlobalForUser = query({
  args: {
    ownerUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("memories")
      .withIndex("by_owner_scope", (q) =>
        q.eq("ownerUserId", args.ownerUserId).eq("scope", "global")
      )
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .collect();
  },
});

export const listAllForUser = query({
  args: {
    ownerUserId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    return await ctx.db
      .query("memories")
      .withIndex("by_owner_scope", (q) =>
        q.eq("ownerUserId", args.ownerUserId)
      )
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .take(limit);
  },
});

export const getSummariesForRoomAndThread = query({
  args: {
    ownerUserId: v.id("users"),
    roomId: v.id("rooms"),
    threadId: v.optional(v.id("threads")),
  },
  handler: async (ctx, args) => {
    const summaries = await ctx.db
      .query("memory_summaries")
      .withIndex("by_owner_room_level", (q) =>
        q.eq("ownerUserId", args.ownerUserId).eq("roomId", args.roomId)
      )
      .collect();

    if (args.threadId) {
      const threadSummaries = await ctx.db
        .query("memory_summaries")
        .withIndex("by_thread_level", (q) =>
          q.eq("threadId", args.threadId)
        )
        .collect();
      summaries.push(...threadSummaries);
    }

    // Separate by level
    const threadSummaries = summaries.filter((s) => s.level === 1 && s.threadId === args.threadId);
    const roomSummaries = summaries.filter((s) => s.level === 2);

    return {
      threadSummary: threadSummaries[0] || null,
      roomSummary: roomSummaries[0] || null,
    };
  },
});

// Mutations
export const pin = mutation({
  args: {
    ownerUserId: v.id("users"),
    scope: v.string(),
    roomId: v.optional(v.id("rooms")),
    threadId: v.optional(v.id("threads")),
    kind: v.string(),
    content: v.string(),
    importance: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const memoryId = await ctx.db.insert("memories", {
      ownerUserId: args.ownerUserId,
      scope: args.scope,
      roomId: args.roomId,
      threadId: args.threadId,
      kind: args.kind,
      source: "user_pin",
      content: args.content,
      importance: args.importance,
      recencyScore: 1.0,
      usedCount: 0,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    // Create memory event
    await ctx.db.insert("memory_events", {
      ownerUserId: args.ownerUserId,
      roomId: args.roomId,
      threadId: args.threadId,
      type: "pin",
      memoryId,
      payload: { content: args.content },
      createdAt: now,
    });

    return memoryId;
  },
});

export const update = mutation({
  args: {
    memoryId: v.id("memories"),
    content: v.optional(v.string()),
    scope: v.optional(v.string()),
    kind: v.optional(v.string()),
    importance: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const memory = await ctx.db.get(args.memoryId);
    if (!memory) {
      throw new Error("Memory not found");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.content !== undefined) updates.content = args.content;
    if (args.scope !== undefined) updates.scope = args.scope;
    if (args.kind !== undefined) updates.kind = args.kind;
    if (args.importance !== undefined) updates.importance = args.importance;

    await ctx.db.patch(args.memoryId, updates);

    // Create update event
    await ctx.db.insert("memory_events", {
      ownerUserId: memory.ownerUserId,
      roomId: memory.roomId,
      threadId: memory.threadId,
      type: "update",
      memoryId: args.memoryId,
      payload: updates,
      createdAt: Date.now(),
    });
  },
});

export const forget = mutation({
  args: {
    memoryId: v.id("memories"),
  },
  handler: async (ctx, args) => {
    const memory = await ctx.db.get(args.memoryId);
    if (!memory) {
      throw new Error("Memory not found");
    }

    await ctx.db.patch(args.memoryId, {
      status: "deleted",
      updatedAt: Date.now(),
    });

    // Create forget event
    await ctx.db.insert("memory_events", {
      ownerUserId: memory.ownerUserId,
      roomId: memory.roomId,
      threadId: memory.threadId,
      type: "forget",
      memoryId: args.memoryId,
      payload: { content: memory.content },
      createdAt: Date.now(),
    });
  },
});

export const discardCandidate = mutation({
  args: {
    eventId: v.id("memory_events"),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.type !== "candidate") {
      throw new Error("Can only discard candidate events");
    }

    // Delete the event (this effectively discards the candidate)
    await ctx.db.delete(args.eventId);
  },
});

// Actions
export const intakeForMessage = action({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const { messageId } = args;

    // Load message
    const message = await ctx.runQuery(internal.memory.getMessageInternal, { messageId });
    if (!message) {
      throw new Error("Message not found");
    }

    // Load room and thread context
    const room = await ctx.runQuery(internal.memory.getRoomInternal, {
      roomId: message.roomId,
    });
    if (!room) {
      throw new Error("Room not found");
    }

    const thread = message.threadId
      ? await ctx.runQuery(internal.memory.getThreadInternal, {
          threadId: message.threadId,
        })
      : null;

    // Load recent messages for context (last 20)
    const recentMessages = await ctx.runQuery(internal.memory.getRecentMessagesInternal, {
      roomId: message.roomId,
      threadId: message.threadId,
      limit: 20,
    });

    // Load existing memories for context
    const existingMemories = await ctx.runQuery(
      internal.memory.listForRoomAndThreadInternal,
      {
        ownerUserId: room.ownerUserId,
        roomId: message.roomId,
        threadId: message.threadId,
      }
    );

    const existingMemorySnippets = existingMemories
      .slice(0, 10)
      .map((m) => `[${m.scope}/${m.kind}] ${m.content}`);

    // Build memory plan prompt
    const { MEMORY_PLAN_SYSTEM_PROMPT, buildMemoryPlanUserPrompt, parseMemoryPlan } =
      await import("../../lib/memory/memoryPlan");

    const userPrompt = buildMemoryPlanUserPrompt({
      location: {
        userId: room.ownerUserId,
        roomId: room._id,
        roomTitle: room.title,
        threadId: thread?._id,
        threadTitle: thread?.title,
        roomType: room.type as "dm" | "group" | "project" | "global",
      },
      recentMessages: recentMessages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
      existingMemorySnippets,
    });

    // Call AI provider
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: MEMORY_PLAN_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const planJson = completion.choices[0]?.message?.content;
    if (!planJson) {
      throw new Error("No response from AI provider");
    }

    // Parse memory plan
    const plan = parseMemoryPlan(planJson);

    const now = Date.now();
    const writtenMemoryIds: string[] = [];

    // Process candidates
    for (const candidate of plan.candidates) {
      // Only write memories with importance >= 0.6 or suggestPin
      if (candidate.importance >= 0.6 || candidate.suggestPin) {
        // Check for similar existing memories
        const similarMemory = existingMemories.find(
          (m) =>
            m.scope === candidate.scope &&
            m.kind === candidate.kind &&
            Math.abs(m.importance - candidate.importance) < 0.2 &&
            m.content.includes(candidate.content.substring(0, 20)) // Simple similarity check
        );

        if (similarMemory) {
          // Update existing memory
          await ctx.runMutation(internal.memory.updateMemoryInternal, {
            memoryId: similarMemory._id,
            content: candidate.content,
            importance: candidate.importance,
            updatedAt: now,
          });
          writtenMemoryIds.push(similarMemory._id);
        } else {
          // Create new memory
          const memoryId = await ctx.runMutation(internal.memory.createMemoryInternal, {
            ownerUserId: room.ownerUserId,
            scope: candidate.scope,
            roomId: candidate.scope === "room" || candidate.scope === "thread" ? room._id : undefined,
            threadId: candidate.scope === "thread" ? message.threadId : undefined,
            kind: candidate.kind,
            source: "auto_extracted",
            content: candidate.content,
            importance: candidate.importance,
            recencyScore: 1.0,
            usedCount: 0,
            status: "active",
            createdAt: now,
            updatedAt: now,
          });
          writtenMemoryIds.push(memoryId);

          // Generate embedding
          try {
            const embeddingResponse = await openai.embeddings.create({
              model: "text-embedding-3-small",
              input: candidate.content,
            });
            const embedding = embeddingResponse.data[0]?.embedding;
            if (embedding) {
              await ctx.runMutation(internal.memory.updateMemoryEmbeddingInternal, {
                memoryId,
                embedding,
              });
            }
          } catch (error) {
            console.error("Failed to generate embedding:", error);
            // Continue without embedding
          }
        }

        // Create memory event
        await ctx.runMutation(internal.memory.createMemoryEventInternal, {
          ownerUserId: room.ownerUserId,
          roomId: message.roomId,
          threadId: message.threadId,
          type: candidate.suggestPin ? "candidate" : "write",
          sourceMessageId: messageId,
          memoryId: writtenMemoryIds[writtenMemoryIds.length - 1],
          payload: {
            content: candidate.content,
            reason: candidate.reason,
            suggestPin: candidate.suggestPin,
          },
          createdAt: now,
        });
      } else {
        // Create candidate event for low-importance memories
        await ctx.runMutation(internal.memory.createMemoryEventInternal, {
          ownerUserId: room.ownerUserId,
          roomId: message.roomId,
          threadId: message.threadId,
          type: "candidate",
          sourceMessageId: messageId,
          payload: {
            scope: candidate.scope,
            kind: candidate.kind,
            content: candidate.content,
            importance: candidate.importance,
            reason: candidate.reason,
            suggestPin: candidate.suggestPin,
          },
          createdAt: now,
        });
      }
    }

    // Trigger summarization if needed (schedule as separate actions)
    // Note: We'll call the actions directly here, but in production you might want to schedule them
    if (plan.shouldSummarizeThread && message.threadId) {
      // Schedule summarization - will be implemented next
      // For now, we'll trigger it synchronously in the summarize actions
    }

    if (plan.shouldSummarizeRoom) {
      // Schedule summarization - will be implemented next
    }

    return {
      success: true,
      candidatesProcessed: plan.candidates.length,
      memoriesWritten: writtenMemoryIds.length,
      shouldSummarizeThread: plan.shouldSummarizeThread,
      shouldSummarizeRoom: plan.shouldSummarizeRoom,
    };
  },
});

export const retrieveForReply = action({
  args: {
    mode: v.string(), // "room" | "global"
    roomId: v.id("rooms"),
    threadId: v.optional(v.id("threads")),
    ownerUserId: v.id("users"),
    recentMessageIds: v.array(v.id("messages")),
    maxTokens: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const maxTokens = args.maxTokens || 1024;
    
    // Get memories by scope priority - use internal queries
    const allMemoriesList = await ctx.runQuery(internal.memory.listForRoomAndThreadInternal, {
      ownerUserId: args.ownerUserId,
      roomId: args.roomId,
      threadId: args.threadId,
    });

    const globalMemories =
      args.mode === "global"
        ? await ctx.runQuery(internal.memory.listGlobalForUserInternal, {
            ownerUserId: args.ownerUserId,
          })
        : [];

    // Combine all memories
    let allMemories = [
      ...allMemoriesList,
      ...globalMemories,
    ];

    // Filter out memories without embeddings for vector search
    const memoriesWithEmbeddings = allMemories.filter((m) => m.embedding && m.embedding.length > 0);
    const memoriesWithoutEmbeddings = allMemories.filter((m) => !m.embedding || m.embedding.length === 0);

    // Generate query embedding from recent messages if available
    let queryEmbedding: number[] | null = null;
    if (args.recentMessageIds.length > 0 && memoriesWithEmbeddings.length > 0) {
      try {
        // Get recent messages content
        const recentMessages = await Promise.all(
          args.recentMessageIds.slice(-5).map((id) =>
            ctx.runQuery(internal.memory.getMessageInternal, { messageId: id })
          )
        );

        const queryText = recentMessages
          .filter((m) => m !== null)
          .map((m) => m!.content)
          .join(" ");

        if (queryText.length > 0) {
          const apiKey = process.env.OPENAI_API_KEY;
          if (apiKey) {
            const OpenAI = (await import("openai")).default;
            const openai = new OpenAI({ apiKey });

            const embeddingResponse = await openai.embeddings.create({
              model: "text-embedding-3-small",
              input: queryText,
            });
            queryEmbedding = embeddingResponse.data[0]?.embedding || null;
          }
        }
      } catch (error) {
        console.error("Failed to generate query embedding:", error);
        // Continue without vector search
      }
    }

    // Score memories: combine vector similarity with importance/recency
    const scoredMemories = allMemories.map((memory) => {
      let score = memory.importance * memory.recencyScore;

      // Add vector similarity score if available
      if (queryEmbedding && memory.embedding && memory.embedding.length > 0) {
        const similarity = cosineSimilarity(queryEmbedding, memory.embedding);
        // Weight similarity: 0.6 for similarity, 0.4 for importance*recency
        score = similarity * 0.6 + score * 0.4;
      }

      return { memory, score };
    });

    // Sort by combined score
    scoredMemories.sort((a, b) => b.score - a.score);

    // Limit by token budget (rough estimate: 1 token ≈ 4 chars)
    const memorySnippets: string[] = [];
    let tokenCount = 0;
    for (const { memory } of scoredMemories) {
      const estimatedTokens = Math.ceil(memory.content.length / 4);
      if (tokenCount + estimatedTokens <= maxTokens) {
        memorySnippets.push(
          `[${memory.scope}/${memory.kind}] ${memory.content}`
        );
        tokenCount += estimatedTokens;
      } else {
        break;
      }
    }

    // Get summaries (also use vector search if available)
    const summaries = await ctx.runQuery(internal.memory.getSummariesInternal, {
      ownerUserId: args.ownerUserId,
      roomId: args.roomId,
      threadId: args.threadId,
    });

    // Score summaries with vector similarity if available
    let scoredSummaries = summaries;
    if (queryEmbedding) {
      scoredSummaries = summaries
        .map((summary) => {
          let score = summary.level; // Higher level = more important
          if (summary.embedding && summary.embedding.length > 0) {
            const similarity = cosineSimilarity(queryEmbedding!, summary.embedding);
            score = similarity * 0.7 + score * 0.3;
          }
          return { summary, score };
        })
        .sort((a, b) => b.score - a.score)
        .map((s) => s.summary)
        .slice(0, 3); // Top 3 summaries
    }

    return {
      memorySnippets,
      summaries: scoredSummaries.map((s) => s.content),
    };
  },
});

export const summarizeThread = action({
  args: {
    threadId: v.id("threads"),
    ownerUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { threadId, ownerUserId } = args;

    // Load thread
    const thread = await ctx.runQuery(internal.memory.getThreadInternal, { threadId });
    if (!thread) {
      throw new Error("Thread not found");
    }

    // Load room
    const room = await ctx.runQuery(internal.memory.getRoomInternal, {
      roomId: thread.roomId,
    });
    if (!room) {
      throw new Error("Room not found");
    }

    // Load all messages in thread
    const messages = await ctx.runQuery(internal.memory.getRecentMessagesInternal, {
      roomId: thread.roomId,
      threadId,
      limit: 200, // Get more messages for summarization
    });

    if (messages.length === 0) {
      return { success: false, message: "No messages to summarize" };
    }

    // Build summarization prompt
    const messagesText = messages
      .map((m) => {
        const roleLabel = m.role === "user" ? "U" : m.role === "assistant" ? "M" : "S";
        return `${roleLabel}: ${m.content}`;
      })
      .join("\n\n");

    const summarizationPrompt = `请总结以下线程对话，提取关键决策、重要信息和进展。

线程标题: ${thread.title}
房间: ${room.title}

对话内容:
${messagesText}

请用 3-5 句话总结这个线程的核心内容、关键决策和重要进展。`;

    // Call AI provider
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `你是 Mazlo 的摘要生成器。你的任务是将对话历史总结成简洁、有用的摘要。摘要应该：
1. 突出关键决策和重要信息
2. 保持简洁（通常 3-5 句话）
3. 使用中文或中英混合
4. 便于后续检索和理解`,
        },
        { role: "user", content: summarizationPrompt },
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    const summaryContent = completion.choices[0]?.message?.content;
    if (!summaryContent) {
      throw new Error("No summary generated");
    }

    const now = Date.now();
    const timeFrom = messages[0]?.createdAt || now;
    const timeTo = messages[messages.length - 1]?.createdAt || now;

    // Check if summary exists
    const existingSummaries = await ctx.runQuery(internal.memory.getThreadSummariesInternal, {
      threadId,
      level: 1,
    });

    let summaryId;
    if (existingSummaries.length > 0) {
      // Update existing summary
      summaryId = existingSummaries[0]._id;
      await ctx.runMutation(internal.memory.updateSummaryInternal, {
        summaryId,
        content: summaryContent,
        timeFrom,
        timeTo,
        updatedAt: now,
      });
    } else {
      // Create new summary
      summaryId = await ctx.runMutation(internal.memory.createSummaryInternal, {
        ownerUserId,
        roomId: thread.roomId,
        threadId,
        level: 1,
        timeFrom,
        timeTo,
        content: summaryContent,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Generate embedding
    try {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: summaryContent,
      });
      const embedding = embeddingResponse.data[0]?.embedding;
      if (embedding) {
        await ctx.runMutation(internal.memory.updateSummaryEmbeddingInternal, {
          summaryId,
          embedding,
        });
      }
    } catch (error) {
      console.error("Failed to generate summary embedding:", error);
    }

    // Create memory event
    await ctx.runMutation(internal.memory.createMemoryEventInternal, {
      ownerUserId,
      roomId: thread.roomId,
      threadId,
      type: "summarize",
      payload: { level: 1, summaryId },
      createdAt: now,
    });

    return { success: true, summaryId, content: summaryContent };
  },
});

export const summarizeRoom = action({
  args: {
    roomId: v.id("rooms"),
    ownerUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { roomId, ownerUserId } = args;

    // Load room
    const room = await ctx.runQuery(internal.memory.getRoomInternal, { roomId });
    if (!room) {
      throw new Error("Room not found");
    }

    // Load all threads in room
    const threads = await ctx.runQuery(internal.memory.getThreadsByRoomInternal, {
      roomId,
    });

    // Load recent messages from all threads (last 100)
    const allMessages: any[] = [];
    for (const thread of threads.slice(0, 10)) {
      // Limit to 10 threads to avoid too much data
      const messages = await ctx.runQuery(internal.memory.getRecentMessagesInternal, {
        roomId,
        threadId: thread._id,
        limit: 50,
      });
      allMessages.push(...messages);
    }

    // Sort by creation time
    allMessages.sort((a, b) => a.createdAt - b.createdAt);

    if (allMessages.length === 0) {
      return { success: false, message: "No messages to summarize" };
    }

    // Build summarization prompt
    const messagesText = allMessages
      .slice(-100) // Take last 100 messages
      .map((m) => {
        const roleLabel = m.role === "user" ? "U" : m.role === "assistant" ? "M" : "S";
        return `${roleLabel}: ${m.content}`;
      })
      .join("\n\n");

    const summarizationPrompt = `请总结以下房间的所有对话，提取房间的目标、关键决策、重要里程碑和整体进展。

房间标题: ${room.title}
房间类型: ${room.type}
${room.description ? `房间描述: ${room.description}` : ""}

对话内容（来自多个线程）:
${messagesText}

请用 5-7 句话总结这个房间的整体情况、项目目标、关键决策和重要里程碑。`;

    // Call AI provider
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `你是 Mazlo 的摘要生成器。你的任务是将房间的所有对话总结成简洁、有用的摘要。摘要应该：
1. 突出房间的目标和整体情况
2. 总结关键决策和重要里程碑
3. 保持简洁（通常 5-7 句话）
4. 使用中文或中英混合
5. 便于后续检索和理解`,
        },
        { role: "user", content: summarizationPrompt },
      ],
      temperature: 0.5,
      max_tokens: 700,
    });

    const summaryContent = completion.choices[0]?.message?.content;
    if (!summaryContent) {
      throw new Error("No summary generated");
    }

    const now = Date.now();
    const timeFrom = allMessages[0]?.createdAt || now;
    const timeTo = allMessages[allMessages.length - 1]?.createdAt || now;

    // Check if summary exists
    const existingSummaries = await ctx.runQuery(internal.memory.getRoomSummariesInternal, {
      roomId,
      level: 2,
    });

    let summaryId;
    if (existingSummaries.length > 0) {
      // Update existing summary
      summaryId = existingSummaries[0]._id;
      await ctx.runMutation(internal.memory.updateSummaryInternal, {
        summaryId,
        content: summaryContent,
        timeFrom,
        timeTo,
        updatedAt: now,
      });
    } else {
      // Create new summary
      summaryId = await ctx.runMutation(internal.memory.createSummaryInternal, {
        ownerUserId,
        roomId,
        level: 2,
        timeFrom,
        timeTo,
        content: summaryContent,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Generate embedding
    try {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: summaryContent,
      });
      const embedding = embeddingResponse.data[0]?.embedding;
      if (embedding) {
        await ctx.runMutation(internal.memory.updateSummaryEmbeddingInternal, {
          summaryId,
          embedding,
        });
      }
    } catch (error) {
      console.error("Failed to generate summary embedding:", error);
    }

    // Create memory event
    await ctx.runMutation(internal.memory.createMemoryEventInternal, {
      ownerUserId,
      roomId,
      type: "summarize",
      payload: { level: 2, summaryId },
      createdAt: now,
    });

    return { success: true, summaryId, content: summaryContent };
  },
});

// Internal queries for actions
export const listForRoomAndThreadInternal = internalQuery({
  args: {
    ownerUserId: v.id("users"),
    roomId: v.id("rooms"),
    threadId: v.optional(v.id("threads")),
  },
  handler: async (ctx, args) => {
    let memories = await ctx.db
      .query("memories")
      .withIndex("by_owner_scope", (q) =>
        q.eq("ownerUserId", args.ownerUserId)
      )
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // Filter by scope
    memories = memories.filter((m) => {
      if (args.threadId && m.scope === "thread") {
        return m.threadId === args.threadId;
      }
      if (m.scope === "room") {
        return m.roomId === args.roomId;
      }
      if (m.scope === "global") {
        return true;
      }
      return false;
    });

    return memories.sort((a, b) => b.importance - a.importance);
  },
});

export const listGlobalForUserInternal = internalQuery({
  args: {
    ownerUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("memories")
      .withIndex("by_owner_scope", (q) =>
        q.eq("ownerUserId", args.ownerUserId).eq("scope", "global")
      )
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .collect();
  },
});

export const getSummariesInternal = internalQuery({
  args: {
    ownerUserId: v.id("users"),
    roomId: v.id("rooms"),
    threadId: v.optional(v.id("threads")),
  },
  handler: async (ctx, args) => {
    const summaries = await ctx.db
      .query("memory_summaries")
      .withIndex("by_owner_room_level", (q) =>
        q.eq("ownerUserId", args.ownerUserId).eq("roomId", args.roomId)
      )
      .collect();

    if (args.threadId) {
      const threadSummaries = await ctx.db
        .query("memory_summaries")
        .withIndex("by_thread_level", (q) =>
          q.eq("threadId", args.threadId)
        )
        .collect();
      summaries.push(...threadSummaries);
    }

    return summaries.sort((a, b) => b.level - a.level).slice(0, 3);
  },
});

// Internal queries for memory intake
export const getMessageInternal = internalQuery({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.messageId);
  },
});

export const getRoomInternal = internalQuery({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});

export const getThreadInternal = internalQuery({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.threadId);
  },
});

export const getRecentMessagesInternal = internalQuery({
  args: {
    roomId: v.id("rooms"),
    threadId: v.optional(v.id("threads")),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("messages")
      .withIndex("by_room_time", (q) => q.eq("roomId", args.roomId));

    if (args.threadId) {
      query = ctx.db
        .query("messages")
        .withIndex("by_thread_time", (q) => q.eq("threadId", args.threadId));
    }

    const messages = await query.order("desc").take(args.limit);
    return messages.reverse(); // Return in chronological order
  },
});

// Internal mutations for memory intake
export const createMemoryInternal = internalMutation({
  args: {
    ownerUserId: v.id("users"),
    scope: v.string(),
    roomId: v.optional(v.id("rooms")),
    threadId: v.optional(v.id("threads")),
    kind: v.string(),
    source: v.string(),
    content: v.string(),
    importance: v.number(),
    recencyScore: v.number(),
    usedCount: v.number(),
    status: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("memories", {
      ownerUserId: args.ownerUserId,
      scope: args.scope,
      roomId: args.roomId,
      threadId: args.threadId,
      kind: args.kind,
      source: args.source,
      content: args.content,
      importance: args.importance,
      recencyScore: args.recencyScore,
      usedCount: args.usedCount,
      status: args.status,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });
  },
});

export const updateMemoryInternal = internalMutation({
  args: {
    memoryId: v.id("memories"),
    content: v.optional(v.string()),
    importance: v.optional(v.number()),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const updates: any = { updatedAt: args.updatedAt };
    if (args.content !== undefined) updates.content = args.content;
    if (args.importance !== undefined) updates.importance = args.importance;
    await ctx.db.patch(args.memoryId, updates);
  },
});

export const updateMemoryEmbeddingInternal = internalMutation({
  args: {
    memoryId: v.id("memories"),
    embedding: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.memoryId, {
      embedding: args.embedding,
    });
  },
});

export const createMemoryEventInternal = internalMutation({
  args: {
    ownerUserId: v.id("users"),
    roomId: v.optional(v.id("rooms")),
    threadId: v.optional(v.id("threads")),
    type: v.string(),
    sourceMessageId: v.optional(v.id("messages")),
    memoryId: v.optional(v.id("memories")),
    payload: v.optional(v.any()),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("memory_events", {
      ownerUserId: args.ownerUserId,
      roomId: args.roomId,
      threadId: args.threadId,
      type: args.type,
      sourceMessageId: args.sourceMessageId,
      memoryId: args.memoryId,
      payload: args.payload,
      createdAt: args.createdAt,
    });
  },
});

// Internal queries for summarization
export const getThreadSummariesInternal = internalQuery({
  args: {
    threadId: v.id("threads"),
    level: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("memory_summaries")
      .withIndex("by_thread_level", (q) =>
        q.eq("threadId", args.threadId).eq("level", args.level)
      )
      .collect();
  },
});

export const getRoomSummariesInternal = internalQuery({
  args: {
    roomId: v.id("rooms"),
    level: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("memory_summaries")
      .withIndex("by_owner_room_level", (q) =>
        q.eq("roomId", args.roomId).eq("level", args.level)
      )
      .collect();
  },
});

export const getThreadsByRoomInternal = internalQuery({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("threads")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});

// Internal mutations for summarization
export const createSummaryInternal = internalMutation({
  args: {
    ownerUserId: v.id("users"),
    roomId: v.optional(v.id("rooms")),
    threadId: v.optional(v.id("threads")),
    level: v.number(),
    timeFrom: v.number(),
    timeTo: v.number(),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("memory_summaries", {
      ownerUserId: args.ownerUserId,
      roomId: args.roomId,
      threadId: args.threadId,
      level: args.level,
      timeFrom: args.timeFrom,
      timeTo: args.timeTo,
      content: args.content,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });
  },
});

export const updateSummaryInternal = internalMutation({
  args: {
    summaryId: v.id("memory_summaries"),
    content: v.string(),
    timeFrom: v.number(),
    timeTo: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.summaryId, {
      content: args.content,
      timeFrom: args.timeFrom,
      timeTo: args.timeTo,
      updatedAt: args.updatedAt,
    });
  },
});

export const updateSummaryEmbeddingInternal = internalMutation({
  args: {
    summaryId: v.id("memory_summaries"),
    embedding: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.summaryId, {
      embedding: args.embedding,
    });
  },
});

