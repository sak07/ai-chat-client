import { useEffect, useState } from 'react'
import { useAuthStore } from './stores/authStore'
import { AuthPage } from './components/AuthPage'
import { Sidebar } from './components/Sidebar'
import { ChatPanel } from './components/ChatPanel'

export default function App() {
  const { user, loading, restoreSession } = useAuthStore()
  const [minWait, setMinWait] = useState(true)

  useEffect(() => {
    let cancelled = false
    restoreSession().then(() => {
      setTimeout(() => { if (!cancelled) setMinWait(false) }, 2000)
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading || minWait) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: '#f5f3ff' }}
      >
        {/* Brand icon */}
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-200"
          style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
        >
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </div>

        {/* App name */}
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">AI Chat</h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">Loading your workspace…</p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2 mt-1">
          {[0, 150, 300].map((delay) => (
            <div
              key={delay}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (!user) return <AuthPage />

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f3ff]">
      <Sidebar />
      <ChatPanel />
    </div>
  )
}
