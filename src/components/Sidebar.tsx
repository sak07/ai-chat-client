import { useEffect, useState } from 'react'
import { useConversationsStore } from '../stores/conversationsStore'
import { useAuthStore } from '../stores/authStore'

export function Sidebar() {
  const { conversations, activeId, loading, fetch, create, rename, remove, setActive } =
    useConversationsStore()
  const { user, logout } = useAuthStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    fetch()
  }, [fetch])

  const startRename = (id: string, title: string) => {
    setEditingId(id)
    setEditTitle(title)
  }

  const commitRename = (id: string) => {
    if (editTitle.trim()) rename(id, editTitle.trim())
    setEditingId(null)
  }

  return (
    <aside className="w-64 flex flex-col bg-slate-900 border-r border-slate-800 h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <span className="text-sm font-semibold text-white">Conversations</span>
        <button
          onClick={() => create()}
          title="New conversation"
          className="text-slate-400 hover:text-white transition-colors text-lg leading-none"
        >
          +
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1">
        {loading && (
          <p className="text-slate-500 text-xs px-4 py-3">Loading…</p>
        )}
        {!loading && conversations.length === 0 && (
          <p className="text-slate-500 text-xs px-4 py-3">No conversations yet. Click + to start.</p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setActive(conv.id)}
            className={`group flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg mx-1 my-0.5 transition-colors ${
              activeId === conv.id
                ? 'bg-indigo-600/20 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {editingId === conv.id ? (
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => commitRename(conv.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename(conv.id)
                  if (e.key === 'Escape') setEditingId(null)
                }}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-slate-700 text-white text-sm px-2 py-0.5 rounded focus:outline-none"
              />
            ) : (
              <span className="flex-1 text-sm truncate">{conv.title}</span>
            )}

            {/* Actions — shown on hover */}
            {editingId !== conv.id && (
              <span className="hidden group-hover:flex gap-1 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); startRename(conv.id, conv.title) }}
                  className="text-slate-400 hover:text-white text-xs"
                  title="Rename"
                >✏️</button>
                <button
                  onClick={(e) => { e.stopPropagation(); remove(conv.id) }}
                  className="text-slate-400 hover:text-red-400 text-xs"
                  title="Delete"
                >🗑</button>
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer: user info + logout */}
      <div className="border-t border-slate-800 px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-slate-400 truncate max-w-[130px]">{user?.email}</span>
        <button
          onClick={logout}
          className="text-xs text-slate-400 hover:text-red-400 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
