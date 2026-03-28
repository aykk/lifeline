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
    <div className="px-8 py-8 max-w-3xl">
      <div className="flex flex-col gap-1.5 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Logs</h1>
        <p className="text-sm text-zinc-500">Every call made from your account.</p>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-zinc-400">No calls made yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-zinc-100">
          {entries.map((log) => {
            const date = new Date(log.created_at);
            return (
              <div key={log.id} className="py-4 flex items-start justify-between gap-6">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                      &ldquo;{log.trigger_phrase}&rdquo;
                    </span>
                    <span className="text-xs text-zinc-400">→</span>
                    <span className="text-xs text-zinc-600 font-medium">{log.phone_number}</span>
                  </div>
                  <p className="text-sm text-zinc-500 italic truncate">&ldquo;{log.message}&rdquo;</p>
                  <p className="text-xs text-zinc-400">
                    {date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    {" · "}
                    {date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="shrink-0 mt-1">
                  {log.success ? (
                    <span className="text-zinc-900 text-base" title="Success">✓</span>
                  ) : (
                    <span className="text-red-400 text-base" title="Failed">✕</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
