/**
 * Test script for z.ai API integration
 * Run with: npx tsx scripts/test-zai.ts
 * 
 * Make sure ZAI_API_KEY is set in your environment or .env file
 */

import { ZaiProvider } from "../lib/provider/zai";

async function testZaiProvider() {
  const apiKey = process.env.ZAI_API_KEY;

  if (!apiKey) {
    console.error("❌ ZAI_API_KEY not found in environment variables");
    console.log("Please set ZAI_API_KEY in your .env file");
    process.exit(1);
  }

  console.log("🧪 Testing z.ai Provider...\n");
  console.log(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}\n`);

  const provider = new ZaiProvider(apiKey);

  // Test 1: Non-streaming completion
  console.log("📝 Test 1: Non-streaming chat completion");
  try {
    const result = await provider.chatCompletion({
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: "Say 'Hello from z.ai!' in exactly 5 words." },
      ],
      model: "glm-4-plus",
      temperature: 0.7,
    });

    console.log("✅ Success!");
    console.log(`Response: ${result.content}\n`);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    console.error("Full error:", error);
    return;
  }

  // Test 2: Streaming completion
  console.log("📡 Test 2: Streaming chat completion");
  try {
    let fullContent = "";
    for await (const chunk of provider.streamChat(
      [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: "Count from 1 to 5, one number per line." },
      ],
      {
        model: "glm-4-plus",
        temperature: 0.7,
      }
    )) {
      process.stdout.write(chunk);
      fullContent += chunk;
    }
    console.log("\n✅ Streaming completed!");
    console.log(`Full response length: ${fullContent.length} characters\n`);
  } catch (error: any) {
    console.error("\n❌ Error:", error.message);
    console.error("Full error:", error);
    return;
  }

  // Test 3: Test with different models
  console.log("🔬 Test 3: Testing different models");
  const models = ["glm-4-plus", "glm-4-flash", "glm-4-air"];

  for (const model of models) {
    try {
      console.log(`\nTesting model: ${model}`);
      const result = await provider.chatCompletion({
        messages: [
          { role: "user", content: "Say 'OK' if you can hear me." },
        ],
        model,
        temperature: 0.7,
        maxTokens: 10,
      });
      console.log(`✅ ${model}: ${result.content.substring(0, 50)}...`);
    } catch (error: any) {
      console.log(`❌ ${model}: ${error.message}`);
    }
  }

  console.log("\n✨ All tests completed!");
}

testZaiProvider().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

