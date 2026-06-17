declare global {
  interface Window {
    api: {
      token: {
        store: (token: string) => Promise<void>
        get: () => Promise<string | null>
        clear: () => Promise<void>
      }
    }
  }
}

export {}
