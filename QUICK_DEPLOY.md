# Quick Deploy Guide - TL;DR Version

For those who want the fastest path to deployment.

## Prerequisites Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account (free)
- [ ] Supabase account (free)
- [ ] Convex account (created during setup)

## 5-Minute Setup

### 1. Set Up Convex (2 minutes)

```bash
cd apps/chat-ultra
npx convex dev
# Follow prompts to create account/project
# Copy the URL it gives you (e.g., https://xxx.convex.cloud)

npx convex deploy --prod
```

**Save:** Your Convex URL

### 2. Set Up Supabase (2 minutes)

1. Go to https://supabase.com → New Project
2. Create project, save password
3. Go to Settings → API, copy:
   - Project URL
   - anon key
   - service_role key
4. Go to Settings → Database, copy connection string (replace `[YOUR-PASSWORD]`)
5. Go to Storage → Create bucket: `chat-ultra-files` (private)

**Save:** Supabase URL, anon key, service_role key, DATABASE_URL

### 3. Deploy to Vercel (1 minute)

1. Go to https://vercel.com/new
2. Import your GitHub repo
3. **Set Root Directory:** `apps/chat-ultra`
4. **Add Environment Variables** (see below)
5. Click Deploy

### Environment Variables (Copy-Paste Ready)

Add these in Vercel → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
DATABASE_URL=postgresql://postgres:password@xxx.supabase.co:5432/postgres
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
ZAI_API_KEY=your_key
SITE_PASSWORD=$(openssl rand -base64 32)
```

### 4. Update App URL

After first deploy:
1. Copy your Vercel URL
2. Update `NEXT_PUBLIC_APP_URL` in Vercel
3. Redeploy

## Done! 🎉

Your app is live. Test it:
- Visit your Vercel URL
- Enter the site password
- Create an account
- Start chatting!

## Need More Details?

See `DEPLOY_TO_VERCEL.md` for the complete step-by-step guide.

