import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
let supabaseUrl = rawUrl;

if (supabaseUrl) {
  // Handle project ID only
  if (!supabaseUrl.includes(".") && supabaseUrl.length === 20) {
    supabaseUrl = `${supabaseUrl}.supabase.co`;
  }
  // Ensure protocol
  if (!supabaseUrl.startsWith('http')) {
    supabaseUrl = `https://${supabaseUrl}`;
  }
}

const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing or incomplete in environment variables.');
}

const isConfigured = !!(supabaseUrl && supabaseAnonKey);

export const isSupabaseConfigured = isConfigured;

export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder-anon-key'
);
