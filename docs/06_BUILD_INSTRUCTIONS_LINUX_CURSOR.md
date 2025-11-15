# Chat Ultra — Build Instructions for Linux Cursor

## Prerequisites

### System Requirements

- **OS:** Linux (Ubuntu 22.04+, Debian 11+, Fedora 37+, or similar)
- **Node.js:** 20.x LTS or higher
- **PostgreSQL:** 14+ (or use Neon/Supabase cloud)
- **Git:** Latest stable version
- **Cursor IDE:** Latest version installed

### Install Prerequisites

```bash
# Update package manager
sudo apt update  # Debian/Ubuntu
# OR
sudo dnf update  # Fedora/RHEL

# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs  # Debian/Ubuntu
# OR
sudo dnf install nodejs npm  # Fedora (check for Node 20+)

# Verify Node.js version
node --version  # Should be 20.x.x
npm --version

# Install pnpm (preferred package manager)
npm install -g pnpm

# Install PostgreSQL client (for local dev)
sudo apt-get install postgresql-client postgresql  # Debian/Ubuntu
# OR
sudo dnf install postgresql postgresql-server  # Fedora

# Install Git (if not already installed)
sudo apt-get install git  # Debian/Ubuntu
# OR
sudo dnf install git  # Fedora
```

## Project Setup

### 1. Clone or Navigate to Project

```bash
# If cloning from repository
git clone <repository-url>
cd mazlo-chat-ultra

# OR if already in project directory
cd /path/to/mazlo-chat-ultra
```

### 2. Install Dependencies

```bash
# Install all dependencies
pnpm install

# This will install:
# - Next.js 15
# - React 19
# - TypeScript
# - Tailwind CSS
# - Drizzle ORM
# - And all other dependencies
```

### 3. Supabase Setup

1. **Create Supabase Account:**
   - Go to https://supabase.com
   - Sign up or log in

2. **Create New Project:**
   - Click "New Project"
   - Choose organization
   - Name: `chat-ultra` (or your preferred name)
   - Database Password: Create strong password (save it!)
   - Region: Choose closest to your users
   - Pricing Plan: Free tier is fine for development

3. **Get Project Credentials:**
   - Wait for project to finish setting up (~2 minutes)
   - Go to Project Settings → API
   - Note:
     - Project URL (e.g., `https://xxxxx.supabase.co`)
     - `anon` `public` key
     - `service_role` `secret` key (keep this secret!)

4. **Get Database Connection String:**
   - Go to Project Settings → Database
   - Under "Connection string", select "URI"
   - Copy connection string (replace `[YOUR-PASSWORD]` with your database password)
   - Format: `postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`

5. **Set Up Storage:**
   - Go to Storage → Create bucket
   - Name: `chat-ultra-files`
   - Public: `false` (private bucket)
   - File size limit: 10MB (adjust as needed)
   - Click "Create bucket"

### 4. Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

**Required `.env` variables:**

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/chatultra"
# OR for cloud:
# DATABASE_URL="postgresql://user:password@host.neon.tech/chatultra?sslmode=require"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# OpenAI (required for Mazlo to work)
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Optional: z.ai
# ZAI_API_KEY="your-zai-key"

# Optional: Local model (Ollama, etc.)
# LOCAL_MODEL_ENDPOINT="http://localhost:11434"

# Auth (development)
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### 5. Database Migrations

```bash
# Set DATABASE_URL environment variable
export DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# Run migrations (creates all tables)
pnpm db:migrate

# Seed demo data (optional, for development)
pnpm db:seed
```

**Note:** For Supabase, you can also run migrations via SQL Editor:
1. Go to Supabase Dashboard → SQL Editor
2. Copy migration SQL from `db/migrations/` files
3. Paste and run in SQL Editor

### 6. Development Server

```bash
# Start development server
pnpm dev

# Server will start at http://localhost:3000
# Open in browser or Cursor's preview
```

## Cursor IDE Configuration

### 1. Open Project in Cursor

```bash
# From terminal, open Cursor in project directory
cursor /path/to/mazlo-chat-ultra

# OR use Cursor's File > Open Folder
```

### 2. Install Cursor Extensions (Recommended)

