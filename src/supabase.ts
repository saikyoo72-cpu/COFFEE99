import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mvzylepgbvfbgupanelf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_zZLHCEtjVoL-tF-LevFu4Q_rPKjT6Qs';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing in environment variables.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
