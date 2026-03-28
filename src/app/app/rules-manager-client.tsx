"use client";

import dynamic from "next/dynamic";
import type { TriggerRule } from "@/lib/types";

const RulesManager = dynamic(() => import("./rules-manager"), { ssr: false });

export default function RulesManagerClient(props: { initialRules: TriggerRule[]; userId: string }) {
  return <RulesManager {...props} />;
}
