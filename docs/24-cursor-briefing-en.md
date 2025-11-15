# Cursor / Codex Briefing (English)

```text

You are a senior full-stack team. Your job is to implement the "Chat Ultra with Mazlo" app as fully described in the /spec markdown files.



Follow this order:



1. Read:

   - 00-index.md

   - 01-product-vision-and-principles.md

   - 02-domain-model.md

   - 03-ux-flows.md

   - 04-ui-routes-and-layout.md

   - 05-frontend-components-inventory.md

   - 06-backend-architecture.md

   - 07-convex-schema.md

   - 08-convex-functions-inventory.md



2. Then read the memory-related specs:

   - Existing memory docs 01–08 from previous steps

   - 09-memory-plan-prompt.md

   - 10-mazlo-room-system-prompt.md

   - 11-mazlo-global-system-prompt.md

   - 12-chat-orchestrator.md

   - 13-provider-adapters.md

   - 17-vector-memory-and-search.md



3. Implement in this order:

   - Convex schema (07)

   - Convex functions (08)

   - Provider adapters (13)

   - Orchestrator (12)

   - Frontend routes and layout (04)

   - Frontend components (05)

   - Memory panel UI (06 + memory docs)



Constraints:



- Use TypeScript everywhere.

- Use Next.js App Router and React for the frontend.

- Use Convex.dev for all persistent state and server logic.

- Do not invent new names for core entities or functions; use the exact names from the specs so there are no dead routes or unused functions.

- Ensure:

  - Every Convex function listed in 08 is implemented and exported.

  - Every route in 04 has a corresponding page component.

  - Every core component in 05 is implemented or clearly stubbed with TODO comments.



After implementation, generate a README that explains:



- Folder structure

- How Mazlo's memory system works (room/thread/global + Global Chat)

- How to run the app locally, including Convex dev setup

```

