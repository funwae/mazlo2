package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

const (
	zaiBaseURL = "https://api.z.ai/api/paas/v4"
	defaultTimeout = 30 * time.Second
)

// ZaiClient handles communication with z.ai API
type ZaiClient struct {
	apiKey  string
	baseURL string
	client  *http.Client
}

// NewZaiClient creates a new z.ai client
func NewZaiClient(apiKey string) *ZaiClient {
	return &ZaiClient{
		apiKey:  apiKey,
		baseURL: zaiBaseURL,
		client: &http.Client{
			Timeout: defaultTimeout,
		},
	}
}

// ChatMessage represents a message in the conversation
type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// ChatRequest represents the request payload
type ChatRequest struct {
	Model       string        `json:"model"`
	Messages    []ChatMessage `json:"messages"`
	Temperature float64       `json:"temperature,omitempty"`
	MaxTokens   int           `json:"max_tokens,omitempty"`
	Stream      bool          `json:"stream"`
}

// ChatResponse represents a non-streaming response
type ChatResponse struct {
	ID      string `json:"id"`
	Object  string `json:"object"`
	Created int64  `json:"created"`
	Model   string `json:"model"`
	Choices []struct {
		Index        int `json:"index"`
		Message      ChatMessage `json:"message"`
		FinishReason string `json:"finish_reason"`
	} `json:"choices"`
	Usage struct {
		PromptTokens     int `json:"prompt_tokens"`
		CompletionTokens int `json:"completion_tokens"`
		TotalTokens      int `json:"total_tokens"`
	} `json:"usage"`
}

// StreamChunk represents a streaming response chunk
type StreamChunk struct {
	ID      string `json:"id"`
	Object  string `json:"object"`
	Created int64  `json:"created"`
	Model   string `json:"model"`
	Choices []struct {
		Index        int `json:"index"`
		Delta        ChatMessage `json:"delta"`
		FinishReason *string `json:"finish_reason"`
	} `json:"choices"`
}

// ChatCompletion performs a non-streaming chat completion
func (c *ZaiClient) ChatCompletion(req ChatRequest) (*ChatResponse, error) {
	req.Stream = false
	
	jsonData, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequest("POST", c.baseURL+"/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+c.apiKey)

	resp, err := c.client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API error (status %d): %s", resp.StatusCode, string(body))
	}

	var chatResp ChatResponse
	if err := json.NewDecoder(resp.Body).Decode(&chatResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &chatResp, nil
}

// StreamChatCompletion performs a streaming chat completion
func (c *ZaiClient) StreamChatCompletion(req ChatRequest, onChunk func(string) error) error {
	req.Stream = true
	
	jsonData, err := json.Marshal(req)
	if err != nil {
		return fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequest("POST", c.baseURL+"/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+c.apiKey)

	resp, err := c.client.Do(httpReq)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("API error (status %d): %s", resp.StatusCode, string(body))
	}

	// Read SSE stream
	reader := resp.Body
	buffer := make([]byte, 4096)
	var lineBuffer strings.Builder

	for {
		n, err := reader.Read(buffer)
		if n > 0 {
			lineBuffer.Write(buffer[:n])
			lines := strings.Split(lineBuffer.String(), "\n")
			lineBuffer.Reset()
			
			// Keep incomplete line in buffer
			if !strings.HasSuffix(string(buffer[:n]), "\n") {
				lineBuffer.WriteString(lines[len(lines)-1])
				lines = lines[:len(lines)-1]
			}

			for _, line := range lines {
				line = strings.TrimSpace(line)
				if line == "" {
					continue
				}

				if strings.HasPrefix(line, "data: ") {
					data := strings.TrimPrefix(line, "data: ")
					if data == "[DONE]" {
						return nil
					}

					var chunk StreamChunk
					if err := json.Unmarshal([]byte(data), &chunk); err != nil {
						continue // Skip invalid JSON
					}

					if len(chunk.Choices) > 0 && chunk.Choices[0].Delta.Content != "" {
						if err := onChunk(chunk.Choices[0].Delta.Content); err != nil {
							return err
						}
					}
				}
			}
		}

		if err == io.EOF {
			break
		}
		if err != nil {
			return fmt.Errorf("failed to read stream: %w", err)
		}
	}

	return nil
}

func main() {
	apiKey := os.Getenv("ZAI_API_KEY")
	if apiKey == "" {
		log.Fatal("ZAI_API_KEY environment variable is not set")
	}

	client := NewZaiClient(apiKey)

	// Test 1: Non-streaming completion
	fmt.Println("🧪 Test 1: Non-streaming chat completion")
	req := ChatRequest{
		Model: "glm-4",
		Messages: []ChatMessage{
			{Role: "system", Content: "You are a helpful AI assistant."},
			{Role: "user", Content: "Say 'Hello from z.ai!' in exactly 5 words."},
		},
		Temperature: 0.7,
	}

	resp, err := client.ChatCompletion(req)
	if err != nil {
		log.Fatalf("Error: %v", err)
	}

	if len(resp.Choices) > 0 {
		fmt.Printf("✅ Response: %s\n\n", resp.Choices[0].Message.Content)
		fmt.Printf("Tokens used: %d\n\n", resp.Usage.TotalTokens)
	}

	// Test 2: Streaming completion
	fmt.Println("📡 Test 2: Streaming chat completion")
	streamReq := ChatRequest{
		Model: "glm-4",
		Messages: []ChatMessage{
			{Role: "system", Content: "You are a helpful AI assistant."},
			{Role: "user", Content: "Count from 1 to 5, one number per line."},
		},
		Temperature: 0.7,
	}

	fmt.Print("Response: ")
	err = client.StreamChatCompletion(streamReq, func(chunk string) error {
		fmt.Print(chunk)
		return nil
	})
	if err != nil {
		log.Fatalf("Error: %v", err)
	}
	fmt.Println("\n✅ Streaming completed!")

	// Test 3: Test different models
	fmt.Println("\n🔬 Test 3: Testing different models")
	models := []string{"glm-4", "glm-3-turbo", "glm-4.6"}

	for _, model := range models {
		fmt.Printf("\nTesting model: %s\n", model)
		testReq := ChatRequest{
			Model: model,
			Messages: []ChatMessage{
				{Role: "user", Content: "Say 'OK' if you can hear me."},
			},
			Temperature: 0.7,
			MaxTokens:   10,
		}

		testResp, err := client.ChatCompletion(testReq)
		if err != nil {
			fmt.Printf("❌ %s: %v\n", model, err)
			continue
		}

		if len(testResp.Choices) > 0 {
			fmt.Printf("✅ %s: %s\n", model, testResp.Choices[0].Message.Content)
		}
	}

	fmt.Println("\n✨ All tests completed!")
}

