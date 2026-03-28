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
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm px-8 py-4 flex items-center justify-between border-b border-zinc-100">
        <span className="text-sm font-semibold tracking-tight text-zinc-900">lifeline</span>
        <div className="flex items-center gap-2">
          <Link href="/demo">
            <Button variant="ghost" size="sm" className="text-zinc-500 text-xs">Demo</Button>
          </Link>
          {user ? (
            <Link href="/app">
              <Button size="sm" className="text-xs h-8 px-4 rounded-full">Dashboard →</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" className="text-xs h-8 px-4 rounded-full">Sign in</Button>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero — offset upward to account for sticky nav */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-6 pb-40">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-zinc-400 border border-zinc-100 rounded-full px-3 py-1">
            AI-powered safety calls
          </span>
          <h1 className="text-6xl font-semibold tracking-tight text-zinc-900 leading-[1.1] max-w-2xl">
            Say the word.<br />
            <span className="text-zinc-400">We make the call.</span>
          </h1>
          <p className="text-base text-zinc-500 max-w-md leading-relaxed">
            Lifeline listens for your trigger phrases and instantly dispatches an AI agent to call whoever you need — with your message and location.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Link href="/login">
              <Button size="lg" className="px-7 h-11 text-sm rounded-full">Get started</Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="px-7 h-11 text-sm rounded-full text-zinc-600">Try the demo</Button>
            </Link>
          </div>
        </section>

        {/* Feature sections — each fills the viewport, content constrained to fit */}
        <section className="w-full flex flex-col">

          {/* Feature 1 */}
          <div className="min-h-screen border-t border-zinc-200 flex items-center justify-center px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full max-w-5xl py-16">
              <div className="flex flex-col gap-5">
                <span className="text-xs font-medium tracking-widest uppercase text-zinc-400">Trigger configuration</span>
                <h2 className="text-4xl font-semibold tracking-tight text-zinc-900 leading-snug">
                  Set it up once.<br />It works every time.
                </h2>
                <p className="text-base text-zinc-500 leading-relaxed max-w-sm">
                  Create rules that map a spoken phrase to a phone number and a message. Say &ldquo;pizza&rdquo; and your mom gets a call. You define the logic.
                </p>
                <ul className="flex flex-col gap-2.5">
                  {["Custom trigger phrases", "Any phone number", "Fully custom AI message", "Optional GPS location"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-base text-zinc-600">
                      <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 w-full aspect-4/3 max-h-[55vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-center px-6">
                  <span className="text-3xl">⚙️</span>
                  <p className="text-xs text-zinc-400 font-medium">Screenshot: Trigger configuration</p>
                  <p className="text-xs text-zinc-300">Replace with actual app screenshot</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="min-h-screen border-t border-zinc-200 flex items-center justify-center px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full max-w-5xl py-16">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 w-full aspect-4/3 max-h-[55vh] flex items-center justify-center order-last md:order-first">
                <div className="flex flex-col items-center gap-2 text-center px-6">
                  <span className="text-3xl">🎙</span>
                  <p className="text-xs text-zinc-400 font-medium">Screenshot: Listen mode</p>
                  <p className="text-xs text-zinc-300">Replace with actual app screenshot</p>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <span className="text-xs font-medium tracking-widest uppercase text-zinc-400">Always listening</span>
                <h2 className="text-4xl font-semibold tracking-tight text-zinc-900 leading-snug">
                  Keep it open.<br />It&apos;s always on guard.
                </h2>
                <p className="text-base text-zinc-500 leading-relaxed max-w-sm">
                  The Listen page monitors your microphone in real time. The moment it hears a trigger, the call fires — no button press needed.
                </p>
                <ul className="flex flex-col gap-2.5">
                  {["Continuous background listening", "Matches multiple triggers at once", "Visual transcript feedback", "10-second cooldown to prevent duplicates"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-base text-zinc-600">
                      <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="min-h-screen border-t border-zinc-200 flex items-center justify-center px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full max-w-5xl py-16">
              <div className="flex flex-col gap-5">
                <span className="text-xs font-medium tracking-widest uppercase text-zinc-400">Call logs</span>
                <h2 className="text-4xl font-semibold tracking-tight text-zinc-900 leading-snug">
                  Every call,<br />accounted for.
                </h2>
                <p className="text-base text-zinc-500 leading-relaxed max-w-sm">
                  A full history of every call dispatched — what triggered it, who was called, what was said, and whether it went through.
                </p>
                <ul className="flex flex-col gap-2.5">
                  {["Timestamp and date", "Trigger phrase logged", "Message delivered", "Dispatch status"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-base text-zinc-600">
                      <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 w-full aspect-4/3 max-h-[55vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-center px-6">
                  <span className="text-3xl">📋</span>
                  <p className="text-xs text-zinc-400 font-medium">Screenshot: Call logs</p>
                  <p className="text-xs text-zinc-300">Replace with actual app screenshot</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="min-h-screen border-t border-zinc-200 flex flex-col items-center justify-center text-center gap-5 px-8">
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-900">Ready when you need it.</h2>
          <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
            Set up your triggers in under a minute. Free to get started.
          </p>
          <Link href="/login">
            <Button size="lg" className="px-8 h-11 text-sm rounded-full mt-2">Create your account →</Button>
          </Link>
        </section>
      </main>

      <footer className="px-8 py-6 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-xs text-zinc-400">© 2026 lifeline</span>
        <span className="text-xs text-zinc-400">Powered by Bland AI</span>
      </footer>
    </div>
  );
}
