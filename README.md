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

From the **repo root**:

```bash
npm run mobile
```

This runs the **`@rolltrack/mobile`** workspace script (`npx expo start`) with the **working directory set to `mobile/`**, so Metro picks up `mobile/app.json` and `mobile/assets`.

**Do not** run plain `npx expo start` at the repo root without a project path — it will use the wrong folder.

**Alternative:** `cd mobile && npx expo start`.

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
