import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Unit tests for chatStore send/persist logic
// These tests exercise the store's state transitions without hitting the
// real PocketBase or mock-AI server.
// ---------------------------------------------------------------------------

// Stub the PocketBase singleton before importing the store
vi.mock('../src/lib/pb', () => ({
  pb: {
    authStore: { record: { id: 'user-1' } },
    autoCancellation: vi.fn(),
    collection: vi.fn(),
  },
}))

// Stub window.api (normally injected by the Electron preload)
Object.defineProperty(globalThis, 'window', {
  value: {
    api: {
      token: {
        store: vi.fn(),
        get: vi.fn().mockResolvedValue(null),
        clear: vi.fn(),
      },
    },
  },
  writable: true,
})

import { pb } from '../src/lib/pb'
import { useChatStore } from '../src/stores/chatStore'

function makePbCollection(overrides: Record<string, unknown> = {}) {
  return {
    getList: vi.fn().mockResolvedValue({ items: [] }),
    create: vi.fn().mockResolvedValue({
      id: 'msg-1',
      created: new Date().toISOString(),
      ...overrides,
    }),
    ...overrides,
  }
}

beforeEach(() => {
  useChatStore.setState({ messages: [], sending: false, error: null })
})

describe('chatStore – loadMessages', () => {
  it('populates messages from PocketBase', async () => {
    const mockMsg = { id: 'm1', role: 'user', content: 'hello', created: '2024-01-01T00:00:00Z' }
    vi.mocked(pb.collection).mockReturnValue({
      ...makePbCollection(),
      getList: vi.fn().mockResolvedValue({ items: [mockMsg] }),
    } as ReturnType<typeof makePbCollection>)

    await useChatStore.getState().loadMessages('conv-1')
    const { messages } = useChatStore.getState()

    expect(messages).toHaveLength(1)
    expect(messages[0].content).toBe('hello')
    expect(messages[0].role).toBe('user')
  })

  it('sets error when PocketBase throws', async () => {
    vi.mocked(pb.collection).mockReturnValue({
      ...makePbCollection(),
      getList: vi.fn().mockRejectedValue(new Error('network')),
    } as ReturnType<typeof makePbCollection>)

    await useChatStore.getState().loadMessages('conv-1')
    expect(useChatStore.getState().error).toBe('Failed to load messages')
  })
})

describe('chatStore – sendMessage', () => {
  it('adds user message optimistically then adds assistant reply', async () => {
    const createMock = vi
      .fn()
      .mockResolvedValueOnce({ id: 'user-msg', created: new Date().toISOString() })
      .mockResolvedValueOnce({ id: 'ai-msg', created: new Date().toISOString() })

    vi.mocked(pb.collection).mockReturnValue({ create: createMock } as unknown as ReturnType<typeof pb.collection>)

    // Mock fetch (mock AI)
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ reply: 'Hello from AI' }),
    } as Response)

    await useChatStore.getState().sendMessage('conv-1', 'test message')

    const { messages, sending, error } = useChatStore.getState()
    expect(error).toBeNull()
    expect(sending).toBe(false)
    expect(messages.some((m) => m.role === 'user' && m.content === 'test message')).toBe(true)
    expect(messages.some((m) => m.role === 'assistant' && m.content === 'Hello from AI')).toBe(true)
  })

  it('shows error and stays usable when mock AI fails', async () => {
    vi.mocked(pb.collection).mockReturnValue({
      create: vi.fn().mockResolvedValue({ id: 'user-msg', created: new Date().toISOString() }),
    } as unknown as ReturnType<typeof pb.collection>)

    global.fetch = vi.fn().mockRejectedValue(new Error('connection refused'))

    await useChatStore.getState().sendMessage('conv-1', 'failing message')

    const { error, sending } = useChatStore.getState()
    expect(sending).toBe(false)
    expect(error).toBeTruthy()
  })

  it('clearError resets the error field', () => {
    useChatStore.setState({ error: 'some error' })
    useChatStore.getState().clearError()
    expect(useChatStore.getState().error).toBeNull()
  })
})
