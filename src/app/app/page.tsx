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
    <div className="px-8 py-8 max-w-3xl">
      <div className="flex flex-col gap-1.5 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          Configure trigger phrases. When heard, the AI will call the number and deliver your message.
        </p>
      </div>
      <RulesManagerClient
        initialRules={(rules ?? []) as TriggerRule[]}
        userId={user!.id}
      />
    </div>
  );
}
