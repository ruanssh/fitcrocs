# Fitcrocs

Aplicacao web para registrar treinos diarios e acompanhar evolucao com dashboard.

## O que o projeto faz

- Cadastro e login com autenticacao JWT.
- Cadastro de treinos com data, horario de inicio/fim e observacoes.
- Inclusao e remocao de exercicios por treino (com ordem).
- Listagem de treinos com filtros por periodo e tela de detalhes.
- Dashboard com indicadores, ranking de exercicios e heatmap diario estilo GitHub.
- Perfil do usuario com upload/remocao de foto em Base64.

## Stack

- Backend: NestJS, Prisma, MySQL, JWT, Swagger.
- Frontend: React 19, Vite, Tailwind CSS v4, TanStack Query/Table, Recharts, react-activity-calendar.
- Idioma da interface: pt-BR (i18next).

## Estrutura do repositorio

- `backend`: API REST e regras de negocio.
- `frontend`: aplicacao web.
- `docker-compose.yml`: sobe frontend e backend em modo container.

## Pre-requisitos

- Node.js 20+
- npm
- Banco MySQL acessivel pela `DATABASE_URL`

## Executando localmente (desenvolvimento)

1. Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run dev
```

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### Variaveis de ambiente (local)

- Backend (`backend/.env`):

```env
PORT=3000
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/fitcrocs"
JWT_SECRET="fitcrocs-super-secret-change-me"
JWT_EXPIRES_IN="7d"
CORS_ALLOWED_ORIGINS="http://localhost:5173"
```

- Frontend (`frontend/.env`):

```env
VITE_API_BASE_URL="http://localhost:3000"
```

### Enderecos (local)

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`

## Executando com Docker

1. Crie o arquivo `.env` na raiz a partir do exemplo:

```bash
cp .env.example .env
```

2. Ajuste os valores (principalmente `DATABASE_URL` e `JWT_SECRET`).

3. Suba os servicos:

```bash
docker compose up --build -d
```

### Enderecos (Docker)

- Frontend: `http://localhost:4174`
- Backend: `http://localhost:3001`
- Swagger: `http://localhost:3001/docs`

Observacao: o `docker-compose.yml` atual nao sobe um container de banco; configure a `DATABASE_URL` para um MySQL externo/acessivel.

## Principais rotas da API

- Auth: `POST /auth/register`, `POST /auth/login`
- Users: `GET /users/me`, `PATCH /users/me/photo`
- Workouts: CRUD de treinos e exercicios em `/workouts`
- Dashboard: `/dashboard/summary`, `/dashboard/top-exercises`, `/dashboard/heatmap`

## Parar servicos Docker

```bash
docker compose down
```
