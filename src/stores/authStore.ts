import { create } from 'zustand'
import { pb } from '../lib/pb'

interface AuthState {
  user: { id: string; email: string } | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  restoreSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const auth = await pb.collection('users').authWithPassword(email, password)
      const token = pb.authStore.token
      await window.api.token.store(token)
      set({ user: { id: auth.record.id, email: auth.record.email }, loading: false })
    } catch (err: unknown) {
      const msg = parseError(err)
      set({ error: msg, loading: false })
    }
  },

  signup: async (email, password) => {
    set({ loading: true, error: null })
    try {
      await pb.collection('users').create({ email, password, passwordConfirm: password })
    } catch (err: unknown) {
      const msg = parseError(err)
      set({ error: msg, loading: false })
      return
    }
    try {
      const auth = await pb.collection('users').authWithPassword(email, password)
      const token = pb.authStore.token
      await window.api.token.store(token)
      set({ user: { id: auth.record.id, email: auth.record.email }, loading: false })
    } catch {
      set({
        error: 'Account created, but sign-in failed. Email verification may be required — check your inbox, or ask an admin to disable it.',
        loading: false,
      })
    }
  },

  logout: async () => {
    pb.authStore.clear()
    await window.api.token.clear()
    set({ user: null, error: null })
  },

  restoreSession: async () => {
    set({ loading: true })
    try {
      if (!window.api?.token) { set({ loading: false }); return }
      const token = await window.api.token.get()
      if (!token) {
        set({ loading: false })
        return
      }
      // Load token into PocketBase auth store (model unknown until validated)
      pb.authStore.save(token, null)
      // Validate the token is still good
      const auth = await pb.collection('users').authRefresh()
      set({ user: { id: auth.record.id, email: auth.record.email }, loading: false })
    } catch {
      // Token invalid — clear it
      pb.authStore.clear()
      await window.api.token.clear()
      set({ user: null, loading: false })
    }
  },
}))

function parseError(err: unknown): string {
  if (err && typeof err === 'object') {
    const e = err as { status?: number; message?: string; response?: { message?: string } }
    if (e.status === 0) return 'Cannot reach server. Is PocketBase running?'
    if (e.response?.message) return e.response.message
    if (e.message) return e.message
  }
  return 'Something went wrong'
}
