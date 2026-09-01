import { MembersSidebar } from '@/components/miembros/MembersSidebar'
import { MembersBottomNav } from '@/components/miembros/MembersBottomNav'
import { MembersDesktopHeader } from '@/components/miembros/MembersDesktopHeader'

export default function MiembrosAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-members-background text-members-on-surface">
      <MembersSidebar />
      <div className="flex min-h-screen flex-col md:ml-[240px]">
        <MembersDesktopHeader />
        <main className="flex-1 overflow-auto pb-20 md:pb-0">{children}</main>
      </div>
      <MembersBottomNav />
    </div>
  )
}
