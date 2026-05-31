import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

async function readJsonBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'));
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

/** Dev-only mock APIs so POST /api/* works with `npm run dev` */
function apiPlugin() {
  return {
    name: 'permias-mock-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        if (req.method === 'POST' && url === '/api/subscribe') {
          const body = await readJsonBody(req);
          const email = String(body.email || '').trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            sendJson(res, 400, { ok: false, error: 'Invalid email' });
            return;
          }
          sendJson(res, 200, { ok: true, message: 'Subscribed' });
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/permias_2026/',
  plugins: [react(), apiPlugin()],
  server: {
    // Proxy to Flask in dev: run `python app.py` in permias_2026/flask (port 5001)
    proxy: {
      '/api/chat': { target: 'http://127.0.0.1:5001', changeOrigin: true },
      '/api/chapter-register': { target: 'http://127.0.0.1:5001', changeOrigin: true },
      '/api/contact': { target: 'http://127.0.0.1:5001', changeOrigin: true },
    },
  },
});
