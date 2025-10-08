# Clinic Assistant

Clinic Assistant is a modern, role‑based clinic management app that streamlines patient intake, visit queues, and prescriptions. It uses Next.js 15 (App Router) and React 19 with credential authentication via NextAuth, a Prisma adapter on MongoDB, multilingual UX (English/Arabic) via next‑intl, and a responsive, accessible UI with Tailwind CSS and Radix UI.

## Features

- Patient management: create, list, search, and count patients
- Visit queue: assign queue order, track visit status (pending/in‑progress/completed)
- Prescriptions: record doctor notes and content, optional SMS flag
- Authentication: credentials login with role propagation in JWT/session
- Role‑based areas: `RECEPTION`, `DOCTOR`, `ADMIN`
- Internationalization: `en` and `ar` locales with RTL support
- Modern UI: Tailwind v4, Radix primitives, shadcn‑style components

## Tech Stack

- Next.js 15, React 19
- NextAuth v5 (credentials), `@auth/prisma-adapter`
- Prisma v6, MongoDB datasource
- next‑intl for i18n
- Tailwind CSS v4, Radix UI, Lucide icons
- Zustand state management, TanStack Table for data grids

## Project Structure

- `app/` – App Router pages and API routes
  - `app/api/` – REST endpoints for auth, patients, doctor queue, prescriptions, visits
  - `app/(auth)` and `app/(dashboard)` – routed UI sections
- `components/` – UI, layout, dialogs, tables, providers
- `lib/` – auth and shared utilities
- `prisma/` – Prisma schema
- `messages/` – i18n message catalogs (`en`, `ar`)
- `hooks/` – client hooks (language switch, data fetching)

## Environment

Create an `.env.local` file with the following variables:

```env
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"
NEXTAUTH_SECRET="your-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Getting Started

1. Install dependencies
   ```bash
   pnpm install # or yarn install / npm install
   ```
2. Generate Prisma client and push schema to MongoDB
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```
3. Run the dev server
   ```bash
   pnpm dev # or yarn dev / npm run dev
   ```
4. Open `http://localhost:3000`

## Authentication

- Credentials provider (email/password). New users can sign up via the sign‑up page.
- Roles are attached to JWT and mirrored to session for client access.

## Internationalization

- Implemented via `next-intl`, with locale middleware and message catalogs in `messages/`.
- Arabic is RTL‑aware and the UI adapts accordingly.

## Key API Endpoints (App Router)

- Auth: `app/api/auth/[...nextauth]/route.ts`
- Patients: `app/api/patients` (CRUD, count, search)
- Doctor queue: `app/api/doctor/queue`
- Prescriptions: `app/api/prescriptions`
- Visits: `app/api/visit`

## Scripts

- `dev` – start development server
- `build` – create production build
- `start` – run production server
- `lint` – run lints

## Deployment

- Recommended: Vercel. Set `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` in project settings.
- Ensure MongoDB network access allows Vercel egress IPs or use Atlas.

## Notes

- The Prisma schema targets MongoDB; `prisma db push` is used instead of migrations.
- Sensitive data (secrets, connection strings) must not be committed.
