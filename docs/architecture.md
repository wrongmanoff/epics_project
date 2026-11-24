# Architecture – JanSahayak Authentication

## Overview

```
┌─────────────────┐     HTTPS/CORS      ┌─────────────────┐
│  React (Vite)   │ ──────────────────► │  Flask API      │
│  localhost:5173 │   credentials:true  │  localhost:5000 │
└────────┬────────┘                     └────────┬────────┘
         │                                       │
         │ i18next JSON                          │ supabase-py
         │                                       ▼
         │                              ┌─────────────────┐
         │                              │  Supabase       │
         │                              │  Auth + Postgres│
         └──────────────────────────────┴─────────────────┘
```

The browser never holds Supabase service keys. All Auth and profile operations go through Flask.

## Session strategy

1. On login/signup, Flask receives Supabase `access_token` and `refresh_token`.
2. Tokens are stored in **HttpOnly**, **SameSite=Lax** cookies (`access_token`, `refresh_token`).
3. `Secure` is enabled when `FLASK_ENV=production`.
4. `GET /api/auth/me` validates the access token with Supabase and returns the profile.
5. Logout clears cookies and optionally revokes the session server-side.
6. Refresh: if the access token is expired, `POST /api/auth/refresh` uses the refresh cookie.

Frontend authentication state comes only from successful `/api/auth/me` responses, never from localStorage tokens.

## API endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/signup` | Register user + create profile |
| POST | `/api/auth/login` | Authenticate and set cookies |
| POST | `/api/auth/logout` | Clear session cookies |
| GET | `/api/auth/me` | Current user + profile |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/forgot-password` | Send password reset email |

## Database

- **auth.users** – managed by Supabase Auth (credentials, hashing).
- **public.profiles** – application profile data linked by `id = auth.users.id`.
- RLS ensures users read/update only their own row.

Signup flow:

1. Create Auth user (anon or service client).
2. Insert profile row (service role bypasses RLS for insert after signup).
3. On profile insert failure, attempt cleanup of the Auth user when possible.

## Internationalization

`i18next` loads `en`, `hi`, and `mr` JSON files. Language preference is stored in `localStorage` key `jansahayak_lang`. All UI strings (including validation) use `t(...)`.

## Security notes

- Passwords never stored in `profiles`.
- Rate limiting on auth routes (Flask-Limiter).
- CORS restricted to `FRONTEND_URL` with credentials.
- Validation on both client and server.
- Generic error messages to avoid account enumeration where practical.
