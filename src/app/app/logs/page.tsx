import { createClient } from "@/lib/supabase/server";
import { AppPageHeader } from "@/components/app-page-header";
import { ClipboardList } from "lucide-react";
import type { CallLog } from "@/lib/types";

export default async function LogsPage() {
  const supabase = await createClient();
  const { data: logs } = await supabase
    .from("call_logs")
    .select("*")
    .order("created_at", { ascending: false });

  const entries = (logs ?? []) as CallLog[];

  return (
    <div className="px-8 py-10 max-w-2xl">
      <AppPageHeader
        label="History"
        title="Logs"
        description="Every call dispatched from your account, with status and timestamps."
      />

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-900/10 bg-[var(--lifeline-canvas)]/50 px-6 py-14 flex flex-col items-center gap-3 text-center">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-900/[0.06]">
            <ClipboardList className="size-5 text-[var(--lifeline-accent)] opacity-70" />
          </div>
          <p className="text-sm font-medium text-zinc-800">No calls yet</p>
          <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
            Calls will appear here once triggered from the Listen page.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-900/[0.08] bg-white shadow-sm shadow-zinc-900/[0.03] overflow-hidden">
          {entries.map((log, i) => {
            const date = new Date(log.created_at);
            return (
              <div
                key={log.id}
                className={`px-5 py-4 flex items-start justify-between gap-6 ${
                  i !== entries.length - 1 ? "border-b border-zinc-900/[0.06]" : ""
                }`}
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono bg-[var(--lifeline-accent-soft)] text-[var(--lifeline-accent)] px-2 py-0.5 rounded-md">
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
