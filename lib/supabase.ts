import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || url === 'your_supabase_url') {
      // Return a mock client that won't crash during build
      return createClient('https://placeholder.supabase.co', 'placeholder-key');
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

// Keep backward compat export
export const supabase = typeof window !== 'undefined' 
  ? (() => { try { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); } catch { return null as unknown as SupabaseClient; } })()
  : null as unknown as SupabaseClient;

// Server-side client with service role key
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === 'your_supabase_url') {
    return createClient('https://placeholder.supabase.co', 'placeholder-key');
  }
  return createClient(url, key);
}

export type Incident = {
  id: number;
  lambarka_warbixinta: string;
  taariikhda: string;
  degmada: string;
  nooca_hantida: string;
  sababta_dabka: string;
  magaca_milkiilaha: string;
  telefoon: string | null;
  khasaaraha_nafeed: string | null;
  khasaaraha_hantida: number;
  tirada_dabdamiyasha: number;
  tirada_gaadiidka: number;
  waqtiga_jawaabta: number;
  muddada_hawlgalka: number;
  biyaha_la_isticmaalay: number;
  foam_la_isticmaalay: number;
  taliyaha_hawlgalka: string;
  sharaxaadda: string;
  xaaladda: string;
  created_at: string;
  updated_at: string;
};
