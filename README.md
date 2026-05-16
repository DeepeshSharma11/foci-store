# Focistore

Frontend and backend are split into separate folders.

## Structure

- `frontend/` - Next.js wrapper for the existing static site.
- `backend/` - Node.js API with Supabase server client.
- `supabase/admin-panel/` - Supabase SQL schema for admin-managed apps/games.
- `Memory.md` - project change history.

## Setup

```bash
npm install --prefix frontend
npm install --prefix backend
Copy-Item frontend/.env.example frontend/.env
Copy-Item backend/.env.example backend/.env
```

Fill Supabase values in both `.env` files.

## Run

```bash
npm run dev:frontend
npm run dev:backend
```

Frontend: `http://localhost:3000`  
Backend health: `http://localhost:4000/health`

## Vercel Deploy

Deploy the `frontend/` folder as the Vercel project root. The backend endpoints needed on Vercel are available as Next.js API routes:

- `/api/health`
- `/api/supabase/status`

Add these Vercel environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Docker

Docker is for local/container hosting:

```bash
npm run docker:up
```

Vercel deploys the Next.js app directly, not via Docker containers.

## Auth Routes

- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/account`
- `/admin`

Allow these Supabase Auth redirect URLs during local development:

- `http://localhost:3000/account`
- `http://localhost:3000/reset-password`

Login redirects to `/admin`. Add the logged-in user to `public.admin_users` to allow admin panel access.
Public users do not need login; `/login` is only for admin access.
If an admin session already exists, `/login` redirects to `/admin`.

## Notes

- Supabase uses `@supabase/supabase-js` v2 via the latest npm package.
- Backend uses `ws` as the Supabase Realtime transport for Node.js 20.
- Frontend must use only `NEXT_PUBLIC_*` Supabase anon values.
- Backend uses `SUPABASE_SERVICE_ROLE_KEY`; never expose it in frontend code.
- Legacy links like `/index.html`, `/apps.html`, and clean links like `/apps` are supported.
- Static HTML scripts are collected from the full document so head scripts like `data.js` and `script.js` still execute in Next.
- Frontend initialization supports scripts loaded after `DOMContentLoaded`.
- `data.js` exposes `window.appData` for reliable browser access.
- `script.js` includes all startup initializer functions used by the static site wrapper.
