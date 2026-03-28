"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const links = [
  { href: "/app", label: "Triggers", icon: "⚡" },
  { href: "/app/listen", label: "Listen", icon: "🎙" },
  { href: "/app/logs", label: "Logs", icon: "📋" },
];

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <aside className="w-52 shrink-0 border-r border-zinc-100 flex flex-col min-h-screen sticky top-0 h-screen">
      <div className="px-5 py-5 border-b border-zinc-100">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-900">
          lifeline
        </Link>
      </div>

      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-zinc-900 text-white font-medium"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-zinc-100">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-zinc-500 font-medium truncate">{user.email}</p>
          <button
            onClick={signOut}
            className="text-xs text-zinc-400 hover:text-zinc-700 text-left transition-colors w-fit"
          >
            Sign out →
          </button>
        </div>
      </div>
    </aside>
  );
}
