import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'

const DOODLE_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3C!-- chat bubble --%3E%3Cpath d='M15 10 Q15 6 19 6 L31 6 Q35 6 35 10 L35 18 Q35 22 31 22 L22 22 L18 26 L18 22 L19 22 Q15 22 15 18 Z' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.12'/%3E%3C!-- star --%3E%3Cpolygon points='80,8 81.8,13.5 87.5,13.5 83,17 84.8,22.5 80,19 75.2,22.5 77,17 72.5,13.5 78.2,13.5' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.1'/%3E%3C!-- heart --%3E%3Cpath d='M155 14 C155 11 152 8 149 10 C146 8 143 11 143 14 C143 20 149 24 149 24 C149 24 155 20 155 14 Z' fill='none' stroke='%237c3aed' stroke-width='1.2' opacity='0.1'/%3E%3C!-- lightning bolt --%3E%3Cpath d='M178 6 L173 15 L177 15 L172 26 L181 13 L177 13 Z' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.1'/%3E%3C!-- small circles --%3E%3Ccircle cx='60' cy='40' r='4' fill='none' stroke='%237c3aed' stroke-width='1.2' opacity='0.12'/%3E%3Ccircle cx='120' cy='35' r='3' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.1'/%3E%3Ccircle cx='190' cy='20' r='2.5' fill='%234f46e5' opacity='0.09'/%3E%3C!-- wavy line --%3E%3Cpath d='M5 55 Q15 48 25 55 Q35 62 45 55 Q55 48 65 55' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.09'/%3E%3C!-- speech dots --%3E%3Ccircle cx='100' cy='60' r='2' fill='%237c3aed' opacity='0.12'/%3E%3Ccircle cx='107' cy='60' r='2' fill='%237c3aed' opacity='0.12'/%3E%3Ccircle cx='114' cy='60' r='2' fill='%237c3aed' opacity='0.12'/%3E%3C!-- diamond --%3E%3Cpath d='M165 45 L172 52 L165 59 L158 52 Z' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.1'/%3E%3C!-- plus signs --%3E%3Cpath d='M38 80 L38 92 M32 86 L44 86' stroke='%234f46e5' stroke-width='1.5' stroke-linecap='round' opacity='0.1'/%3E%3Cpath d='M185 75 L185 83 M181 79 L189 79' stroke='%237c3aed' stroke-width='1.5' stroke-linecap='round' opacity='0.09'/%3E%3C!-- chat bubble 2 --%3E%3Cpath d='M130 75 Q130 72 133 72 L143 72 Q146 72 146 75 L146 81 Q146 84 143 84 L137 84 L135 87 L135 84 Q130 84 130 81 Z' fill='none' stroke='%237c3aed' stroke-width='1.2' opacity='0.1'/%3E%3C!-- zigzag --%3E%3Cpath d='M5 110 L15 100 L25 110 L35 100 L45 110' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.08'/%3E%3C!-- moon --%3E%3Cpath d='M80 100 A12 12 0 1 0 80 124 A8 8 0 1 1 80 100 Z' fill='none' stroke='%237c3aed' stroke-width='1.2' opacity='0.1'/%3E%3C!-- dots scattered --%3E%3Ccircle cx='170' cy='105' r='2.5' fill='%234f46e5' opacity='0.1'/%3E%3Ccircle cx='160' cy='115' r='1.5' fill='%237c3aed' opacity='0.09'/%3E%3Ccircle cx='180' cy='118' r='2' fill='%234f46e5' opacity='0.08'/%3E%3C!-- arrow --%3E%3Cpath d='M110 110 L125 110 M120 105 L125 110 L120 115' fill='none' stroke='%234f46e5' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' opacity='0.1'/%3E%3C!-- sparkle --%3E%3Cpath d='M50 145 L52 140 L54 145 L59 147 L54 149 L52 154 L50 149 L45 147 Z' fill='none' stroke='%237c3aed' stroke-width='1.2' opacity='0.11'/%3E%3C!-- chat bubble 3 --%3E%3Cpath d='M140 140 Q140 136 144 136 L158 136 Q162 136 162 140 L162 150 Q162 154 158 154 L148 154 L145 158 L145 154 Q140 154 140 150 Z' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.11'/%3E%3C!-- infinity --%3E%3Cpath d='M10 170 C10 164 18 164 22 170 C26 176 34 176 34 170 C34 164 26 164 22 170 C18 176 10 176 10 170' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.09'/%3E%3C!-- star small --%3E%3Cpolygon points='100,155 101,159 105,159 102,161.5 103,165.5 100,163 97,165.5 98,161.5 95,159 99,159' fill='none' stroke='%237c3aed' stroke-width='1' opacity='0.11'/%3E%3C!-- circle ring --%3E%3Ccircle cx='175' cy='160' r='8' fill='none' stroke='%234f46e5' stroke-width='1.2' opacity='0.1'/%3E%3Ccircle cx='175' cy='160' r='3' fill='%234f46e5' opacity='0.08'/%3E%3C!-- crosses --%3E%3Cpath d='M68 185 L74 191 M74 185 L68 191' stroke='%237c3aed' stroke-width='1.2' stroke-linecap='round' opacity='0.1'/%3E%3Cpath d='M130 185 L136 191 M136 185 L130 191' stroke='%234f46e5' stroke-width='1.2' stroke-linecap='round' opacity='0.09'/%3E%3C!-- wave --%3E%3Cpath d='M0 195 Q25 188 50 195 Q75 202 100 195 Q125 188 150 195 Q175 202 200 195' fill='none' stroke='%234f46e5' stroke-width='1' opacity='0.07'/%3E%3C/svg%3E")`

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const { login, signup, loading, error } = useAuthStore()

  const validate = () => {
    const errors: { email?: string; password?: string } = {}
    if (!email.trim()) errors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.'
    if (!password) errors.password = 'Password is required.'
    else if (mode === 'signup' && password.length < 8) errors.password = 'Password must be at least 8 characters.'
    return errors
  }

  const submit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return }
    setFieldErrors({})
    if (mode === 'login') login(email, password)
    else signup(email, password)
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: `${DOODLE_BG}, #f5f3ff` }}
    >
      <div className="relative w-full max-w-sm">
        {/* Logo / brand */}
        <div className="mb-8 text-center">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg shadow-orange-200"
            style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
          >
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">AI Chat</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            {mode === 'login' ? 'Welcome back 👋' : 'Create your account'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-indigo-100 rounded-3xl p-7 shadow-xl shadow-indigo-100/60">
          <form onSubmit={submit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })) }}
                className={`w-full rounded-xl bg-gray-50 border text-gray-900 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition-all ${fieldErrors.email ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-indigo-400'}`}
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/></svg>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })) }}
                className={`w-full rounded-xl bg-gray-50 border text-gray-900 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition-all ${fieldErrors.password ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-indigo-400'}`}
                placeholder="••••••••"
              />
              {fieldErrors.password && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/></svg>
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2.5 text-sm bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="text-red-600">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl py-2.5 text-sm transition-all shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 hover:scale-[1.01] active:scale-[0.99] mt-1"
              style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
            >
              {loading
                ? <span className="inline-flex items-center gap-2 justify-center">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Please wait…
                  </span>
                : mode === 'login' ? 'Sign in' : 'Create account'
              }
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={switchMode}
            className="font-bold transition-colors hover:opacity-80 cursor-pointer"
            style={{ color: '#f97316' }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}