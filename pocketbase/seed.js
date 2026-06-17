/**
 * PocketBase seed script.
 * Creates the `conversations` and `messages` collections if they don't exist.
 * Run: node pocketbase/seed.js
 *
 * Requires PocketBase to be running: npm run pb:start
 * Set PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD env vars.
 */

const PB_URL = process.env.PB_URL || 'http://127.0.0.1:8090'
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || 'adminpassword123'

let token = ''

async function api(path, method = 'GET', body) {
  const res = await fetch(`${PB_URL}/api/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(data)}`)
  return data
}

async function main() {
  // Try superuser auth (PocketBase v0.23+), fall back to legacy admin auth
  try {
    const auth = await api('collections/_superusers/auth-with-password', 'POST', {
      identity: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })
    token = auth.token
    console.log('✓ Authenticated as superuser')
  } catch {
    try {
      const auth = await api('admins/auth-with-password', 'POST', {
        identity: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      })
      token = auth.token
      console.log('✓ Authenticated as admin (legacy)')
    } catch (err) {
      throw new Error(`Auth failed: ${err.message}`)
    }
  }

  const existing = await api('collections', 'GET')
  const byName = Object.fromEntries(existing.items.map((c) => [c.name, c]))

  const conversationsDef = {
    name: 'conversations',
    type: 'base',
    fields: [
      { name: 'user_id', type: 'text', required: true },
      { name: 'title', type: 'text', required: true },
    ],
    listRule: '@request.auth.id = user_id',
    viewRule: '@request.auth.id = user_id',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id = user_id',
    deleteRule: '@request.auth.id = user_id',
  }

  const messagesDef = {
    name: 'messages',
    type: 'base',
    fields: [
      { name: 'conversation_id', type: 'text', required: true },
      { name: 'user_id', type: 'text', required: true },
      { name: 'role', type: 'text', required: true },
      { name: 'content', type: 'text', required: true },
    ],
    listRule: '@request.auth.id = user_id',
    viewRule: '@request.auth.id = user_id',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id = user_id',
    deleteRule: '@request.auth.id = user_id',
  }

  // Create or update conversations
  if (!byName['conversations']) {
    await api('collections', 'POST', conversationsDef)
    console.log('✓ Created conversations collection')
  } else {
    await api(`collections/${byName['conversations'].id}`, 'PATCH', {
      listRule: conversationsDef.listRule,
      viewRule: conversationsDef.viewRule,
      createRule: conversationsDef.createRule,
      updateRule: conversationsDef.updateRule,
      deleteRule: conversationsDef.deleteRule,
    })
    console.log('✓ Updated conversations collection rules')
  }

  // Create or update messages
  if (!byName['messages']) {
    await api('collections', 'POST', messagesDef)
    console.log('✓ Created messages collection')
  } else {
    await api(`collections/${byName['messages'].id}`, 'PATCH', {
      listRule: messagesDef.listRule,
      viewRule: messagesDef.viewRule,
      createRule: messagesDef.createRule,
      updateRule: messagesDef.updateRule,
      deleteRule: messagesDef.deleteRule,
    })
    console.log('✓ Updated messages collection rules')
  }

  console.log('\nDone. PocketBase schema is ready.')
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
