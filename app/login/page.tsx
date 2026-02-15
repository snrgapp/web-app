'use client'

import { useFormState } from 'react-dom'
import { useFormStatus } from 'react-dom'
import { Mail, Lock, AlertTriangle } from 'lucide-react'
import { login, type LoginState } from '../actions/auth'
import Image from 'next/image'
import { motion } from 'framer-motion'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-zinc-900 text-white rounded-xl py-3.5 px-6 text-sm font-medium hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-70"
    >
      {pending ? 'Verificando...' : 'Ingresar'}
    </button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useFormState<LoginState, FormData>(login, null)

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        {/* Panel izquierdo: imagen con flotación suave */}
        <div className="relative lg:w-[45%] bg-zinc-50 flex items-center justify-center p-4 lg:p-12 overflow-hidden">
          <motion.div
            className="relative w-full max-w-[160px] lg:max-w-[320px] aspect-square"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Image
              src="/images/coffee-login.png"
              alt="Coffee cup"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* Panel derecho: formulario */}
        <div className="flex-1 flex flex-col justify-center px-6 py-6 sm:px-12 lg:px-16 lg:py-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-8">
            Sign in
          </h1>

          {state?.error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm mb-6">
              <AlertTriangle size={18} className="flex-shrink-0" />
              {state.error}
            </div>
          )}

          <p className="text-sm text-zinc-500 mb-6">
            Ingresa con tu correo electrónico
          </p>

          <form action={formAction} className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="correo"
                required
                autoComplete="email"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-300 transition-colors"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                placeholder="contraseña"
                required
                autoComplete="current-password"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-300 transition-colors"
              />
            </div>

            <div className="pt-2">
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
