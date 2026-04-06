# RollTrack API (local GraphQL + Prisma)

Separate **Node/TypeScript** process from the Expo app. Uses **GraphQL** (`@apollo/server`) and **Prisma** with **SQLite** (`prisma/dev.db`).

The Expo UI still uses its **own** SQLite file on-device (`lib/db.ts`) until you wire the client to this API.

## Setup

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed   # optional: reloads seed from ../lib/mockData.ts
npm run dev
```

Default URL: **http://localhost:4000/** (GraphQL HTTP; no UI playground unless you add one).

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

## Scripts

| Script            | Purpose                |
|-------------------|------------------------|
| `npm run dev`     | `tsx watch src/server.ts` |
| `npm run build`   | Compile to `dist/`     |
| `npm start`       | Run compiled server    |
| `npx prisma studio` | Browse SQLite DB     |

## Connecting the React Native app

Point the client at your machine’s IP (not `localhost` on a physical device). Example env for Expo: `EXPO_PUBLIC_GRAPHQL_URL=http://192.168.x.x:4000/graphql` — then use `fetch` or Apollo Client against that URL. (Apollo Server 4 default path is `/` for POST; adjust if you add a path prefix.)
