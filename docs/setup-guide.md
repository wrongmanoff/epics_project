# Setup Guide – JanSahayak Authentication

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- A Supabase project

## 1. Configure Supabase

1. Open your Supabase project → **Settings → API**.
2. Copy:
   - Project URL → `SUPABASE_URL`
   - `anon` `public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only)
3. Open **SQL Editor** and run, in order:
   - `database/schema.sql`
   - `database/policies.sql`
4. Auth settings (recommended for development):
   - **Authentication → Providers → Email** enabled
   - For local testing you may disable “Confirm email” temporarily, or keep it on and use the confirmation email link
5. Password reset redirect (optional):
   - Site URL: `http://localhost:5173`
   - Redirect URLs: `http://localhost:5173/login`

## 2. Backend environment

```bash
cd /home/rightman/jansahayak-auth/backend
cp .env.example .env
```

Edit `.env`:

```
FLASK_SECRET_KEY=change-me-to-a-long-random-string
FLASK_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Create venv and install:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

Health check: `curl http://localhost:5000/api/health`

## 3. Frontend environment

```bash
cd /home/rightman/jansahayak-auth/frontend
cp .env.example .env
```

`.env` (optional override):

```
VITE_API_URL=http://localhost:5000
```

```bash
npm install
npm run dev
```

Open http://localhost:5173

## 4. Connecting frontend and backend

- Frontend `authService` / `api.js` call `VITE_API_URL` with `credentials: 'include'`.
- Flask CORS allows `FRONTEND_URL` and `supports_credentials=True`.
- Cookies are set by Flask on login/signup; the browser sends them on subsequent requests.

## 5. Verify flows

1. Sign up with a new email → profile created → redirected (or shown verify-email message).
2. Log in → dashboard shows name/email.
3. Open `/dashboard` in a private window → redirected to login.
4. Log out → cookies cleared → protected route blocked.
5. Switch language to Hindi/Marathi → UI updates; refresh keeps language.

## Troubleshooting

| Issue | Check |
|-------|--------|
| CORS errors | `FRONTEND_URL` matches the Vite origin exactly |
| Cookies not set | Use `localhost` (not `127.0.0.1`) consistently, or match both |
| Signup profile missing | Service role key set; RLS policies applied |
| 401 on `/me` | Logged in? Cookies enabled? Access token expired → try refresh |
| Email confirmation | Disable confirm email in Supabase for local testing, or confirm via email |
