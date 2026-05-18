import { notFound } from 'next/navigation'
import { getPublishedTenantExperienceByPublicSlug } from '@/lib/paas/tenant-experience-public'
import { getOrgSettingsByOrgId } from '@/lib/get-org-settings'
import { themeToCssVars } from '@/lib/org-theme'

export default async function ExpPublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ publicSlug: string }>
}) {
  const { publicSlug } = await params
  const te = await getPublishedTenantExperienceByPublicSlug(publicSlug)
  if (!te) notFound()

  const settings = await getOrgSettingsByOrgId(te.organizacion_id)
  const vars = themeToCssVars(settings?.theme)

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
