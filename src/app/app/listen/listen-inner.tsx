"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TriggerRule } from "@/lib/types";
import Link from "next/link";

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
  const [log, setLog] = useState<{ rule: string; time: string; success: boolean }[]>([]);
  const [statuses, setStatuses] = useState<Record<string, "calling" | "done" | "error">>({});
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const cooldownRef = useRef<Set<string>>(new Set());

  const fireRule = useCallback(async (rule: TriggerRule) => {
    if (cooldownRef.current.has(rule.id)) return;
    cooldownRef.current.add(rule.id);
    setStatuses((s) => ({ ...s, [rule.id]: "calling" }));

    let locationSuffix = "";
    if (rule.include_location) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        const { latitude, longitude } = pos.coords;
        const geo = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          { headers: { "Accept-Language": "en" } }
        );
        const geoData = await geo.json();
        const address = geoData.display_name ?? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        locationSuffix = ` Their current location is: ${address}.`;
      } catch {
        locationSuffix = " Note: location could not be determined.";
      }
    }

    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: rule.phone_number,
          message: rule.message + locationSuffix,
          trigger_phrase: rule.trigger_phrase,
          user_id: userId,
        }),
      });
      const success = res.ok;
      setStatuses((s) => ({ ...s, [rule.id]: success ? "done" : "error" }));
      setLog((l) => [{ rule: rule.name, time: new Date().toLocaleTimeString(), success }, ...l]);
    } catch {
      setStatuses((s) => ({ ...s, [rule.id]: "error" }));
      setLog((l) => [{ rule: rule.name, time: new Date().toLocaleTimeString(), success: false }, ...l]);
    }

    setTimeout(() => cooldownRef.current.delete(rule.id), 10000);
  }, [userId]);

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
        if (lower.includes(rule.trigger_phrase.toLowerCase().trim())) fireRule(rule);
      }
    };

    r.onend = () => { setListening((prev) => { if (prev) r.start(); return prev; }); };
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
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Listen</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Keep this page open. Trigger phrases are detected in real time.
        </p>
      </div>

      {!micSupported ? (
        <div className="rounded-xl border border-zinc-100 p-6">
          <p className="text-sm text-zinc-500">Microphone not available. Try Chrome or Edge.</p>
        </div>
      ) : rules.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 px-6 py-12 flex flex-col items-center gap-3 text-center">
          <span className="text-2xl">⚡</span>
          <p className="text-sm font-medium text-zinc-700">No triggers configured</p>
          <p className="text-xs text-zinc-400">Add triggers on the Triggers page first.</p>
          <Link href="/app" className="text-xs text-zinc-600 underline underline-offset-2 mt-1">Go to Triggers →</Link>
        </div>
      ) : (
        <>
          {/* Big listen button */}
          <button
            onClick={toggle}
            className={`w-full rounded-xl border-2 py-8 flex flex-col items-center gap-3 transition-all ${
              listening
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
            }`}
          >
            <span className="text-3xl">{listening ? "🎙" : "🎙"}</span>
            <span className="text-sm font-medium">{listening ? "Listening — say your trigger" : "Start listening"}</span>
            {listening && (
              <span className="flex gap-1 items-end h-5">
                {[0,1,2,3,4].map((i) => (
                  <span key={i} className="w-0.5 bg-white/60 rounded-full animate-pulse"
                    style={{ height: `${6 + (i % 3) * 5}px`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </span>
            )}
            {listening && transcript && (
              <span className="text-xs text-white/50 italic max-w-xs truncate">&ldquo;{transcript}&rdquo;</span>
            )}
          </button>

          {/* Active triggers */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Active triggers</p>
            <div className="rounded-xl border border-zinc-100 overflow-hidden">
              {rules.map((rule, i) => {
                const s = statuses[rule.id];
                return (
                  <div key={rule.id} className={`px-5 py-3.5 flex items-center justify-between gap-4 ${
                    i !== rules.length - 1 ? "border-b border-zinc-100" : ""
                  } ${s === "calling" ? "bg-zinc-50" : ""}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        s === "calling" ? "bg-zinc-400 animate-pulse" :
                        s === "done" ? "bg-zinc-900" :
                        s === "error" ? "bg-red-400" :
                        listening ? "bg-zinc-300" : "bg-zinc-200"
                      }`} />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-900">{rule.name}</span>
                          <span className="text-xs font-mono bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded">
                            &ldquo;{rule.trigger_phrase}&rdquo;
                          </span>
                        </div>
                        <span className="text-xs text-zinc-400 truncate">→ {rule.phone_number}</span>
                      </div>
                    </div>
                    {s && (
                      <span className={`text-xs font-medium shrink-0 ${
                        s === "calling" ? "text-zinc-400" :
                        s === "done" ? "text-zinc-700" : "text-red-400"
                      }`}>
                        {s === "calling" ? "Calling..." : s === "done" ? "✓ Called" : "✕ Failed"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Session log */}
          {log.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Session log</p>
              <div className="flex flex-col gap-1">
                {log.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">
                      <span className={entry.success ? "text-zinc-700 font-medium" : "text-red-400 font-medium"}>{entry.rule}</span>
                      {" "}triggered
                    </span>
                    <span className="text-zinc-300">{entry.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
