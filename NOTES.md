# NOTES

## Structure

The app is split into three clear layers:

**Main process** (`electron/main/index.ts`)
- Creates the BrowserWindow with `contextIsolation: true`, `nodeIntegration: false`
- Owns all privileged work: `safeStorage` encryption, CSP headers
- Exposes only three IPC handles: `token:store`, `token:get`, `token:clear`

**Preload bridge** (`electron/preload/index.ts`)
- Typed, minimal surface — `window.api.token.*` only
- Renderer cannot reach `ipcRenderer` directly

**Renderer** (`src/`)
- Three focused Zustand stores: `authStore` (session), `conversationsStore` (sidebar), `chatStore` (messages)
- PocketBase JS SDK handles auth + persistence; no custom fetch wrappers needed

## What was cut and why

**All NICE TO HAVE items were skipped** per the assignment's explicit guidance:
- Optimistic send with rollback — the send flow is synchronous enough at this scale that optimistic UI adds complexity without visible benefit in a 2-day build
- Real-time sync (PocketBase subscriptions) — adds WebSocket management and edge-case handling; not worth the risk in the time window
- Virtualised list — not needed until there are hundreds of messages
- Single-instance lock — the boilerplate already includes `app.requestSingleInstanceLock()`; focus-on-second-launch is the only missing piece and was skipped

**Bonus items skipped:**
- Light/Dark theme — no time; dark-only is consistent and clean
- OAuth login — PocketBase supports it but wiring the redirect flow in Electron is fiddly; skipped for solid core
- Auto-update — `electron-updater` is a dependency from the boilerplate but not wired up
- Error logging — errors surface in the UI; file logging not implemented

## What I'd do next

1. **Optimistic send + rollback** — add a `pendingIds` set and roll back the user message if PocketBase save fails
2. **PocketBase subscriptions** — subscribe to `messages` collection for real-time updates across windows
3. **Light/dark theme** — CSS custom properties + a `theme` field in localStorage
4. **Error boundary** — wrap the renderer in a React error boundary so uncaught render errors don't blank the screen
5. **Proper e2e tests** — Playwright is already set up in the boilerplate; wire up login → send → restart → verify history flow

## Self-critique

- **PocketBase binary is not committed.** The binary is OS-specific (~30 MB) and gitignored. The reviewer must download the correct binary for their platform from https://pocketbase.io/docs/ and place it at `pocketbase/pocketbase` (Mac/Linux) or `pocketbase/pocketbase.exe` (Windows) before running `npm run pb:start`. Once the binary is present, all schema setup is automatic via migrations — no admin UI steps required. A proper solution would add a `postinstall` script that downloads the correct binary automatically.
- The CSP `style-src 'unsafe-inline'` is present because Tailwind v4 injects some inline styles at build time. A stricter approach would use a nonce-based CSP, but that requires additional Vite plugin work.
- Unit tests mock both PocketBase and `window.api`, which means they test state transitions rather than the full IPC/network stack. A Playwright e2e test would cover the full path.
