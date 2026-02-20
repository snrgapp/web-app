'use server'

import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'
import { QuestionWithCategory } from '@/types/database.types'

export async function getRandomQuestions(limit: number = 10, categorySlug?: string | null): Promise<QuestionWithCategory[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  const orgId = await getDefaultOrgId()
  if (!orgId) return []

  try {
    let query = supabase
      .from('questions')
      .select(`
        *,
        categories!inner(*)
      `)
      .eq('categories.organizacion_id', orgId)

    if (categorySlug) {
      query = query.eq('categories.slug', categorySlug)
    }

    const { data, error } = await query.limit(limit * 2)
    
    if (error) {
      console.error('Error fetching questions:', error)
      throw error
    }
    
    if (!data || data.length === 0) {
      return []
    }
    
    // Mezclar aleatoriamente las preguntas
    const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, limit)
    
    // Mapear los datos para incluir la categoría correctamente
    const questionsWithCategories: QuestionWithCategory[] = shuffled.map((q: any) => {
      const category = Array.isArray(q.categories) ? q.categories[0] : q.categories
      return {
        id: q.id,
        content: q.content,
        category_id: q.category_id,
        difficulty_level: q.difficulty_level,
        created_at: q.created_at,
        category: category ? { ...category, slug: category.slug ?? null } : {
          id: '',
          name: 'Sin categoría',
          slug: null,
          color_hex: '#6b7280',
          icon_slug: 'help-circle',
          created_at: new Date().toISOString(),
        },
      }
    })
    
    return questionsWithCategories
  } catch (error) {
    console.error('Error in getRandomQuestions:', error)
    return []
  }
}
