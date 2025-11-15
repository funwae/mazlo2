# Deployment Checklist

Quick checklist for deploying Chat Ultra to Vercel.

## Pre-Deployment

- [ ] Code is committed and pushed to Git
- [ ] All tests pass locally
- [ ] `.env` file is NOT committed (in `.gitignore`)

## Supabase Setup

- [ ] Created Supabase project
- [ ] Saved project URL
- [ ] Saved anon key
- [ ] Saved service_role key
- [ ] Saved database password
- [ ] Created storage bucket: `chat-ultra-files`
- [ ] Got database connection string

## Convex Setup

- [ ] Created Convex project (`npx convex dev`)
- [ ] Saved Convex URL
- [ ] Deployed Convex functions (`npx convex deploy`)

## Vercel Setup

- [ ] Connected Git repository to Vercel
- [ ] Set Root Directory: `apps/chat-ultra`
- [ ] Connected Supabase integration (auto-adds env vars)

## Environment Variables in Vercel

Set these in **Project Settings → Environment Variables**:

### Supabase (may be auto-added by integration)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `DATABASE_URL`

### Convex
- [ ] `NEXT_PUBLIC_CONVEX_URL`

### App
- [ ] `NEXT_PUBLIC_APP_URL` (your Vercel URL)

### API Keys
- [ ] `ZAI_API_KEY` (your z.ai key)
- [ ] `OPENAI_API_KEY` (optional)

### Security
- [ ] `SITE_PASSWORD` (strong password for site protection)

## Deploy

- [ ] Clicked "Deploy" in Vercel
- [ ] Build completed successfully
- [ ] No build errors

## Post-Deployment

- [ ] Ran database migrations (via Supabase SQL Editor)
- [ ] Tested password protection
- [ ] Tested login/signup
- [ ] Tested creating a Room
- [ ] Tested sending messages
- [ ] Tested AI responses (z.ai)
- [ ] Tested file uploads

## Share

- [ ] Shared Vercel URL with password
- [ ] Ready to demo to z.ai! 🚀

