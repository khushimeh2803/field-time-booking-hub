export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      booking_feedback: {
        Row: {
          booking_id: string
          feedback_date: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          booking_id: string
          feedback_date?: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          booking_id?: string
          feedback_date?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_feedback_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          created_at: string
          end_time: string
          ground_id: string
          id: string
          membership_applied: boolean | null
          payment_status: string
          promo_code: string | null
          start_time: string
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          booking_date: string
          created_at?: string
          end_time: string
          ground_id: string
          id?: string
          membership_applied?: boolean | null
          payment_status?: string
          promo_code?: string | null
          start_time: string
          status?: string
          total_amount: number
          user_id: string
        }
        Update: {
          booking_date?: string
          created_at?: string
          end_time?: string
          ground_id?: string
          id?: string
          membership_applied?: boolean | null
          payment_status?: string
          promo_code?: string | null
          start_time?: string
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_ground_id_fkey"
            columns: ["ground_id"]
            isOneToOne: false
            referencedRelation: "grounds"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      grounds: {
        Row: {
          address: string
          amenities: string[] | null
          capacity: number
          closing_time: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean
          name: string
          opening_time: string
          price_per_hour: number
          sport_id: string
        }
        Insert: {
          address: string
          amenities?: string[] | null
          capacity: number
          closing_time: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          name: string
          opening_time: string
          price_per_hour: number
          sport_id: string
        }
        Update: {
          address?: string
          amenities?: string[] | null
          capacity?: number
          closing_time?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          name?: string
          opening_time?: string
          price_per_hour?: number
          sport_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grounds_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plans: {
        Row: {
          created_at: string
          description: string | null
          discount_percentage: number
          duration_months: number
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_percentage: number
          duration_months: number
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_percentage?: number
          duration_months?: number
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          discount_percentage: number
          id: string
          is_active: boolean
          valid_from: string
          valid_until: string
        }
        Insert: {
          code: string
          created_at?: string
          discount_percentage: number
          id?: string
          is_active?: boolean
          valid_from: string
          valid_until: string
        }
        Update: {
          code?: string
          created_at?: string
          discount_percentage?: number
          id?: string
          is_active?: boolean
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      sports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      user_memberships: {
        Row: {
          created_at: string
          end_date: string
          id: string
          plan_id: string
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          plan_id: string
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          plan_id?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_memberships_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "user"],
    },
  },
} as const
