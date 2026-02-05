'use client'

import { LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        aria-label="Cerrar sesión"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </form>
  )
}
