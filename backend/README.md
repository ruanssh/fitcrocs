# FITCROCS Backend

API em NestJS + Prisma + MySQL para registrar treinos diarios.

## Stack

- NestJS
- TypeScript
- Prisma + MySQL
- JWT (login)
- Swagger

## Rodando local

```bash
npm install
npm run prisma:generate
npm run start:dev
```

Swagger: `http://localhost:3000/docs`

## Variaveis de ambiente

Arquivo `.env`:

```env
PORT=3000
DATABASE_URL="mysql://USER:PASSWORD:3306/fitcrocs"
JWT_SECRET="fitcrocs-super-secret-change-me"
JWT_EXPIRES_IN="7d"
```

## Rotas principais

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Users

- `GET /users/me` (JWT)

### Workouts (JWT)

- `POST /workouts`
- `GET /workouts`
- `GET /workouts/:id`
- `PATCH /workouts/:id`
- `DELETE /workouts/:id`
- `POST /workouts/:id/exercises`
- `PATCH /workouts/:id/exercises/:exerciseId`
- `DELETE /workouts/:id/exercises/:exerciseId`

### Dashboard (JWT)

- `GET /dashboard/summary?from=YYYY-MM&to=YYYY-MM`
- `GET /dashboard/top-exercises?from=YYYY-MM&to=YYYY-MM&limit=10`
- `GET /dashboard/heatmap?from=YYYY-MM&to=YYYY-MM`
