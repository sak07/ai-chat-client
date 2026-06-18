import { useEffect, useState } from 'react'
import { useConversationsStore } from '../stores/conversationsStore'
import { useAuthStore } from '../stores/authStore'

function ConfirmDialog({ title, onConfirm, onCancel }: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/10 border border-indigo-100 p-6 w-full max-w-sm">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </div>

        <h3 className="text-base font-bold text-gray-800 text-center mb-1">Delete conversation?</h3>
        <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
          "<span className="font-semibold text-gray-700">{title}</span>" will be permanently deleted and cannot be recovered.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors cursor-pointer shadow-sm shadow-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const { conversations, activeId, loading, fetch, create, rename, remove, setActive } =
    useConversationsStore()
  const { user, logout } = useAuthStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null)
  const [confirmSignOut, setConfirmSignOut] = useState(false)

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

  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmDelete({ id, title })
  }

  return (
    <>
      {confirmDelete && (
        <ConfirmDialog
          title={confirmDelete.title}
          onConfirm={() => { remove(confirmDelete.id); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {confirmSignOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setConfirmSignOut(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/10 border border-indigo-100 p-6 w-full max-w-sm">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-800 text-center mb-1">Sign out?</h3>
            <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
              You'll be returned to the sign-in screen. Your conversations will be saved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmSignOut(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => { logout(); setConfirmSignOut(false) }}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-colors cursor-pointer shadow-sm shadow-orange-200"
                style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="w-64 flex flex-col bg-white border-r border-indigo-100 h-full">
        {/* Header */}
        <div className="px-4 pt-5 pb-4 border-b border-indigo-100">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="text-base font-extrabold text-gray-800 tracking-tight">AI Chat</span>
          </div>

          <button
            onClick={() => create()}
            className="w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-2.5 rounded-xl cursor-pointer hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-sm shadow-orange-200"
            style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New conversation
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {loading && (
            <div className="flex flex-col gap-2 px-1 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center px-4 py-10 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-500">No conversations yet</p>
              <p className="text-xs text-gray-400 leading-relaxed">Hit the button above to start your first chat.</p>
            </div>
          )}

          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActive(conv.id)}
              className={`group flex items-center gap-2 px-3 py-2.5 cursor-pointer rounded-xl my-0.5 transition-all ${
                activeId === conv.id
                  ? 'bg-orange-50 border border-orange-200'
                  : 'text-gray-600 hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${activeId === conv.id ? 'bg-orange-400' : 'bg-gray-200'}`} />

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
                  className="flex-1 bg-white border border-indigo-200 text-gray-800 text-sm px-2 py-0.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              ) : (
                <span className={`flex-1 text-sm truncate font-medium ${activeId === conv.id ? 'text-orange-700' : 'text-gray-600'}`}>
                  {conv.title}
                </span>
              )}

              {editingId !== conv.id && (
                <span className="hidden group-hover:flex gap-1 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); startRename(conv.id, conv.title) }}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer"
                    title="Rename"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleDelete(conv.id, conv.title, e)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-indigo-100 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
            >
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => setConfirmSignOut(true)}
              title="Sign out"
              className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}