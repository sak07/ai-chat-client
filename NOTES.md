# NOTES

## Architecture

**Main process** (`electron/main/index.ts`)
- BrowserWindow with `contextIsolation: true`, `nodeIntegration: false`
- `safeStorage` encryption for auth token, CSP headers
- IPC handles: `token:store`, `token:get`, `token:clear`

**Preload** (`electron/preload/index.ts`)
- Exposes only `window.api.token.*` — renderer has no direct IPC access

**Renderer** (`src/`)
- `authStore` — session, login, signup, token restore
- `conversationsStore` — sidebar list, create, rename, delete, auto-select on load
- `chatStore` — messages, send, load, error handling
- PocketBase JS SDK for auth and persistence

## UI

- Light theme with a repeating SVG doodle background (chat bubbles, stars, hearts, etc.)
- Font: Plus Jakarta Sans
- Accent: orange-to-red gradient (`#f97316 → #ef4444`)
- Auth page: custom field-level validation, no native browser tooltips
- Splash screen on launch with 2s minimum display
- Confirmation dialogs before delete and sign out
- Empty states for sidebar and chat panel with a CTA

## Error handling

- All store actions catch errors and surface them inline — no app crash, no reload needed
- `loadMessages` skips for newly created conversations (ref-based guard, StrictMode-safe)
- Auth errors map HTTP status codes to human-readable messages

## Known limitations

- PocketBase binary is not committed (OS-specific, ~30 MB) — must be downloaded manually
- Mock AI server (`localhost:3010`) must be running separately for replies to work
- `style-src 'unsafe-inline'` in CSP due to Tailwind v4 inline style injection
- No real-time sync — messages do not update across multiple windows
- Unit tests mock PocketBase and `window.api`; no full e2e coverage yet

## What's next

1. Optimistic send + rollback on failure
2. PocketBase subscriptions for real-time updates
3. Auto-download PocketBase binary in `postinstall`
4. Playwright e2e: login → send → restart → verify history