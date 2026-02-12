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
      eventos: {
        Row: {
          id: string
          titulo: string | null
          image_url: string
          link: string
          orden: number
          fecha: string | null
          ciudad: string | null
          created_at: string
        }
        Insert: {
          id?: string
          titulo?: string | null
          image_url: string
          link: string
          orden?: number
          fecha?: string | null
          ciudad?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          titulo?: string | null
          image_url?: string
          link?: string
          orden?: number
          fecha?: string | null
          ciudad?: string | null
          created_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
        Relationships: []
      }
      contactos: {
        Row: {
          id: string
          nombre: string | null
          whatsapp: string | null
          correo: string | null
          mensaje: string
          created_at: string
        }
        Insert: {
          id?: string
          nombre?: string | null
          whatsapp?: string | null
          correo?: string | null
          mensaje: string
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string | null
          whatsapp?: string | null
          correo?: string | null
          mensaje?: string
          created_at?: string
        }
        Relationships: []
      }
      forms: {
        Row: {
          id: string
          evento_id: string | null
          slug: string
          titulo: string
          descripcion: string | null
          icon_url: string | null
          cover_url: string | null
          campos: Json
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          evento_id?: string | null
          slug: string
          titulo: string
          descripcion?: string | null
          icon_url?: string | null
          cover_url?: string | null
          campos?: Json
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          evento_id?: string | null
          slug?: string
          titulo?: string
          descripcion?: string | null
          icon_url?: string | null
          cover_url?: string | null
          campos?: Json
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forms_evento_id_fkey"
            columns: ["evento_id"]
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          }
        ]
      }
      form_submissions: {
        Row: {
          id: string
          form_id: string
          datos: Json
          created_at: string
        }
        Insert: {
          id?: string
          form_id: string
          datos?: Json
          created_at?: string
        }
        Update: {
          id?: string
          form_id?: string
          datos?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            referencedRelation: "forms"
            referencedColumns: ["id"]
          }
        ]
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
export type Evento = Database['public']['Tables']['eventos']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
export type Contacto = Database['public']['Tables']['contactos']['Row']
export type FormRow = Database['public']['Tables']['forms']['Row']
export type FormSubmissionRow = Database['public']['Tables']['form_submissions']['Row']
export type QuestionWithCategory = Question & {
  category: Category
}
