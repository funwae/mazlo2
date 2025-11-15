# Testing z.ai Integration

## Quick Start

1. **Set your API key**:
   ```bash
   export ZAI_API_KEY=your_api_key_here
   ```
   
   Or create `.env` file in `apps/chat-ultra/`:
   ```
   ZAI_API_KEY=your_api_key_here
   ```

2. **Run tests**:
   ```bash
   # TypeScript test (recommended)
   cd apps/chat-ultra
   npx tsx scripts/test-zai.ts
   
   # Go adapter test
   cd apps/chat-ultra/go-zai-adapter
   go run main.go
   
   # Direct API test (requires curl and jq)
   cd apps/chat-ultra
   ./scripts/test-zai-direct.sh
   ```

## What's Implemented

✅ **TypeScript Provider** (`lib/provider/zai.ts`):
- Non-streaming chat completions
- Streaming chat completions (SSE)
- Model name mapping (glm-4, glm-4.6, glm-3-turbo)
- Error handling with detailed messages
- Compatible with existing ChatProvider interface

✅ **Go Adapter** (`go-zai-adapter/main.go`):
- Full streaming support
- Non-streaming support
- Error handling
- Token usage tracking
- Can be used as standalone service

✅ **Integration Points**:
- Updated orchestrator to support z.ai streaming
- Updated provider settings UI with correct model names
- Updated test endpoint to use correct model names

## Expected Test Results

### Test 1: Non-streaming
Should return: "Hello from z.ai!" (or similar)

### Test 2: Streaming
Should stream response token by token

### Test 3: Model Testing
Should test glm-4, glm-3-turbo, and glm-4.6 models

## Troubleshooting

### If tests fail:

1. **Check API Key**:
   ```bash
   echo $ZAI_API_KEY
   ```

2. **Test direct API call**:
   ```bash
   curl -X POST "https://api.z.ai/api/paas/v4/chat/completions" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $ZAI_API_KEY" \
     -d '{"model": "glm-4", "messages": [{"role": "user", "content": "test"}]}'
   ```

3. **Check API status**: Visit https://z.ai/status

4. **Verify plan limits**: GLM Lite plan has rate limits

## Next Steps After Testing

1. ✅ Verify all tests pass
2. ✅ Test in UI (Settings → Providers → Test Connection)
3. ✅ Send a message using z.ai provider
4. ✅ Verify streaming works in chat
5. ✅ Monitor usage and rate limits

## Files Modified

- `lib/provider/zai.ts` - Full z.ai implementation
- `lib/orchestrator/mazlo.ts` - Support for z.ai streaming
- `app/(app)/settings/providers/page.tsx` - Updated model names
- `app/api/providers/test/route.ts` - Updated test endpoint
- `go-zai-adapter/main.go` - Go adapter for testing
- `scripts/test-zai.ts` - TypeScript test script
- `scripts/test-zai-direct.sh` - Direct API test script

