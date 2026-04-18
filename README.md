# PERMAS / PERMIAS Nasional — website

New Permias website — Spring 2026 (04.17.2026). Credits: PnP team.

React + Vite + Tailwind site. The app lives in [`permias-nasional/`](./permias-nasional/).

**Repository:** [github.com/permias/permias_2026](https://github.com/permias/permias_2026)

## Why GitHub said “lots of files”

If you **drag a folder into GitHub in the browser**, there is a **low file limit** (on the order of ~100 files). A normal Node project has **thousands** of files inside `node_modules/`, which you must **never** upload.

**Do this instead:** use **Git** on your computer and **push** to GitHub. Only **source code** is tracked; `node_modules/` and `dist/` stay out of the repo (see [`.gitignore`](./.gitignore)).

### First-time setup (command line)

From this folder:

```bash
git clone https://github.com/permias/permias_2026.git
cd permias_2026
npm install
```

### Install and run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

- **Production build:** `npm run build` — output is `permias-nasional/dist/`.
- **Preview build:** `npm run preview`.

## Put the site on your own domain

This is a **static site** after `npm run build`. You upload **`dist/`** to a host, or connect the GitHub repo so the host builds for you.

**Custom domain (typical steps):**

1. **Pick a host** (any of these work well for Vite SPAs): [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), [Cloudflare Pages](https://pages.cloudflare.com/), or [GitHub Pages](https://pages.github.com/).
2. **Connect your GitHub repo** in the host’s dashboard and set:
   - **Root directory:** `permias-nasional` (if the dashboard asks for a “base directory”).
   - **Build command:** `npm run build` (from repo root, or `cd permias-nasional && npm run build` if the UI runs commands from a subfolder only — match what your host expects).
   - **Publish directory:** `permias-nasional/dist`.
3. **Add your domain** in the host: they will show you **DNS records** (often `A`/`AAAA` for `@` or `CNAME` for `www`).
4. At your **domain registrar** (where you bought the domain), create those **DNS records** exactly as the host specifies. Wait for DNS to propagate (minutes to a few hours).
5. Enable **HTTPS** in the host (usually one click once DNS is correct).

**SPA routing:** deep links like `/resources/embassies` must fall back to `index.html`. This repo includes Netlify-style config ([`permias-nasional/netlify.toml`](./permias-nasional/netlify.toml) and [`permias-nasional/public/_redirects`](./permias-nasional/public/_redirects)). On **Vercel**, the Vite preset usually handles this automatically; on **Cloudflare Pages**, turn on **“Single Page Application”** or add an equivalent redirect if direct URLs 404.

**GitHub Pages (subpath):** if the site is served from `https://username.github.io/repo-name/`, you must set Vite `base` to `/repo-name/` — ask if you need that; for a **root custom domain** (`https://yourdomain.com`) the default `base: '/'` is correct.

## Repo layout

| Path | Purpose |
|------|---------|
| `permias-nasional/` | Vite + React application |
| `permias-nasional/dist/` | Build output (ignored by git) |
| `package.json` | Workspace scripts; run `npm install` here |

## Scripts (from repo root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build → `permias-nasional/dist` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
