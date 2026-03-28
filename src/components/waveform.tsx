"use client";

import { useEffect, useState } from "react";

const phrases = [
  "pizza",
  "I need help",
  "call mom",
  "get me out of here",
  "emergency",
  "I'm not safe",
];

export default function Waveform() {
  const [displayed, setDisplayed] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];

    if (!deleting && charIndex < current.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), 80);
      return () => clearTimeout(t);
    }

    if (!deleting && charIndex === current.length) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    }

    if (deleting && charIndex > 0) {
      const t = setTimeout(() => setCharIndex((c) => c - 1), 45);
      return () => clearTimeout(t);
    }

    if (deleting && charIndex === 0) {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }
  }, [charIndex, deleting, phraseIndex]);

  useEffect(() => {
    setDisplayed(phrases[phraseIndex].slice(0, charIndex));
  }, [charIndex, phraseIndex]);

  return (
    <div className="absolute bottom-20 left-0 right-0 flex items-center justify-center pointer-events-none">
      <div className="flex items-center gap-2 text-zinc-400">
        <span className="text-xs tracking-widest uppercase font-medium">say</span>
        <span className="font-mono text-sm text-zinc-500 min-w-[140px]">
          &ldquo;{displayed}
          <span className="inline-block w-[1px] h-[13px] bg-zinc-400 ml-[1px] align-middle animate-pulse" />
          &rdquo;
        </span>
      </div>
    </div>
  );
}
