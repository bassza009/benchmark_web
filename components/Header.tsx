"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type Lang } from "@/lib/i18n";
import LangSwitch from "./LangSwitch";
import ThemeToggle from "./ThemeToggle";

export default function Header({ lang, batchId }: { lang: Lang; batchId: number | null }) {
  const text = t(lang);
  const pathname = usePathname();
  const links = [
    { href: `/${lang}`, label: text.nav.home, active: pathname === `/${lang}` || pathname.startsWith(`/${lang}/benchmark`) },
    { href: `/${lang}/compare`, label: text.nav.compare, active: pathname.startsWith(`/${lang}/compare`) },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-line bg-bg/95 px-4 backdrop-blur sm:gap-4 sm:px-6">
      <Link href={`/${lang}`} className="flex shrink-0 items-center gap-2.5">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" aria-hidden />
        <span className="neon hidden font-display text-base font-black uppercase tracking-wider text-accent lg:inline">
          {text.siteName}
        </span>
        <span className="neon font-display text-sm font-black uppercase tracking-wider text-accent lg:hidden">Bench</span>
        {batchId !== null && (
          <span className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-faint sm:inline">
            {text.dash.batch} #{batchId}
          </span>
        )}
      </Link>

      <nav className="flex items-center gap-3 whitespace-nowrap border-l border-line pl-3 text-sm sm:gap-4 sm:pl-4">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={l.active ? "page" : undefined}
            className={`border-b-2 pb-0.5 transition-colors ${
              l.active ? "border-accent font-semibold text-accent" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <LangSwitch lang={lang} label={text.switchLang} />
        <ThemeToggle lightLabel={text.theme.light} darkLabel={text.theme.dark} />
      </div>
    </header>
  );
}
