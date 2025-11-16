# Deploy to Vercel - Complete Step-by-Step Guide

This guide will walk you through deploying your Chat Ultra application to Vercel, including setting up Supabase and all required environment variables.

## Prerequisites

- A GitHub account (or GitLab/Bitbucket)
- A Vercel account (sign up at https://vercel.com - it's free)
- A Supabase account (sign up at https://supabase.com - free tier available)

---

## Step 1: Push Your Code to GitHub

1. **Make sure your code is committed:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify your repository is on GitHub** (or your preferred Git provider)

---

## Step 2: Set Up Supabase (Authentication & File Storage)

### 2.1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name:** `chat-ultra` (or any name you prefer)
   - **Database Password:** Create a strong password and **SAVE IT** (you'll need it)
   - **Region:** Choose the region closest to you
   - **Pricing Plan:** Free tier works fine
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to finish setting up

### 2.2: Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them for Vercel):
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
   - **service_role secret** key (under "Project API keys" - keep this secret!)

### 2.3: Get Database Connection String

1. Go to **Settings** → **Database**
2. Under "Connection string", select **"URI"**
3. Copy the connection string (it will look like: `postgresql://postgres:[YOUR-PASSWORD]@xxxxx.supabase.co:5432/postgres`)
4. **Replace `[YOUR-PASSWORD]`** with the database password you created in step 3.1

### 2.4: Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **"Create bucket"**
3. Name: `chat-ultra-files`
4. **Public:** `false` (make it private)
5. **File size limit:** 10MB (or adjust as needed)
6. Click **"Create bucket"**

**✅ You should now have:**
- Supabase project URL
- Supabase anon key
- Supabase service_role key
- Database connection string (with password replaced)
- Storage bucket created

---

## Step 3: Connect Repository to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your repository (GitHub/GitLab/Bitbucket)
4. Click **"Import"**

### 3.1: Configure Project Settings

**⚠️ IMPORTANT:** Set these settings exactly as shown:

1. **Framework Preset:** Next.js (should auto-detect)
2. **Root Directory:** Click "Edit" and set to: `apps/chat-ultra`
   - This is CRITICAL - the app is in a subdirectory
3. **Build Command:** Leave empty (uses default from package.json)
4. **Output Directory:** Leave empty (uses default `.next`)
5. **Install Command:** Leave empty (uses default `npm install`)

**DO NOT click "Deploy" yet!** We need to set environment variables first.

---

## Step 4: Set Environment Variables in Vercel

Before deploying, you need to add all environment variables.

1. In the Vercel project setup page, scroll down to **"Environment Variables"**
2. Add each variable below (click "Add" for each one):

### Required Environment Variables

Add these one by one:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_anon_key_here` | From Supabase Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_service_role_key_here` | From Supabase Settings → API |
| `DATABASE_URL` | `postgresql://postgres:password@xxxxx.supabase.co:5432/postgres` | Your database connection string |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Your Vercel URL (you'll get this after first deploy, or use a placeholder for now) |
| `ZAI_API_KEY` | `your_zai_api_key` | Your z.ai API key (if you have one) |
| `SITE_PASSWORD` | `your_secure_password` | A strong password for site protection (generate with: `openssl rand -base64 32`) |

### Optional Environment Variables

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `OPENAI_API_KEY` | `sk-your_openai_key` | Only if you want to use OpenAI (optional) |

### Setting Environment Variables

For each variable:
1. Click **"Add"** or **"Add Another"**
2. Enter the **Key** (variable name)
3. Enter the **Value** (the actual value)
4. Select environments: **Production**, **Preview**, and **Development** (check all three)
5. Click **"Save"**

**✅ After adding all variables, you should have 7-8 environment variables set.**

---

## Step 5: Deploy to Vercel

1. Scroll to the bottom of the Vercel project setup page
2. Click **"Deploy"**
3. Wait 3-5 minutes for the build to complete
4. Watch the build logs - if there are errors, they'll show here

### 5.1: Get Your Deployment URL

After deployment completes:
1. You'll see a success message
2. Your deployment URL will be shown (e.g., `https://your-project.vercel.app`)
3. **Copy this URL**

### 5.2: Update NEXT_PUBLIC_APP_URL

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Find `NEXT_PUBLIC_APP_URL`
4. Click the three dots → **Edit**
5. Update the value to your actual Vercel URL (e.g., `https://your-project.vercel.app`)
6. Click **"Save"**
7. Go to **Deployments** tab
8. Click the three dots on the latest deployment → **Redeploy**

---

## Step 6: Run Database Migrations

Your Supabase database needs the schema. You can do this via Supabase SQL Editor:

1. Go to your Supabase dashboard
2. Click **SQL Editor**
3. Click **"New query"**
4. You'll need to create the tables. Check if there's a migration file in `apps/chat-ultra/db/schema.ts` or look for SQL migration files
5. If you have SQL migrations, copy and paste them into the SQL Editor
6. Click **"Run"**

**Note:** If you don't have SQL migrations, the app might create tables automatically on first use, or you may need to run migrations via Drizzle. Check the `apps/chat-ultra/db/` directory for migration files.

---

## Step 7: Test Your Deployment

Visit your Vercel URL and test:

- [ ] Landing page loads
- [ ] Password protection works (you should see a password prompt)
- [ ] After entering password, you can access the site
- [ ] Login page works
- [ ] Can create account (magic link via Supabase)
- [ ] Can create a Room
- [ ] Can send messages
- [ ] AI responses work (if you have ZAI_API_KEY set)
- [ ] File uploads work

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**
- Check that Root Directory is set to `apps/chat-ultra` in Vercel settings
- Verify all dependencies are in the root `package.json`

**Error: "Environment variable missing"**
- Go to Vercel → Settings → Environment Variables
- Verify all required variables are set
- Make sure you selected all environments (Production, Preview, Development)
- Redeploy after adding variables

### Database Connection Fails

- Verify `DATABASE_URL` format is correct
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Check Supabase project is active (not paused)
- Verify the connection string uses the correct format: `postgresql://postgres:password@host:5432/postgres`

### Password Protection Not Working

- Verify `SITE_PASSWORD` is set in Vercel environment variables
- Make sure it's set for Production environment
- Clear browser cache and cookies
- Try in an incognito/private window

### API Calls Fail

- Check browser console for CSP (Content Security Policy) errors
- Verify CSP in `apps/chat-ultra/next.config.js` allows your API domains
- Check Vercel function logs: Vercel Dashboard → Your Project → Functions tab

---

## Quick Reference: Environment Variables Checklist

Before deploying, make sure you have:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `DATABASE_URL`
- [ ] `NEXT_PUBLIC_APP_URL` (update after first deploy)
- [ ] `ZAI_API_KEY`
- [ ] `SITE_PASSWORD`
- [ ] `OPENAI_API_KEY` (optional)

---

## Next Steps After Deployment

1. **Set up custom domain** (optional)
   - Vercel → Settings → Domains
   - Add your domain
   - Configure DNS as instructed

2. **Monitor your deployment**
   - Check Vercel dashboard for build logs
   - Monitor function logs for errors
   - Set up uptime monitoring (optional)

3. **Share your app**
   - Share the Vercel URL
   - Share the site password
   - Perfect for demos!

---

## Need Help?

If you encounter issues:

1. Check the build logs in Vercel dashboard
2. Check function logs in Vercel dashboard
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly
5. Make sure Supabase project is active

---

## Summary

You've now:
- ✅ Set up Supabase for auth and storage
- ✅ Deployed to Vercel
- ✅ Configured all environment variables
- ✅ Tested your deployment

Your app should now be live at your Vercel URL! 🎉

