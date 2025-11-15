# z.ai GLM Integration Guide

This document describes the z.ai API integration for the Chat Ultra application.

## API Endpoint

- **Base URL**: `https://api.z.ai/api/paas/v4`
- **Chat Completions**: `POST /chat/completions`
- **Authentication**: Bearer token in `Authorization` header

## Supported Models

- `glm-4` - GLM-4 model (recommended)
- `glm-4.6` - GLM-4.6 model (latest)
- `glm-3-turbo` - GLM-3 Turbo model (faster, cheaper)

## Setup

1. **Get API Key**: Obtain your API key from [z.ai Platform](https://z.ai/)

2. **Set Environment Variable**:
   ```bash
   export ZAI_API_KEY=your_api_key_here
   ```
   
   Or create a `.env` file in `apps/chat-ultra/`:
   ```
   ZAI_API_KEY=your_api_key_here
   ```

3. **Test the Integration**:
   ```bash
   # TypeScript test
   npx tsx scripts/test-zai.ts
   
   # Go test
   cd go-zai-adapter && go run main.go
   
   # Direct API test
   ./scripts/test-zai-direct.sh
   ```

## Implementation Details

### TypeScript Provider (`lib/provider/zai.ts`)

The `ZaiProvider` class implements:
- Non-streaming chat completions
- Streaming chat completions (SSE)
- Model name mapping for compatibility
- Error handling

### Go Adapter (`go-zai-adapter/`)

A standalone Go adapter for testing and integration:
- Full streaming support
- Error handling
- Token usage tracking
- Can be used as a microservice if needed

## Usage in Application

### Setting z.ai as Default Provider

1. Go to Settings → Providers
2. Enter your z.ai API key
3. Select a model (glm-4, glm-4.6, or glm-3-turbo)
4. Click "Save" and "Set as Default"

### Using in Code

```typescript
import { ZaiProvider } from "@/lib/provider/zai";

const provider = new ZaiProvider(process.env.ZAI_API_KEY!);

// Non-streaming
const result = await provider.chatCompletion({
  messages: [
    { role: "user", content: "Hello!" }
  ],
  model: "glm-4",
  temperature: 0.7,
});

// Streaming
for await (const chunk of provider.streamChat(
  [{ role: "user", content: "Hello!" }],
  { model: "glm-4", temperature: 0.7 }
)) {
  console.log(chunk);
}
```

## Testing

Run the test suite to verify integration:

```bash
# Test TypeScript implementation
ZAI_API_KEY=your_key npx tsx scripts/test-zai.ts

# Test Go adapter
cd go-zai-adapter
ZAI_API_KEY=your_key go run main.go

# Test direct API calls
ZAI_API_KEY=your_key ./scripts/test-zai-direct.sh
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check that your API key is correct and has proper permissions
2. **Model not found**: Ensure you're using the correct model name (glm-4, glm-4.6, glm-3-turbo)
3. **Streaming not working**: Check that the API key has streaming permissions
4. **Rate limits**: GLM Lite plan has limits (120 prompts per 5 hours)

### Error Messages

- `z.ai API error (401)`: Invalid or missing API key
- `z.ai API error (429)`: Rate limit exceeded
- `z.ai API error (400)`: Invalid request format

## API Limits (GLM Lite Plan)

- **Rate Limit**: ~120 prompts per 5 hours
- **Token Limits**: Check z.ai documentation for current limits
- **Streaming**: Supported

## Next Steps

1. Test the integration with your API key
2. Verify streaming works correctly
3. Test with different models
4. Monitor usage and rate limits
5. Consider upgrading plan if needed

