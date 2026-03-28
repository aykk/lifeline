import { createClient } from "@/lib/supabase/server";
import type { CallLog } from "@/lib/types";

export default async function LogsPage() {
  const supabase = await createClient();
  const { data: logs } = await supabase
    .from("call_logs")
    .select("*")
    .order("created_at", { ascending: false });

  const entries = (logs ?? []) as CallLog[];

  return (
    <div className="px-8 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Logs</h1>
        <p className="text-sm text-zinc-400 mt-1">Every call dispatched from your account.</p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 px-6 py-12 flex flex-col items-center gap-3 text-center">
          <span className="text-2xl">📋</span>
          <p className="text-sm font-medium text-zinc-700">No calls yet</p>
          <p className="text-xs text-zinc-400">Calls will appear here once triggered from the Listen page.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-100 overflow-hidden">
          {entries.map((log, i) => {
            const date = new Date(log.created_at);
            return (
              <div
                key={log.id}
                className={`px-5 py-4 flex items-start justify-between gap-6 ${
                  i !== entries.length - 1 ? "border-b border-zinc-100" : ""
                }`}
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
                <div className="shrink-0 flex flex-col items-end gap-1 pt-0.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                    log.success
                      ? "bg-zinc-100 text-zinc-700"
                      : "bg-red-50 text-red-500"
                  }`}>
                    {log.success ? "✓ dispatched" : "✕ failed"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
