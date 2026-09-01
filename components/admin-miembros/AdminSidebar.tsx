'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { adminMembersNav } from '@/lib/admin-miembros/nav'

function NavLink({
  href,
  icon: Icon,
  label,
  exact,
  onClick,
}: {
  href: string
  icon: React.ElementType
  label: string
  exact: boolean
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg border p-3 text-sm font-semibold tracking-wide transition-all duration-200',
        isActive
          ? 'border-members-primary bg-members-surface-container-highest text-members-primary'
          : 'border-transparent text-members-on-surface-variant hover:bg-members-surface-bright/10 hover:text-members-on-surface'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.2 : 1.75} />
      {label}
    </Link>
  )
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-members-border bg-members-surface px-4 md:hidden">
        <div className="text-xl font-semibold text-members-primary">Admin Synergy</div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-members-primary"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {mobileOpen ? (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-members-border bg-members-surface px-4 py-6 md:hidden">
            <div className="mb-8 flex items-center justify-between">
              <Brand />
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-members-on-surface-variant">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-2">
              {adminMembersNav.map((item) => (
                <NavLink key={item.href} {...item} onClick={() => setMobileOpen(false)} />
              ))}
            </nav>
          </aside>
        </>
      ) : null}

      <nav className="fixed left-0 top-0 z-40 hidden h-full w-[240px] flex-col border-r border-members-border bg-members-surface px-4 py-6 md:flex">
        <div className="mb-8">
          <Brand />
        </div>
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {adminMembersNav.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
        <Link
          href="/panel"
          className="mt-auto flex items-center gap-3 rounded-lg p-2 text-sm font-semibold text-members-on-surface-variant hover:bg-members-surface-bright/10 hover:text-members-on-surface"
        >
          <LogOut className="h-5 w-5" />
          Panel organización
        </Link>
      </nav>
    </>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-members-primary-container">
        <Image src="/logo.png" alt="Synergy" width={28} height={28} className="h-7 w-7 object-contain brightness-0 invert" />
      </div>
      <div>
        <div className="text-lg font-semibold leading-tight text-members-on-surface">Admin</div>
        <div className="text-xs text-members-on-surface-variant">Contenido miembros</div>
      </div>
    </div>
  )
}
