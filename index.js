const http = require('http');
const fs = require('fs');

const manifest = JSON.parse(fs.readFileSync('module.manifest.json', 'utf8'));

const server = http.createServer((req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/html');
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${manifest.metadata.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      max-width: 500px;
    }
    h1 { font-size: 2rem; margin-bottom: 1rem; }
    .status { 
      background: #fbbf24; 
      color: #1a1a2e;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      display: inline-block;
      margin-bottom: 1.5rem;
      font-weight: 600;
    }
    .info { color: #94a3b8; line-height: 1.6; }
    .meta { 
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      font-size: 0.875rem;
      color: #64748b;
    }
    .meta span { display: block; margin: 0.25rem 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${manifest.metadata.name}</h1>
    <div class="status">Substrate Only</div>
    <p class="info">${manifest.metadata.description}</p>
    <p class="info" style="margin-top: 1rem;">This repository contains governance files and module manifest. Business logic will be added in future phases.</p>
    <div class="meta">
      <span><strong>Module ID:</strong> ${manifest.moduleId}</span>
      <span><strong>Class:</strong> ${manifest.class}</span>
      <span><strong>Version:</strong> ${manifest.version}</span>
    </div>
  </div>
</body>
</html>`);
});

const PORT = 5000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log('Server running at http://' + HOST + ':' + PORT);
});
