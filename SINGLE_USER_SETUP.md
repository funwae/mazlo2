# Single-User Setup Guide

This guide explains how to run Chat Ultra as a single-user application using your own API keys stored locally.

## How API Keys Work

**Your API keys are stored locally and never exposed:**

1. **Storage**: API keys are stored in `.env` file in the project root (never committed to git)
2. **Usage**: Keys are read server-side only (in Convex actions and API routes)
3. **Security**: Keys never reach the browser or client-side code
4. **Single-User**: Perfect for personal use - just you and your keys

## Quick Setup

### 1. Add Your API Keys to `.env`

Create or edit `.env` in the project root:

```bash
# z.ai API Key (for GLM models)
ZAI_API_KEY=your_zai_api_key_here

# OpenAI API Key (optional, if you want to use OpenAI)
OPENAI_API_KEY=sk-your_openai_key_here

# Convex (optional for now - using placeholder)
NEXT_PUBLIC_CONVEX_URL=https://placeholder.convex.cloud

# Supabase (optional for now - using placeholder)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-anon-key
```

### 2. Start the Application

```bash
# From project root
npm run dev
```

The app will:
- Read your API keys from `.env` automatically
- Use them server-side only (never exposed to browser)
- Work as a single-user system

### 3. Configure Provider (Optional)

You can also set your default provider via the Settings page:
- Go to Settings → Providers
- Select z.ai or OpenAI
- Choose your model (e.g., `glm-4-plus` for z.ai)

**Note**: The provider settings UI is designed for multi-user scenarios, but for single-user use, the system automatically uses your `.env` keys.

## How It Works

### Environment Variables (Your Setup)

When you set `ZAI_API_KEY` in `.env`:
- ✅ Used automatically by all AI functions
- ✅ Never sent to browser
- ✅ Perfect for single-user personal use

### Provider Settings UI (Future Multi-User)

The Settings → Providers page allows:
- Users to enter their own API keys
- Keys stored encrypted in database
- Multi-user support

**For now, just use `.env` - it's simpler and more secure for single-user use.**

## Security Notes

✅ **Safe**: API keys in `.env` are:
- Stored locally on your machine
- Never committed to git (`.env` is in `.gitignore`)
- Only read server-side
- Never exposed to browser

❌ **Never**: 
- Commit `.env` to git
- Share your `.env` file
- Put API keys in client-side code

## Testing Your Setup

1. Start the app: `npm run dev`
2. Open http://localhost:3000
3. Go to Settings → Providers
4. Click "Test Connection" for z.ai
5. It will use your `ZAI_API_KEY` from `.env`

## Next Steps

Once you're ready to show z.ai:
- The app works with your local API keys
- No multi-user setup needed
- All your data stays local
- Perfect for demos and testing

