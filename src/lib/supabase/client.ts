import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./config";

/** Default @supabase/ssr cookie behavior; keep in sync with server/middleware (no custom cookieOptions). */
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
