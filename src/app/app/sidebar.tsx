"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const links = [
    { href: "/app", label: "Dashboard" },
    { href: "/app/listen", label: "Listen" },
    { href: "/app/logs", label: "Logs" },
  ];

  return (
    <aside className="w-56 shrink-0 border-r border-zinc-100 flex flex-col min-h-screen">
      <div className="px-5 py-6 border-b border-zinc-100">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-900">
          clarify
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === href
                ? "bg-zinc-100 text-zinc-900 font-medium"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-zinc-100 flex flex-col gap-2">
        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
        <button
          onClick={signOut}
          className="text-xs text-zinc-400 hover:text-zinc-700 text-left transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
