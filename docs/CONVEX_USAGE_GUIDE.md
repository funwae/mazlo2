# Convex Usage Guide

## Table of Contents
1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [Installation & Setup](#installation--setup)
4. [Project Structure](#project-structure)
5. [Functions](#functions)
6. [Database](#database)
7. [Realtime & Reactivity](#realtime--reactivity)
8. [Authentication](#authentication)
9. [Next.js Integration](#nextjs-integration)
10. [CLI Commands](#cli-commands)
11. [Production Deployment](#production-deployment)
12. [Best Practices](#best-practices)
13. [Common Patterns](#common-patterns)

---

## Overview

**Convex** is an open-source, reactive database platform where queries are TypeScript code running directly in the database. It provides:

- **Reactive Database**: Queries automatically update when data changes (like React components)
- **TypeScript-First**: Full type safety across client and backend
- **Real-time by Default**: No additional setup needed for live updates
- **Automatic Caching**: Query results are cached and invalidated automatically
- **Serverless Functions**: Write backend logic in TypeScript/JavaScript
- **No SQL Required**: Use JavaScript to express database operations

### Key Benefits

- **Automatic Realtime**: Queries automatically subscribe to changes
- **Consistent Data**: All clients see the same database snapshot simultaneously
- **Zero Configuration**: No need to set up WebSockets, polling, or caching
- **Type Safety**: Generated types ensure consistency between frontend and backend
- **Scalable**: Handles scaling automatically

---

## Core Concepts

### Architecture

Convex follows a three-tier architecture:
1. **Client/UI**: Your frontend application (React, Next.js, etc.)
2. **Backend Functions**: Server-side TypeScript/JavaScript functions
3. **Database**: Reactive database that triggers updates automatically

### Function Types

Convex has three types of functions:

| Feature | Queries | Mutations | Actions |
|---------|---------|-----------|---------|
| Database Access | ✅ Yes | ✅ Yes | ❌ No |
| Transactional | ✅ Yes | ✅ Yes | ❌ No |
| Cached | ✅ Yes | ❌ No | ❌ No |
| Real-time Updates | ✅ Yes | ❌ No | ❌ No |
| External API Calls | ❌ No | ❌ No | ✅ Yes |

### Data Model

- **Tables**: Collections of documents (created automatically on first insert)
- **Documents**: JSON-like objects stored in tables
- **Schemas**: Optional TypeScript definitions for type safety
- **Indexes**: For fast querying (defined in schemas)

---

## Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Convex account (sign up at [convex.dev](https://convex.dev))

### Initial Setup

1. **Install Convex CLI globally:**
```bash
npm install -g convex
```

2. **Login to Convex:**
```bash
npx convex dev
```
This will prompt you to log in and create a project.

3. **Install Convex client library:**
```bash
npm install convex
```

4. **Initialize Convex in your project:**
```bash
npx convex dev
```
This creates:
- `convex/` directory for your backend functions
- `convex.json` configuration file
- `.env.local` with your deployment URL

### Environment Variables

After initialization, you'll have:
```env
CONVEX_DEPLOYMENT=your-deployment-url
```

For production, also set:
```env
CONVEX_URL=https://your-deployment.convex.cloud
```

---

## Project Structure

```
your-project/
├── convex/
│   ├── _generated/
│   │   └── api.d.ts          # Auto-generated types
│   ├── schema.ts              # Database schema definition
│   ├── messages.ts            # Example query/mutation functions
│   └── auth.ts                # Authentication helpers
├── app/                       # Next.js app directory
│   └── layout.tsx
├── .env.local                 # Convex deployment URL
├── convex.json                # Convex configuration
└── package.json
```

### Key Files

- **`convex/schema.ts`**: Define your database schema
- **`convex/_generated/api.d.ts`**: Auto-generated TypeScript types (don't edit)
- **`convex.json`**: Project configuration

---

## Functions

### Queries

**Purpose**: Read data from the database. Automatically cached and realtime.

**Characteristics**:
- Can only read from database
- Automatically cached
- Automatically reactive (updates when data changes)
- Must be deterministic (same inputs = same outputs)

**Example:**
```typescript
// convex/messages.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});
```

**Client Usage:**
```typescript
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function MessagesList({ roomId }) {
  const messages = useQuery(api.messages.list, { roomId });
  // messages automatically updates when database changes
}
```

### Mutations

**Purpose**: Write data to the database. Run as transactions.

**Characteristics**:
- Can read and write to database
- Run as transactions (all-or-nothing)
- Not cached
- Not reactive (called explicitly)

**Example:**
```typescript
// convex/messages.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
  args: {
    roomId: v.id("rooms"),
    body: v.string(),
    author: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      roomId: args.roomId,
      body: args.body,
      author: args.author,
      timestamp: Date.now(),
    });
    return messageId;
  },
});
```

**Client Usage:**
```typescript
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function SendMessage({ roomId }) {
  const sendMessage = useMutation(api.messages.send);
  
  const handleSend = async () => {
    await sendMessage({
      roomId,
      body: "Hello!",
      author: currentUserId,
    });
  };
}
```

### Actions

**Purpose**: Call external APIs, perform side effects, or call multiple mutations.

**Characteristics**:
- Cannot access database directly
- Can call external APIs (fetch, OpenAI, Stripe, etc.)
- Can call mutations internally
- Not cached
- Not reactive

**Example:**
```typescript
// convex/actions.ts
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

export const sendEmail = action({
  args: {
    userId: v.id("users"),
    subject: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // Call external API
    const response = await fetch("https://api.email-service.com/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: args.userId,
        subject: args.subject,
        body: args.body,
      }),
    });
    
    // Then update database via mutation
    await ctx.runMutation(api.messages.logEmailSent, {
      userId: args.userId,
      timestamp: Date.now(),
    });
    
    return response.json();
  },
});
```

**Client Usage:**
```typescript
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

function EmailButton({ userId }) {
  const sendEmail = useAction(api.actions.sendEmail);
  
  const handleClick = async () => {
    await sendEmail({
      userId,
      subject: "Welcome!",
      body: "Thanks for signing up.",
    });
  };
}
```

### HTTP Actions

**Purpose**: Create HTTP endpoints that can be called from webhooks or external services.

**Example:**
```typescript
// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    // Process webhook
    await ctx.runMutation(api.webhooks.process, { data: body });
    return new Response("OK", { status: 200 });
  }),
});

export default http;
```

---

## Database

### Schema Definition

Define your database schema in `convex/schema.ts`:

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    roomId: v.id("rooms"),
    author: v.id("users"),
    body: v.string(),
    timestamp: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_author", ["author"]),
    
  rooms: defineTable({
    name: v.string(),
    createdBy: v.id("users"),
  }),
  
  users: defineTable({
    name: v.string(),
    email: v.string(),
  })
    .index("by_email", ["email"]),
});
```

### Reading Data

**Query all documents:**
```typescript
const allMessages = await ctx.db.query("messages").collect();
```

**Query with filter:**
```typescript
const messages = await ctx.db
  .query("messages")
  .filter((q) => q.eq(q.field("author"), userId))
  .collect();
```

**Query with index:**
```typescript
const messages = await ctx.db
  .query("messages")
  .withIndex("by_room", (q) => q.eq("roomId", roomId))
  .collect();
```

**Get single document:**
```typescript
const message = await ctx.db.get(messageId);
```

**Paginated queries:**
```typescript
const { results, continueCursor } = await ctx.db
  .query("messages")
  .withIndex("by_room")
  .paginate({ cursor, numItems: 20 });
```

### Writing Data

**Insert:**
```typescript
const messageId = await ctx.db.insert("messages", {
  roomId,
  author: userId,
  body: "Hello!",
  timestamp: Date.now(),
});
```

**Update (patch):**
```typescript
await ctx.db.patch(messageId, {
  body: "Updated message",
});
```

**Replace:**
```typescript
await ctx.db.replace(messageId, {
  roomId,
  author: userId,
  body: "Completely new message",
  timestamp: Date.now(),
});
```

**Delete:**
```typescript
await ctx.db.delete(messageId);
```

### Data Types

Convex supports:
- `v.string()`
- `v.number()`
- `v.boolean()`
- `v.id("tableName")` - Reference to another table
- `v.array(v.string())` - Arrays
- `v.object({ field: v.string() })` - Nested objects
- `v.union(v.string(), v.number())` - Union types
- `v.optional(v.string())` - Optional fields
- `v.any()` - Any type (use sparingly)
- `v.null()` - Null value

### Document IDs

Document IDs are typed references to documents in tables:

```typescript
const userId: Id<"users"> = await ctx.db.insert("users", { name: "Alice" });
const messageId: Id<"messages"> = await ctx.db.insert("messages", {
  author: userId, // Type-safe reference
  body: "Hello",
});
```

---

## Realtime & Reactivity

### Automatic Realtime Updates

Convex queries are **automatically reactive**. When you use `useQuery` in React, the component automatically re-renders when the underlying data changes.

**No setup required:**
```typescript
function MessagesList({ roomId }) {
  // This automatically updates when messages change
  const messages = useQuery(api.messages.list, { roomId });
  
  if (messages === undefined) {
    return <div>Loading...</div>;
  }
  
  return (
    <ul>
      {messages.map((msg) => (
        <li key={msg._id}>{msg.body}</li>
      ))}
    </ul>
  );
}
```

### How It Works

1. Client subscribes to a query
2. Convex tracks which database tables/fields the query depends on
3. When data changes, Convex automatically pushes updates to subscribed clients
4. React components re-render with new data

### Automatic Caching

- Query results are cached automatically
- Cache is invalidated when underlying data changes
- No database bandwidth charges for cached reads
- No manual cache management needed

---

## Authentication

### Overview

Convex uses **OpenID Connect (OAuth)** with JWT tokens for authentication. It's compatible with most auth providers.

### Third-Party Providers

**Recommended Options:**
- **Clerk**: Great Next.js and React Native support
- **WorkOS AuthKit**: Built for B2B apps, free up to 1M users
- **Auth0**: Established with many features
- **Custom**: Any OpenID Connect-compatible provider

### Convex Auth (Beta)

For React/React Native apps, you can use Convex Auth directly:

```typescript
// convex/auth.ts
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, signUp } = convexAuth({
  providers: [
    // Configure providers
  ],
});
```

**Note**: Convex Auth is in beta. Next.js support is experimental.

### Accessing Auth in Functions

```typescript
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCurrentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});
```

### Authorization Pattern

Check permissions at the start of functions:

```typescript
export const removeUserImage = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    // Only allow users to remove their own image
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    await ctx.db.patch(userId, {
      imageId: undefined,
    });
  },
});
```

---

## Next.js Integration

### App Router Setup

1. **Install dependencies:**
```bash
npm install convex react
```

2. **Create Convex provider:**
```typescript
// app/providers.tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

3. **Wrap your app:**
```typescript
// app/layout.tsx
import { ConvexClientProvider } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
```

4. **Use in components:**
```typescript
"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MessagesPage() {
  const messages = useQuery(api.messages.list, { roomId: "..." });
  // Component automatically updates when data changes
}
```

### Server Components

For Server Components, use the Convex HTTP client:

```typescript
import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function ServerPage() {
  const messages = await client.query(api.messages.list, { roomId: "..." });
  return <div>{/* Render messages */}</div>;
}
```

### Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

---

## CLI Commands

### Development

**Start development server:**
```bash
npx convex dev
```
- Watches for file changes
- Pushes updates automatically
- Shows function logs
- Generates TypeScript types

**Run once (no watch):**
```bash
npx convex run
```

### Deployment

**Deploy to production:**
```bash
npx convex deploy
```

**Deploy with environment:**
```bash
npx convex deploy --prod
```

### Database

**Import data:**
```bash
npx convex import data.json
```

**Export data:**
```bash
npx convex export --output data.json
```

**Backup:**
```bash
npx convex backup
```

### Code Generation

**Generate types:**
```bash
npx convex codegen
```

Types are auto-generated in `convex/_generated/api.d.ts`

### Other Commands

**View logs:**
```bash
npx convex logs
```

**Open dashboard:**
```bash
npx convex dashboard
```

**Run function:**
```bash
npx convex run messages:list --arg '{"roomId":"..."}'
```

---

## Production Deployment

### Environment Setup

1. **Set production deployment URL:**
```env
CONVEX_URL=https://your-production-deployment.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://your-production-deployment.convex.cloud
```

2. **Deploy functions:**
```bash
npx convex deploy --prod
```

### CI/CD Integration

**GitHub Actions example:**
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx convex deploy --prod
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
```

### Monitoring

- Use Convex Dashboard for monitoring
- View function logs and errors
- Monitor query performance
- Track database usage

### Best Practices

1. **Use environment-specific deployments** (dev, staging, prod)
2. **Set up backups** for production data
3. **Monitor function performance** in dashboard
4. **Use indexes** for frequently queried fields
5. **Validate inputs** in function args
6. **Handle errors gracefully** with try/catch

---

## Best Practices

### Function Design

1. **Keep queries simple**: Complex logic should be in actions
2. **Use indexes**: Define indexes for frequently queried fields
3. **Validate inputs**: Use `v` validators in function args
4. **Handle errors**: Use try/catch and return meaningful errors
5. **Keep mutations atomic**: One mutation = one logical operation

### Database Design

1. **Define schemas**: Use schemas for type safety
2. **Use indexes**: For fields you query frequently
3. **Normalize data**: Avoid deep nesting
4. **Use document IDs**: For references between tables
5. **Consider pagination**: For large datasets

### Performance

1. **Use indexes**: For query performance
2. **Limit query results**: Use pagination for large datasets
3. **Cache expensive operations**: In actions, not queries
4. **Batch operations**: When possible
5. **Monitor in dashboard**: Track slow queries

### Security

1. **Validate all inputs**: Use `v` validators
2. **Check authentication**: In every function that needs it
3. **Implement authorization**: Check permissions explicitly
4. **Don't expose secrets**: Use environment variables
5. **Sanitize user input**: Before storing in database

---

## Common Patterns

### Pagination

```typescript
export const listPaginated = query({
  args: {
    cursor: v.optional(v.string()),
    numItems: v.number(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("messages")
      .order("desc")
      .paginate({
        cursor: args.cursor,
        numItems: args.numItems,
      });
    return result;
  },
});
```

### Full-Text Search

Use Convex Search component or implement with actions:

```typescript
export const search = action({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    // Call external search service or use Convex Search
    const results = await ctx.runQuery(api.messages.searchInternal, {
      query: args.query,
    });
    return results;
  },
});
```

### File Uploads

```typescript
export const uploadFile = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    // Store URL in database
    await ctx.db.insert("files", { url });
  },
});
```

### Scheduled Functions

```typescript
import { cron } from "convex/server";
import { internal } from "./_generated/api";

export default cron({
  schedule: "0 0 * * *", // Daily at midnight
  handler: async (ctx) => {
    await ctx.runMutation(internal.cleanup.cleanOldMessages);
  },
});
```

### Error Handling

```typescript
export const safeOperation = mutation({
  args: { data: v.string() },
  handler: async (ctx, args) => {
    try {
      // Operation that might fail
      await ctx.db.insert("items", { data: args.data });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
```

---

## Resources

- **Documentation**: [docs.convex.dev](https://docs.convex.dev)
- **Dashboard**: [dashboard.convex.dev](https://dashboard.convex.dev)
- **GitHub**: [github.com/get-convex](https://github.com/get-convex)
- **Discord**: [convex.dev/community](https://convex.dev/community)
- **Stack Blog**: [stack.convex.dev](https://stack.convex.dev)

---

## Quick Reference

### Function Types

```typescript
// Query - Read only, cached, reactive
export const get = query({ handler: async (ctx) => { ... } });

// Mutation - Read/write, transactional
export const update = mutation({ handler: async (ctx) => { ... } });

// Action - External APIs, side effects
export const callAPI = action({ handler: async (ctx) => { ... } });
```

### Client Hooks

```typescript
// React hooks
const data = useQuery(api.module.function, args);
const mutate = useMutation(api.module.function);
const action = useAction(api.module.function);
```

### Database Operations

```typescript
// Read
await ctx.db.query("table").collect();
await ctx.db.get(id);

// Write
await ctx.db.insert("table", data);
await ctx.db.patch(id, updates);
await ctx.db.replace(id, data);
await ctx.db.delete(id);
```

---

*Last updated: Based on Convex documentation as of 2024*

