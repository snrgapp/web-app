import RadarConvocatoriasPage from '@/components/radar/RadarConvocatoriasPage'
import { loadRadarConvocatorias } from '@/lib/radar-load'

export const dynamic = 'force-dynamic'

export default async function RadarConvocatoriasRoute() {
  const { items, refreshedAt } = await loadRadarConvocatorias()
  return <RadarConvocatoriasPage items={items} refreshedAt={refreshedAt} />
}
