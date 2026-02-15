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
          evento_id: string | null
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
          mesa_ronda2: string | null
          created_at: string
        }
        Insert: {
          id?: string
          evento_id?: string | null
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
          mesa_ronda2?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          evento_id?: string | null
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
          mesa_ronda2?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'asistentes_evento_id_fkey'
            columns: ['evento_id']
            referencedRelation: 'eventos'
            referencedColumns: ['id']
          }
        ]
      }
      feedback_networking: {
        Row: {
          id: string
          asistente_id: string
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          asistente_id: string
          rating: number
          created_at?: string
        }
        Update: {
          id?: string
          asistente_id?: string
          rating?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'feedback_networking_asistente_id_fkey'
            columns: ['asistente_id']
            referencedRelation: 'asistentes'
            referencedColumns: ['id']
          }
        ]
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
          checkin_slug: string | null
          inscripcion_abierta: boolean
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
          checkin_slug?: string | null
          inscripcion_abierta?: boolean
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
          checkin_slug?: string | null
          inscripcion_abierta?: boolean
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
      founders: {
        Row: {
          id: string
          nombre: string
          startup_nombre: string
          image_url: string | null
          pitch_order: number
          activo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          startup_nombre: string
          image_url?: string | null
          pitch_order?: number
          activo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          startup_nombre?: string
          image_url?: string | null
          pitch_order?: number
          activo?: boolean
          created_at?: string
        }
        Relationships: []
      }
      votantes: {
        Row: {
          id: string
          whatsapp: string
          nombre: string | null
          categoria: 'espectador' | 'jurado'
          created_at: string
        }
        Insert: {
          id?: string
          whatsapp: string
          nombre?: string | null
          categoria?: 'espectador' | 'jurado'
          created_at?: string
        }
        Update: {
          id?: string
          whatsapp?: string
          nombre?: string | null
          categoria?: 'espectador' | 'jurado'
          created_at?: string
        }
        Relationships: []
      }
      votos: {
        Row: {
          id: string
          votante_id: string
          founder_id: string
          score_innovacion: number
          score_claridad: number
          score_qa: number
          created_at: string
        }
        Insert: {
          id?: string
          votante_id: string
          founder_id: string
          score_innovacion: number
          score_claridad: number
          score_qa: number
          created_at?: string
        }
        Update: {
          id?: string
          votante_id?: string
          founder_id?: string
          score_innovacion?: number
          score_claridad?: number
          score_qa?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "votos_votante_id_fkey"
            columns: ["votante_id"]
            referencedRelation: "votantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votos_founder_id_fkey"
            columns: ["founder_id"]
            referencedRelation: "founders"
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
export type Founder = Database['public']['Tables']['founders']['Row']
export type Votante = Database['public']['Tables']['votantes']['Row']
export type Voto = Database['public']['Tables']['votos']['Row']
export type FeedbackNetworking = Database['public']['Tables']['feedback_networking']['Row']
export type QuestionWithCategory = Question & {
  category: Category
}
