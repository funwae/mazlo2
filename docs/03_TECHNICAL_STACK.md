# Chat Ultra — Technical Stack

## Technology Choices

### Frontend
- **Framework:** Next.js 15 (App Router)
- **React:** React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + custom design tokens
- **UI Components:** Custom component library (see 05_COMPONENT_SPECIFICATIONS.md)

### Backend
- **API:** Next.js App Router API Routes
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (for file uploads)
- **ORM:** Drizzle ORM
- **Migrations:** Drizzle migrations

### Authentication
- **Primary:** Supabase Auth (Email magic links)
- **Session Management:** Supabase session handling
- **Future:** OAuth with OpenAI/z.ai (if supported)

### Email Service
- **Provider:** Resend (recommended), SendGrid, or Postmark
- **Use Cases:** Magic link emails, notifications (optional)
- **Templates:** HTML + plain text templates

### File Storage
- **Provider:** Supabase Storage
- **Use Cases:** User avatars, Room attachments
- **Buckets:** Private bucket (`chat-ultra-files`)

### Real-time Communication
- **Streaming:** Server-Sent Events (SSE) or WebSocket
- **Provider Responses:** Streamed token-by-token

### Background Jobs
- **Queue:** Node worker or hosted queue (e.g., BullMQ, Inngest)
- **Use Cases:** Long traces, Room summaries, health reports

## Development Environment Setup (Linux)

### Prerequisites

```bash
# Node.js 20+ (LTS recommended)
node --version  # Should be 20.x or higher

# pnpm (preferred package manager)
npm install -g pnpm

# PostgreSQL client (for local dev)
sudo apt-get install postgresql-client  # Debian/Ubuntu
# OR
sudo dnf install postgresql  # Fedora/RHEL

# Git
git --version
```

### Project Setup

```bash
# Clone or navigate to project directory
cd /path/to/mazlo-chat-ultra

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

Create `.env` file in project root:

```bash
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY]"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON-KEY]"

# OpenAI
OPENAI_API_KEY="sk-..."

# Email Service (Resend/SendGrid/Postmark)
RESEND_API_KEY="re_..." # OR
SENDGRID_API_KEY="SG..." # OR
POSTMARK_API_KEY="..."

# File Storage (Supabase)
SUPABASE_STORAGE_BUCKET="chat-ultra-files"

# Optional: Monitoring
SENTRY_DSN="https://..." # Optional
NEXT_PUBLIC_SENTRY_DSN="https://..." # Optional

# Optional: Redis (Upstash) for rate limiting
UPSTASH_REDIS_REST_URL="https://..." # Optional
UPSTASH_REDIS_REST_TOKEN="..." # Optional
```

### Database Setup (Supabase)

1. **Create Supabase Project:**
   - Go to https://supabase.com
   - Create new project
   - Note project URL and anon key

2. **Get Connection String:**
   - Project Settings → Database
   - Copy connection string

3. **Run Migrations:**
   ```bash
   # Set DATABASE_URL to Supabase connection string
   export DATABASE_URL="postgresql://..."
   pnpm db:migrate
   ```

4. **Seed Demo Data (optional):**
   ```bash
   pnpm db:seed
   ```

5. **Set Up Storage:**
   - Storage → Create bucket: `chat-ultra-files`
   - Configure storage policies (see 10_DEPLOYMENT_AND_DEVOPS.md)

### Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Run tests (when implemented)
pnpm test
```

## Project Structure

```
apps/chat-ultra/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes
│   │   ├── login/
│   │   └── callback/
│   ├── (app)/                    # Authenticated app routes
│   │   ├── layout.tsx           # App shell layout
│   │   ├── page.tsx             # Home page
│   │   ├── rooms/
│   │   │   ├── page.tsx         # Rooms list
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Room detail
│   │   └── settings/
│   │       └── page.tsx         # Settings
│   ├── api/                      # API routes
│   │   ├── rooms/
│   │   ├── threads/
│   │   ├── messages/
│   │   ├── tasks/
│   │   ├── pins/
│   │   └── health/
│   └── chatultra/                # Landing page
│       └── page.tsx
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── layout/                   # Layout components
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── room/                     # Room-specific components
│   │   ├── RoomHeader.tsx
│   │   ├── ThreadList.tsx
│   │   ├── ChatTimeline.tsx
│   │   ├── Composer.tsx
│   │   └── MazloPanel.tsx
│   └── mazlo/                    # Mazlo-specific components
│       ├── MazloAvatar.tsx
│       ├── MazloStatusRing.tsx
│       └── TraceView.tsx
├── lib/                          # Utilities and business logic
│   ├── db/                       # Database client and queries
│   │   ├── index.ts
│   │   └── queries/
│   ├── orchestrator/             # Mazlo orchestrator
│   │   ├── mazlo.ts
│   │   ├── providers.ts
│   │   └── context-builder.ts
│   ├── theme/                    # Design tokens
│   │   └── tokens.ts
│   └── utils/                    # General utilities
├── db/                           # Database schema and migrations
│   ├── schema.ts                 # Drizzle schema
│   └── migrations/               # Migration files
├── public/                       # Static assets
│   ├── icons/
│   └── images/
└── types/                        # TypeScript type definitions
    ├── database.ts
    └── api.ts
```

