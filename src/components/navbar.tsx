"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isLoggedIn: boolean;
}

const sections = [
  { label: "Home", href: "#hero" },
  { label: "What is Lifeline?", href: "#what-is-lifeline" },
  { label: "How it works", href: "#how-it-works" },
];

export default function Navbar({ isLoggedIn }: NavbarProps) {
  function scrollTo(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <header
        className="flex items-center justify-between gap-4 sm:gap-6 px-4 sm:px-5 py-2.5 rounded-full w-full max-w-3xl ring-1 ring-zinc-900/[0.07]"
        style={{
          background: "rgba(250,250,248,0.82)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          border: "1px solid color-mix(in srgb, var(--lifeline-accent) 12%, rgba(0,0,0,0.06))",
          boxShadow:
            "0 4px 24px rgba(0,0,0,0.04), 0 1px 0 rgba(255,255,255,0.9) inset, 0 0 0 1px rgba(255,255,255,0.4) inset",
        }}
      >
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-900 pl-0.5 sm:pl-1 shrink-0"
        >
          lifeline.
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {sections.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => scrollTo(e, href)}
              className="px-3 py-1.5 text-sm text-zinc-600 hover:text-[var(--lifeline-accent)] rounded-full hover:bg-[var(--lifeline-accent-soft)] transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {isLoggedIn ? (
            <Link href="/app">
              <Button size="sm" className="text-xs h-8 px-4 sm:px-5 rounded-full shadow-sm">
                Dashboard →
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" className="text-xs h-8 px-4 sm:px-5 rounded-full shadow-sm">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}
