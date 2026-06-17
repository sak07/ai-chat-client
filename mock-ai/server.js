/**
 * Mock AI server — returns a canned/echoed reply over plain HTTP.
 * Run: npm run mock-ai  (or: node mock-ai/server.js)
 * POST http://localhost:3001/chat  { message: string }
 * Returns: { reply: string }
 */
import http from 'node:http'

const PORT = 3010

const CANNED = [
  "That's an interesting point. Could you tell me more?",
  'I understand. Here is what I think: **every problem has a solution** if you look hard enough.',
  'Great question! Let me think about that.\n\n- First, consider the context.\n- Then, explore the options.\n- Finally, decide with confidence.',
  "I'm a mock AI assistant. I can't actually think, but I'm here to demonstrate the chat interface works end-to-end.",
  '```js\nconsole.log("Hello from the mock AI!")\n```\nThis is how you might write it in JavaScript.',
]

let idx = 0

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method !== 'POST' || req.url !== '/chat') {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'Not found' }))
    return
  }

  let body = ''
  req.on('data', (chunk) => (body += chunk))
  req.on('end', () => {
    try {
      const { message } = JSON.parse(body)
      // Echo back the message + a canned reply, rotating through responses
      const reply = `You said: *"${message}"*\n\n${CANNED[idx % CANNED.length]}`
      idx++

      // Simulate slight latency
      setTimeout(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ reply }))
      }, 600)
    } catch {
      res.writeHead(400)
      res.end(JSON.stringify({ error: 'Invalid JSON' }))
    }
  })
})

server.listen(PORT, () => {
  console.log(`Mock AI server running at http://localhost:${PORT}`)
})
