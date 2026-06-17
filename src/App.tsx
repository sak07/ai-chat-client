import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'
import { AuthPage } from './components/AuthPage'
import { Sidebar } from './components/Sidebar'
import { ChatPanel } from './components/ChatPanel'

export default function App() {
  const { user, loading, restoreSession } = useAuthStore()

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <AuthPage />

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />
      <ChatPanel />
    </div>
  )
}
