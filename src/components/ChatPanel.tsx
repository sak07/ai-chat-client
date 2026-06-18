import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import { useConversationsStore } from '../stores/conversationsStore'
import { useChatStore } from '../stores/chatStore'

const DOODLE_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M15 10 Q15 6 19 6 L31 6 Q35 6 35 10 L35 18 Q35 22 31 22 L22 22 L18 26 L18 22 L19 22 Q15 22 15 18 Z' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.12'/%3E%3Cpolygon points='80,8 81.8,13.5 87.5,13.5 83,17 84.8,22.5 80,19 75.2,22.5 77,17 72.5,13.5 78.2,13.5' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.1'/%3E%3Cpath d='M155 14 C155 11 152 8 149 10 C146 8 143 11 143 14 C143 20 149 24 149 24 C149 24 155 20 155 14 Z' fill='none' stroke='%237c3aed' stroke-width='1.2' opacity='0.1'/%3E%3Cpath d='M178 6 L173 15 L177 15 L172 26 L181 13 L177 13 Z' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.1'/%3E%3Ccircle cx='60' cy='40' r='4' fill='none' stroke='%237c3aed' stroke-width='1.2' opacity='0.12'/%3E%3Ccircle cx='120' cy='35' r='3' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.1'/%3E%3Ccircle cx='190' cy='20' r='2.5' fill='%234f46e5' opacity='0.09'/%3E%3Cpath d='M5 55 Q15 48 25 55 Q35 62 45 55 Q55 48 65 55' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.09'/%3E%3Ccircle cx='100' cy='60' r='2' fill='%237c3aed' opacity='0.12'/%3E%3Ccircle cx='107' cy='60' r='2' fill='%237c3aed' opacity='0.12'/%3E%3Ccircle cx='114' cy='60' r='2' fill='%237c3aed' opacity='0.12'/%3E%3Cpath d='M165 45 L172 52 L165 59 L158 52 Z' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.1'/%3E%3Cpath d='M38 80 L38 92 M32 86 L44 86' stroke='%234f46e5' stroke-width='1.5' stroke-linecap='round' opacity='0.1'/%3E%3Cpath d='M185 75 L185 83 M181 79 L189 79' stroke='%237c3aed' stroke-width='1.5' stroke-linecap='round' opacity='0.09'/%3E%3Cpath d='M130 75 Q130 72 133 72 L143 72 Q146 72 146 75 L146 81 Q146 84 143 84 L137 84 L135 87 L135 84 Q130 84 130 81 Z' fill='none' stroke='%237c3aed' stroke-width='1.2' opacity='0.1'/%3E%3Cpath d='M5 110 L15 100 L25 110 L35 100 L45 110' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.08'/%3E%3Cpath d='M80 100 A12 12 0 1 0 80 124 A8 8 0 1 1 80 100 Z' fill='none' stroke='%237c3aed' stroke-width='1.2' opacity='0.1'/%3E%3Ccircle cx='170' cy='105' r='2.5' fill='%234f46e5' opacity='0.1'/%3E%3Ccircle cx='160' cy='115' r='1.5' fill='%237c3aed' opacity='0.09'/%3E%3Ccircle cx='180' cy='118' r='2' fill='%234f46e5' opacity='0.08'/%3E%3Cpath d='M110 110 L125 110 M120 105 L125 110 L120 115' fill='none' stroke='%234f46e5' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' opacity='0.1'/%3E%3Cpath d='M50 145 L52 140 L54 145 L59 147 L54 149 L52 154 L50 149 L45 147 Z' fill='none' stroke='%237c3aed' stroke-width='1.2' opacity='0.11'/%3E%3Cpath d='M140 140 Q140 136 144 136 L158 136 Q162 136 162 140 L162 150 Q162 154 158 154 L148 154 L145 158 L145 154 Q140 154 140 150 Z' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.11'/%3E%3Cpath d='M10 170 C10 164 18 164 22 170 C26 176 34 176 34 170 C34 164 26 164 22 170 C18 176 10 176 10 170' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.09'/%3E%3Cpolygon points='100,155 101,159 105,159 102,161.5 103,165.5 100,163 97,165.5 98,161.5 95,159 99,159' fill='none' stroke='%237c3aed' stroke-width='1' opacity='0.11'/%3E%3Ccircle cx='175' cy='160' r='8' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.1'/%3E%3Ccircle cx='175' cy='160' r='3' fill='%234f46e5' opacity='0.08'/%3E%3Cpath d='M68 185 L74 191 M74 185 L68 191' stroke='%237c3aed' stroke-width='1.2' stroke-linecap='round' opacity='0.1'/%3E%3Cpath d='M130 185 L136 191 M136 185 L130 191' stroke='%234f46e5' stroke-width='1.2' stroke-linecap='round' opacity='0.09'/%3E%3Cpath d='M0 195 Q25 188 50 195 Q75 202 100 195 Q125 188 150 195 Q175 202 200 195' fill='none' stroke='%234f46e5' stroke-width='1' opacity='0.07'/%3E%3C/svg%3E")`

