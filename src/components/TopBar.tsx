"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/aprendizaje", label: "Parte A · Aprendizaje" },
  { href: "/galeria", label: "Parte B · Galería" },
] as const;

export default function TopBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 sm:px-6">
        <span className="py-4 text-sm font-semibold tracking-wide text-foreground">
          Gravitación<span className="text-accent">.</span>
        </span>

        <nav aria-label="Secciones" className="flex gap-1">
          {TABS.map((tab) => {
            const active = pathname?.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`relative px-3 py-4 text-sm font-medium transition-colors ${
                  active
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {tab.label}
                {active && (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
