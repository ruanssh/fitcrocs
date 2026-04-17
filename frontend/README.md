# Fitcrocs Frontend

Frontend do dashboard de treinos usando React + TypeScript + Vite.

## Stack escolhida

- React 19 + TypeScript
- TanStack Query para consulta e cache de dados
- Axios para cliente HTTP
- Tailwind CSS v4 para design e sistema visual
- Recharts para ranking de exercicios
- react-activity-calendar para heatmap estilo GitHub

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Aplicacao em: `http://localhost:5173`

## Variaveis de ambiente

```env
VITE_API_BASE_URL="http://localhost:3000"
```

## Rotas

- `/login`
- `/dashboard` (protegida por JWT)

## Funcionalidades implementadas

- Login com token JWT
- Filtro por periodo mensal (`from` e `to`)
- Cards de indicadores
- Heatmap de frequencia diaria
- Grafico de exercicios mais frequentes

## Observacao de linguagem

- Interface textual sem uso de emojis.
