#!/bin/bash
# Convex Setup Script
# Run this to set up Convex for your project

echo "🚀 Setting up Convex..."
echo ""
echo "This will:"
echo "1. Log you into Convex (if not already logged in)"
echo "2. Create a new Convex project"
echo "3. Deploy your Convex functions"
echo "4. Get your deployment URL"
echo ""

cd "$(dirname "$0")"

# Check if convex CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js first."
    exit 1
fi

echo "📦 Installing Convex CLI (if needed)..."
npm list -g convex > /dev/null 2>&1 || npm install -g convex

echo ""
echo "🔐 Logging into Convex..."
echo "You'll be prompted to log in or create an account."
npx convex login

echo ""
echo "🏗️  Creating Convex project..."
echo "This will create a new Convex project and deploy your functions."
npx convex dev --once

echo ""
echo "✅ Convex setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Check your .env.local file for NEXT_PUBLIC_CONVEX_URL"
echo "2. Add NEXT_PUBLIC_CONVEX_URL to Vercel environment variables"
echo "3. Run 'npx convex deploy --prod' to deploy to production"
echo ""

