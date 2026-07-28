'use server'

import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'
import { QuestionWithCategory } from '@/types/database.types'

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function mapQuestions(data: any[]): QuestionWithCategory[] {
  return data.map((q) => {
    const category = Array.isArray(q.categories) ? q.categories[0] : q.categories
    return {
      id: q.id,
      content: q.content,
      category_id: q.category_id,
      difficulty_level: q.difficulty_level,
      created_at: q.created_at,
      category: category
        ? { ...category, slug: category.slug ?? null }
        : {
            id: '',
            name: 'Sin categoría',
            slug: null,
            color_hex: '#6b7280',
            icon_slug: 'help-circle',
            created_at: new Date().toISOString(),
          },
    }
  })
}

/**
 * Devuelve preguntas mezcladas de la org actual.
 * Por defecto trae un pool amplio para evitar repeticiones al girar.
 */
export async function getRandomQuestions(
  limit: number = 100,
  categorySlug?: string | null
): Promise<QuestionWithCategory[]> {
  const supabase = await createServerClient()
  if (!supabase) return []

  const orgId = await getDefaultOrgId()
  if (!orgId) return []

  try {
    let query = supabase
      .from('questions')
      .select(
        `
        *,
        categories!inner(*)
      `
      )
      .eq('categories.organizacion_id', orgId)

    if (categorySlug) {
      query = query.eq('categories.slug', categorySlug)
    }

    // Traer todas (tope alto) y mezclar en servidor
    const { data, error } = await query.limit(Math.max(limit, 200))

    if (error) {
      console.error('Error fetching questions:', error)
      throw error
    }

    if (!data || data.length === 0) return []

    // Deduplicar por contenido (por si se insertaron dos veces)
    const seen = new Set<string>()
    const unique = data.filter((q) => {
      const key = String(q.content ?? '')
        .trim()
        .toLowerCase()
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })

    const shuffled = shuffleInPlace([...unique])
    return mapQuestions(shuffled).slice(0, Math.min(limit, shuffled.length))
  } catch (error) {
    console.error('Error in getRandomQuestions:', error)
    return []
  }
}
