import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const LEGACY_JWT_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptbnhlbWNqZXZ0cGdzbmxyaXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MDkyMjcsImV4cCI6MjA5Mjk4NTIyN30.H7cD4PHnYBYdBcyCduNUf_snsGflqcMbbd-P5toCyBw";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://jmnxemcjevtpgsnlrium.supabase.co";

const rawKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_PUBLISHABLE_KEY = (!rawKey || rawKey.startsWith("sb_publishable_")) ? LEGACY_JWT_ANON_KEY : rawKey;

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY, 
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);