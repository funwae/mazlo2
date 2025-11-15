/**
 * Build prompt sections for Mazlo with memory and summaries
 */

export interface MemoryBundle {
  memorySnippets: string[];
  summaries: string[];
}

export function buildMemorySection(memorySnippets: string[]): string {
  if (memorySnippets.length === 0) {
    return "";
  }

  return `[Memory: Room / Thread / Global]

${memorySnippets.map((snippet) => `- ${snippet}`).join("\n")}

`;
}

export function buildSummarySection(summaries: string[]): string {
  if (summaries.length === 0) {
    return "";
  }

  return `[Summary]

${summaries.map((summary, i) => {
  const labels = ["线程摘要", "房间摘要", "全局/项目摘要"];
  return `- ${labels[i] || "摘要"}: ${summary}`;
}).join("\n")}

`;
}

export function buildConversationSection(messages: Array<{ role: string; content: string }>): string {
  return `[Conversation History]

${messages.map((msg) => {
  const roleLabel = msg.role === "user" ? "U" : msg.role === "assistant" ? "M" : "S";
  return `${roleLabel}: ${msg.content}`;
}).join("\n\n")}

`;
}

export function buildFullPrompt(options: {
  systemPrompt: string;
  memoryBundle: MemoryBundle;
  conversationMessages: Array<{ role: string; content: string }>;
}): string {
  const { systemPrompt, memoryBundle, conversationMessages } = options;

  let prompt = `${systemPrompt}\n\n`;

  prompt += buildSummarySection(memoryBundle.summaries);
  prompt += buildMemorySection(memoryBundle.memorySnippets);
  prompt += buildConversationSection(conversationMessages);

  return prompt;
}

