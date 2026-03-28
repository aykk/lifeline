"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const VoiceSection = dynamic(() => import("../app/voice-section"), { ssr: false });

export default function DemoPage() {
  const [phone, setPhone] = useState("");
  const [trigger, setTrigger] = useState("i'm getting a phone call");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleCall() {
    if (!phone.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("Call incoming. Pick up your phone.");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-8 py-6 flex items-center justify-between border-b border-zinc-100">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-900">
          clarify
        </Link>
        <Link href="/login">
          <Button size="sm" variant="outline">Sign in for full access</Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-widest uppercase text-zinc-400">Demo</span>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Get a call</h2>
            <p className="text-sm text-zinc-500">Try it out — no account needed.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCall()}
              className="h-11 text-sm"
              disabled={status === "loading"}
            />

            <VoiceSection
              phone={phone}
              trigger={trigger}
              onTriggerChange={setTrigger}
              onCall={handleCall}
              disabled={status === "loading"}
            />

            <Button
              onClick={handleCall}
              disabled={status === "loading" || !phone.trim()}
              className="h-11 w-full rounded-lg text-sm"
            >
              {status === "loading" ? "Calling..." : "Call me"}
            </Button>
          </div>

          {message && (
            <p className={`text-sm text-center ${status === "success" ? "text-zinc-600" : "text-red-500"}`}>
              {message}
            </p>
          )}
        </div>
      </main>

      <footer className="px-8 py-6 border-t border-zinc-100">
        <span className="text-xs text-zinc-400">Powered by Bland AI</span>
      </footer>
    </div>
  );
}
