'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  isMembersRouteActive,
  membersBasePath,
  membersHref,
  membersMobileTabs,
} from '@/lib/miembros/nav'

export function MembersBottomNav() {
  const pathname = usePathname()
  const basePath = membersBasePath(pathname)

  return (
    <nav className="members-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t border-members-border bg-members-surface/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md md:hidden">
      <ul className="grid grid-cols-6">
        {membersMobileTabs.map((item) => {
          const Icon = item.icon
          const isActive = isMembersRouteActive(pathname, item.href, item.exact, basePath)
          return (
            <li key={item.href}>
              <Link
                href={membersHref(item.href, basePath)}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold tracking-wide',
                  isActive ? 'text-members-primary' : 'text-members-on-surface-variant'
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.75} />
                {item.shortLabel}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
