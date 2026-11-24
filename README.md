# JanSahayak – Authentication Module

Multilingual authentication module for the EPICS rural welfare schemes platform.

**Stack:** React (Vite) · Flask · Supabase Auth · PostgreSQL · i18next

## Quick start

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run `database/schema.sql` then `database/policies.sql` in the SQL Editor.
3. Copy project URL, anon key, and service role key into `backend/.env`.

### 2. Backend

```bash
cd /home/rightman/jansahayak-auth/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in Supabase credentials
python run.py
```

API: http://localhost:5000

### 3. Frontend

```bash
cd /home/rightman/jansahayak-auth/frontend
npm install
cp .env.example .env   # optional; defaults to http://localhost:5000
npm run dev
```

App: http://localhost:5173

## Features

- Email/password signup and login via Supabase Auth
- Profiles stored in PostgreSQL (`profiles` table)
- HttpOnly cookie sessions (no tokens in localStorage)
- Logout and protected dashboard route
- Forgot-password flow
- English / Hindi / Marathi UI (i18next)

## Documentation

- [Architecture](docs/architecture.md)
- [Setup guide](docs/setup-guide.md)

## Project layout

```
jansahayak-auth/
├── frontend/     # React + Vite
├── backend/      # Flask API
├── database/     # SQL schema + RLS
└── docs/         # Architecture and setup
```

> Placeholder name **JanSahayak** can be renamed later. This is not an official government product.
