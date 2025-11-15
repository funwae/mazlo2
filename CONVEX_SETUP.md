# Convex Setup Guide

## Quick Setup

Run this command from the `apps/chat-ultra` directory:

```bash
cd apps/chat-ultra
./setup-convex.sh
```

Or manually:

```bash
cd apps/chat-ultra
npx convex dev
```

This will:
1. Prompt you to log in to Convex (or create an account)
2. Create a new Convex project
3. Deploy your functions
4. Generate a deployment URL

## Get Your Convex URL

After running `npx convex dev`, you'll get a URL like:
```
https://your-project-name.convex.cloud
```

This URL will be saved in `.env.local` as `CONVEX_DEPLOYMENT`.

## For Vercel Deployment

1. Copy the URL from `.env.local` (it's the `CONVEX_DEPLOYMENT` value)
2. Go to Vercel → Your Project → Settings → Environment Variables
3. Add:
   - **Key**: `NEXT_PUBLIC_CONVEX_URL`
   - **Value**: `https://your-project-name.convex.cloud`
   - **Environment**: Production, Preview, Development (select all)

## Deploy to Production

After setting up locally, deploy your Convex functions to production:

```bash
cd apps/chat-ultra
npx convex deploy --prod
```

## Troubleshooting

**"Cannot prompt for input" error:**
- Run the setup script locally (not in CI/CD)
- Convex requires interactive login the first time

**Build fails with Convex errors:**
- The build will use committed generated files if codegen fails
- Make sure `NEXT_PUBLIC_CONVEX_URL` is set in Vercel

**No Convex URL:**
- Run `npx convex dev` locally first
- Check `.env.local` for the deployment URL

