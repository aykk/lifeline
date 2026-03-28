/**
 * NEXT_PUBLIC_* vars are required at runtime (browser + server).
 * Vercel: Project → Settings → Environment Variables (enable for Production + Preview).
 * Local: copy `example.env` → `.env.local` and fill values from Supabase dashboard.
 */
export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  if (!url || !anonKey) {
    throw new Error(
      [
        "Supabase URL and anon key are missing.",
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        "Local: .env.local  ·  Vercel: Project Settings → Environment Variables",
        "Values: https://supabase.com/dashboard/project/_/settings/api",
      ].join(" ")
    );
  }

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  if (!url || !key) return false;
  if (url === "your_supabase_project_url") return false;
  if (key === "your_supabase_anon_key" || key.startsWith("your_")) return false;
  return true;
}
