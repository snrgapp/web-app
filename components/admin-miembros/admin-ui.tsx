'use client'

import { type FormEvent, type ReactNode, useState } from 'react'

export async function adminFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Error de servidor')
  return data
}

export function AdminPage({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-10 pt-6 sm:px-6 md:px-10 md:pt-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="coffee-title mb-2 text-members-on-surface">{title}</h1>
          <p className="beneficios-subtitle max-w-2xl text-members-on-surface-variant">{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-members-on-surface-variant">{label}</span>
      {children}
    </label>
  )
}

export const inputClass =
  'w-full rounded-lg border border-members-border bg-[#080808] px-3 py-2 text-sm text-members-on-surface outline-none placeholder:text-members-outline-variant focus:border-members-primary-container'

export function AdminButton({
  children,
  onClick,
  type = 'button',
  tone = 'primary',
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  tone?: 'primary' | 'ghost' | 'danger'
  disabled?: boolean
}) {
  const styles = {
    primary: 'bg-members-primary-container text-white hover:brightness-110',
    ghost: 'border border-members-border text-members-on-surface hover:bg-[#1A1A1A]',
    danger: 'border border-red-500/30 text-red-300 hover:bg-red-500/10',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50 ${styles[tone]}`}
    >
      {children}
    </button>
  )
}

export function Notice({ message }: { message?: string | null }) {
  if (!message) return null
  return (
    <p className="mb-4 rounded-lg border border-members-outline-variant bg-[#1A1A1A] px-3 py-2 text-sm text-members-on-surface-variant">
      {message}
    </p>
  )
}

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <form
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-members-border bg-members-surface p-6"
        onSubmit={(event: FormEvent) => event.preventDefault()}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h1 className="text-lg font-semibold text-members-on-surface">{title}</h1>
          <AdminButton tone="ghost" onClick={onClose}>
            Cerrar
          </AdminButton>
        </div>
        {children}
      </form>
    </div>
  )
}

export function useBusy() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function run(task: () => Promise<void>) {
    setBusy(true)
    setError(null)
    try {
      await task()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setBusy(false)
    }
  }
  return { busy, error, setError, run }
}
