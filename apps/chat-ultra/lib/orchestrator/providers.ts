import OpenAI from 'openai';

export interface ProviderConfig {
  name: string;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface Provider {
  name: string;
  streamChat(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    config: ProviderConfig
  ): AsyncGenerator<string>;
  supportsMode(mode: string): boolean;
}

export class OpenAIProvider implements Provider {
  name = 'openai';

  async *streamChat(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    config: ProviderConfig
  ): AsyncGenerator<string> {
    const openai = new OpenAI({
      apiKey: config.apiKey,
    });

    const stream = await openai.chat.completions.create({
      model: config.model,
      messages: messages as any,
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        yield content;
      }
    }
  }

  supportsMode(mode: string): boolean {
    return ['chat', 'translate', 'code', 'critique'].includes(mode);
  }
}

export function getProvider(name: string): Provider {
  switch (name) {
    case 'openai':
      return new OpenAIProvider();
    default:
      throw new Error(`Unknown provider: ${name}`);
  }
}

