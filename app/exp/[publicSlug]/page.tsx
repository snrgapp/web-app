import { notFound } from 'next/navigation'
import { getPublishedTenantExperienceByPublicSlug } from '@/lib/paas/tenant-experience-public'
import { getOrgSettingsByOrgId } from '@/lib/get-org-settings'
import { themeLogoUrls } from '@/lib/org-theme'
import { NetworkingLandingClient } from '@/components/networking/NetworkingLandingClient'

interface PageProps {
  params: Promise<{ publicSlug: string }>
}

export default async function ExpLandingPage({ params }: PageProps) {
  const { publicSlug } = await params
  const te = await getPublishedTenantExperienceByPublicSlug(publicSlug)
  if (!te) notFound()

  const settings = await getOrgSettingsByOrgId(te.organizacion_id)
  const { logoUrl } = themeLogoUrls(settings?.theme)

  return (
    <NetworkingLandingClient
      logoUrl={logoUrl}
      verifyHref={`/exp/${publicSlug}/verify`}
      backHref="/"
    />
  )
}
