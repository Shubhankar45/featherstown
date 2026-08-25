# Deploying FeatherTown to Render

This project is **one deployable app**: the Express backend (`/backend`) serves the
API **and** the built React frontend (`/frontend/dist`) as static files. So you deploy
a **single Render Web Service** that (1) builds the frontend and (2) runs the backend.

```
Repo root
├── backend/      ← Express 5 server (also serves the frontend build)
│   ├── server.js         start = node server.js
│   ├── templates/welcome_email.html
│   └── .env.example      ← all env vars documented here
└── frontend/     ← Vite 8 + React 19  (build output → frontend/dist)
```

---

## Prerequisites

1. **GitHub repo** – push this project to GitHub (Render deploys from a repo).
2. **MongoDB Atlas** – a free cluster + connection string (`MONGO_URI`).
3. **Email mailbox** – SMTP credentials for `support@feathertown.online`
   (Hostinger / Zoho / Namecheap Private Email / Google Workspace, etc.).

---

## Step 1 — Push the code to GitHub

```bash
git add .
git commit -m "Update welcome-email automation + on-brand template"
git push origin main
```

> Make sure `backend/.env` is **NOT** committed (it should be in `.gitignore`).
> Real secrets go in the Render dashboard, never in git.

---

## Step 2 — MongoDB Atlas

