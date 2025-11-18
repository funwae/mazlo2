# Chat Ultra with Mazlo

A project-centric AI workspace featuring Mazlo, an AI operator that helps you manage projects, tasks, and conversations.

## Features

- **Rooms**: Organize conversations by project
- **Threads**: Multiple conversation threads per room
- **Mazlo AI**: Intelligent AI operator with reasoning traces
- **Pins**: Save important decisions, insights, specs, and links
- **Tasks**: Task management with priorities and due dates
- **Bridge Mode**: Multi-language translation support
- **Health Tracking**: Monitor usage and maintain healthy habits
- **Search**: Full-text search across rooms, messages, pins, and tasks
- **Command Palette**: Quick navigation with Cmd+K

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, TypeScript, Tailwind CSS
- **Database**: PostgreSQL via Supabase, Drizzle ORM
- **Authentication**: Supabase Auth (Magic Links)
- **AI**: OpenAI (extensible to other providers)
- **Deployment**: Docker, Vercel-ready

## Quick Start

1. Clone the repository

2. Install dependencies:
```bash
cd apps/chat-ultra
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
# Copy the example .env file
cp .env.example .env.local

# Edit .env.local and add your Supabase and Z.AI credentials
# For development: Keep DEV_BYPASS_AUTH=true to skip authentication
```

**Development Mode**: With `DEV_BYPASS_AUTH=true` in your `.env.local`, the app automatically uses a demo user (no login required). This lets you focus on building and testing without dealing with authentication.

4. Run database migrations:
```bash
npm run db:migrate
```

5. Start development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

**Note**: In production, set `DEV_BYPASS_AUTH=false` in your Vercel environment variables to enable real authentication.

## Project Structure

```
apps/chat-ultra/
├── app/                    # Next.js app router pages
│   ├── (app)/             # Authenticated routes
│   ├── (auth)/            # Authentication routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   ├── room/              # Room-specific components
│   └── mazlo/             # Mazlo-specific components
├── lib/                   # Utility libraries
│   ├── auth/              # Authentication utilities
│   ├── db/                # Database utilities
│   ├── orchestrator/      # Mazlo orchestrator logic
│   └── health/            # Health tracking
├── db/                    # Database schema and migrations
└── public/                 # Static assets
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking
- `npm run test` - Run tests
- `npm run db:studio` - Open Drizzle Studio

## Documentation

- [Quick Start Guide](./QUICK_START.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [API Documentation](./docs/06_API.md)
- [Data Architecture](./docs/02_DATA_ARCHITECTURE.md)
- [Component Specifications](./docs/05_COMPONENT_SPECIFICATIONS.md)

## License

MIT
