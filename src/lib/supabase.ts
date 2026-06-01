import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string;
          subscription_tier: 'free' | 'professional' | 'enterprise';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string;
          avatar_url?: string;
          subscription_tier?: 'free' | 'professional' | 'enterprise';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          subscription_tier?: 'free' | 'professional' | 'enterprise';
          created_at?: string;
          updated_at?: string;
        };
      };
      cvs: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          template: string;
          color_theme: string;
          language: 'fr' | 'en';
          personal_info: Json;
          is_draft: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          template?: string;
          color_theme?: string;
          language?: 'fr' | 'en';
          personal_info?: Json;
          is_draft?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          template?: string;
          color_theme?: string;
          language?: 'fr' | 'en';
          personal_info?: Json;
          is_draft?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      experiences: {
        Row: {
          id: string;
          cv_id: string;
          company: string;
          position: string;
          location: string;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          description: string;
          achievements: Json;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cv_id: string;
          company?: string;
          position?: string;
          location?: string;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          description?: string;
          achievements?: Json;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          cv_id?: string;
          company?: string;
          position?: string;
          location?: string;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          description?: string;
          achievements?: Json;
          display_order?: number;
          created_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          cv_id: string;
          institution: string;
          degree: string;
          field: string;
          location: string;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          description: string;
          achievements: Json;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cv_id: string;
          institution?: string;
          degree?: string;
          field?: string;
          location?: string;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          description?: string;
          achievements?: Json;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          cv_id?: string;
          institution?: string;
          degree?: string;
          field?: string;
          location?: string;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          description?: string;
          achievements?: Json;
          display_order?: number;
          created_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          cv_id: string;
          name: string;
          level: number;
          category: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cv_id: string;
          name?: string;
          level?: number;
          category?: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          cv_id?: string;
          name?: string;
          level?: number;
          category?: string;
          display_order?: number;
          created_at?: string;
        };
      };
    };
  };
};
