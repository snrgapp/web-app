import { getOrgSettingsResolved } from '@/lib/get-org-settings'
import { themeLogoUrls } from '@/lib/org-theme'
import { NetworkingLandingClient } from '@/components/networking/NetworkingLandingClient'

export default async function NetworkingLandingPage() {
  const resolved = await getOrgSettingsResolved()
  const { logoUrl } = themeLogoUrls(resolved?.settings?.theme)
  return <NetworkingLandingClient logoUrl={logoUrl} />
}
