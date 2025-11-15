#!/bin/bash
# Direct test script for z.ai API
# Usage: ./scripts/test-zai-direct.sh

set -e

# Check if API key is set
if [ -z "$ZAI_API_KEY" ]; then
    echo "❌ ZAI_API_KEY environment variable is not set"
    echo "Please set it with: export ZAI_API_KEY=your_key"
    exit 1
fi

echo "🧪 Testing z.ai API directly..."
echo "API Key: ${ZAI_API_KEY:0:10}...${ZAI_API_KEY: -4}"
echo ""

# Test 1: Non-streaming completion
echo "📝 Test 1: Non-streaming chat completion"
curl -X POST "https://api.z.ai/api/paas/v4/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZAI_API_KEY" \
  -d '{
    "model": "glm-4",
    "messages": [
      {"role": "system", "content": "You are a helpful AI assistant."},
      {"role": "user", "content": "Say \"Hello from z.ai!\" in exactly 5 words."}
    ],
    "temperature": 0.7,
    "stream": false
  }' | jq -r '.choices[0].message.content'

echo ""
echo "✅ Test 1 completed!"
echo ""

# Test 2: Test streaming (simplified)
echo "📡 Test 2: Testing streaming endpoint (first chunk only)"
curl -X POST "https://api.z.ai/api/paas/v4/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZAI_API_KEY" \
  -d '{
    "model": "glm-4",
    "messages": [
      {"role": "user", "content": "Say OK"}
    ],
    "temperature": 0.7,
    "stream": true
  }' 2>/dev/null | head -n 3

echo ""
echo "✅ Test 2 completed!"
echo ""

echo "✨ Direct API tests completed!"
echo ""
echo "For full integration testing, use:"
echo "  - TypeScript: npx tsx scripts/test-zai.ts"
echo "  - Go: cd go-zai-adapter && go run main.go"

