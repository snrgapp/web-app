export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string | null
          color_hex: string
          icon_slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string | null
          color_hex: string
          icon_slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string | null
          color_hex?: string
          icon_slug?: string
          created_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: string
          content: string
          category_id: string
          difficulty_level: 'easy' | 'medium' | 'hard'
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          category_id: string
          difficulty_level: 'easy' | 'medium' | 'hard'
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          category_id?: string
          difficulty_level?: 'easy' | 'medium' | 'hard'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      asistentes: {
        Row: {
          id: string
          nombre: string | null
          apellido: string | null
          telefono: string | null
          correo: string | null
          empresa: string | null
          sector: string | null
          soluciones: string | null
          desafios: string | null
          mesa: string | null
          codigo_mesa: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre?: string | null
          apellido?: string | null
          telefono?: string | null
          correo?: string | null
          empresa?: string | null
          sector?: string | null
          soluciones?: string | null
          desafios?: string | null
          mesa?: string | null
          codigo_mesa?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string | null
          apellido?: string | null
          telefono?: string | null
          correo?: string | null
          empresa?: string | null
          sector?: string | null
          soluciones?: string | null
          desafios?: string | null
          mesa?: string | null
          codigo_mesa?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipos auxiliares para uso en la aplicación
export type Category = Database['public']['Tables']['categories']['Row']
export type Question = Database['public']['Tables']['questions']['Row']
export type Asistente = Database['public']['Tables']['asistentes']['Row']
export type QuestionWithCategory = Question & {
  category: Category
}
