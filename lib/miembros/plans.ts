export type BillingPeriod = 'mensual' | 'anual'
export type Currency = 'USD' | 'EUR' | 'GBP'
export type PlanId = 'free' | 'pro' | 'teams'

export const CURRENCIES: { id: Currency; label: string; symbol: string }[] = [
  { id: 'USD', label: 'USD ($)', symbol: '$' },
  { id: 'EUR', label: 'EUR (€)', symbol: '€' },
  { id: 'GBP', label: 'GBP (£)', symbol: '£' },
]

const MONTHLY_PRICES: Record<Currency, Record<PlanId, number>> = {
  USD: { free: 0, pro: 49, teams: 199 },
  EUR: { free: 0, pro: 45, teams: 189 },
  GBP: { free: 0, pro: 39, teams: 169 },
}

const ANNUAL_DISCOUNT = 0.15

export function getPlanPrice(plan: PlanId, currency: Currency, billing: BillingPeriod) {
  const base = MONTHLY_PRICES[currency][plan]
  if (plan === 'free') return 0
  if (billing === 'anual') return Math.round(base * (1 - ANNUAL_DISCOUNT))
  return base
}

export function formatPlanPrice(plan: PlanId, currency: Currency, billing: BillingPeriod) {
  const symbol = CURRENCIES.find((item) => item.id === currency)?.symbol ?? '$'
  return `${symbol}${getPlanPrice(plan, currency, billing)}`
}
