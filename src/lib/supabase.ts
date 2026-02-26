import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create a real client if credentials are provided
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL_HERE') {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.info('[Mercadex] Supabase no configurado. Usando datos de demostración.');
}

export { supabase };
