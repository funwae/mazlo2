import { buildMazloPrompt } from "./buildPrompt";
import { getDefaultProvider } from "@/lib/provider";
import { createMessage, getMessagesByThread } from "@/lib/data/messages";

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
    // 1. Save user message
    const savedUserMessage = await createMessage({
      roomId,
      threadId,
      role: "user",
      content: input.userMessage,
    });

    // 2. Get recent messages for context
    const recentMessages = await getMessagesByThread(threadId, 40);

    // 3. Retrieve memories and summaries (placeholder - TODO: implement memory system)
    const memoryBundle = {
      memorySnippets: [] as any[],
      summaries: [] as any[],
    };

    // 4. Build prompt with memory
    const conversationMessages = recentMessages.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
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
      content: input.userMessage,
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
      description: `Processing ${mode} request in room "${roomId}"`,
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
            const result = await (providerWithKey as any).chatCompletion({
              messages,
              model,
              temperature: 0.7,
            });
            fullContent = result.content;
            yield { type: "token", content: result.content };
          }

    // 6. Save Mazlo message
    const mazloMessage = await createMessage({
      roomId,
      threadId,
      role: "mazlo",
      content: fullContent,
      provider: `${provider}:${model}`,
    });

    // 7. Trigger memory intake asynchronously (fire-and-forget)
    // TODO: Implement memory intake system
    // For now, we skip memory intake

    yield { type: "done", messageId: mazloMessage.id };
  } catch (error: any) {
    yield { type: "error", error: error.message };
    throw error;
  }
}
