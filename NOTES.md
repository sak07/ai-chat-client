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

## Token storage

The auth token is encrypted with Electron's `safeStorage` (OS keychain-backed on Windows/Mac/Linux) and kept only in memory as an encrypted `Buffer`. It is never written to disk in plaintext and never stored in `localStorage` or `sessionStorage`.

## What I'd do next

1. **Optimistic send + rollback** — add a `pendingIds` set and roll back the user message if PocketBase save fails
2. **PocketBase subscriptions** — subscribe to `messages` collection for real-time updates across windows
3. **Light/dark theme** — CSS custom properties + a `theme` field in localStorage
4. **Error boundary** — wrap the renderer in a React error boundary so uncaught render errors don't blank the screen
5. **Proper e2e tests** — Playwright is already set up in the boilerplate; wire up login → send → restart → verify history flow

## Self-critique

- The `seed.js` uses the admin API endpoint (`/api/admins/auth-with-password`) which was deprecated in PocketBase v0.23+ in favour of superusers. Depending on the PocketBase version the reviewer uses, the seed script may need updating.
- The CSP `style-src 'unsafe-inline'` is present because Tailwind v4 injects some inline styles at build time. A stricter approach would use a nonce-based CSP, but that requires additional Vite plugin work.
- Unit tests mock both PocketBase and `window.api`, which means they test state transitions rather than the full IPC/network stack. A Playwright e2e test would cover the full path.
