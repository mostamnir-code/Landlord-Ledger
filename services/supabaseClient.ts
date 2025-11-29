import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const isConfigured = !!(supabaseUrl && supabaseKey);

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!isConfigured) {
  console.error("Supabase URL or Key is not configured. Please check your .env.local file. The app will not function correctly.");
}
