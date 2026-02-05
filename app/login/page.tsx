'use client'

import { useFormState } from 'react-dom'
import { useFormStatus } from 'react-dom'
import { Mail, Lock, AlertTriangle, ArrowRight } from 'lucide-react'
import { login, type LoginState } from '../actions/auth'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-black text-white rounded-full py-4 sm:py-5 px-6 sm:px-8 flex items-center justify-between active:scale-[0.98] transition-transform shadow-lg disabled:opacity-70"
    >
      <span className="text-xl sm:text-2xl font-semibold tracking-wide mx-auto">
        {pending ? 'Verificando...' : 'Ingresar'}
      </span>
      <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#FFE100] bg-white/10">
        <ArrowRight size={20} className="text-white" />
      </div>
    </button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useFormState<LoginState, FormData>(login, null)

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans px-6 sm:px-8 py-8">
      <form action={formAction} className="w-full max-w-sm space-y-4 sm:space-y-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-black text-center mb-2">Login</h1>
        {state?.error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
            <AlertTriangle size={18} className="flex-shrink-0" />
            {state.error}
          </div>
        )}

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            <Mail size={20} className="sm:w-5 sm:h-5" />
          </div>
          <input
            type="email"
            name="email"
            placeholder="correo"
            required
            autoComplete="email"
            className="w-full h-12 sm:h-14 pl-12 sm:pl-14 pr-4 rounded-2xl border border-zinc-200 bg-white text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-zinc-300 shadow-sm"
          />
        </div>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            <Lock size={20} className="sm:w-5 sm:h-5" />
          </div>
          <input
            type="password"
            name="password"
            placeholder="clave"
            required
            autoComplete="current-password"
            className="w-full h-12 sm:h-14 pl-12 sm:pl-14 pr-4 rounded-2xl border border-zinc-200 bg-white text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-zinc-300 shadow-sm"
          />
        </div>

        <div className="pt-2">
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}
