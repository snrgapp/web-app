'use client'

import { LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'

interface LogoutButtonProps {
  variant?: 'icon' | 'sidebar'
}

export function LogoutButton({ variant = 'icon' }: LogoutButtonProps) {
  return (
    <form action={logout}>
      <button
        type="submit"
        className={
          variant === 'sidebar'
            ? 'flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-zinc-600 hover:text-red-600 hover:bg-red-50 transition-colors'
            : 'p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors'
        }
        aria-label="Cerrar sesión"
      >
        <LogOut className="w-4 h-4 flex-shrink-0" />
        {variant === 'sidebar' && <span>Cerrar sesión</span>}
      </button>
    </form>
  )
}
