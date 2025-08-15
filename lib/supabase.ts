import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Admin client for server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      forms: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          fields: any[]
          settings: Record<string, any>
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          description?: string
          fields?: any[]
          settings?: Record<string, any>
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          fields?: any[]
          settings?: Record<string, any>
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      form_responses: {
        Row: {
          id: string
          form_id: string
          responses: Record<string, any>
          ip_address: string | null
          user_agent: string | null
          submitted_at: string
        }
        Insert: {
          id?: string
          form_id: string
          responses: Record<string, any>
          ip_address?: string | null
          user_agent?: string | null
          submitted_at?: string
        }
        Update: {
          id?: string
          form_id?: string
          responses?: Record<string, any>
          ip_address?: string | null
          user_agent?: string | null
          submitted_at?: string
        }
      }
    }
  }
}