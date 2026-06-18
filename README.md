# AI Chat Desktop Client

A desktop AI chat client built with Electron, React 19, Vite, TypeScript, Zustand, and PocketBase.

## Prerequisites

- Node.js 18+
- PocketBase binary

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up PocketBase

1. Download the PocketBase binary from https://pocketbase.io/docs/ and place it in `pocketbase/`:
   - Windows: `pocketbase/pocketbase.exe`
   - Mac/Linux: `pocketbase/pocketbase`
2. Start PocketBase:
   ```bash
   npm run pb:start
   ```
3. First run only — open http://127.0.0.1:8090/_/ and create an admin account, then seed the schema:
   ```bash
   PB_ADMIN_EMAIL=admin@example.com PB_ADMIN_PASSWORD=adminpassword123 npm run pb:seed
   ```

### 3. Start the mock AI server

```bash
npm run mock-ai
```

### 4. Run the app

```bash
npm run dev
```

## Other commands

```bash
npm test          # run unit tests
npm run typecheck # type check
npm run build     # production build
```

## Architecture

- `electron/main/index.ts` — BrowserWindow, `safeStorage` IPC, CSP headers
- `electron/preload/index.ts` — exposes only `window.api.token.{store,get,clear}` to the renderer
- `src/stores/` — `authStore`, `conversationsStore`, `chatStore` (Zustand)
- `src/lib/pb.ts` — single PocketBase client instance
- `mock-ai/server.js` — local HTTP server returning canned AI replies
- `pocketbase/seed.js` — creates `conversations` and `messages` collections
