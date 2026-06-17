import { create } from 'zustand'
import { pb } from '../lib/pb'

export interface Conversation {
  id: string
  title: string
  created: string
}

interface ConversationsState {
  conversations: Conversation[]
  activeId: string | null
  loading: boolean
  error: string | null
  fetch: () => Promise<void>
  create: (title?: string) => Promise<void>
  rename: (id: string, title: string) => Promise<void>
  remove: (id: string) => Promise<void>
  setActive: (id: string | null) => void
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: [],
  activeId: null,
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null })
    try {
      const userId = pb.authStore.record?.id
      const result = await pb.collection('conversations').getList(1, 100, {
        filter: `user_id = "${userId}"`,
        sort: '-created',
      })
      set({ conversations: result.items as unknown as Conversation[], loading: false })
    } catch {
      set({ error: 'Failed to load conversations', loading: false })
    }
  },

  create: async (title = 'New conversation') => {
    try {
      const userId = pb.authStore.record?.id
      const record = await pb.collection('conversations').create({ user_id: userId, title })
      const conv: Conversation = { id: record.id, title: record['title'], created: record.created }
      set((s) => ({ conversations: [conv, ...s.conversations], activeId: conv.id }))
    } catch {
      set({ error: 'Failed to create conversation' })
    }
  },

  rename: async (id, title) => {
    try {
      await pb.collection('conversations').update(id, { title })
      set((s) => ({
        conversations: s.conversations.map((c) => (c.id === id ? { ...c, title } : c)),
      }))
    } catch {
      set({ error: 'Failed to rename conversation' })
    }
  },

  remove: async (id) => {
    try {
      await pb.collection('conversations').delete(id)
      set((s) => {
        const next = s.conversations.filter((c) => c.id !== id)
        return {
          conversations: next,
          activeId: s.activeId === id ? (next[0]?.id ?? null) : s.activeId,
        }
      })
    } catch {
      set({ error: 'Failed to delete conversation' })
    }
  },

  setActive: (id) => set({ activeId: id }),
}))
