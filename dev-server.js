// dev-server.js — Local development server for TGMS Somaram
// Serves static files and executes Vercel Serverless Functions in api/

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env variables
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  });
}

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = reqUrl.pathname;

  // Enhance res with helper methods (compatible with Vercel serverless functions)
  res.status = function(code) {
    res.statusCode = code;
    return res;
  };
  res.json = function(data) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
    return res;
  };

  // Enhance req with query
  req.query = Object.fromEntries(reqUrl.searchParams.entries());

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    let bodyData = '';
    req.on('data', chunk => { bodyData += chunk; });
    req.on('end', async () => {
      if (bodyData) {
        try {
          req.body = JSON.parse(bodyData);
        } catch {
          req.body = bodyData;
        }
      } else {
        req.body = {};
      }

      // Resolve API handler file
      let apiRel = pathname.replace(/^\/api\//, '');
      if (apiRel.endsWith('/')) apiRel = apiRel.slice(0, -1);
      let apiFile = path.join(__dirname, 'api', apiRel + '.js');

      if (!fs.existsSync(apiFile)) {
        res.status(404).json({ error: `API route not found: ${pathname}` });
        return;
      }

      try {
        const module = await import(`file://${apiFile}?t=${Date.now()}`);
        const handler = module.default;
        if (typeof handler === 'function') {
          await handler(req, res);
        } else {
          res.status(500).json({ error: 'Handler function not exported' });
        }
      } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ error: err.message || 'Internal Server Error' });
      }
    });
    return;
  }

  // Handle Static Routes
  if (pathname === '/admin' || pathname === '/admin/') {
    pathname = '/admin/index.html';
  } else if (pathname === '/') {
    pathname = '/index.html';
  }

  let filePath = path.join(__dirname, pathname);

  // Fallback to index.html for root client routes
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading file');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 TGMS Somaram Website & Admin Portal is running!`);
  console.log(`🔗 Website:      http://localhost:${PORT}/`);
  console.log(`🔐 Admin Portal: http://localhost:${PORT}/admin`);
  console.log(`======================================================\n`);
});
