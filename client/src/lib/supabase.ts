import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase環境変数が設定されていません。.env.localを確認してください。");
}

// Provide fallback empty strings to prevent crash; queries will fail gracefully
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
