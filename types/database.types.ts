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
      organizaciones: {
        Row: {
          id: string
          nombre: string
          slug: string
          dominio_custom: string | null
          plan: 'free' | 'pro' | 'enterprise'
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          slug: string
          dominio_custom?: string | null
          plan?: 'free' | 'pro' | 'enterprise'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          slug?: string
          dominio_custom?: string | null
          plan?: 'free' | 'pro' | 'enterprise'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      organizacion_miembros: {
        Row: {
          id: string
          organizacion_id: string
          user_id: string
          rol: 'admin' | 'member' | 'viewer'
          created_at: string
        }
        Insert: {
          id?: string
          organizacion_id: string
          user_id: string
          rol?: 'admin' | 'member' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          organizacion_id?: string
          user_id?: string
          rol?: 'admin' | 'member' | 'viewer'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'organizacion_miembros_organizacion_id_fkey'
            columns: ['organizacion_id']
            referencedRelation: 'organizaciones'
            referencedColumns: ['id']
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string | null
          color_hex: string
          icon_slug: string
          organizacion_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string | null
          color_hex: string
          icon_slug: string
          organizacion_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string | null
          color_hex?: string
          icon_slug?: string
          organizacion_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'categories_organizacion_id_fkey'
            columns: ['organizacion_id']
            referencedRelation: 'organizaciones'
            referencedColumns: ['id']
          }
        ]
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
          link: string | null
          orden: number
          fecha: string | null
          ciudad: string | null
          checkin_slug: string | null
          inscripcion_abierta: boolean
          acerca_del_evento: string | null
          organizacion_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          titulo?: string | null
          image_url: string
          link?: string | null
          orden?: number
          fecha?: string | null
          ciudad?: string | null
          checkin_slug?: string | null
          inscripcion_abierta?: boolean
          acerca_del_evento?: string | null
          organizacion_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          titulo?: string | null
          image_url?: string
          link?: string | null
          orden?: number
          fecha?: string | null
          ciudad?: string | null
          checkin_slug?: string | null
          inscripcion_abierta?: boolean
          acerca_del_evento?: string | null
          organizacion_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'eventos_organizacion_id_fkey'
            columns: ['organizacion_id']
            referencedRelation: 'organizaciones'
            referencedColumns: ['id']
          }
        ]
      }
      leads: {
        Row: {
          id: string
          email: string
          ciudad: string | null
          organizacion_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          ciudad?: string | null
          organizacion_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          ciudad?: string | null
          organizacion_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'leads_organizacion_id_fkey'
            columns: ['organizacion_id']
            referencedRelation: 'organizaciones'
            referencedColumns: ['id']
          }
        ]
      }
      contactos: {
        Row: {
          id: string
          nombre: string | null
          whatsapp: string | null
          correo: string | null
          mensaje: string
          organizacion_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre?: string | null
          whatsapp?: string | null
          correo?: string | null
          mensaje: string
          organizacion_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string | null
          whatsapp?: string | null
          correo?: string | null
          mensaje?: string
          organizacion_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'contactos_organizacion_id_fkey'
            columns: ['organizacion_id']
            referencedRelation: 'organizaciones'
            referencedColumns: ['id']
          }
        ]
      }
      forms: {
        Row: {
          id: string
          evento_id: string | null
          organizacion_id: string | null
          slug: string
          titulo: string
          descripcion: string | null
          icon_url: string | null
          cover_url: string | null
          campos: Json
          activo: boolean
          brevo_list_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          evento_id?: string | null
          organizacion_id?: string | null
          slug: string
          titulo: string
          descripcion?: string | null
          icon_url?: string | null
          cover_url?: string | null
          campos?: Json
          activo?: boolean
          brevo_list_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          evento_id?: string | null
          organizacion_id?: string | null
          slug?: string
          titulo?: string
          descripcion?: string | null
          icon_url?: string | null
          cover_url?: string | null
          campos?: Json
          activo?: boolean
          brevo_list_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forms_evento_id_fkey"
            columns: ["evento_id"]
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forms_organizacion_id_fkey"
            columns: ["organizacion_id"]
            referencedRelation: "organizaciones"
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
          organizacion_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          startup_nombre: string
          image_url?: string | null
          pitch_order?: number
          activo?: boolean
          organizacion_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          startup_nombre?: string
          image_url?: string | null
          pitch_order?: number
          activo?: boolean
          organizacion_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'founders_organizacion_id_fkey'
            columns: ['organizacion_id']
            referencedRelation: 'organizaciones'
            referencedColumns: ['id']
          }
        ]
      }
      votantes: {
        Row: {
          id: string
          whatsapp: string
          nombre: string | null
          categoria: 'espectador' | 'jurado'
          organizacion_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          whatsapp: string
          nombre?: string | null
          categoria?: 'espectador' | 'jurado'
          organizacion_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          whatsapp?: string
          nombre?: string | null
          categoria?: 'espectador' | 'jurado'
          organizacion_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'votantes_organizacion_id_fkey'
            columns: ['organizacion_id']
            referencedRelation: 'organizaciones'
            referencedColumns: ['id']
          }
        ]
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
      members: {
        Row: {
          id: string
          phone: string
          nombre: string | null
          email: string | null
          empresa: string | null
          avatar_url: string | null
          ciudad: string | null
          referido_por_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone: string
          nombre?: string | null
          email?: string | null
          empresa?: string | null
          avatar_url?: string | null
          ciudad?: string | null
          referido_por_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string
          nombre?: string | null
          email?: string | null
          empresa?: string | null
          avatar_url?: string | null
          ciudad?: string | null
          referido_por_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'members_referido_por_id_fkey'
            columns: ['referido_por_id']
            referencedRelation: 'members'
            referencedColumns: ['id']
          }
        ]
      }
      connections: {
        Row: {
          id: string
          member_id: string
          connected_member_id: string
          tipo: 'connection' | 'cafe_invitado' | 'cafe_aceptado'
          created_at: string
        }
        Insert: {
          id?: string
          member_id: string
          connected_member_id: string
          tipo?: 'connection' | 'cafe_invitado' | 'cafe_aceptado'
          created_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          connected_member_id?: string
          tipo?: 'connection' | 'cafe_invitado' | 'cafe_aceptado'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'connections_member_id_fkey'
            columns: ['member_id']
            referencedRelation: 'members'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'connections_connected_member_id_fkey'
            columns: ['connected_member_id']
            referencedRelation: 'members'
            referencedColumns: ['id']
          }
        ]
      }
      member_events: {
        Row: {
          id: string
          titulo: string
          descripcion: string | null
          fecha_inicio: string | null
          fecha_fin: string | null
          lugar: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descripcion?: string | null
          fecha_inicio?: string | null
          fecha_fin?: string | null
          lugar?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descripcion?: string | null
          fecha_inicio?: string | null
          fecha_fin?: string | null
          lugar?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_attendance: {
        Row: {
          id: string
          event_id: string
          member_id: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          member_id: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          member_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'event_attendance_event_id_fkey'
            columns: ['event_id']
            referencedRelation: 'member_events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'event_attendance_member_id_fkey'
            columns: ['member_id']
            referencedRelation: 'members'
            referencedColumns: ['id']
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
export type Organizacion = Database['public']['Tables']['organizaciones']['Row']
export type OrganizacionMiembro = Database['public']['Tables']['organizacion_miembros']['Row']
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
export type Member = Database['public']['Tables']['members']['Row']
export type Connection = Database['public']['Tables']['connections']['Row']
export type MemberEvent = Database['public']['Tables']['member_events']['Row']
export type EventAttendance = Database['public']['Tables']['event_attendance']['Row']
export type QuestionWithCategory = Question & {
  category: Category
}
