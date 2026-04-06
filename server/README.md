# RollTrack API (local GraphQL + Prisma)

Separate **Node/TypeScript** process from the Expo app. Uses **GraphQL** (`@apollo/server`) and **Prisma** with **SQLite** (`prisma/dev.db`).

Source layout: `src/graphql`, `src/resolvers`, `src/lib` (Prisma client), plus optional `services/`, `repositories/`, etc.

The mobile app still uses its **own** SQLite file (`mobile/src/lib/db.ts`) until you wire the client to this API.

## Setup

From the **repo root** (workspaces):

```bash
npm install
cd server
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Seed data comes from `@rolltrack/shared` (same as the app’s mock catalog).

Default URL: **http://localhost:4000/** (GraphQL HTTP POST at `/`).

## Example query

```bash
curl -s http://localhost:4000/ \
  -H 'content-type: application/json' \
  -d '{"query":"{ health techniques { id name } }"}' | jq
```

## Example mutation

```bash
curl -s http://localhost:4000/ \
  -H 'content-type: application/json' \
  -d '{"query":"mutation($input: CreateSessionLogInput!){ createSessionLog(input:$input){ id date notes } }","variables":{"input":{"date":"2026-04-06","giType":"Gi","sessionType":"Class","techniquesPracticed":[],"notes":"Test from curl"}}}' | jq
```

## Connecting the mobile app

Point the client at your machine’s IP (not `localhost` on a physical device). Example: `EXPO_PUBLIC_GRAPHQL_URL=http://192.168.x.x:4000/` — then use `fetch` or Apollo Client.
