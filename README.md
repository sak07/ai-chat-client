# AI Chat Desktop Client

A desktop AI chat client built with Electron, React 19, Vite, TypeScript, Zustand, and PocketBase.

## Prerequisites

- Node.js 18+
- PocketBase binary (see below)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up PocketBase

1. Download the PocketBase binary for your OS from https://pocketbase.io/docs/
2. Place it in the `pocketbase/` folder:
   - Windows: `pocketbase/pocketbase.exe`
   - Linux/Mac: `pocketbase/pocketbase`
3. Start PocketBase:
   ```bash
   npm run pb:start
   ```
4. On **first run only**, open http://127.0.0.1:8090/_/ and create an admin account.
5. Run the seed script to create the schema:
   ```bash
   # Set your admin credentials as env vars (or edit the defaults in pocketbase/seed.js)
   PB_ADMIN_EMAIL=admin@example.com PB_ADMIN_PASSWORD=adminpassword123 npm run pb:seed
   ```

### 3. Start the mock AI server

In a separate terminal:
```bash
npm run mock-ai
```

### 4. Run the app

```bash
npm run dev
```

This starts the Electron app in development mode with HMR.

## Running tests

```bash
npm test
```

## Type checking

```bash
npm run typecheck
```

## Build for production

```bash
npm run build
```

## Architecture summary

- `electron/main/index.ts` — Main process. Creates the BrowserWindow with `contextIsolation: true`, `nodeIntegration: false`. Handles `safeStorage` IPC for token encryption. Sets CSP headers.
- `electron/preload/index.ts` — Typed preload bridge. Exposes only `window.api.token.{store,get,clear}` to the renderer.
- `src/stores/` — Three focused Zustand stores: `authStore`, `conversationsStore`, `chatStore`.
- `src/lib/pb.ts` — Single PocketBase client instance.
- `mock-ai/server.js` — Tiny Node HTTP server returning echoed/canned replies.
- `pocketbase/seed.js` — Creates `conversations` and `messages` collections via PocketBase API.

## Known issues / limitations

See NOTES.md for a full self-critique.
