"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, Database, GitCompareArrows } from "lucide-react";
import type { Lang } from "@/lib/i18n";

export type SidebarGroup = { label: string; items: { slug: string; title: string }[] };

// Left rail on md+ screens: every benchmark, grouped. On phones the header nav is enough.
export default function Sidebar({
  lang,
  groups,
  title,
  compareLabel,
  lastSync,
}: {
  lang: Lang;
  groups: SidebarGroup[];
  title: string;
  compareLabel: string;
  lastSync: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 top-14 z-40 hidden w-60 flex-col border-r border-line bg-card/80 backdrop-blur md:flex">
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <p className="eyebrow px-2">{title}</p>

        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-1 flex items-center gap-2 px-2 font-mono text-[10px] uppercase tracking-widest text-data">
              {group.label.startsWith("Web") ? <Database className="h-3 w-3" /> : <Cpu className="h-3 w-3" />}
              {group.label}
            </p>
            <ul className="space-y-0.5 text-[13px]">
              {group.items.map((item) => {
                const href = `/${lang}/benchmark/${item.slug}`;
                const active = pathname === href;
                return (
                  <li key={item.slug}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`block truncate rounded-r-lg border-l-2 px-3 py-1.5 transition-colors ${
                        active
                          ? "border-accent bg-card-2 font-semibold text-accent"
                          : "border-transparent text-muted hover:bg-card-2 hover:text-ink"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-line p-4">
        <Link
          href={`/${lang}/compare`}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-accent/40 bg-card py-2 text-xs font-semibold text-accent transition-colors hover:border-accent hover:bg-accent-soft"
        >
          <GitCompareArrows className="h-3.5 w-3.5" />
          {compareLabel}
        </Link>
        {lastSync && (
          <p className="flex items-center gap-2 px-1 font-mono text-[10px] text-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-data" aria-hidden />
            {lastSync}
          </p>
        )}
      </div>
    </aside>
  );
}
