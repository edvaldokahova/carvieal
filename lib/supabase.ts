import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** true quando as variáveis do Supabase estão configuradas (na Vercel ou em .env.local). */
export const supabaseConfigurado = Boolean(url && key);

export const supabase: SupabaseClient = supabaseConfigurado
  ? createClient(url!, key!)
  : (new Proxy({}, { get() { throw new Error("Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."); } }) as SupabaseClient);

export const STORE_SLUG = "carvieal";
