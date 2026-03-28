import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Settings, Mic, ClipboardList } from "lucide-react";
import ThreadsBg from "@/components/threads-bg";
import Navbar from "@/components/navbar";

export default async function Home() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {}

  return (
    <div className="min-h-screen bg-[var(--lifeline-canvas)] text-zinc-900 flex flex-col">
      <Navbar isLoggedIn={!!user} />

      <main className="flex-1 flex flex-col">
        {/* ── Hero ── */}
        <section
          id="hero"
          className="lifeline-hero-field relative min-h-dvh flex flex-col items-center justify-center text-center px-6 gap-7 pb-32 pt-20 overflow-hidden section-hairline-b"
        >
          <ThreadsBg />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.1) 100%)",
            }}
          />

          <span className="lifeline-kicker relative rounded-full border border-zinc-300/70 bg-white/55 backdrop-blur-md px-3.5 py-2 shadow-sm shadow-zinc-900/5">
            Powered by Bland AI
          </span>
          <h1 className="relative text-5xl sm:text-6xl font-semibold tracking-tight text-zinc-900 leading-[1.1] max-w-2xl">
            Say the word.
            <br />
            <span className="text-zinc-400">We make the call.</span>
          </h1>
          <p className="relative text-base text-zinc-600 max-w-md leading-relaxed">
            Lifeline listens for your trigger phrases and instantly dispatches an AI agent to call whoever you need, with your message and location.
          </p>
          <div className="relative flex flex-wrap items-center justify-center gap-3">
            <a href="#what-is-lifeline">
              <Button
                variant="outline"
                size="lg"
                className="px-7 h-11 text-sm rounded-full border-zinc-300/90 bg-white/60 text-zinc-700 hover:bg-white hover:text-zinc-900"
              >
                Learn more
              </Button>
            </a>
            <Link href="/login">
              <Button size="lg" className="px-7 h-11 text-sm rounded-full shadow-sm">
                Get started
              </Button>
            </Link>
          </div>
        </section>

        {/* ── What is Lifeline? ── */}
        <section
          id="what-is-lifeline"
          className="min-h-dvh flex flex-col items-center justify-center px-8 md:px-16 py-24 section-hairline-b bg-[var(--lifeline-band)]"
        >
          <div className="w-full max-w-3xl flex flex-col gap-8 text-center md:text-left md:mx-auto">
            <span className="lifeline-section-label">What is Lifeline?</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 leading-snug">
              When seconds matter, fumbling for your phone is not an option.
            </h2>
            <div className="flex flex-col gap-5 text-base text-zinc-600 leading-relaxed text-left">
              <p>
                In a real emergency, or even a moment when you need someone to know where you are, the gap between thinking &ldquo;I need help&rdquo; and actually placing a call can feel impossible. Screens lock, hands are full, or you cannot safely dial.
              </p>
              <p>
                We built Lifeline so you can use your voice as the fastest path out. You choose a phrase only you would say, who gets called, and what the AI should tell them. Keep Listen open, and if that phrase is ever heard, a call goes out automatically, no tap, no unlock, no second guess.
              </p>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section
          id="how-it-works"
          className="min-h-dvh flex flex-col justify-center bg-[var(--lifeline-canvas)] section-hairline-b px-8 md:px-16 py-20"
        >
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-12 md:gap-16">
            <div className="flex flex-col gap-3 max-w-lg">
              <span className="lifeline-section-label">How it works</span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 leading-snug">
                Three steps. One word. Someone gets the call.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl border border-zinc-900/[0.08] bg-white/85 shadow-lg shadow-zinc-900/[0.04] ring-1 ring-white/80 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-zinc-900/[0.07]">
              {[
                {
                  n: "01",
                  title: "Set a trigger",
                  body: "Choose a word or phrase that acts as your signal, something natural you'd say in conversation.",
                },
                {
                  n: "02",
                  title: "Configure the call",
                  body: "Pick who gets called and write the exact message the AI delivers. Add your location if needed.",
                },
                {
                  n: "03",
                  title: "Say the word",
                  body: "Keep the Listen page open. The moment Lifeline hears your phrase, the call fires automatically.",
                },
              ].map(({ n, title, body }) => (
                <div key={n} className="flex flex-col gap-4 px-6 md:px-8 py-10 bg-white/60">
                  <span className="text-xs font-mono font-semibold text-[var(--lifeline-accent)] tabular-nums">
                    {n}
                  </span>
                  <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature: triggers ── */}
        <section
          id="trigger-config"
          className="min-h-dvh flex items-center justify-center px-8 md:px-16 py-20 bg-[var(--lifeline-band)] section-hairline-b"
        >
          <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-center w-full max-w-5xl">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Settings className="size-4 text-[var(--lifeline-accent)]" />
                <span className="lifeline-section-label">Trigger configuration</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 leading-tight">
                Set it up once.
                <br />
                It works every time.
              </h2>
              <p className="text-base text-zinc-600 leading-relaxed">
                Map any spoken phrase to a phone number and a custom AI message. Say &ldquo;pizza&rdquo; and your mom gets a call. You define the logic.
              </p>
              <div className="flex flex-col gap-0 pt-1">
                {[
                  "Custom trigger phrases",
                  "Any phone number",
                  "Fully custom AI message",
                  "Optional GPS location",
                ].map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-3 py-2.5 border-b border-zinc-300/60 last:border-0"
                  >
                    <span className="w-1 h-1 rounded-full bg-[var(--lifeline-accent)] shrink-0 opacity-80" />
                    <span className="text-sm text-zinc-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-900/[0.08] bg-white/90 shadow-lg shadow-zinc-900/[0.05] ring-1 ring-white/60 w-full aspect-4/3 max-h-[min(50vh,28rem)] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center px-8">
                <div className="w-10 h-10 rounded-xl bg-[var(--lifeline-canvas)] border border-zinc-200/80 flex items-center justify-center">
                  <Settings className="size-5 text-[var(--lifeline-accent)] opacity-80" />
                </div>
                <p className="text-sm text-zinc-500">Screenshot: Trigger configuration</p>
                <p className="text-xs text-zinc-400">Replace with actual app screenshot</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature: listen ── */}
        <section className="min-h-dvh flex items-center justify-center px-8 md:px-16 py-20 bg-[var(--lifeline-canvas)] section-hairline-b">
          <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-center w-full max-w-5xl">
            <div className="rounded-2xl border border-zinc-900/[0.08] bg-white/90 shadow-lg shadow-zinc-900/[0.05] ring-1 ring-white/60 w-full aspect-4/3 max-h-[min(50vh,28rem)] flex items-center justify-center order-last md:order-first">
              <div className="flex flex-col items-center gap-3 text-center px-8">
                <div className="w-10 h-10 rounded-xl bg-[var(--lifeline-canvas)] border border-zinc-200/80 flex items-center justify-center">
                  <Mic className="size-5 text-[var(--lifeline-accent)] opacity-80" />
                </div>
                <p className="text-sm text-zinc-500">Screenshot: Listen mode</p>
                <p className="text-xs text-zinc-400">Replace with actual app screenshot</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Mic className="size-4 text-[var(--lifeline-accent)]" />
                <span className="lifeline-section-label">Always listening</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 leading-tight">
                Keep it open.
                <br />
                It&apos;s always on guard.
              </h2>
              <p className="text-base text-zinc-600 leading-relaxed">
                The Listen page monitors your microphone in real time. The moment it hears a trigger, the call fires, no button press needed.
              </p>
              <div className="flex flex-col gap-0 pt-1">
                {[
                  "Continuous background listening",
                  "Matches multiple triggers at once",
                  "Visual transcript feedback",
                  "10-second cooldown to prevent duplicates",
                ].map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-3 py-2.5 border-b border-zinc-200/90 last:border-0"
                  >
                    <span className="w-1 h-1 rounded-full bg-[var(--lifeline-accent)] shrink-0 opacity-80" />
                    <span className="text-sm text-zinc-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature: logs ── */}
        <section
          id="logs"
          className="min-h-dvh flex items-center justify-center px-8 md:px-16 py-20 bg-[var(--lifeline-band)] section-hairline-b"
        >
          <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-center w-full max-w-5xl">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <ClipboardList className="size-4 text-[var(--lifeline-accent)]" />
                <span className="lifeline-section-label">Call logs</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 leading-tight">
                Every call,
                <br />
                accounted for.
              </h2>
              <p className="text-base text-zinc-600 leading-relaxed">
                A full history of every call dispatched, what triggered it, who was called, what was said, and whether it went through.
              </p>
              <div className="flex flex-col gap-0 pt-1">
                {["Timestamp and date", "Trigger phrase logged", "Message delivered", "Dispatch status"].map(
                  (f) => (
                    <div
                      key={f}
                      className="flex items-center gap-3 py-2.5 border-b border-zinc-300/60 last:border-0"
                    >
                      <span className="w-1 h-1 rounded-full bg-[var(--lifeline-accent)] shrink-0 opacity-80" />
                      <span className="text-sm text-zinc-700">{f}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-900/[0.08] bg-white/90 shadow-lg shadow-zinc-900/[0.05] ring-1 ring-white/60 w-full aspect-4/3 max-h-[min(50vh,28rem)] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center px-8">
                <div className="w-10 h-10 rounded-xl bg-[var(--lifeline-canvas)] border border-zinc-200/80 flex items-center justify-center">
                  <ClipboardList className="size-5 text-[var(--lifeline-accent)] opacity-80" />
                </div>
                <p className="text-sm text-zinc-500">Screenshot: Call logs</p>
                <p className="text-xs text-zinc-400">Replace with actual app screenshot</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          id="get-started"
          className="min-h-dvh flex flex-col items-center justify-center text-center gap-6 px-8 py-24 bg-[var(--lifeline-canvas)] section-hairline-b relative"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 80%, var(--lifeline-accent-soft), transparent 65%)",
            }}
          />
          <p className="lifeline-section-label relative">Get started</p>
          <h2 className="relative text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 max-w-md">
            Ready when you need it.
          </h2>
          <p className="relative text-base text-zinc-600 max-w-sm leading-relaxed">
            Set up your triggers in under a minute. Free to get started.
          </p>
          <Link href="/login" className="relative">
            <Button size="lg" className="px-8 h-11 text-sm rounded-full mt-2 shadow-md shadow-zinc-900/10">
              Create your account →
            </Button>
          </Link>
        </section>
      </main>

      <footer className="bg-[var(--lifeline-band)] px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-medium text-zinc-500 tracking-wide">© 2026 lifeline.</span>
        <span className="text-xs text-zinc-400">Voice calls powered by Bland AI</span>
      </footer>
    </div>
  );
}
