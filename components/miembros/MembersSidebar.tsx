'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import Image from 'next/image'
import {
  isMembersRouteActive,
  membersBasePath,
  membersFooterItems,
  membersHref,
  membersNavItems,
} from '@/lib/miembros/nav'
import { NotificationsBubble } from './NotificationsBubble'

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
  const basePath = membersBasePath(pathname)
  const to = membersHref(href, basePath)
  const isActive = isMembersRouteActive(pathname, href, exact, basePath)

  return (
    <Link
      href={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg p-3 text-sm font-semibold tracking-wide transition-all duration-200',
        isActive
          ? 'border-r-2 border-members-primary bg-members-surface-bright/10 font-semibold text-members-primary'
          : 'text-members-on-surface-variant hover:bg-members-surface-bright/10 hover:text-members-on-surface'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.2 : 1.75} />
      {label}
    </Link>
  )
}

async function doLogout() {
  await fetch('/api/miembros/auth/logout', { method: 'POST' })
  window.location.href = '/login'
}

function BrandMark() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-members-primary-container">
        <Image src="/logo.png" alt="Synergy" width={28} height={28} className="h-7 w-7 object-contain brightness-0 invert" />
      </div>
      <div>
        <div className="text-lg font-semibold leading-tight text-members-on-surface">Synergy</div>
        <div className="text-xs text-members-on-surface-variant">Founders & Makers</div>
      </div>
    </div>
  )
}

export function MembersSidebar() {
  const pathname = usePathname()
  const basePath = membersBasePath(pathname)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-members-border bg-members-surface px-4 md:hidden">
        <div className="text-xl font-semibold text-members-primary">Synergy</div>
        <div className="flex items-center gap-1">
          <NotificationsBubble variant="dark" />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-members-primary active:opacity-80"
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-members-border bg-members-surface px-4 py-6 shadow-[0_20px_40px_rgba(0,0,0,0.8)] md:hidden">
            <div className="mb-8 flex items-center justify-between">
              <BrandMark />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-members-on-surface-variant hover:bg-members-surface-bright/10"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
              {membersNavItems.map((item) => (
                <NavLink key={item.href} {...item} onClick={() => setMobileOpen(false)} />
              ))}
            </nav>
            <Link
              href={membersHref('/upgrade', basePath)}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'mb-4 mt-4 w-full rounded-lg bg-members-primary-container py-2.5 text-center text-sm font-semibold text-white shadow-[0_0_15px_rgba(79,70,229,0.2)] transition-colors hover:brightness-110',
                isMembersRouteActive(pathname, '/upgrade', false, basePath) && 'ring-2 ring-members-primary/40'
              )}
            >
              Upgrade a Pro
            </Link>
            <div className="mt-auto flex flex-col gap-1 border-t border-members-outline-variant pt-4">
              {membersFooterItems.map((item) => (
                <Link
                  key={item.href}
                  href={membersHref(item.href, basePath)}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg p-2 text-sm font-semibold text-members-on-surface-variant hover:bg-members-surface-bright/10 hover:text-members-on-surface"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  void doLogout()
                  setMobileOpen(false)
                }}
                className="flex w-full items-center gap-3 rounded-lg p-2 text-sm font-semibold text-members-on-surface-variant hover:bg-members-surface-bright/10 hover:text-members-on-surface"
              >
                <LogOut className="h-5 w-5" />
                Cerrar sesión
              </button>
            </div>
          </aside>
        </>
      ) : null}

      <nav className="fixed left-0 top-0 z-40 hidden h-full w-[240px] flex-col gap-4 border-r border-members-border bg-members-surface px-4 py-6 text-members-primary md:flex">
        <div className="mb-8">
          <BrandMark />
        </div>
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {membersNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
        <Link
          href={membersHref('/upgrade', basePath)}
          className={cn(
            'mb-2 w-full rounded-lg bg-members-primary-container py-2.5 text-center text-sm font-semibold text-white shadow-[0_0_15px_rgba(79,70,229,0.2)] transition-colors hover:brightness-110',
            isMembersRouteActive(pathname, '/upgrade', false, basePath) && 'ring-2 ring-members-primary/40'
          )}
        >
          Upgrade a Pro
        </Link>
        <div className="mt-auto flex flex-col gap-1">
          <div className="my-2 h-px w-full bg-members-outline-variant" />
          {membersFooterItems.map((item) => (
            <Link
              key={item.href}
              href={membersHref(item.href, basePath)}
              className="flex items-center gap-3 rounded-lg p-2 text-sm font-semibold text-members-on-surface-variant hover:bg-members-surface-bright/10 hover:text-members-on-surface"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => void doLogout()}
            className="flex w-full items-center gap-3 rounded-lg p-2 text-sm font-semibold text-members-on-surface-variant hover:bg-members-surface-bright/10 hover:text-members-on-surface"
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </nav>
    </>
  )
}
