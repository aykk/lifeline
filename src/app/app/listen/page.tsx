import { createClient } from "@/lib/supabase/server";
import ListenClient from "./listen-client";
import type { TriggerRule } from "@/lib/types";

export default async function ListenPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: rules } = await supabase
    .from("trigger_rules")
    .select("*")
    .order("created_at", { ascending: false });

  return <ListenClient rules={(rules ?? []) as TriggerRule[]} userId={user!.id} />;
}
