import { getOrgSettingsResolved } from '@/lib/get-org-settings'
import { themeToCssVars } from '@/lib/org-theme'

export default async function NetworkingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const resolved = await getOrgSettingsResolved()
  const vars = themeToCssVars(resolved?.settings?.theme)
  return (
    <div
      className="min-h-screen antialiased"
      style={{
        ...vars,
        backgroundColor: 'var(--net-bg)',
        color: 'var(--net-fg)',
        fontFamily: 'var(--net-font-sans)',
      }}
    >
      {children}
    </div>
  )
}
