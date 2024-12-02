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
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'user'
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role: 'admin' | 'user'
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'user'
          avatar_url?: string | null
          created_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_owner_id: string
          member_id: string
          role: 'admin' | 'member' | 'viewer'
          created_at: string
          user: {
            id: string
            email: string
            name: string
            avatar_url: string | null
            created_at: string
            role: 'admin' | 'user'
          }
        }
        Insert: {
          id?: string
          team_owner_id: string
          member_id: string
          role: 'admin' | 'member' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          team_owner_id?: string
          member_id?: string
          role?: 'admin' | 'member' | 'viewer'
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          content: string
          completed: boolean
          completed_at: string | null
          time: string | null
          client_tag_id: string | null
          project_tag_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          completed?: boolean
          completed_at?: string | null
          time?: string | null
          client_tag_id?: string | null
          project_tag_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          completed?: boolean
          completed_at?: string | null
          time?: string | null
          client_tag_id?: string | null
          project_tag_id?: string | null
          created_at?: string
        }
      }
      recurring_tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          time: string | null
          client_id: string | null
          project_id: string | null
          frequency: 'daily' | 'weekly' | 'monthly'
          week_day: number | null
          month_day: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          time?: string | null
          client_id?: string | null
          project_id?: string | null
          frequency: 'daily' | 'weekly' | 'monthly'
          week_day?: number | null
          month_day?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          time?: string | null
          client_id?: string | null
          project_id?: string | null
          frequency?: 'daily' | 'weekly' | 'monthly'
          week_day?: number | null
          month_day?: number | null
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          emoji: string
          color: string
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          emoji: string
          color: string
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          emoji?: string
          color?: string
          tags?: string[]
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          client_id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      task_client_tags: {
        Row: {
          task_id: string
          id: string
          name: string
          emoji: string
          color: string
          tag: string
        }
      }
      task_project_tags: {
        Row: {
          task_id: string
          id: string
          name: string
          client_name: string
          tag: string
        }
      }
    }
    Functions: {
      add_team_member: {
        Args: {
          member_email: string
          member_role?: 'admin' | 'member' | 'viewer'
        }
        Returns: {
          success: boolean
          message: string
          data?: {
            id: string
            team_owner_id: string
            member_id: string
            role: 'admin' | 'member' | 'viewer'
            created_at: string
            user: {
              id: string
              email: string
              name: string
              avatar_url: string | null
              created_at: string
              role: 'admin' | 'user'
            }
          }
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
