/**
 * Memory Plan prompt utilities for Mazlo memory system
 * Based on docs/09-memory-plan-prompt.md
 */

export interface MemoryCandidate {
  scope: "thread" | "room" | "global";
  kind: "fact" | "preference" | "plan" | "identity" | "project";
  importance: number; // 0.0 to 1.0
  content: string;
  reason: string;
  suggestPin: boolean;
}

export interface MemoryPlan {
  candidates: MemoryCandidate[];
  shouldSummarizeThread: boolean;
  shouldSummarizeRoom: boolean;
}

export const MEMORY_PLAN_SYSTEM_PROMPT = `你是 Mazlo 的"记忆规划器"（Memory Planner）。

你的任务不是回答用户问题，而是为 Mazlo 的记忆系统做出"要记什么、记到哪里、记多久"的决策。

Chat Ultra / Mazlo 的记忆系统有以下特性：

1. 多层级作用域（Scopes）
   - thread 级记忆：只与当前线程强相关。
   - room 级记忆：适用于当前房间中大部分对话。
   - global 级记忆：与用户长期身份、偏好、项目密切相关。
   - system 级记忆：开发者配置的系统规则（通常不由你创建）。

2. 记忆类型（Kinds）
   - fact：稳定事实（例如"用户住在东京"、"这个房间是 ZekeChat 设计室"）。
   - preference：偏好（例如"用户喜欢用中文写规格"、"用户偏好简短回答"）。
   - plan：计划 / TODO（例如"本线程目标是完成 Logo v3 设计"）。
   - identity：用户自我描述、价值观、长期角色定义。
   - project：项目或房间的目的、约束、阶段性目标。

3. 选择性记忆（Selective）
   - 只有对未来多次对话有用的内容才值得写入长期记忆。
   - 临时的、一次性的、很容易再说一遍的内容不要记。
   - 对隐私敏感、用户显然不想持久存储的内容不要记。

4. 摘要（Summaries）
   - 当线程很长、房间历史庞大时，应建议生成摘要：
     - 线程摘要：总结当前线程的目标、关键决策、进展。
     - 房间摘要：总结这个房间的用途、项目整体情况。

输出要求：
- **只输出 JSON**，不要任何解释性文字。
- JSON 必须能被严格解析。
- importance 使用 0.0 ~ 1.0 浮点数，0.0 最不重要，1.0 极其重要。
- 不要为同一事实生成多个几乎相同的候选。`;

export interface MemoryPlanLocation {
  userId: string;
  roomId: string;
  roomTitle: string;
  threadId?: string;
  threadTitle?: string;
  roomType: "dm" | "group" | "project" | "global";
}

export interface RecentMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export function buildMemoryPlanUserPrompt(options: {
  location: MemoryPlanLocation;
  recentMessages: RecentMessage[];
  existingMemorySnippets: string[];
}): string {
  const { location, recentMessages, existingMemorySnippets } = options;

  const messagesBlock = recentMessages
    .map((msg) => {
      const roleLabel = msg.role === "user" ? "U" : msg.role === "assistant" ? "M" : "S";
      return `${roleLabel}: ${msg.content}`;
    })
    .join("\n");

  const memorySnippetsBlock =
    existingMemorySnippets.length > 0
      ? existingMemorySnippets.map((snippet) => `- ${snippet}`).join("\n")
      : "- （暂无相关记忆）";

  return `你将看到：

1. 当前所在位置（Location）
2. 最近对话历史（Latest Conversation）
3. 当前已存在记忆片段（Existing Memories）

请根据这些信息，输出一个"记忆规划"（Memory Plan）。

---

【Location】
- UserId: ${location.userId}
- RoomId: ${location.roomId}
- RoomTitle: ${location.roomTitle}
- ThreadId: ${location.threadId || "null"}
- ThreadTitle: ${location.threadTitle || "null"}
- RoomType: ${location.roomType}

【Latest Conversation】
（从旧到新排列）

${messagesBlock}

【Existing Memories】
（与你当前 scope 相关的记忆摘要，每条一行）

${memorySnippetsBlock}

---

【你的任务】

1. 识别哪些内容**值得写入长期记忆**：
   - 对未来多次对话有帮助；
   - 是用户的稳定事实、偏好、项目目标、长期计划；
   - 或者是该房间/线程的定位。

2. 为每个候选记忆选择合适的：
   - scope: "thread" | "room" | "global"
   - kind: "fact" | "preference" | "plan" | "identity" | "project"
   - importance: 0.0 ~ 1.0
   - content: 用 1–3 句中文或中英混合简洁描述这个记忆。
   - reason: 简要说明你为什么要记它。
   - suggestPin: true/false （如果你认为特别关键，建议 UI 提示用户"是否固定为重要记忆"）

3. 决定是否建议生成摘要：
   - shouldSummarizeThread: 当前线程是否该生成/更新摘要（true/false）
   - shouldSummarizeRoom: 当前房间是否该生成/更新摘要（true/false）

如果没有适合写入记忆的内容，可以输出空的 candidates 数组。

---

【输出格式】

严格输出下面的 JSON 结构（不要添加注释或多余字段）：

{
  "candidates": [
    {
      "scope": "room",
      "kind": "project",
      "importance": 0.9,
      "content": "这个房间是 ZekeChat 中英双语界面设计的专用空间。",
      "reason": "用户明确说明房间用途，这会影响后续所有讨论。",
      "suggestPin": true
    }
  ],
  "shouldSummarizeThread": false,
  "shouldSummarizeRoom": false
}`;
}

/**
 * Parse JSON response from memory plan prompt
 */
export function parseMemoryPlan(jsonString: string): MemoryPlan {
  try {
    // Try to extract JSON from markdown code blocks if present
    let cleaned = jsonString.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(cleaned);

    // Validate structure
    if (!parsed.candidates || !Array.isArray(parsed.candidates)) {
      throw new Error("Invalid memory plan: missing candidates array");
    }

    // Validate candidates
    for (const candidate of parsed.candidates) {
      if (
        !["thread", "room", "global"].includes(candidate.scope) ||
        !["fact", "preference", "plan", "identity", "project"].includes(candidate.kind) ||
        typeof candidate.importance !== "number" ||
        candidate.importance < 0 ||
        candidate.importance > 1 ||
        typeof candidate.content !== "string" ||
        typeof candidate.reason !== "string" ||
        typeof candidate.suggestPin !== "boolean"
      ) {
        throw new Error(`Invalid candidate: ${JSON.stringify(candidate)}`);
      }
    }

    return {
      candidates: parsed.candidates,
      shouldSummarizeThread: Boolean(parsed.shouldSummarizeThread),
      shouldSummarizeRoom: Boolean(parsed.shouldSummarizeRoom),
    };
  } catch (error) {
    throw new Error(`Failed to parse memory plan: ${error instanceof Error ? error.message : String(error)}`);
  }
}

