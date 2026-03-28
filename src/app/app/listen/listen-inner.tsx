"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TriggerRule } from "@/lib/types";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface Props {
  rules: TriggerRule[];
  userId: string;
}

export default function ListenInner({ rules, userId }: Props) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [micSupported, setMicSupported] = useState(true);
  const [log, setLog] = useState<{ rule: string; time: string }[]>([]);
  const [status, setStatus] = useState<{ ruleId: string; state: "calling" | "done" | "error" } | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const cooldownRef = useRef<Set<string>>(new Set());

  const fireRule = useCallback(async (rule: TriggerRule) => {
    if (cooldownRef.current.has(rule.id)) return;
    cooldownRef.current.add(rule.id);
    setStatus({ ruleId: rule.id, state: "calling" });
    setLog((l) => [{ rule: rule.name, time: new Date().toLocaleTimeString() }, ...l]);

    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: rule.phone_number,
          message: rule.message,
          trigger_phrase: rule.trigger_phrase,
          user_id: userId,
        }),
      });
      setStatus({ ruleId: rule.id, state: res.ok ? "done" : "error" });
    } catch {
      setStatus({ ruleId: rule.id, state: "error" });
    }

    // 10s cooldown per rule to avoid re-firing
    setTimeout(() => cooldownRef.current.delete(rule.id), 10000);
  }, []);

  useEffect(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) { setMicSupported(false); return; }

    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";

    r.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        interim += e.results[i][0].transcript;
      }
      setTranscript(interim);

      const lower = interim.toLowerCase();
      for (const rule of rules) {
        if (lower.includes(rule.trigger_phrase.toLowerCase().trim())) {
          fireRule(rule);
        }
      }
    };

    r.onend = () => {
      setListening((prev) => { if (prev) r.start(); return prev; });
    };

    r.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "not-allowed") { setMicSupported(false); setListening(false); }
    };

    recognitionRef.current = r;
    return () => { r.onend = null; r.stop(); };
  }, [rules, fireRule]);

  function toggle() {
    const r = recognitionRef.current;
    if (!r) return;
    if (listening) {
      r.onend = null; r.stop();
      setListening(false); setTranscript("");
    } else {
      r.start(); setListening(true);
    }
  }

  return (
    <div className="px-8 py-8 max-w-2xl flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Listen</h1>
        <p className="text-sm text-zinc-500">
          Keep this page open. When a trigger phrase is heard, the AI will call the configured number.
        </p>
      </div>

      {!micSupported ? (
        <div className="border border-zinc-100 rounded-xl p-6">
          <p className="text-sm text-zinc-500">Microphone not available in this browser. Try Chrome or Edge.</p>
        </div>
      ) : (
        <div className="border border-zinc-100 rounded-xl p-6 flex flex-col gap-4">
          <button
            onClick={toggle}
            disabled={rules.length === 0}
            className={`flex items-center justify-between w-full h-12 px-5 rounded-lg border text-sm font-medium transition-colors
              ${listening
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
              } disabled:opacity-40 disabled:pointer-events-none`}
          >
            <span>{listening ? "🎙 Listening for triggers..." : "🎙 Start listening"}</span>
            {listening && (
              <span className="flex gap-0.5 items-end h-4">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="w-0.5 bg-white rounded-full animate-pulse"
                    style={{ height: `${6 + i * 3}px`, animationDelay: `${i * 0.12}s` }} />
                ))}
              </span>
            )}
          </button>

          {rules.length === 0 && (
            <p className="text-xs text-zinc-400">No rules configured. Add some on the Dashboard first.</p>
          )}

          {listening && transcript && (
            <p className="text-xs text-zinc-400 italic truncate">&ldquo;{transcript}&rdquo;</p>
          )}
        </div>
      )}

      {/* Active rules */}
      {rules.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Active rules</h2>
          {rules.map((rule) => (
            <div key={rule.id} className={`border rounded-xl px-5 py-3 flex items-center justify-between transition-colors ${
              status?.ruleId === rule.id && status.state === "calling"
                ? "border-zinc-900 bg-zinc-50"
                : "border-zinc-100"
            }`}>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-900">{rule.name}</span>
                  <span className="text-xs font-mono bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">
                    &ldquo;{rule.trigger_phrase}&rdquo;
                  </span>
                </div>
                <span className="text-xs text-zinc-400">→ {rule.phone_number}</span>
              </div>
              {status?.ruleId === rule.id && (
                <span className={`text-xs font-medium ${
                  status.state === "calling" ? "text-zinc-500" :
                  status.state === "done" ? "text-zinc-900" : "text-red-500"
                }`}>
                  {status.state === "calling" ? "Calling..." : status.state === "done" ? "Called ✓" : "Failed"}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Call log */}
      {log.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Call log</h2>
          {log.map((entry, i) => (
            <div key={i} className="flex items-center justify-between text-xs text-zinc-400">
              <span>Triggered: <span className="text-zinc-600 font-medium">{entry.rule}</span></span>
              <span>{entry.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
