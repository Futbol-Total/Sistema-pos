import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Restaurant = {
  id: string;
  name: string;
  currency: string;
  tax_percentage: number;
  include_tax?: boolean;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  total_sales?: number;
  total_orders?: number;
  created_at: string;
};

export type Employee = {
  id: string;
  restaurant_id: string;
  name: string;
  position: string;
  phone?: string;
  email?: string;
  salary_per_month?: number;
  is_active: boolean;
  created_at: string;
};

export type Category = {
  id: string;
  restaurant_id: string;
  name: string;
  icon: string;
  sort_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  sort_order: number;
  created_at: string;
};

export type Table = {
  id: string;
  restaurant_id: string;
  table_number: number;
  capacity: number;
  is_occupied: boolean;
  current_order_id: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  restaurant_id: string;
  table_id: string;
  employee_id?: string;
  status: 'open' | 'closed' | 'paid';
  subtotal: number;
  tax: number;
  total: number;
  tip_amount?: number;
  payment_method: string | null;
  notes: string | null;
  opened_at: string;
  closed_at: string | null;
  order_duration_minutes?: number;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  notes: string | null;
  created_at: string;
};
