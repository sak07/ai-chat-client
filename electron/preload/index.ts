import { contextBridge, ipcRenderer } from 'electron'

// Typed bridge — renderer talks to privileged main-process APIs only through these methods.
// nodeIntegration is off; contextIsolation is on (default).
const api = {
  token: {
    store: (token: string): Promise<void> => ipcRenderer.invoke('token:store', token),
    get: (): Promise<string | null> => ipcRenderer.invoke('token:get'),
    clear: (): Promise<void> => ipcRenderer.invoke('token:clear'),
  },
}

contextBridge.exposeInMainWorld('api', api)

// --------- Loading splash (original boilerplate) ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) resolve(true)
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) parent.appendChild(child)
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) parent.removeChild(child)
  },
}

function useLoading() {
  const styleContent = `
    .app-loading-wrap { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      display: flex; align-items: center; justify-content: center; background: #0f172a; z-index: 9; }
    .app-loading-wrap .spinner { width: 40px; height: 40px; border: 3px solid #334155;
      border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')
  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="spinner"></div>`
  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)
window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading()
}
setTimeout(removeLoading, 4999)
