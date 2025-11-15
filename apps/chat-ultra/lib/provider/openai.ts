import OpenAI from "openai";
import type { ChatProvider, ChatMessage, CompletionResult, EmbedResult } from "./base";

export class OpenAIProvider implements ChatProvider {
  name = "openai" as const;
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
    });
  }

  async chatCompletion(args: {
    messages: ChatMessage[];
    model: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<CompletionResult> {
    const response = await this.client.chat.completions.create({
      model: args.model,
      messages: args.messages as any,
      temperature: args.temperature ?? 0.7,
      max_tokens: args.maxTokens,
    });

    const content = response.choices[0]?.message?.content || "";
    return {
      content,
      raw: response,
    };
  }

  async embed(args: {
    texts: string[];
    model?: string;
  }): Promise<EmbedResult> {
    const model = args.model || "text-embedding-3-small";
    const response = await this.client.embeddings.create({
      model,
      input: args.texts,
    });

    return {
      embeddings: response.data.map((item) => item.embedding),
      raw: response,
    };
  }

  // Streaming support (for existing code compatibility)
  async *streamChat(
    messages: ChatMessage[],
    config: { model: string; temperature?: number; maxTokens?: number }
  ): AsyncGenerator<string> {
    const stream = await this.client.chat.completions.create({
      model: config.model,
      messages: messages as any,
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        yield content;
      }
    }
  }
}

