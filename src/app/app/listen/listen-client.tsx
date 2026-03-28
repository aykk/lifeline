"use client";

import dynamic from "next/dynamic";
import type { TriggerRule } from "@/lib/types";

const ListenInner = dynamic(() => import("./listen-inner"), { ssr: false });

export default function ListenClient({ rules, userId }: { rules: TriggerRule[]; userId: string }) {
  return <ListenInner rules={rules} userId={userId} />;
}
