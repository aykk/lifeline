"use client";

import { useState } from "react";
import type { CallLog } from "@/lib/types";

function LogRow({
  log,
  isLast,
}: {
  log: CallLog;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(log.summary ?? null);

  async function toggle() {
    if (!expanded && !summary) {
      setLoading(true);
      try {
        const res = await fetch(`/api/summary/${log.id}`, { method: "POST" });
        const data = await res.json();
        if (data.summary) setSummary(data.summary);
      } finally {
        setLoading(false);
      }
    }
    setExpanded((v) => !v);
  }

  const date = new Date(log.created_at);

  return (
    <div className={`flex flex-col ${!isLast ? "border-b border-zinc-100" : ""}`}>
      <button
        onClick={toggle}
        className="px-5 py-4 flex items-start justify-between gap-6 w-full text-left hover:bg-zinc-50 transition-colors"
      >
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md">
              &ldquo;{log.trigger_phrase}&rdquo;
            </span>
            <span className="text-xs text-zinc-300">→</span>
            <span className="text-xs font-medium text-zinc-700">{log.phone_number}</span>
          </div>
          <p className="text-xs text-zinc-400 italic truncate max-w-sm">&ldquo;{log.message}&rdquo;</p>
          <p className="text-xs text-zinc-300">
            {date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            {" · "}
            {date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-2 pt-0.5">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
            log.success ? "bg-zinc-100 text-zinc-700" : "bg-red-50 text-red-500"
          }`}>
            {log.success ? "✓ dispatched" : "✕ failed"}
          </span>
          <span className="text-xs text-zinc-300">{expanded ? "▲ hide" : "▼ summary"}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-zinc-50">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2 mt-3">
            AI incident summary
          </p>
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
              <span className="text-xs text-zinc-400">Generating summary...</span>
            </div>
          ) : summary ? (
            <p className="text-sm text-zinc-600 leading-relaxed">{summary}</p>
          ) : (
            <p className="text-xs text-zinc-400">Could not generate summary.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function LogsClient({ logs }: { logs: CallLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 px-6 py-12 flex flex-col items-center gap-3 text-center">
        <span className="text-2xl">📋</span>
        <p className="text-sm font-medium text-zinc-700">No calls yet</p>
        <p className="text-xs text-zinc-400">Calls will appear here once triggered from the Listen page.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-100 overflow-hidden">
      {logs.map((log, i) => (
        <LogRow key={log.id} log={log} isLast={i === logs.length - 1} />
      ))}
    </div>
  );
}
