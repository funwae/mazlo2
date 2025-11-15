import type { ChatProvider, ChatMessage, CompletionResult, EmbedResult } from "./base";

/**
 * z.ai Provider implementation for GLM models
 * 
 * API Documentation: https://docs.z.ai/
 * Base URL: https://api.z.ai/api/paas/v4
 */
export class ZaiProvider implements ChatProvider {
  name = "zai" as const;
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || "https://api.z.ai/api/paas/v4";
  }

  async chatCompletion(args: {
    messages: ChatMessage[];
    model: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<CompletionResult> {
    // Map model names to z.ai model names
    // Available models: glm-4-plus (recommended), glm-4-flash, glm-4-air
    const modelMap: Record<string, string> = {
      "zai-gpt-4": "glm-4-plus",
      "zai-gpt-3.5": "glm-4-flash",
      "glm-4": "glm-4-plus",
      "glm-3-turbo": "glm-4-flash",
      "glm-4.6": "glm-4-plus",
      "glm-4-plus": "glm-4-plus",
      "glm-4-flash": "glm-4-flash",
      "glm-4-air": "glm-4-air",
    };

    const zaiModel = modelMap[args.model] || args.model;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: zaiModel,
        messages: args.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: args.temperature ?? 0.7,
        max_tokens: args.maxTokens,
        stream: false,
      }),
    });

    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = response.statusText;
      }
      throw new Error(
        `z.ai API error (${response.status}): ${errorText || response.statusText}`
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    if (!content && data.error) {
      throw new Error(`z.ai API error: ${JSON.stringify(data.error)}`);
    }

    return {
      content,
      raw: data,
    };
  }

  async embed(args: {
    texts: string[];
    model?: string;
  }): Promise<EmbedResult> {
    // z.ai embedding endpoint (if available)
    // For now, throw error as embedding may not be available in GLM Lite plan
    throw new Error(
      "z.ai embedding not yet implemented. Please use OpenAI provider for embeddings."
    );
  }

  /**
   * Streaming chat completion support
   */
  async *streamChat(
    messages: ChatMessage[],
    config: { model: string; temperature?: number; maxTokens?: number }
  ): AsyncGenerator<string> {
    const modelMap: Record<string, string> = {
      "zai-gpt-4": "glm-4-plus",
      "zai-gpt-3.5": "glm-4-flash",
      "glm-4": "glm-4-plus",
      "glm-3-turbo": "glm-4-flash",
      "glm-4.6": "glm-4-plus",
      "glm-4-plus": "glm-4-plus",
      "glm-4-flash": "glm-4-flash",
      "glm-4-air": "glm-4-air",
    };

    const zaiModel = modelMap[config.model] || config.model;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: zaiModel,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens,
        stream: true,
      }),
    });

    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = response.statusText;
      }
      throw new Error(
        `z.ai API error (${response.status}): ${errorText || response.statusText}`
      );
    }

    if (!response.body) {
      throw new Error("No response body for streaming");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              return;
            }

            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content || "";
              if (content) {
                yield content;
              }
            } catch (e) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
