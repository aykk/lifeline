import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./config";

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:";

  return createBrowserClient(url, anonKey, {
    isSingleton: true,
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      secure,
    },
  });
}
