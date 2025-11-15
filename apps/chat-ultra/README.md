# Chat Ultra Application

This is the main Next.js application for Chat Ultra with Mazlo.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. Run database migrations:
```bash
pnpm db:migrate
```

4. Start development server:
```bash
pnpm dev
```

## Project Structure

- `app/` - Next.js App Router pages and API routes
- `components/` - React components
  - `ui/` - Base UI components
  - `layout/` - Layout components
  - `room/` - Room-specific components
  - `mazlo/` - Mazlo-specific components
- `lib/` - Utilities and business logic
  - `db/` - Database client and queries
  - `orchestrator/` - Mazlo orchestrator
  - `theme/` - Design tokens
  - `utils/` - General utilities
- `db/` - Database schema and migrations

## Key Features Implemented

- ✅ Authentication (Supabase Auth with magic links)
- ✅ Rooms management (create, list, view, update)
- ✅ Threads system
- ✅ Chat with Mazlo (streaming responses)
- ✅ Design system (tokens, components)
- ✅ Base UI components

## Features In Progress

- Pins system (API complete, UI pending)
- Tasks system (API complete, UI pending)
- Trace viewer
- Bridge mode
- Health tracking
- Settings pages
- Search functionality
- Room export

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run linter
- `pnpm type-check` - Type check
- `pnpm db:generate` - Generate database migration
- `pnpm db:migrate` - Run database migrations

