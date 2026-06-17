# PocketBase Setup

1. Download the PocketBase binary for your OS from https://pocketbase.io/docs/
2. Place it in this folder as `pocketbase.exe` (Windows) or `pocketbase` (Linux/Mac)
3. Start PocketBase: `npm run pb:start`
4. On first run, create an admin account at http://127.0.0.1:8090/_/
5. Run the seed script: `npm run pb:seed`
   - Set env vars if needed: `PB_ADMIN_EMAIL` and `PB_ADMIN_PASSWORD`
