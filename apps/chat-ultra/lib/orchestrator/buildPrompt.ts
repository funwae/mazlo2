import type { MemoryBundle } from "@/lib/memory/buildPrompt";
import {
  buildMemorySection,
  buildSummarySection,
  buildConversationSection,
  buildFullPrompt,
} from "@/lib/memory/buildPrompt";
import { getSystemPrompt } from "./system-prompt";

export interface BuildPromptOptions {
  mode: "room" | "global";
  memoryBundle: MemoryBundle;
  conversationMessages: Array<{ role: string; content: string }>;
}

export function buildMazloPrompt(options: BuildPromptOptions): {
  systemPrompt: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
} {
  const { mode, memoryBundle, conversationMessages } = options;

  const systemPrompt = getSystemPrompt(mode);

  // Build the full system prompt with memory and summaries
  const fullSystemPrompt = buildFullPrompt({
    systemPrompt,
    memoryBundle,
    conversationMessages,
  });

  // Convert conversation messages to the format expected by providers
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: fullSystemPrompt },
    ...conversationMessages.map((msg) => ({
      role: msg.role as "system" | "user" | "assistant",
      content: msg.content,
    })),
  ];

  return {
    systemPrompt: fullSystemPrompt,
    messages,
  };
}

