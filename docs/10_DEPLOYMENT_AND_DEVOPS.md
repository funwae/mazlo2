# Chat Ultra — Deployment and DevOps

## Deployment Strategy

### Primary Platform: Vercel

Vercel is the recommended deployment platform for Chat Ultra due to:
- Native Next.js support
- Automatic deployments from Git
- Edge functions and serverless functions
- Built-in analytics and monitoring
- Easy environment variable management
- Global CDN

### Alternative: Self-Hosted (Docker)

For self-hosting, Docker containerization is provided as an alternative.

## Vercel Deployment

### Prerequisites

1. **Vercel Account**
   - Sign up at https://vercel.com
   - Connect GitHub/GitLab/Bitbucket account

2. **Supabase Project**
   - Create project at https://supabase.com
   - Note project URL and anon key
   - Set up database (see Supabase setup below)

3. **Domain** (optional)
   - Purchase domain or use existing
   - Configure DNS settings

### Step 1: Prepare Repository

```bash
# Ensure all code is committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect Next.js
4. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/chat-ultra` (if monorepo) or `.` (if single repo)
   - **Build Command:** `pnpm build` (or `npm run build`)
   - **Output Directory:** `.next`
   - **Install Command:** `pnpm install` (or `npm install`)

### Step 3: Environment Variables

In Vercel dashboard → Project Settings → Environment Variables, add:

```bash
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY]"

# Next.js
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON-KEY]"

# OpenAI
OPENAI_API_KEY="sk-..."

# Auth
NEXTAUTH_SECRET="[GENERATE-RANDOM-SECRET]"
NEXTAUTH_URL="https://your-domain.com"

# Email (Resend/SendGrid)
RESEND_API_KEY="re_..." # OR
SENDGRID_API_KEY="SG..." # OR
POSTMARK_API_KEY="..."

# File Storage (Supabase Storage)
SUPABASE_STORAGE_BUCKET="chat-ultra-files"

# Optional: Monitoring
SENTRY_DSN="https://..."
VERCEL_ANALYTICS_ID="..." # Auto-generated

# Optional: Redis (Upstash)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 4: Deploy

1. Click "Deploy" in Vercel dashboard
2. Vercel will:
   - Install dependencies
   - Run build
   - Deploy to production
3. First deployment may take 3-5 minutes

### Step 5: Run Database Migrations

After first deployment, run migrations:

```bash
# Option 1: Via Vercel CLI
vercel env pull .env.production
pnpm db:migrate

# Option 2: Via Supabase Dashboard SQL Editor
# Copy migration SQL and run in Supabase SQL Editor
```

### Step 6: Custom Domain (Optional)

1. In Vercel → Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Vercel will provision SSL automatically

### Step 7: Verify Deployment

1. Visit your Vercel deployment URL
2. Test:
   - Landing page loads
   - Sign up flow works
   - Magic link email received
   - Can create Room
   - Can send message
   - Database operations work

## Supabase Setup

### Create Project

1. Go to https://supabase.com
2. Create new project
3. Choose:
   - **Organization:** Your org
   - **Name:** chat-ultra
   - **Database Password:** Strong password (save it!)
   - **Region:** Closest to your users
   - **Pricing Plan:** Free tier or Pro

### Configure Database

1. **Get Connection String:**
   - Project Settings → Database
   - Connection string format:
     ```
     postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
     ```

2. **Run Migrations:**
   ```bash
   # Set DATABASE_URL to Supabase connection string
   export DATABASE_URL="postgresql://..."
   pnpm db:migrate
   ```

3. **Seed Data (optional):**
   ```bash
   pnpm db:seed
   ```

### Configure Storage

1. **Create Storage Bucket:**
   - Storage → Create bucket
   - Name: `chat-ultra-files`
   - Public: `false` (private bucket)
   - File size limit: 10MB (adjust as needed)

2. **Set Up Storage Policies:**
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Users can upload files"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'chat-ultra-files');

   -- Allow users to read their own files
   CREATE POLICY "Users can read own files"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (bucket_id = 'chat-ultra-files');
   ```

