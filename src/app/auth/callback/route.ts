import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/config";

/**
 * OAuth / magic-link return. Exchange `code` using cookies on the **incoming request**
 * (PKCE verifier is in those cookies). Session cookies are written onto the same
 * `NextResponse.redirect` as Supabase recommends.
 *
 * Middleware must **not** run `updateSession` on this path (see `src/middleware.ts`)
 * or the code-verifier cookie can be cleared before this handler runs.
 */
export async function GET(request: NextRequest) {
  let supabaseUrl: string;
  let anonKey: string;
  try {
    const env = getSupabaseEnv();
    supabaseUrl = env.url;
    anonKey = env.anonKey;
  } catch {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const oauthError =
    requestUrl.searchParams.get("error_description") ?? requestUrl.searchParams.get("error");
  const origin = requestUrl.origin;

  if (oauthError) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(oauthError)}`, origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", origin));
  }

  const redirectToApp = new URL("/app", origin);
  const response = NextResponse.redirect(redirectToApp);

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, origin)
    );
  }

  return response;
}
