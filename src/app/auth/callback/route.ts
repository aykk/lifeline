import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/config";

/**
 * OAuth / magic-link callback. Session cookies must be set on the same
 * NextResponse as the redirect — using `cookies()` from `next/headers` here
 * often fails on Vercel (session never sticks, infinite login loop).
 */
export async function GET(request: NextRequest) {
  let url: string;
  let anon: string;
  try {
    const env = getSupabaseEnv();
    url = env.url;
    anon = env.anonKey;
  } catch {
    return NextResponse.json({ error: "Supabase is not configured (missing env vars)." }, { status: 500 });
  }

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const nextPath = "/app";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", origin));
  }

  const redirectTo = new URL(nextPath, origin);
  let response = NextResponse.redirect(redirectTo);

  const supabase = createServerClient(url, anon, {
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
