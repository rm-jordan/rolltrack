# RollTrack

Monorepo layout:

| Path | Description |
|------|-------------|
| `mobile/` | Expo + React Native app (`src/app` = Expo Router), NativeWind + Tailwind, Zustand |
| `server/` | Node GraphQL API + Prisma + SQLite |
| `packages/shared/` | Shared TypeScript types, date helpers, seed data for Prisma |

## Setup

```bash
npm install
```

Always run **`npm install` from the repo root** so workspaces resolve `@rolltrack/shared`.

### Mobile (Expo)

The app loads **techniques and session logs from the GraphQL API** (`mobile/src/services/graphql.ts` → Zustand store). There is **no on-device SQLite** in the current app; data in memory is refetched when the app starts (see `mobile/src/app/_layout.tsx`).

**1. API URL**

Copy `mobile/.env.example` to `mobile/.env` and set:

```bash
EXPO_PUBLIC_GRAPHQL_URL=http://127.0.0.1:4000
```

- **iOS Simulator**: `127.0.0.1` or `localhost` is usually fine.
- **Android emulator**: use `http://10.0.2.2:4000` to reach the host machine.
- **Physical device**: use your computer’s LAN IP (e.g. `http://192.168.x.x:4000`); the device must reach that URL.

**2. Start Metro from the `mobile/` working directory**

NativeWind and Metro resolve paths like `./global.css` and Tailwind `content` globs using **`process.cwd()`**. The supported flows keep **cwd = `mobile/`**:

| Command | When |
|--------|------|
| `npm start` | Recommended from repo root |
| `npm run start:clear` | Same, with `--clear` (use after config / dependency changes) |
| `npm run mobile` | Alias for `npm start` |
| `npm run ios` / `npm run android` / `npm run web` | Platform shortcuts from repo root |
| `cd mobile && npx expo start` | Manual equivalent |

**Avoid** starting Expo from the **repo root** with something like `npx expo start ./mobile` while cwd stays the monorepo root: that breaks NativeWind/Tailwind because relative paths no longer point at `mobile/`.

**Do not** run plain `npx expo start` at the repo root without changing into `mobile/`—the wrong project root is used.

### Server (GraphQL)

From the **repo root**:

```bash
npm run server
```

First-time server setup (from `server/`):

```bash
cd server && cp .env.example .env && npm run prisma:migrate && npx prisma db seed
```

The API uses port **4000** by default; the process prints the exact URL (GraphQL HTTP POST at `/`). Details and `curl` examples: **`server/README.md`**.

## Root npm scripts

| Script | Purpose |
|--------|---------|
| `npm start` / `npm run mobile` | Expo dev server (cwd `mobile/`) |
| `npm run start:clear` | Expo with `--clear` |
| `npm run ios` / `android` / `web` | Expo for that platform |
| `npm run server` | GraphQL API in watch mode |
| `npm run lint` | Lint the mobile workspace |

## Development notes

- **Mobile** talks to the **server** over GraphQL only; session CRUD and technique CRUD go through the API.
- **Server** persists to **`server/prisma/`** (SQLite). Restart the mobile app after changing server data if you need a fresh fetch.
- **Styling**: NativeWind v4 + Tailwind; Babel uses `jsxImportSource: "nativewind"` with `nativewind/babel` (see `mobile/babel.config.js`).