export function ChatPanel() {
  const { activeId, justCreatedId, clearJustCreated } = useConversationsStore()
  const { messages, sending, error, loadMessages, sendMessage, clearError } = useChatStore()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const skipLoadRef = useRef<string | null>(null)

  // Keep ref in sync with justCreatedId so the load effect can read it without stale closure
  useEffect(() => {
    if (justCreatedId) skipLoadRef.current = justCreatedId
  }, [justCreatedId])

  useEffect(() => {
    if (!activeId) return
    if (activeId === skipLoadRef.current) {
      skipLoadRef.current = null
      clearJustCreated()
      return
    }
    loadMessages(activeId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    const text = input.trim()
    if (!text || !activeId || sending) return
    setInput('')
    sendMessage(activeId, text)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const { create } = useConversationsStore()

  if (!activeId) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center px-8"
        style={{ background: `${DOODLE_BG}, #f5f3ff` }}
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-200 mb-6"
          style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
        >
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Welcome to AI Chat</h2>
        <p className="text-gray-500 text-sm text-center max-w-xs mb-8">
          Start a new conversation or pick one from the sidebar to chat with your AI assistant.
        </p>

        {/* CTA */}
        <button
          onClick={() => create()}
          className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-2xl shadow-md shadow-orange-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
          style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New conversation
        </button>

        {/* Feature hints */}
        <div className="flex gap-3 mt-10 flex-wrap justify-center">
          {[
            { icon: '💬', label: 'Natural conversation' },
            { icon: '🧠', label: 'AI-powered replies' },
            { icon: '📝', label: 'Markdown support' },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-2 bg-white/80 border border-indigo-100 rounded-xl px-4 py-2 text-xs text-gray-600 font-semibold shadow-sm">
              <span>{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex-1 flex flex-col h-full overflow-hidden"
      style={{ background: `${DOODLE_BG}, #f5f3ff` }}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && !sending && (
          <p className="text-gray-400 text-sm text-center mt-8">Send a message to start the conversation.</p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : msg.error
                  ? 'bg-red-50 text-red-600 border border-red-200 rounded-bl-sm'
                  : 'bg-white text-gray-800 border border-indigo-100 rounded-bl-sm'
              } ${msg.pending ? 'opacity-60' : ''}`}
              style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #f97316, #ef4444)' } : {}}
            >
              {msg.pending ? (
                <span className="inline-flex gap-1 items-center">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
                </span>
              ) : msg.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-4 mb-2 flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-red-600 text-sm">
          <span>{error}</span>
          <button onClick={clearError} className="ml-3 text-red-400 hover:text-red-600 cursor-pointer">✕</button>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-indigo-100 px-4 py-3 bg-white/80 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Message… (Enter to send, Shift+Enter for newline)"
            rows={1}
            disabled={sending}
            className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white disabled:opacity-50 max-h-32 overflow-y-auto transition-all placeholder:text-gray-400"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className="text-white rounded-xl px-4 py-2.5 text-sm font-bold transition-all disabled:opacity-40 shrink-0 cursor-pointer hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-sm shadow-orange-200"
            style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}