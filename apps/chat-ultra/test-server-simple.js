// Simple test server for z.ai integration - direct API calls
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env file manually
const envPath = path.join(__dirname, '../../.env');
let ZAI_API_KEY = '';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^ZAI_API_KEY=(.*)$/);
    if (match) {
      ZAI_API_KEY = match[1].trim();
    }
  });
}

if (!ZAI_API_KEY) {
  console.error('❌ ZAI_API_KEY not found in .env file');
  process.exit(1);
}

console.log(`✅ Loaded API key: ${ZAI_API_KEY.substring(0, 10)}...${ZAI_API_KEY.substring(ZAI_API_KEY.length - 4)}`);

// Make z.ai API call
function callZaiAPI(messages, stream = false) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'glm-4-plus',
      messages: messages,
      temperature: 0.7,
      stream: stream,
    });

    const options = {
      hostname: 'api.z.ai',
      port: 443,
      path: '/api/paas/v4/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZAI_API_KEY}`,
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errorBody = '';
        res.on('data', (chunk) => { errorBody += chunk; });
        res.on('end', () => {
          reject(new Error(`API error (${res.statusCode}): ${errorBody}`));
        });
        return;
      }

      if (stream) {
        resolve(res); // Return stream
      } else {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            resolve(json.choices?.[0]?.message?.content || '');
          } catch (e) {
            reject(new Error(`Parse error: ${e.message}`));
          }
        });
      }
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

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
      const response = await callZaiAPI([
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: 'Say "OK" if you can hear me.' },
      ], false);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'z.ai API is working!',
        response: response,
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
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      const streamRes = await callZaiAPI([
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: 'Count from 1 to 5, one number per line.' },
      ], true);

      streamRes.on('data', (chunk) => {
        const text = chunk.toString();
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') {
              res.write('data: [DONE]\n\n');
              res.end();
              return;
            }
            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content || '';
              if (content) {
                res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      });

      streamRes.on('end', () => {
        res.write('data: [DONE]\n\n');
        res.end();
      });
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (req.url === '/' || req.url === '/index.html') {
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>z.ai Integration Test</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #0a0a0a; color: #fff; }
    button { padding: 12px 24px; margin: 10px; font-size: 16px; cursor: pointer; background: #38BDF2; color: #000; border: none; border-radius: 5px; font-weight: bold; }
    button:hover { background: #2da8d8; }
    button:disabled { background: #666; cursor: not-allowed; }
    #result { margin-top: 20px; padding: 15px; background: #1a1a1a; border-radius: 5px; border: 1px solid #333; }
    .success { color: #4ade80; }
    .error { color: #f87171; }
    #stream-output { margin-top: 20px; padding: 15px; background: #1a2a3a; border-radius: 5px; border: 1px solid #38BDF2; white-space: pre-wrap; min-height: 50px; }
    h1 { color: #38BDF2; }
  </style>
</head>
<body>
  <h1>🧪 z.ai GLM Integration Test</h1>
  <p>Testing z.ai API with GLM-4-Plus model</p>
  <button onclick="testAPI()">Test Non-Streaming</button>
  <button onclick="testStreaming()">Test Streaming</button>
  <div id="result"></div>
  <div id="stream-output"></div>
  
  <script>
    async function testAPI() {
      const resultDiv = document.getElementById('result');
      const btn = event.target;
      btn.disabled = true;
      resultDiv.innerHTML = '⏳ Testing...';
      
      try {
        const response = await fetch('/test');
        const data = await response.json();
        
        if (data.success) {
          resultDiv.innerHTML = '<div class="success"><strong>✅ Success!</strong><br>' +
            'Response: <strong>' + data.response + '</strong><br>' +
            'Model: ' + data.model + '</div>';
        } else {
          resultDiv.innerHTML = '<div class="error"><strong>❌ Error:</strong> ' + data.error + '</div>';
        }
      } catch (error) {
        resultDiv.innerHTML = '<div class="error"><strong>❌ Request failed:</strong> ' + error.message + '</div>';
      } finally {
        btn.disabled = false;
      }
    }
    
    async function testStreaming() {
      const resultDiv = document.getElementById('result');
      const streamDiv = document.getElementById('stream-output');
      const btn = event.target;
      btn.disabled = true;
      resultDiv.innerHTML = '⏳ Starting stream...';
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
                if (json.chunk) {
                  streamDiv.textContent += json.chunk;
                }
              } catch (e) {}
            }
          }
        }
      } catch (error) {
        resultDiv.innerHTML = '<div class="error"><strong>❌ Streaming failed:</strong> ' + error.message + '</div>';
      } finally {
        btn.disabled = false;
      }
    }
  </script>
</body>
</html>`;
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

