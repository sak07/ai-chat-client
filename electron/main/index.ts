import { app, BrowserWindow, shell, ipcMain, safeStorage, session } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

if (process.platform === 'win32' && os.release().startsWith('6.1')) app.disableHardwareAcceleration()
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

// Single-instance lock
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Encrypted token storage — safeStorage encrypts, persisted to userData so it survives restarts.
// The file contains opaque encrypted bytes; it is never plaintext on disk.
const TOKEN_FILE = path.join(app.getPath('userData'), 'session.enc')
let encryptedToken: Buffer | null = (() => {
  try { return fs.existsSync(TOKEN_FILE) ? fs.readFileSync(TOKEN_FILE) : null } catch { return null }
})()

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.cjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'AI Chat',
    width: 1100,
    height: 720,
    minWidth: 800,
    minHeight: 560,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload,
      contextIsolation: true,   // REQUIRED — keeps renderer isolated
      nodeIntegration: false,   // REQUIRED — no Node in renderer
      sandbox: false,           // needed so preload can use ipcRenderer
    },
  })

  // Set Content Security Policy in production only.
  // Dev mode is exempt because Vite HMR injects inline scripts we don't control.
  if (!VITE_DEV_SERVER_URL) {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; " +
            "script-src 'self'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "connect-src 'self' http://localhost:8090 http://localhost:3010 ws://localhost:*; " +
            "img-src 'self' data:; " +
            "font-src 'self' data:;"
          ],
        },
      })
    })
  }

  win.once('ready-to-show', () => win?.show())

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

}

// ── IPC: safeStorage token handlers ──────────────────────────────────────────

ipcMain.handle('token:store', (_event, token: string) => {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('safeStorage encryption not available')
  }
  encryptedToken = safeStorage.encryptString(token)
  fs.writeFileSync(TOKEN_FILE, encryptedToken)
})

ipcMain.handle('token:get', () => {
  if (!encryptedToken || !safeStorage.isEncryptionAvailable()) return null
  try {
    return safeStorage.decryptString(encryptedToken)
  } catch {
    return null
  }
})

ipcMain.handle('token:clear', () => {
  encryptedToken = null
  try { fs.unlinkSync(TOKEN_FILE) } catch { /* already gone */ }
})

// ── App lifecycle ─────────────────────────────────────────────────────────────

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) allWindows[0].focus()
  else createWindow()
})
