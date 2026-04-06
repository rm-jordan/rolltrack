# RollTrack

Monorepo layout:

| Path | Description |
|------|-------------|
| `mobile/` | Expo + React Native app (`src/app` = Expo Router) |
| `server/` | Node GraphQL API + Prisma + SQLite |
| `packages/shared/` | Shared TypeScript types, date helpers, seed/mock data |

## Setup

```bash
npm install
```

### Mobile (Expo)

```bash
npm run mobile
```

This runs **`expo start ./mobile`** so Metro uses `mobile/app.json` and `mobile/assets` (not the repo root). Do **not** run plain `npx expo start` from the repo root — it will look for `App.tsx` and `./assets` at the root and fail.

Alternatively: `cd mobile && npx expo start`.

Always run **`npm install` from the repo root** so workspaces resolve `@rolltrack/shared`.

### Server (GraphQL)

```bash
cd server && cp .env.example .env && npm run prisma:migrate
npm run server
```

See `server/README.md` for API details.

## Development notes

- **Mobile** stores data in on-device SQLite (`mobile/src/lib/db.ts`).
- **Server** uses its own SQLite file under `server/prisma/`. They are not synced until you wire GraphQL into the app.
