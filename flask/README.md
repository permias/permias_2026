# Flask API (Gemini) for PERMIAS Nasional

Flask backend for the site chat using the [Google Gen AI SDK](https://github.com/googleapis/python-genai) (Gemini Developer API / AI Studio API key).

## Project structure

```
flask/
├── app.py
├── requirements.txt
├── Procfile              # gunicorn (Heroku / similar)
├── .env.example
└── .env                  # local only (copy from .env.example)
```

## Quick start

```bash
cd flask
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env: set GEMINI_API_KEY (from https://aistudio.google.com/apikey)
python app.py
```

Default port is **5001** (see `PORT` in `.env`).

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/chat` | **Site chat** — body: `{ "message": "...", "system": "..." }` → `{ "reply": "..." }` |
| GET | `/api/health` | Liveness: `api_configured`, `model` (no secrets) |

## Local full stack (Vite + Flask)

1. Start Flask: `python app.py` (port 5001).
2. In `permias-nasional/`, run `npm run dev`. Vite proxies `POST /api/chat` to `http://127.0.0.1:5001`.

## Production

**Environment**

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes* | API key from Google AI Studio |
| `GOOGLE_API_KEY` | | Alternative name (same as above) |
| `VERTEX_API_KEY` | | Legacy name only — still accepted |
| `GEMINI_MODEL` | No | Model id, e.g. `gemini-2.5-flash` — see [current models](https://ai.google.dev/gemini-api/docs/models) |
| `CORS_ORIGINS` | No | Comma-separated allowed browser origins, or `*` (default). **Use your real site in production** (not `*`) if the API is on a public URL. |
| `CHAT_RATE_LIMIT` | No | Per-IP cap on `POST` chat routes (e.g. `20 per minute`). See [Flask-Limiter](https://flask-limiter.readthedocs.io/) syntax. |
| `TRUST_X_FORWARDED_FOR` | No | Set to `1` / `true` if the app is **behind a reverse proxy** so the client IP (and rate limit) comes from `X-Forwarded-For`. |
| `RATELIMIT_STORAGE_URI` | No | e.g. `redis://...` to share rate-limit counters across **multiple gunicorn workers**; default in-memory. |
| `MAX_REQUEST_BYTES` | No | Max request body size (default `65536`) to protect against large POST abuse. |
| `PORT` | No | Listen port for gunicorn/Flask |

**Keep the API key on the server only** — set `GEMINI_API_KEY` in the host’s environment (or a secrets manager), never in the React repo or a `VITE_` variable (those are embedded in the public JS bundle).

**Run with gunicorn** (e.g. Linux server or container):

```bash
cd flask
gunicorn -b 0.0.0.0:5001 -w 2 "app:app"
```

**Same host as the static site (recommended)**  
Put the built Vite app behind nginx (or similar) and proxy `/api/` to gunicorn. The frontend can use `VITE_API_BASE=` (empty) so `fetch` hits `/api/chat` on the same origin.

**Separate API host**  
Build the frontend with `VITE_API_BASE` pointing at the API origin (see `permias-nasional/.env.example`). Set `CORS_ORIGINS` on Flask to that site’s origin.

### Example: nginx (same host)

```nginx
location /api/ {
  proxy_pass http://127.0.0.1:5001;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

Set `TRUST_X_FORWARDED_FOR=1` in Flask when you forward these headers, so per-IP rate limits use the real visitor IP.

## cURL

```bash
curl -sS -X POST http://127.0.0.1:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is PERMIAS?","system":"Reply in one sentence."}' | jq .
```

## Troubleshooting

- **503** from `/api/chat` — `GEMINI_API_KEY` (or accepted alias) is not set on the server.
- **401/403** from Google — key invalid or Generative Language API not enabled for the key’s project; check [AI Studio](https://aistudio.google.com).
- **4xx/5xx** from the assistant — often wrong or retired `GEMINI_MODEL` or Google quota. Set a valid `GEMINI_MODEL` and check [model docs](https://ai.google.dev/gemini-api/docs/models) or your Google project quotas.
- **429** (from Google) — rate or free-tier limit; the client shows a short message. Wait or change plan/model in AI Studio.
