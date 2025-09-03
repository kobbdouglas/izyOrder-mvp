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
      restaurants: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          hero_image_url: string | null
          description_en: string
          description_de: string
          owner_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          hero_image_url?: string | null
          description_en?: string
          description_de?: string
          owner_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          hero_image_url?: string | null
          description_en?: string
          description_de?: string
          owner_id?: string | null
          created_at?: string
        }
      }
      restaurant_customization: {
        Row: {
          restaurant_id: string
          welcome_text_en: string
          welcome_text_de: string
          primary_color: string
          secondary_color: string
          accent_color: string
          font_style: string
        }
        Insert: {
          restaurant_id: string
          welcome_text_en?: string
          welcome_text_de?: string
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          font_style?: string
        }
        Update: {
          restaurant_id?: string
          welcome_text_en?: string
          welcome_text_de?: string
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          font_style?: string
        }
      }
      menu_categories: {
        Row: {
          id: string
          restaurant_id: string
          name_en: string
          name_de: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name_en: string
          name_de: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name_en?: string
          name_de?: string
          sort_order?: number
          created_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          category_id: string
          name_en: string
          name_de: string
          description_en: string
          description_de: string
          price: number
          image_url: string | null
          is_vegetarian: boolean
          is_vegan: boolean
          spice_level: number
          meat_type: string | null
          is_sold_out: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name_en: string
          name_de: string
          description_en?: string
          description_de?: string
          price: number
          image_url?: string | null
          is_vegetarian?: boolean
          is_vegan?: boolean
          spice_level?: number
          meat_type?: string | null
          is_sold_out?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name_en?: string
          name_de?: string
          description_en?: string
          description_de?: string
          price?: number
          image_url?: string | null
          is_vegetarian?: boolean
          is_vegan?: boolean
          spice_level?: number
          meat_type?: string | null
          is_sold_out?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          restaurant_id: string
          title_en: string
          title_de: string
          description_en: string
          description_de: string
          discount_percentage: number
          valid_days: number[]
          valid_hours_start: string
          valid_hours_end: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          title_en: string
          title_de: string
          description_en?: string
          description_de?: string
          discount_percentage: number
          valid_days?: number[]
          valid_hours_start: string
          valid_hours_end: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          title_en?: string
          title_de?: string
          description_en?: string
          description_de?: string
          discount_percentage?: number
          valid_days?: number[]
          valid_hours_start?: string
          valid_hours_end?: string
          is_active?: boolean
          created_at?: string
        }
      }
      restaurant_admins: {
        Row: {
          id: string
          restaurant_id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          user_id: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
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