import { createAdminClient } from '@/utils/supabase/admin'

type LooseClient = {
  from: (table: string) => {
    select: (...args: unknown[]) => any
    insert: (values: unknown) => any
    update: (values: unknown) => any
    delete: () => any
  }
}

export function cmsDb(): LooseClient | null {
  const client = createAdminClient()
  if (!client) return null
  return client as unknown as LooseClient
}

export function isMissingRelation(error: { message?: string; code?: string } | null) {
  if (!error) return false
  const message = error.message || ''
  return (
    error.code === '42P01' ||
    error.code === 'PGRST205' ||
    message.includes('does not exist') ||
    message.includes('schema cache')
  )
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || `item-${Date.now()}`
}

export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean)
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}
