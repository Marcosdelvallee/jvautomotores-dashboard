import { createBrowserClient } from '@supabase/ssr';

// Validar que las variables de entorno estén configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Cliente de Supabase para uso en el cliente (Client Components)
// Usamos createBrowserClient para que maneje las cookies automáticamente
export const supabase = supabaseUrl && supabaseAnonKey
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null as any;


