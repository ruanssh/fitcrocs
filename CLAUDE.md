# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Fitcrocs is a workout-tracking web app: users log daily workouts (with exercises, start/end times, notes) and view a dashboard with KPIs, a top-exercises ranking, and a GitHub-style daily heatmap. UI language is pt-BR (i18next); the codebase itself (identifiers, comments) is in English.

Two independent apps in one repo, no shared package/workspace tooling:
- `backend`: NestJS + Prisma + MySQL (MariaDB driver) REST API.
- `frontend`: React 19 + Vite + TypeScript SPA.

## Commands

Backend (run from `backend/`):
```bash
npm run prisma:generate   # regenerate Prisma client after schema.prisma changes
npm run dev               # nest start --watch
npm run build              # nest build
npm run lint                # eslint --fix
npm run format               # prettier --write
npm test                      # jest (unit specs, *.spec.ts, colocated with source under src/)
npm test -- app.controller      # run a single spec by name pattern
npm run test:watch
npm run test:cov
npm run test:e2e             # jest -c test/jest-e2e.json (test/*.e2e-spec.ts)
npm run prisma:migrate       # prisma migrate dev
```

Frontend (run from `frontend/`):
```bash
npm run dev       # vite dev server (http://localhost:5173)
npm run build      # tsc -b && vite build
npm run lint        # eslint .
npm run preview      # preview production build
```
There is no frontend test runner configured.

Docker (from repo root, `.env` created from `.env.example`):
```bash
docker compose up --build -d   # backend on :3001, frontend on :4174
docker compose down
```
Note: `docker-compose.yml` does not run a MySQL container — `DATABASE_URL` must point at an external/reachable MySQL instance in both local and Docker setups.

## Backend architecture

NestJS modules under `backend/src/modules/`, one per domain: `auth`, `users`, `workouts`, `dashboard`. Each follows the same shape: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/*.dto.ts` (class-validator, since `ValidationPipe` is global with `whitelist`/`forbidNonWhitelisted`/`transform` in `main.ts`).

- **Auth**: JWT via `@nestjs/passport` + `passport-jwt`. `JwtStrategy` (`modules/auth/jwt.strategy.ts`) validates the token and returns the raw payload (`{ sub, email, name }`) as `req.user` — there's no DB lookup per request. Guard routes with `@UseGuards(JwtAuthGuard)` + `@Req() req: AuthenticatedRequest`, then pass `BigInt(req.user.sub)` as the user id into service calls. This pattern is repeated verbatim in every controller (see `workouts.controller.ts`).
- **Prisma**: `PrismaService` (`backend/src/prisma/prisma.service.ts`) extends `PrismaClient`, manually building a `PrismaMariaDb` adapter from the parsed `DATABASE_URL` (not Prisma's default connection string handling) and connecting `onModuleInit`. All IDs are `BigInt` (`@db.UnsignedBigInt`); `main.ts` patches `BigInt.prototype.toJSON` globally so responses serialize correctly. Controllers convert incoming string route params/DTO ids to `BigInt` before calling services.
- **Ownership checks**: services scope every read/write to the authenticated `userId` (e.g. `ensureWorkoutOwner` in `workouts.service.ts` before mutating a workout or its exercises) and throw `NotFoundException` rather than a 403 when a resource isn't owned by the caller — don't leak existence of other users' resources.
- **Schema** (`backend/prisma/schema.prisma`): `User` 1—N `Workout` 1—N `WorkoutExercise` (cascade delete both levels). `WorkoutExercise.orderIndex` is manually maintained by callers (defaults to `count+1` on insert; see `addExercise`).
- Global request body limit is 12mb (base64 photo uploads go through `PATCH /users/me/photo`, stored as `photoBase64` `LongText` — no file storage/CDN).
- Swagger is generated from decorators and served at `/docs`; CORS origins come from the comma-separated `CORS_ALLOWED_ORIGINS` env var (falls back to allow-all if unset).

## Frontend architecture

Layered by responsibility, not by feature, under `frontend/src/`:
- `services/*.service.ts` — thin wrappers around the shared `http` (axios) client, one function per endpoint, typed with `types/*.ts`.
- `hooks/use-*.ts` — TanStack Query hooks wrapping services (`useQuery`/`useMutation`), owning cache keys and invalidation. Query keys are arrays like `['workouts', 'list', filters]` / `['workouts', 'detail', id]`; mutations invalidate the relevant list/detail keys on success.
- `pages/*-page.tsx` — route-level components composing hooks + components.
- `components/` — presentational pieces, grouped by area (e.g. `components/dashboard/`).
- `auth/AuthContext.tsx` — holds token + user in React state (token persisted via `api/token.ts`), bootstraps by calling `getMe()` on load if a token exists, and clears it on failure. `ProtectedRoute` gates the authenticated route tree in `App.tsx`.
- `api/http.ts` — single axios instance; a request interceptor attaches `Authorization: Bearer <token>` from `api/token.ts`. Base URL comes from `config/env.ts` (`VITE_API_BASE_URL`).
- `i18n/` — all UI strings live in `i18n/locales/pt-BR/*.ts`, split into namespaces (`common`, `auth`, `dashboard`, `workouts`, `errors`) registered in `i18n/index.ts`. Only `pt-BR` is supported/detected; add new strings to the matching namespace file rather than inlining text in components.
- Routing (`App.tsx`): `/login`, `/register` are public; everything else is nested under `ProtectedRoute` + `AppLayout`, including a catch-all redirect to `/dashboard`.

Styling is Tailwind CSS v4 (`@tailwindcss/vite` plugin, no separate config file — v4 uses CSS-based config in `index.css`). Charts: Recharts (top-exercises ranking) and `react-activity-calendar` (heatmap). No emojis in UI copy (stated project convention).
