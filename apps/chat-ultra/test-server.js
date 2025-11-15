// Simple test server for z.ai integration
const http = require('http');
const fs = require('fs');
const path = require('path');

// Load .env file manually
const envPath = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !match[1].startsWith('#')) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

// Import z.ai provider (using dynamic import for ES modules)
async function startServer() {
  const { ZaiProvider } = await import('./lib/provider/zai.js');
  
  const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    if (req.url === '/test' && req.method === 'GET') {
      try {
        const apiKey = process.env.ZAI_API_KEY;
        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'ZAI_API_KEY not found' }));
          return;
        }
        
        const provider = new ZaiProvider(apiKey);
        const result = await provider.chatCompletion({
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant.' },
            { role: 'user', content: 'Say "OK" if you can hear me.' },
          ],
          model: 'glm-4-plus',
          maxTokens: 5,
        });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'z.ai API is working!',
          response: result.content,
          model: 'glm-4-plus',
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: error.message,
        }));
      }
    } else if (req.url === '/stream' && req.method === 'GET') {
      try {
        const apiKey = process.env.ZAI_API_KEY;
        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'ZAI_API_KEY not found' }));
          return;
        }
        
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        });
        
        const provider = new ZaiProvider(apiKey);
        for await (const chunk of provider.streamChat(
          [
            { role: 'system', content: 'You are a helpful AI assistant.' },
            { role: 'user', content: 'Count from 1 to 5.' },
          ],
          { model: 'glm-4-plus', temperature: 0.7 }
        )) {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        }
        res.write('data: [DONE]\n\n');
        res.end();
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    } else if (req.url === '/' || req.url === '/index.html') {
      // Serve a simple test page
      const html = `
<!DOCTYPE html>
<html>
<head>
  <title>z.ai Integration Test</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
    button { padding: 10px 20px; margin: 10px; font-size: 16px; cursor: pointer; }
    #result { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px; }
    .success { color: green; }
    .error { color: red; }
    #stream-output { margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 5px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>z.ai GLM Integration Test</h1>
  <button onclick="testAPI()">Test Non-Streaming</button>
  <button onclick="testStreaming()">Test Streaming</button>
  <div id="result"></div>
  <div id="stream-output"></div>
  
  <script>
    async function testAPI() {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = 'Testing...';
      
      try {
        const response = await fetch('/test');
        const data = await response.json();
        
        if (data.success) {
          resultDiv.innerHTML = '<div class="success"><strong>✅ Success!</strong><br>' +
            'Response: ' + data.response + '<br>' +
            'Model: ' + data.model + '</div>';
        } else {
          resultDiv.innerHTML = '<div class="error"><strong>❌ Error:</strong> ' + data.error + '</div>';
        }
      } catch (error) {
        resultDiv.innerHTML = '<div class="error"><strong>❌ Request failed:</strong> ' + error.message + '</div>';
      }
    }
    
    async function testStreaming() {
      const resultDiv = document.getElementById('result');
      const streamDiv = document.getElementById('stream-output');
      resultDiv.innerHTML = 'Starting stream...';
      streamDiv.textContent = '';
      
      try {
        const response = await fetch('/stream');
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const text = decoder.decode(value);
          const lines = text.split('\\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                resultDiv.innerHTML = '<div class="success"><strong>✅ Streaming completed!</strong></div>';
                break;
              }
              try {
                const json = JSON.parse(data);
                streamDiv.textContent += json.chunk;
              } catch (e) {}
            }
          }
        }
      } catch (error) {
        resultDiv.innerHTML = '<div class="error"><strong>❌ Streaming failed:</strong> ' + error.message + '</div>';
      }
    }
  </script>
</body>
</html>
      `;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  
  const PORT = 3001;
  server.listen(PORT, () => {
    console.log(`✅ Test server running on http://localhost:${PORT}`);
    console.log(`   - Test page: http://localhost:${PORT}/`);
    console.log(`   - API test: http://localhost:${PORT}/test`);
    console.log(`   - Streaming: http://localhost:${PORT}/stream`);
  });
}

startServer().catch(console.error);

