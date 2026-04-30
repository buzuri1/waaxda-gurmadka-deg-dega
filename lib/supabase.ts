import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
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
