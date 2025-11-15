# z.ai Go Adapter

A Go-based adapter for testing and integrating with z.ai's GLM API.

## Setup

1. Set your API key:
```bash
export ZAI_API_KEY=your_api_key_here
```

2. Run the tests:
```bash
go run main.go
```

## Features

- Non-streaming chat completions
- Streaming chat completions (SSE)
- Support for multiple GLM models (glm-4, glm-3-turbo, glm-4.6)
- Error handling and retry logic
- Token usage tracking

## Usage

The adapter can be used as a standalone test tool or integrated into your application.

### Example: Non-streaming

```go
client := NewZaiClient(os.Getenv("ZAI_API_KEY"))
req := ChatRequest{
    Model: "glm-4",
    Messages: []ChatMessage{
        {Role: "user", Content: "Hello!"},
    },
}
resp, err := client.ChatCompletion(req)
```

### Example: Streaming

```go
client := NewZaiClient(os.Getenv("ZAI_API_KEY"))
req := ChatRequest{
    Model: "glm-4",
    Messages: []ChatMessage{
        {Role: "user", Content: "Count to 5"},
    },
    Stream: true,
}
err := client.StreamChatCompletion(req, func(chunk string) error {
    fmt.Print(chunk)
    return nil
})
```

