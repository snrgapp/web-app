/**
 * Día activo del evento Perrenque para lecturas de grupo/matching en BD.
 * Definir PERRENQUE_EVENT_DAY o NEXT_PUBLIC_PERRENQUE_EVENT_DAY en deploy (1 | 2).
 */
export type PerrenqueEventDay = 1 | 2

export function getPerrenqueEventDay(): PerrenqueEventDay {
  const raw =
    process.env.PERRENQUE_EVENT_DAY?.trim() ??
    process.env.NEXT_PUBLIC_PERRENQUE_EVENT_DAY?.trim() ??
    '1'
  const n = Number(raw)
  if (n === 2) return 2
  return 1
}
