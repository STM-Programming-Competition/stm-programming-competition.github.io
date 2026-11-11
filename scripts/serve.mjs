import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const root = resolve(projectRoot, option('--dir', '.'));
const port = Number(option('--port', '5173'));
const mime = { '.ttf':'font/ttf', '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpeg':'image/jpeg', '.jpg':'image/jpeg', '.json':'application/json; charset=utf-8' };

const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const target = resolve(root, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`);
    if (!target.startsWith(root + sep) || pathname.split('/').some((part) => part.startsWith('.'))) {
      response.writeHead(403).end('Forbidden'); return;
    }
    if (!(await stat(target)).isFile()) { response.writeHead(404).end('Not found'); return; }
    const bytes = await readFile(target);
    response.writeHead(200, { 'Content-Type':mime[extname(target)] || 'application/octet-stream', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : bytes);
  } catch {
    response.writeHead(404).end('Not found');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}/`));
server.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
