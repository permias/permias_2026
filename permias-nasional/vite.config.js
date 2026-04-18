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
        if (req.method === 'POST' && url === '/api/contact') {
          const body = await readJsonBody(req);
          if (!body.name || !body.email || !body.message) {
            sendJson(res, 400, { ok: false, error: 'Missing fields' });
            return;
          }
          sendJson(res, 200, { ok: true, message: 'Received' });
          return;
        }
        if (req.method === 'POST' && url === '/api/chat') {
          await readJsonBody(req);
          sendJson(res, 501, {
            ok: false,
            error:
              'TODO: Connect to Anthropic Claude at /api/chat in production. UI is ready.',
          });
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
});
