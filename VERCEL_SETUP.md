# Vercel Setup - One Time Configuration

## Critical Settings (Set Once, Never Change)

When creating your Vercel project, set these **exactly** as shown:

### Project Settings → General

1. **Root Directory:** `apps/chat-ultra`
   - ⚠️ This is CRITICAL - must be set to `apps/chat-ultra`
   - Do NOT change this after initial setup

2. **Framework Preset:** Next.js
   - Should auto-detect, but verify it's set

3. **Build Command:** Leave empty (uses `npm run build` from package.json)
   - The `vercel.json` handles this

4. **Output Directory:** `.next`
   - Should auto-detect

5. **Install Command:** Leave empty (uses `npm install` from root)
   - The `vercel.json` handles this

### Why This Setup Works

- **Root Directory** tells Vercel where your Next.js app lives
- **vercel.json** handles build/install commands relative to root directory
- **package.json** in `apps/chat-ultra` has the build script
- Dependencies install from repo root (where package.json is)
- Build runs from `apps/chat-ultra` directory

## If Deployment Fails

**DO NOT delete the project!** Instead:

1. **Check Build Logs:**
   - Go to Deployments → Click on failed deployment → View logs
   - Look for the actual error (not just "commit author required")

2. **Fix the Issue:**
   - If it's a code error, fix it and push
   - If it's a config error, update vercel.json and push
   - If it's an env var issue, add it in Settings → Environment Variables

3. **Redeploy:**
   - Click "Redeploy" on the latest commit
   - Or push a new commit to trigger auto-deploy

4. **Only if Absolutely Necessary:**
   - Settings → General → Delete Project
   - Recreate with the exact settings above
   - Re-add all environment variables

## Environment Variables

Set these in **Settings → Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_APP_URL`
- `ZAI_API_KEY`
- `SITE_PASSWORD`

## Troubleshooting

**"Commit author required":**
- This is usually a Git/GitHub integration issue
- Check Settings → Git → Connected Repository
- Ensure your GitHub account is properly linked

**Build fails:**
- Check the actual error in build logs
- Most common: missing env vars, wrong paths, dependency issues
- Fix the code/config, push, redeploy

**"Framework not detected":**
- Ensure Root Directory is set to `apps/chat-ultra`
- Ensure `apps/chat-ultra/package.json` exists
- Ensure `apps/chat-ultra/next.config.js` exists

