import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {}

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-zinc-100">
        <span className="text-sm font-semibold tracking-tight text-zinc-900">clarify</span>
        <div className="flex items-center gap-2">
          <Link href="/demo">
            <Button variant="ghost" size="sm" className="text-zinc-500">Demo</Button>
          </Link>
          {user ? (
            <Link href="/app">
              <Button size="sm">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-8">
        <div className="flex flex-col items-center gap-4 max-w-xl">
          <span className="text-xs font-medium tracking-widest uppercase text-zinc-400">AI-powered calls</span>
          <h1 className="text-5xl font-semibold tracking-tight text-zinc-900 leading-tight">
            Your AI agent,<br />on the line.
          </h1>
          <p className="text-base text-zinc-500 max-w-sm leading-relaxed">
            Drop your number. We&apos;ll have an AI call you in seconds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/demo">
            <Button variant="outline" size="lg" className="px-8 h-11 text-sm rounded-full">
              Demo
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" className="px-8 h-11 text-sm rounded-full">
              Get started →
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-xs text-zinc-400">© 2026 clarify</span>
        <span className="text-xs text-zinc-400">Powered by Bland AI</span>
      </footer>
    </div>
  );
}
