'use server'

import { createServerClient } from '@/utils/supabase/server'
import { QuestionWithCategory } from '@/types/database.types'

export async function getRandomQuestions(limit: number = 10): Promise<QuestionWithCategory[]> {
  const supabase = createServerClient()
  
  try {
    // Obtener preguntas aleatorias con sus categorías
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        categories(*)
      `)
      .limit(limit * 2) // Obtener más para tener variedad al mezclar
    
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
        category: category || {
          id: '',
          name: 'Sin categoría',
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
