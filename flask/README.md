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
| POST | `/api/chapter-register` | **Chapter registration** — emails the national board (see below) |
| POST | `/api/contact` | **Contact form** — emails the national board |
| GET | `/api/health` | Liveness: `api_configured`, `mail_configured`, etc. (no secrets) |

## Local full stack (Vite + Flask)

1. Start Flask: `python app.py` (port 5001).
2. In `permias-nasional/`, run `npm run dev`. Vite proxies `POST /api/chat`, `/api/chapter-register`, and `/api/contact` to `http://127.0.0.1:5001`.

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
| `CHAPTER_REGISTER_TO` | No | Recipient(s), comma-separated (default `info@permiasnasional.com`) |
| `SMTP_USER` / `SMTP_PASSWORD` | For chapter form* | Gmail (or other) SMTP — use an [app password](https://support.google.com/accounts/answer/185833) if 2FA is on |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_FROM` | No | Defaults: `smtp.gmail.com`, `587`, same as `SMTP_USER` |
| `RESEND_API_KEY` | For chapter form* | Alternative to SMTP via [Resend](https://resend.com) |
| `CHAPTER_REGISTER_FROM` | With Resend | Verified sender, e.g. `PERMIAS Nasional <noreply@permiasnasional.com>` |
| `CHAPTER_REGISTER_RATE_LIMIT` | No | Per-IP cap on chapter registrations (default `5 per minute`) |

\*Set **either** SMTP credentials **or** `RESEND_API_KEY` (not both required).
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

## Outbound email (chapter register + contact)

Set **either** SMTP credentials **or** `RESEND_API_KEY` in `.env`. Both forms use the same mail settings.

- `/chapters/register` → `POST /api/chapter-register` → `CHAPTER_REGISTER_TO`
- `/contact` → `POST /api/contact` → `CONTACT_TO`

**Reply-To** is always the submitter’s email.

**Gmail SMTP (typical)**

```bash
CHAPTER_REGISTER_TO=info@permiasnasional.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-account@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM=PERMIAS Nasional <your-account@gmail.com>
```

Restart Flask. `GET /api/health` should show `"chapter_register_configured": true`.

**Resend** — set `RESEND_API_KEY` and a verified `MAIL_FROM` instead of SMTP.

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
