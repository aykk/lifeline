import { createClient } from "@/lib/supabase/server";
import { AppPageHeader } from "@/components/app-page-header";
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
    <div className="px-8 py-10 max-w-2xl">
      <AppPageHeader
        label="Configure"
        title="Triggers"
        description="Each trigger maps a spoken phrase to a phone call. When heard on the Listen page, the AI fires automatically."
      />
      <RulesManagerClient
        initialRules={(rules ?? []) as TriggerRule[]}
        userId={user!.id}
      />
    </div>
  );
}
