/**
 * Parse natural language memory commands from user messages
 */

export interface MemoryCommand {
  type: "remember" | "forget";
  scope: "room" | "global";
  content: string;
}

const REMEMBER_PATTERNS = [
  /记住[：:]\s*(.+)/i,
  /在这个房间里[，,]?\s*你以后要记得[：:]\s*(.+)/i,
  /全局记住[：:]\s*(.+)/i,
  /remember[：:]\s*(.+)/i,
];

const FORGET_PATTERNS = [
  /忘记[：:]\s*(.+)/i,
  /不要再记[：:]\s*(.+)/i,
  /forget[：:]\s*(.+)/i,
];

export function parseMemoryCommand(message: string): MemoryCommand | null {
  // Check for remember commands
  for (const pattern of REMEMBER_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      const content = match[1].trim();
      const scope = message.includes("全局") || message.includes("global")
        ? "global"
        : "room";
      return {
        type: "remember",
        scope,
        content,
      };
    }
  }

  // Check for forget commands
  for (const pattern of FORGET_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      const content = match[1].trim();
      return {
        type: "forget",
        scope: "room", // Default to room scope for forget
        content,
      };
    }
  }

  return null;
}

