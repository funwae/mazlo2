/**
 * Base provider interface for LLM providers
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CompletionResult {
  content: string;
  raw: any;
}

export interface EmbedResult {
  embeddings: number[][];
  raw?: any;
}

export interface ChatProvider {
  name: "openai" | "zai";

  chatCompletion(args: {
    messages: ChatMessage[];
    model: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<CompletionResult>;

  embed(args: {
    texts: string[];
    model?: string;
  }): Promise<EmbedResult>;
}

