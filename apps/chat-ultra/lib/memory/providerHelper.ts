/**
 * Provider helper for use in Convex actions
 * Since Convex actions run in Node.js, we can import provider code directly
 */

import { getProvider } from "@/lib/provider";
import type { ChatProvider, ChatMessage } from "@/lib/provider/base";

/**
 * Get provider instance for memory operations
 * Uses environment variables or user settings
 */
export async function getProviderForMemory(
  providerName: "openai" | "zai" = "openai",
  apiKey?: string
): Promise<ChatProvider> {
  // If API key provided, use it directly
  if (apiKey) {
    return getProvider(providerName, apiKey);
  }

  // Otherwise, try to get from environment
  // In Convex actions, we can access process.env
  const envKey =
    providerName === "openai"
      ? process.env.OPENAI_API_KEY
      : process.env.ZAI_API_KEY;

  if (!envKey) {
    throw new Error(
      `API key not found for provider ${providerName}. Set ${providerName.toUpperCase()}_API_KEY environment variable or pass apiKey parameter.`
    );
  }

  return getProvider(providerName, envKey);
}

/**
 * Call AI provider with memory plan prompt
 */
export async function callMemoryPlanModel(
  provider: ChatProvider,
  systemPrompt: string,
  userPrompt: string,
  model: string = "gpt-4"
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const result = await provider.chatCompletion({
    messages,
    model,
    temperature: 0.3, // Lower temperature for more consistent JSON output
    maxTokens: 2000,
  });

  return result.content;
}

/**
 * Call AI provider for summarization
 */
export async function callSummarizationModel(
  provider: ChatProvider,
  prompt: string,
  model: string = "gpt-4"
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `你是 Mazlo 的摘要生成器。你的任务是将对话历史总结成简洁、有用的摘要。摘要应该：
1. 突出关键决策和重要信息
2. 保持简洁（通常 3-5 句话）
3. 使用中文或中英混合
4. 便于后续检索和理解`,
    },
    { role: "user", content: prompt },
  ];

  const result = await provider.chatCompletion({
    messages,
    model,
    temperature: 0.5,
    maxTokens: 500,
  });

  return result.content;
}

/**
 * Generate embeddings for memory content
 */
export async function generateEmbeddings(
  provider: ChatProvider,
  texts: string[],
  model: string = "text-embedding-3-small"
): Promise<number[][]> {
  const result = await provider.embed({ texts, model });
  return result.embeddings;
}

