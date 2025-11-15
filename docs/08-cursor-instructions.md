# 给 Cursor / Codex 的英文指令（可以直接粘贴）

> You can hand this as a single prompt + the above files.

```text

You are upgrading an existing Next.js + Convex app called "Chat Ultra" with an AI persona called "Mazlo".

Goal:

Implement the AI memory system described in the attached markdown docs:

- 01-memory-overview.md

- 02-memory-entities-and-schema.md

- 03-memory-levels-and-scopes.md

- 04-memory-pipelines.md

- 05-memory-retrieval-and-prompting.md

- 06-mazlo-ux-and-controls.md

- 07-convex-implementation-notes.md

Key tasks (in order):

1. Data layer

   - Extend `convex/schema.ts` with the `memories`, `memory_summaries`, and `memory_events` tables as specified.

   - Add indexes as in the spec or better if you see obvious improvements.

2. Convex functions

   - Implement `memory.intakeForMessage` (action) that:

     - Takes a `messageId`.

     - Loads the message, its room/thread, and recent context.

     - Calls the AI provider (OpenAI or z.ai) with a dedicated "Memory Plan" prompt.

     - Parses the JSON Memory Plan and writes/updates `memories` and `memory_events` according to the rules.

   - Implement `memory.retrieveForReply` that:

     - Given `roomId`, optional `threadId`, `ownerUserId`, and recent message ids,

     - Performs vector + keyword retrieval across `memories` and `memory_summaries`,

     - Returns a small, token-bounded bundle of memory snippets and summaries.

   - Implement summarization actions for threads and rooms.

   - Implement mutations for pin/unpin/forget memory items.

3. Orchestration

   - Update the main chat orchestrator so that before calling the model, it:

     - Calls `memory.retrieveForReply` for the current room/thread.

     - Injects the returned memory snippets/summaries into the system prompt in the format described in the spec.

   - After a successful reply is generated and stored as a `messages` entry, trigger `memory.intakeForMessage` on that message.

4. UI

   - Add a "Mazlo Memory" panel in each room:

     - Show active room/thread-scoped memories, allow editing, pinning, scope changes, and forgetting.

     - Show "suggested memories" based on `memory_events` of type `"candidate"`, with Accept/Discard actions.

     - Show thread/room summaries with a "Regenerate" button.

   - Add a "Mazlo Global" chat entry in the main navigation:

     - Use the same chat components, but route requests through a mode that:

       - Calls `memory.retrieveForReply` with a global scope.

       - Uses a larger-context / slower preset and intentionally shorter answers.

5. Safety and configuration

   - Make AI provider calls pluggable (OpenAI or z.ai) using existing configuration patterns in the repo.

   - Keep all secrets in environment variables, and ensure all server-side calls are only in Convex actions.

Follow the existing coding style and folder structure of the Chat Ultra project.

Where the spec is ambiguous, choose the simplest implementation that preserves the overall architecture.

Do not remove or break existing features; extend them.

When you're done, summarize what you implemented and where the main extension points are for future iterations of the memory system.

```

