import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dist = path.join(__dirname, 'public');

if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}
fs.mkdirSync(dist, { recursive: true });

const items = [
  'index.html',
  'admin',
  'css',
  'js',
  'images',
  'data',
  'manifest.json',
  'robots.txt',
  'sitemap.xml',
  'googleed053f5616bc097a.html'
];

for (const item of items) {
  const src = path.join(__dirname, item);
  const dst = path.join(dist, item);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dst, { recursive: true });
  }
}

console.log('✓ Build successful: Static site prepared in public/ directory.');