### Configure Auth (Magic Links)

1. **Enable Email Auth:**
   - Authentication → Providers
   - Enable "Email"
   - Configure email templates (optional)

2. **Set Up Email Templates:**
   - Use Resend/SendGrid/Postmark (recommended)
   - Or use Supabase's built-in email (limited)

3. **Configure Redirect URLs:**
   - Authentication → URL Configuration
   - Site URL: `https://your-domain.com`
   - Redirect URLs: `https://your-domain.com/auth/callback`

## Environment Management

### Development

```bash
# .env.local (gitignored)
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
# ... other vars
```

### Staging

Create separate Vercel project:
- Project name: `chat-ultra-staging`
- Use staging Supabase project
- Use staging environment variables

### Production

- Use production Supabase project
- Use production environment variables
- Enable Vercel Analytics
- Enable error tracking (Sentry)

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Type check
        run: pnpm type-check
      
      - name: Lint
        run: pnpm lint
      
      - name: Build
        run: pnpm build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Vercel Auto-Deploy

Vercel automatically deploys on:
- Push to `main` → Production
- Push to other branches → Preview deployments
- Pull requests → Preview deployments

## Docker Deployment (Self-Hosted)

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    restart: unless-stopped
```

### Build and Run

```bash
# Build
docker build -t chat-ultra .

# Run
docker-compose up -d

# View logs
docker-compose logs -f
```

## Database Migrations in Production

### Safe Migration Strategy

1. **Test migrations locally first**
2. **Backup database before migration**
3. **Run migrations during low-traffic period**
4. **Monitor for errors**

### Supabase Migration

```bash
# Via Supabase CLI
supabase db push

# Via SQL Editor
# Copy migration SQL and run in Supabase Dashboard → SQL Editor
```

### Rollback Plan

1. Keep previous migration files
2. Create rollback migrations if needed
3. Test rollback procedure

## Monitoring Deployment

### Vercel Dashboard

- **Deployments:** View all deployments
- **Analytics:** Performance metrics
- **Logs:** Real-time function logs
- **Speed Insights:** Core Web Vitals

### Health Checks

Set up uptime monitoring:
- **UptimeRobot:** Free tier available
- **Pingdom:** Paid service
- **Custom endpoint:** `/api/health`

## Rollback Procedure

### Vercel Rollback

1. Go to Vercel → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"
4. Verify site works

### Database Rollback

1. Restore from backup (if needed)
2. Run rollback migration (if created)
3. Verify data integrity

## Performance Optimization

### Vercel Optimizations

- **Edge Functions:** For low-latency API routes
- **ISR (Incremental Static Regeneration):** For static pages
- **Image Optimization:** Next.js Image component
- **Font Optimization:** next/font

### CDN Configuration

Vercel automatically provides:
- Global CDN
- Automatic HTTPS
- HTTP/2 and HTTP/3
- Brotli compression

## Backup Strategy

### Database Backups

**Supabase:**
- Automatic daily backups (Pro plan)
- Point-in-time recovery (Pro plan)
- Manual backup via Supabase Dashboard

**Manual Backup:**
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### File Storage Backups

- Supabase Storage: Automatic redundancy
- Manual backup: Download files via Supabase Dashboard

## Troubleshooting

### Common Issues

**Build Fails:**
- Check environment variables
- Check build logs in Vercel
- Verify Node.js version compatibility

**Database Connection Fails:**
- Verify DATABASE_URL format
- Check Supabase project status
- Verify IP allowlist (if enabled)

**Deployment Slow:**
- Check build time in Vercel
- Optimize dependencies
- Use Vercel Build Cache

**Environment Variables Not Working:**
- Verify variables set in Vercel dashboard
- Redeploy after adding variables
- Check variable names match code

---

*This deployment guide covers Vercel (primary) and Docker (self-hosted) options. Supabase is used for database and storage.*

