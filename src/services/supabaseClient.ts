import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  farm_location?: string;
  phone_number?: string;
  farm_size?: number;
  farm_size_unit?: string;
  created_at: string;
  updated_at: string;
}

export interface FertilizerRecommendation {
  id: string;
  user_id: string;
  field_name: string;
  field_size: number;
  field_size_unit: string;
  crop_type: string;
  soil_type: string;
  soil_ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  ml_prediction_fertilizer: string;
  ml_prediction_confidence: number;
  primary_fertilizer_name: string;
  primary_fertilizer_amount: string;
  secondary_fertilizer_name: string;
  secondary_fertilizer_amount: string;
  total_cost_estimate: string;
  created_at: string;
}