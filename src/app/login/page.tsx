"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-900">clarify</Link>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Sign in</h1>
          <p className="text-sm text-zinc-500">We&apos;ll send you a magic link.</p>
        </div>

        {sent ? (
          <div className="flex flex-col gap-3">
            <div className="border border-zinc-100 rounded-xl px-5 py-4">
              <p className="text-sm text-zinc-700 font-medium">Check your email</p>
              <p className="text-sm text-zinc-500 mt-1">We sent a link to <span className="text-zinc-900">{email}</span>. Click it to sign in.</p>
            </div>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors text-left"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 text-sm"
              autoFocus
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button type="submit" disabled={loading || !email.trim()} className="h-11 text-sm">
              {loading ? "Sending..." : "Send magic link"}
            </Button>
          </form>
        )}

        <p className="text-xs text-zinc-400 text-center">
          Just want to try it?{" "}
          <Link href="/demo" className="text-zinc-600 hover:text-zinc-900 transition-colors">
            Use the demo
          </Link>
        </p>
      </div>
    </div>
  );
}
