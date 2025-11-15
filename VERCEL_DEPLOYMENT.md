# Vercel Deployment Guide

Complete guide to deploy Chat Ultra to Vercel with full functionality.

## Quick Start Checklist

- [ ] Push code to GitHub/GitLab/Bitbucket
- [ ] Create Supabase project
- [ ] Connect Supabase to Vercel
- [ ] Set environment variables in Vercel
- [ ] Deploy to Vercel
- [ ] Run database migrations
- [ ] Set up password protection
- [ ] Test deployment

## Step 1: Prepare Your Repository

```bash
# Make sure all code is committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - **Name:** chat-ultra
   - **Database Password:** (save this!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free tier works fine

4. Wait for project to finish setting up (~2 minutes)

5. Get your credentials:
   - Go to **Project Settings → API**
   - Copy:
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **anon public** key
     - **service_role secret** key (keep secret!)

6. Get database connection string:
   - Go to **Project Settings → Database**
   - Under "Connection string", select "URI"
   - Copy the connection string (replace `[YOUR-PASSWORD]` with your database password)

## Step 3: Set Up Supabase Storage

1. Go to **Storage** in Supabase dashboard
2. Click **Create bucket**
3. Name: `chat-ultra-files`
4. **Public:** `false` (private bucket)
5. **File size limit:** 10MB (adjust as needed)
6. Click **Create bucket**

## Step 4: Connect Repository to Vercel

1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect Next.js
4. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/chat-ultra` ⚠️ **IMPORTANT**
   - **Build Command:** `npm run build` (or `cd ../.. && npm run build`)
   - **Output Directory:** `.next`
   - **Install Command:** `npm install` (or `cd ../.. && npm install`)

## Step 5: Connect Supabase to Vercel

Vercel has built-in Supabase integration:

1. In Vercel project → **Settings → Integrations**
2. Find **Supabase** integration
3. Click **Add Integration**
4. Select your Supabase project
5. Vercel will automatically add these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`

## Step 6: Set Environment Variables in Vercel

Go to **Project Settings → Environment Variables** and add:

### Required Variables

```bash
# Supabase (if not auto-added by integration)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:[PASSWORD]@xxxxx.supabase.co:5432/postgres

# Convex (get from `npx convex dev` or create project)
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# App URL (your Vercel deployment URL)
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app

# API Keys (your personal keys)
ZAI_API_KEY=your_zai_api_key
OPENAI_API_KEY=sk-your_openai_key  # Optional

# Password Protection (set a strong password)
SITE_PASSWORD=your_secure_password_here
```

### Generate Strong Password

```bash
# Generate a secure password
openssl rand -base64 32
```

## Step 7: Update Next.js Config for Vercel

The `next.config.js` already has the correct settings. Make sure CSP allows z.ai:

```javascript
connect-src 'self' https://api.openai.com https://*.supabase.co https://api.z.ai
```

## Step 8: Deploy

1. Click **Deploy** in Vercel dashboard
2. First deployment takes 3-5 minutes
3. Watch the build logs for any errors

## Step 9: Run Database Migrations

After deployment, run migrations:

### Option 1: Via Supabase SQL Editor (Easiest)

1. Go to Supabase Dashboard → **SQL Editor**
2. Copy the migration SQL from `db/schema.ts` or migration files
3. Paste and run in SQL Editor

### Option 2: Via Local CLI

```bash
# Pull Vercel env vars locally
vercel env pull .env.production

# Run migrations
npm run db:migrate
```

## Step 10: Set Up Password Protection

Password protection is already implemented! Just set:

```bash
SITE_PASSWORD=your_secure_password
```

In Vercel environment variables (Production only).

**How it works:**
- Users visiting your site will see a password prompt
- After entering the correct password, they can access the site
- Password is stored in a secure cookie (30 days)
- Only active in production (not in development)

**Generate a strong password:**
```bash
openssl rand -base64 32
```

## Step 11: Test Deployment

Visit your Vercel URL and test:

- [ ] Landing page loads
- [ ] Password protection works
- [ ] Login page works
- [ ] Can create account (magic link)
- [ ] Can create Room
- [ ] Can send messages
- [ ] AI responses work (z.ai)
- [ ] File uploads work
- [ ] Memory system works

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**
- Check Root Directory is set to `apps/chat-ultra`
- Check Install Command includes `cd ../..` if needed

**Error: "Environment variable missing"**
- Verify all env vars are set in Vercel
- Redeploy after adding variables

### Database Connection Fails

- Verify `DATABASE_URL` format is correct
- Check Supabase project is active
- Verify password in connection string matches Supabase password

### Password Protection Not Working

- Verify `SITE_PASSWORD` is set in Vercel
- Check middleware is deployed
- Clear browser cache and cookies

### API Calls Fail

- Check CSP headers allow z.ai domain
- Verify `ZAI_API_KEY` is set correctly
- Check Vercel function logs for errors

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex deployment URL |
| `NEXT_PUBLIC_APP_URL` | Yes | Your Vercel deployment URL |
| `ZAI_API_KEY` | Yes | Your z.ai API key |
| `OPENAI_API_KEY` | No | OpenAI API key (optional) |
| `SITE_PASSWORD` | Yes | Password for site protection |

## Next Steps

After deployment:

1. **Set up custom domain** (optional)
   - Vercel → Settings → Domains
   - Add your domain
   - Configure DNS

2. **Enable Vercel Analytics**
   - Automatically enabled
   - View in Vercel dashboard

3. **Set up monitoring**
   - Use Vercel's built-in monitoring
   - Set up uptime checks (UptimeRobot, etc.)

4. **Share your deployment**
   - Share the Vercel URL
   - Password protection keeps it secure
   - Perfect for demos!

## Security Notes

✅ **Your API keys are safe:**
- Stored in Vercel environment variables (encrypted)
- Never exposed to browser
- Only used server-side

✅ **Password protection:**
- Simple HTTP basic auth
- Set strong password
- Change regularly

✅ **HTTPS:**
- Automatically enabled by Vercel
- SSL certificate auto-provisioned

