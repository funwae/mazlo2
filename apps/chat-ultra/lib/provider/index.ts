import { OpenAIProvider } from "./openai";
import { ZaiProvider } from "./zai";
import type { ChatProvider } from "./base";

/**
 * Get a provider instance based on name
 */
export function getProvider(
  name: "openai" | "zai",
  apiKey: string
): ChatProvider {
  switch (name) {
    case "openai":
      return new OpenAIProvider(apiKey);
    case "zai":
      return new ZaiProvider(apiKey);
    default:
      throw new Error(`Unknown provider: ${name}`);
  }
}

/**
 * Get default provider from environment
 */
export function getDefaultProvider(): ChatProvider {
  const providerName = (process.env.DEFAULT_PROVIDER || "openai") as "openai" | "zai";
  const apiKey =
    providerName === "openai"
      ? process.env.OPENAI_API_KEY
      : process.env.ZAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      `API key not found for provider ${providerName}. Set ${providerName.toUpperCase()}_API_KEY environment variable.`
    );
  }

  return getProvider(providerName, apiKey);
}

