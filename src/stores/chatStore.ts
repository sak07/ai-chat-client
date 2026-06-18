import { create } from 'zustand'
import { pb } from '../lib/pb'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created: string
  pending?: boolean
  error?: boolean
}

interface ChatState {
  messages: Message[]
  sending: boolean
  error: string | null
  loadMessages: (conversationId: string) => Promise<void>
  sendMessage: (conversationId: string, content: string) => Promise<void>
  clearError: () => void
  clearMessages: () => void
}

const MOCK_AI_URL = 'http://localhost:3010/chat'

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  sending: false,
  error: null,

  loadMessages: async (conversationId) => {
    set({ messages: [], error: null })
    try {
      const userId = pb.authStore.record?.id
      const result = await pb.collection('messages').getList(1, 200, {
        filter: `conversation_id = '${conversationId}' && user_id = '${userId}'`,
        sort: 'created',
      })
      set({
        messages: result.items.map((r) => ({
          id: r.id,
          role: r['role'] as 'user' | 'assistant',
          content: r['content'],
          created: r.created,
        })),
      })
    } catch {
      set({ error: 'Failed to load messages' })
    }
  },

  sendMessage: async (conversationId, content) => {
    const userId = pb.authStore.record?.id
    if (!userId) return

    // Persist user message to PocketBase
    let userMsgId = `tmp-${Date.now()}`
    set((s) => ({
      sending: true,
      error: null,
      messages: [
        ...s.messages,
        { id: userMsgId, role: 'user', content, created: new Date().toISOString() },
      ],
    }))

    try {
      const saved = await pb.collection('messages').create({
        conversation_id: conversationId,
        user_id: userId,
        role: 'user',
        content,
      })
      userMsgId = saved.id
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id.startsWith('tmp-') ? { ...m, id: saved.id } : m,
        ),
      }))
    } catch {
      set((s) => ({
        sending: false,
        error: 'Failed to save message',
        messages: s.messages.filter((m) => m.id !== userMsgId),
      }))
      return
    }

    // Add pending assistant message as placeholder
    const pendingId = `pending-${Date.now()}`
    set((s) => ({
      messages: [
        ...s.messages,
        { id: pendingId, role: 'assistant', content: '', created: new Date().toISOString(), pending: true },
      ],
    }))

    // Call mock AI
    try {
      const res = await fetch(MOCK_AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })
      if (!res.ok) throw new Error(`Mock AI returned ${res.status}`)
      const data = await res.json()
      const reply: string = data.reply

      // Persist assistant reply
      const savedReply = await pb.collection('messages').create({
        conversation_id: conversationId,
        user_id: userId,
        role: 'assistant',
        content: reply,
      })

      set((s) => ({
        sending: false,
        messages: s.messages.map((m) =>
          m.id === pendingId
            ? { id: savedReply.id, role: 'assistant', content: reply, created: savedReply.created }
            : m,
        ),
      }))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to get AI reply'
      set((s) => ({
        sending: false,
        error: msg,
        messages: s.messages.map((m) =>
          m.id === pendingId ? { ...m, pending: false, error: true, content: 'Failed to get reply.' } : m,
        ),
      }))
    }
  },

  clearError: () => set({ error: null }),
  clearMessages: () => set({ messages: [], error: null }),
}))
