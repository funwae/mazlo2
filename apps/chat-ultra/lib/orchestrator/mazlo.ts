import { buildMazloPrompt } from "./buildPrompt";
import { getDefaultProvider } from "@/lib/provider";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export interface HandleUserMessageInput {
  roomId: string;
  threadId: string;
  userMessage: string;
  userId: string;
  mode?: "room" | "global";
  provider?: string;
  model?: string;
}

export async function* handleUserMessage(input: HandleUserMessageInput) {
  const {
    roomId,
    threadId,
    userMessage,
    userId,
    mode = "room",
    provider = "openai",
    model = "gpt-4",
  } = input;

  try {
    // 1. Save user message to Convex
    const userMessageId = await convexClient.mutation(api.messages.send, {
      roomId: roomId as any,
      threadId: threadId ? (threadId as any) : undefined,
      senderType: "user",
      senderUserId: userId as any,
      role: "user",
      content: userMessage,
    });

    // 2. Get recent messages for context
    const recentMessages = await convexClient.query(
      api.messages.listByRoomAndThread,
      {
        roomId: roomId as any,
        threadId: threadId ? (threadId as any) : undefined,
        limit: 40,
      }
    );

    // 3. Retrieve memories and summaries
    const memoryBundle = await convexClient.action(api.memory.retrieveForReply, {
      mode,
      roomId: roomId as any,
      threadId: threadId ? (threadId as any) : undefined,
      ownerUserId: userId as any,
      recentMessageIds: recentMessages.map((m: any) => m._id),
      maxTokens: 1024,
    });

    // 4. Build prompt with memory
    const conversationMessages = recentMessages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    const { messages } = buildMazloPrompt({
      mode,
      memoryBundle,
      conversationMessages,
    });

    // Add the current user message
    messages.push({
      role: "user",
      content: userMessage,
    });

    // 5. Get provider and generate response
    const providerInstance = getDefaultProvider();
    const apiKey =
      provider === "openai"
        ? process.env.OPENAI_API_KEY
        : process.env.ZAI_API_KEY;

    if (!apiKey) {
      throw new Error(`${provider.toUpperCase()} API key not configured`);
    }

    const providerWithKey = provider === "openai"
      ? new (await import("@/lib/provider/openai")).OpenAIProvider(apiKey)
      : new (await import("@/lib/provider/zai")).ZaiProvider(apiKey);

    // Stream response
    let fullContent = "";
    const traceSteps: Array<{
      step_number: number;
      action_type: string;
      description: string;
    }> = [];

    traceSteps.push({
      step_number: 1,
      action_type: "Plan",
      description: `Processing ${mode} request in room "${roomId}" with ${memoryBundle.memorySnippets.length} memories`,
    });

    // Use streaming if provider supports it
    if ("streamChat" in providerWithKey) {
      for await (const chunk of (providerWithKey as any).streamChat(messages, {
        model,
        temperature: 0.7,
      })) {
        fullContent += chunk;
        yield { type: "token", content: chunk };
      }
    } else {
      // Fallback to non-streaming
      const result = await providerWithKey.chatCompletion({
        messages,
        model,
        temperature: 0.7,
      });
      fullContent = result.content;
      yield { type: "token", content: result.content };
    }

    // 6. Save Mazlo message
    const mazloMessageId = await convexClient.mutation(api.messages.send, {
      roomId: roomId as any,
      threadId: threadId ? (threadId as any) : undefined,
      senderType: "mazlo",
      role: "assistant",
      content: fullContent,
      meta: {
        provider: `${provider}:${model}`,
        traceSteps,
        memoryCount: memoryBundle.memorySnippets.length,
      },
    });

    // 7. Trigger memory intake asynchronously (fire-and-forget)
    convexClient
      .action(api.memory.intakeForMessage, {
        messageId: userMessageId,
      })
      .catch((err) => {
        console.error("Memory intake failed:", err);
      });

    convexClient
      .action(api.memory.intakeForMessage, {
        messageId: mazloMessageId,
      })
      .catch((err) => {
        console.error("Memory intake failed:", err);
      });

    yield { type: "done", messageId: mazloMessageId };
  } catch (error: any) {
    yield { type: "error", error: error.message };
    throw error;
  }
}
