/**
 * Starts the PocketBase server.
 * Expects the PocketBase binary at pocketbase/pocketbase.exe (Windows)
 * or pocketbase/pocketbase (Linux/Mac).
 *
 * Download from: https://pocketbase.io/docs/
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const binary =
  process.platform === 'win32'
    ? path.join(__dirname, 'pocketbase.exe')
    : path.join(__dirname, 'pocketbase')

const pb = spawn(binary, ['serve', '--http=127.0.0.1:8090'], { stdio: 'inherit' })

pb.on('error', (err) => {
  console.error('Failed to start PocketBase:', err.message)
  console.error('Download the binary from https://pocketbase.io/docs/ and place it in pocketbase/')
  process.exit(1)
})

pb.on('exit', (code) => process.exit(code ?? 0))
