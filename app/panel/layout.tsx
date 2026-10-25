import { Plus_Jakarta_Sans } from 'next/font/google'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/app/actions/auth'
import { getDefaultOrgId } from '@/lib/org-resolver'
import { OrgProvider } from '@/components/panel/OrgProvider'
import { PlatformShell } from '@/components/panel-eventos/PlatformShell'
import { createServerClient } from '@/utils/supabase/server'
import './eventos-platform.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--ep-font',
})

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/login')
  }

  const initialOrgId = await getDefaultOrgId()
  const supabase = await createServerClient()
  const user = supabase ? (await supabase.auth.getUser()).data.user : null

  return (
    <OrgProvider initialOrgId={initialOrgId}>
      <div className={jakarta.variable}>
        <PlatformShell email={user?.email ?? ''}>{children}</PlatformShell>
      </div>
    </OrgProvider>
  )
}
