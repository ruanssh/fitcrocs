# Fitcrocs

Monorepo com backend (NestJS + Prisma) e frontend (React + Vite).

## Docker (build de produção)

1. Crie o arquivo de ambiente na raiz:

```bash
cp .env.example .env
```

2. Ajuste as variáveis em `.env` (principalmente `DATABASE_URL` e `JWT_SECRET`).

3. Suba os serviços com build:

```bash
docker compose up --build -d
```

## Endereços

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`

## Parar serviços

```bash
docker compose down
```