1. Create a **free M0 cluster** (if you don't have one).
2. **Database Access** → add a user with a username + password.
3. **Network Access** → **Add IP Address** → **Allow access from anywhere**
   (`0.0.0.0/0`).
   *Why:* Render's web services don't have a fixed outbound IP on the standard
   plans, so a specific allowlist entry won't work. Access is still protected by
   your database username/password.
4. **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/feathertown?retryWrites=true&w=majority
   ```
   Replace `USER`/`PASSWORD`, and add the db name (`feathertown`) before the `?`.
   This is your `MONGO_URI`.

---

## Step 3 — Create the Render Web Service

In the Render dashboard: **New → Web Service** → connect your GitHub repo, then set:

| Setting | Value |
|---|---|
| **Name** | `feathertown` (anything) |
| **Language / Runtime** | `Node` |
| **Branch** | `main` |
| **Root Directory** | *(leave blank — build needs both `frontend` and `backend`)* |
| **Build Command** | `cd frontend && npm install --include=dev && npm run build && cd ../backend && npm install` |
| **Start Command** | `cd backend && npm start` |
| **Instance Type** | Free is fine to start (note: free instances sleep when idle) |

**Health Check Path** (under *Advanced* / *Settings → Health Checks*): `/api/health`
The server exposes this and returns `{ "status": "OK" }`.

### Why the build command looks like that

- `npm install --include=dev` in **frontend** is required: `vite` is a *devDependency*,
  and because you set `NODE_ENV=production` (Step 4), a plain `npm install` would
  **skip** it and `vite build` would fail. `--include=dev` forces it to install.
- The backend `npm install` skips its only devDependency (`nodemon`) under
  production — that's fine, production runs `node server.js`.
- `frontend/npm run build` outputs to `frontend/dist`, exactly where
  `server.js` looks (`path.join(__dirname, "../frontend/dist")`).

---

## Step 4 — Environment variables

In the service's **Environment** tab, add these (from `backend/.env.example`):

| Key | Value | Notes |
|---|---|---|
| `MONGO_URI` | `mongodb+srv://…` | **Required.** From Step 2. |
| `NODE_ENV` | `production` | |
| `NODE_VERSION` | `22.12.0` | Recommended — Vite 8 needs Node ≥ 20.19 or ≥ 22.12. |
| `MAIL_HOST` | `smtp.hostinger.com` | Your provider's SMTP host. |
| `MAIL_PORT` | `465` | 465 = SSL. (Use `587` for STARTTLS.) |
| `MAIL_SECURE` | `true` | Set `false` if you use port `587`. |
| `MAIL_USER` | `support@feathertown.online` | Full mailbox address. |
| `MAIL_PASS` | *your mailbox password* | Keep secret. |
| `MAIL_FROM_NAME` | `FeatherTown 🦜` | Optional — inbox display name. |
| `MAIL_FROM` | *(omit)* | Optional. Only set if your provider allows send-as aliases; otherwise it defaults to `MAIL_USER`. |

> **Do NOT set `PORT`.** Render injects its own `PORT` and `server.js` reads it
> automatically (`process.env.PORT || 5000`).

Common SMTP hosts: Hostinger `smtp.hostinger.com` · Zoho `smtp.zoho.com`
(or `smtp.zoho.in`) · Namecheap `mail.privateemail.com` · Google Workspace
`smtp.gmail.com`.

---

## Step 5 — Deploy & verify

Click **Create Web Service**. Render will build then start. Watch the **Logs** for:

```
✅ MongoDB connected            (or similar from config/db.js)
✅ Mail Ready (host: …, port: 465, secure: true)
✅ Email template loaded
🚀 Server running on port 10000 (production)
```

Then test:

- Open your Render URL (e.g. `https://feathertown.onrender.com`) — the site loads.
- Visit `…/api/health` — you should see `{"status":"OK", ...}`.
- Enter an email in the newsletter box → you get **one** welcome email.

If mail is misconfigured you'll instead see `⚠️ Mail disabled (env missing)` or
`❌ Mail Error: …` in the logs — the site still works, just no email is sent.

---

## Step 6 — Custom domain (feathertown.online)

1. Render → your service → **Settings → Custom Domains → Add**. Add
   `feathertown.online` and `www.feathertown.online`.
2. Update DNS at your registrar with the CNAME/A records Render shows you.
3. Render auto-provisions HTTPS.

**CORS is already configured** in `server.js` for `feathertown.online`,
`www.feathertown.online`, and `featherstown-y1cy.onrender.com`. If your Render
subdomain is different, add it to the `allowedOrigins` array in `server.js`.

---

## Step 7 — Email deliverability (so welcome mail doesn't hit spam)

Set these DNS records for `feathertown.online` (usually in your email provider's panel):

- **SPF** – a TXT record authorizing your provider's servers, e.g. Hostinger:
  `v=spf1 include:_spf.hostinger.com ~all` (use your provider's exact value).
- **DKIM** – enable DKIM in the mail provider and add the TXT/CNAME key it gives you.
- **DMARC** *(optional but recommended)* – TXT at `_dmarc`:
  `v=DMARC1; p=none; rua=mailto:support@feathertown.online`.

Notes on ports: Render allows outbound SMTP on **465** and **587** (port 25 is
blocked). If sending ever hangs, switch to `MAIL_PORT=587` + `MAIL_SECURE=false`.

---

## How the email automation works now

- Exactly **one** welcome email per **new** subscriber. Repeat/known emails get
  "Already subscribed" and **no** email.
- Sent **after** the HTTP response (fire-and-forget) so the user never waits on SMTP.
- Uses the branded template at `backend/templates/welcome_email.html`, a plain-text
  fallback, a friendly From name, a Reply-To, and a `List-Unsubscribe` header.

> ⚠️ The template is **cached at startup**. If you edit `welcome_email.html`,
> **redeploy** (or restart) so the change is picked up.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Build fails on `vite: not found` | Ensure build command uses `npm install --include=dev` in `frontend`. |
| `Frontend build not found` in browser | The build step didn't run / `frontend/dist` missing — check the Build Command. |
| `❌ Missing required environment variables: MONGO_URI` | Add `MONGO_URI` in the Environment tab. |
| DB connection timeout | Atlas Network Access must allow `0.0.0.0/0`. |
| `⚠️ Mail disabled (env missing)` | One of `MAIL_HOST` / `MAIL_USER` / `MAIL_PASS` is unset. |
| Email works locally, not on Render | Use port 465 or 587 (not 25); double-check `MAIL_PASS`. |
| Emails land in spam | Add SPF + DKIM (Step 7). |

---

## Local development (for reference)

```bash
# backend
cd backend
cp .env.example .env      # then fill in real values
npm install
npm run dev               # nodemon on http://localhost:5000

# frontend (separate terminal)
cd frontend
npm install
npm run dev               # vite on http://localhost:5173
```
