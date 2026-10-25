import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/app/actions/auth'
import { getInalambriaApiBase, getInalambriaBalance } from '@/lib/inalambria'

export const dynamic = 'force-dynamic'

function leerSaldo(data: unknown): string | null {
  if (typeof data === 'number' || typeof data === 'string') return String(data)
  if (!data || typeof data !== 'object') return null
  const o = data as Record<string, unknown>
  const claves = ['balance', 'credits', 'credit', 'saldo', 'available', 'amount', 'sms', 'remaining', 'quantity']
  for (const k of claves) {
    const v = o[k]
    if (typeof v === 'number' || typeof v === 'string') return String(v)
  }
  if (o.data) return leerSaldo(o.data)
  if (o.account) return leerSaldo(o.account)
  return null
}

export async function GET() {
  const session = await isAuthenticated()
  if (!session) {
    return NextResponse.json({ ok: false, reason: 'sesion' }, { status: 401 })
  }

  const base = getInalambriaApiBase()
  const tieneClave = Boolean(process.env.INALAMBRIA_API_KEY?.trim())
  if (!tieneClave) {
    return NextResponse.json({
      ok: false,
      reason: 'sin_clave',
      proveedor: 'Inalambria Express',
      base,
    })
  }

  const r = await getInalambriaBalance()
  if (!r.ok) {
    return NextResponse.json({
      ok: false,
      reason: 'error',
      proveedor: 'Inalambria Express',
      base,
      detalle: r.error ?? 'No respondió',
    })
  }

  const data = r.data && typeof r.data === 'object' ? (r.data as Record<string, unknown>) : {}
  const budget = data.budget && typeof data.budget === 'object' ? (data.budget as Record<string, unknown>) : {}
  const monthly = budget.monthly && typeof budget.monthly === 'object' ? (budget.monthly as Record<string, unknown>) : {}
  const moneda = typeof data.currency === 'string' ? data.currency : null
  const saldoNumero = typeof data.balance === 'number' ? data.balance : null
  const saldoDinero =
    typeof data.monetaryBalance === 'number'
      ? data.monetaryBalance
      : moneda && saldoNumero != null
        ? saldoNumero
        : null

  return NextResponse.json({
    ok: true,
    proveedor: 'Inalambria Express',
    base,
    saldo: saldoDinero == null ? (saldoNumero ?? leerSaldo(r.data)) : null,
    moneda,
    saldoDinero,
    mensajesEstimados: typeof data.estimatedMessages === 'number' ? data.estimatedMessages : null,
    cupoMes: typeof monthly.limit === 'number' ? monthly.limit : null,
    usoMes: typeof monthly.usage === 'number' ? monthly.usage : null,
  })
}
