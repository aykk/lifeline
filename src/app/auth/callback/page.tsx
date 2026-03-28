"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * PKCE code_verifier lives in cookies set by the browser Supabase client.
 * Exchanging the code must run in the browser — a Route Handler often misses
 * the verifier and the flow hangs after Google account selection.
 */
function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    const code = searchParams.get("code");
    const errParam = searchParams.get("error_description") ?? searchParams.get("error");

    if (errParam) {
      router.replace(`/login?error=${encodeURIComponent(errParam)}`);
      return;
    }

    if (!code) {
      router.replace("/login?error=missing_code");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          router.replace(`/login?error=${encodeURIComponent(error.message)}`);
          return;
        }
        router.replace("/app");
        router.refresh();
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "Sign-in failed";
        setMessage("Something went wrong. Redirecting…");
        router.replace(`/login?error=${encodeURIComponent(msg)}`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center px-6">
      <p className="text-sm text-zinc-600">{message}</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-sm text-zinc-500">Loading…</p>
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