- **ESLint** — Code linting
- **Prettier** — Code formatting
- **TypeScript** — Type checking
- **Tailwind CSS IntelliSense** — Tailwind autocomplete

### 3. Configure TypeScript

Cursor should auto-detect `tsconfig.json`. Verify:
- TypeScript version matches project (5.3+)
- IntelliSense is working
- No red squiggles in `lib/` or `components/` directories

### 4. Configure ESLint and Prettier

```bash
# ESLint config should be in .eslintrc.json
# Prettier config should be in .prettierrc

# Test linting
pnpm lint

# Test formatting
pnpm format:check
```

## Project Structure in Cursor

```
mazlo-chat-ultra/
├── apps/
│   └── chat-ultra/              # Main Next.js app
│       ├── app/                 # Next.js App Router (pages)
│       ├── components/          # React components
│       ├── lib/                 # Utilities, orchestrator
│       ├── db/                  # Database schema
│       └── public/             # Static assets
├── docs/                        # All documentation
│   ├── 00_PROJECT_OVERVIEW.md
│   ├── 01_PRODUCT_REQUIREMENTS.md
│   ├── 02_DATA_ARCHITECTURE.md
│   ├── 03_TECHNICAL_STACK.md
│   ├── 04_VISUAL_DESIGN_SYSTEM.md
│   ├── 05_COMPONENT_SPECIFICATIONS.md
│   ├── 06_BUILD_INSTRUCTIONS_LINUX_CURSOR.md  # This file
│   ├── 07_IMPLEMENTATION_PHASES.md
│   ├── 08_API_AND_INTEGRATION.md
│   └── 09_TESTING_AND_QA.md
├── .env                         # Environment variables (gitignored)
├── .env.example                # Example env file
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
└── drizzle.config.ts           # Drizzle ORM config
```

## Development Workflow

### 1. Start Development Session

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2: Watch database changes (if using Drizzle)
pnpm db:studio  # Opens Drizzle Studio at http://localhost:4983
```

### 2. Make Changes

- Edit files in `apps/chat-ultra/`
- Cursor will auto-reload on save (HMR)
- Check browser console for errors
- Check terminal for build errors

### 3. Database Changes

```bash
# After modifying db/schema.ts:
pnpm db:generate  # Generate migration
pnpm db:migrate   # Apply migration
```

### 4. Type Checking

```bash
# Run TypeScript compiler check
pnpm type-check

# Or use Cursor's built-in TypeScript checking (Cmd/Ctrl + Shift + P > "TypeScript: Check")
```

## Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm type-check       # TypeScript type checking

# Database
pnpm db:generate      # Generate migration from schema changes
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed demo data

# Testing (when implemented)
pnpm test             # Run tests
pnpm test:watch       # Watch mode
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# OR change port in .env
PORT=3001
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection string format
psql "$DATABASE_URL"

# Verify user permissions
sudo -u postgres psql -c "\du"
```

### Node Modules Issues

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf .next
pnpm dev
```

### Tailwind Not Working

```bash
# Verify tailwind.config.ts exists
# Check that CSS imports Tailwind in app/globals.css
# Restart dev server
```

## Building for Production

```bash
# Build
pnpm build

# Test production build locally
pnpm start

# Production build will be in .next/ directory
```

## Next Steps

1. **Review Documentation:**
   - Read `01_PRODUCT_REQUIREMENTS.md` for feature specs
   - Read `04_VISUAL_DESIGN_SYSTEM.md` for design tokens
   - Read `05_COMPONENT_SPECIFICATIONS.md` for component details

2. **Start Implementation:**
   - Follow `07_IMPLEMENTATION_PHASES.md` for phased development
   - Begin with Phase 1: Core Shell

3. **Set Up Provider:**
   - Get OpenAI API key from https://platform.openai.com
   - Add to `.env` file
   - Test connection in Settings → Providers

4. **Create First Room:**
   - Start dev server
   - Navigate to http://localhost:3000/chatultra
   - Create account (magic link auth)
   - Create first Room and test chat

## Additional Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Drizzle ORM Docs:** https://orm.drizzle.team
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs

---

*This guide covers Linux Cursor setup. For macOS/Windows, adjust package manager commands accordingly. See other docs in this directory for detailed specifications.*

