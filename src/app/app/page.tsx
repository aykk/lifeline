import { createClient } from "@/lib/supabase/server";
import RulesManagerClient from "./rules-manager-client";
import type { TriggerRule } from "@/lib/types";

export default async function AppPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: rules } = await supabase
    .from("trigger_rules")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="px-8 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Triggers</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Each trigger maps a spoken phrase to a phone call. When heard on the Listen page, the AI fires automatically.
        </p>
      </div>
      <RulesManagerClient
        initialRules={(rules ?? []) as TriggerRule[]}
        userId={user!.id}
      />
    </div>
  );
}
