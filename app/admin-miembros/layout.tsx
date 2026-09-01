import { Inter } from 'next/font/google'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-miembros/AdminSidebar'
import { isMembersAdmin } from '@/lib/admin-miembros/auth'
import '../miembros/members-theme.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-members' })

export default async function AdminMiembrosLayout({ children }: { children: React.ReactNode }) {
  const allowed = await isMembersAdmin()
  if (!allowed) {
    redirect('/login?from=/admin-miembros/inicio')
  }

  return (
    <div className={`members-app min-h-screen bg-members-background text-members-on-surface ${inter.variable}`}>
      <AdminSidebar />
      <div className="flex min-h-screen flex-col md:ml-[240px]">
        <header className="sticky top-0 z-30 hidden h-16 items-center border-b border-members-border bg-members-surface/90 px-10 backdrop-blur-sm md:flex">
          <p className="text-sm text-members-on-surface-variant">
            Panel administrador · nutre lo que ven los emprendedores
          </p>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
