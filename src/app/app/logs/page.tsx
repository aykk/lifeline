import { createClient } from "@/lib/supabase/server";
import type { CallLog } from "@/lib/types";
import LogsClient from "./logs-client";

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
      <LogsClient logs={entries} />
    </div>
  );
}
