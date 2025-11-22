import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = SupabaseUser;

export interface Category {
  id: string;
  name: string;
  user_id?: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  completed: boolean;
  user_id?: string;
  // Novos campos opcionais
  photoUrl?: string;
  productUrl?: string;
  notes?: string;
}

export interface Message {
  id: string;
  text: string;
  user_name: string;
  created_at: string;
  user_id?: string;
}