## Key Libraries and Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "drizzle-orm": "^0.29.0",
    "postgres": "^3.4.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "zod": "^3.22.0",
    "openai": "^4.20.0",
    "resend": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "drizzle-kit": "^0.20.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

### Additional Services

- **Supabase:** Database, Storage, Auth
- **OpenAI:** AI provider (GPT-4, GPT-3.5)
- **Resend:** Email service (magic links)
- **Vercel:** Deployment platform
- **Sentry:** Error tracking (optional)
- **Upstash Redis:** Rate limiting (optional)

## Mazlo Orchestrator Architecture

### Core Function: `handleUserMessage`

Located in `lib/orchestrator/mazlo.ts`:

```typescript
interface HandleUserMessageInput {
  roomId: string;
  threadId: string;
  userMessage: string;
  mode: 'chat' | 'translate' | 'code' | 'critique';
}

async function handleUserMessage(input: HandleUserMessageInput) {
  // 1. Load Room and Thread context
  const room = await loadRoom(input.roomId);
  const thread = await loadThread(input.threadId);
  
  // 2. Build context (Room summary, Thread history, Pins, Tasks)
  const context = await buildContext({ room, thread });
  
  // 3. Select provider based on mode and Room preferences
  const providerConfig = selectProvider({ 
    mode: input.mode, 
    room 
  });
  
  // 4. Build system prompt
  const systemPrompt = buildSystemPrompt({ 
    room, 
    mode: input.mode, 
    mazloProfile 
  });
  
  // 5. Construct messages array
  const messages = [
    { role: "system", content: systemPrompt },
    ...context,
    { role: "user", content: input.userMessage },
  ];
  
  // 6. Call provider with streaming
  const result = await callProviderStream(providerConfig, messages);
  
  // 7. Save message and trace
  await saveMessageAndTrace(result);
  
  // 8. Stream back to client
  return streamBackToClient(result);
}
```

### Provider Integration

**Provider Interface:**
```typescript
interface Provider {
  name: string;
  streamChat(messages: Message[], config: ProviderConfig): AsyncGenerator<string>;
  supportsMode(mode: string): boolean;
}
```

**Supported Providers:**
- OpenAI (GPT-4, GPT-3.5)
- z.ai (GLM-4, etc.)
- Local models (via Ollama, etc.)

### Context Building

**Strategy:**
- Use Room summary instead of full history
- Include active Pins
- Include recent Thread messages (last 10-20)
- Include relevant Tasks
- Compress old context to stay within token limits

## API Routes Structure

### Rooms API

```
GET    /api/rooms              # List user's rooms
POST   /api/rooms              # Create new room
GET    /api/rooms/[id]         # Get room details
PATCH  /api/rooms/[id]         # Update room
DELETE /api/rooms/[id]         # Delete/archive room
POST   /api/rooms/[id]/park    # Park room
POST   /api/rooms/[id]/export  # Export room
```

### Messages API

```
GET    /api/rooms/[id]/threads/[threadId]/messages  # Get messages
POST   /api/rooms/[id]/threads/[threadId]/messages  # Send message (streaming)
GET    /api/messages/[id]/trace                     # Get trace for message
```

### Tasks API

```
GET    /api/rooms/[id]/tasks   # Get room tasks
POST   /api/tasks              # Create task
PATCH  /api/tasks/[id]         # Update task
DELETE /api/tasks/[id]         # Delete task
```

### Health API

```
GET    /api/health/sessions     # Get usage sessions
GET    /api/health/stats       # Get aggregated stats
POST   /api/health/sessions    # Start session
PATCH  /api/health/sessions/[id]  # End session
```

## Security Considerations

### Data Storage
- All Room/Message/Trace data stored in own database
- User data encrypted at rest (database-level encryption)

### Provider Calls
- Only send necessary context (summaries + recent messages)
- Use Room summaries to reduce token usage
- Never send full history unless explicitly requested

### API Security
- Authentication required for all API routes
- Rate limiting on message endpoints
- Input validation with Zod schemas

## Performance Considerations

### Database
- Indexes on foreign keys and frequently queried fields
- Connection pooling
- Query optimization (avoid N+1 queries)

### Frontend
- Server-side rendering for initial page load
- Client-side streaming for messages
- Virtual scrolling for long message lists
- Lazy loading for images and heavy components

### Caching
- Room summaries cached
- Provider responses cached (optional, user-configurable)
- Static assets cached via Next.js

---

*This technical stack supports all features in 01_PRODUCT_REQUIREMENTS.md. See 06_BUILD_INSTRUCTIONS_LINUX_CURSOR.md for step-by-step setup.*

