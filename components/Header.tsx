import Link from "next/link";
import { Gauge, GitCompareArrows, LayoutGrid } from "lucide-react";
import { t, type Lang } from "@/lib/i18n";
import LangSwitch from "./LangSwitch";
import ThemeToggle from "./ThemeToggle";

export default function Header({ lang }: { lang: Lang }) {
  const text = t(lang);
  return (
    <header className="border-b border-line bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link href={`/${lang}`} className="flex items-center gap-2 font-semibold">
          <Gauge className="h-5 w-5 text-accent" />
          {text.siteName}
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link href={`/${lang}`} className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted hover:bg-accent-soft hover:text-accent-text">
            <LayoutGrid className="h-4 w-4" />
            {text.nav.home}
          </Link>
          <Link href={`/${lang}/compare`} className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted hover:bg-accent-soft hover:text-accent-text">
            <GitCompareArrows className="h-4 w-4" />
            {text.nav.compare}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LangSwitch lang={lang} label={text.switchLang} />
          <ThemeToggle lightLabel={text.theme.light} darkLabel={text.theme.dark} />
        </div>
      </div>
    </header>
  );
}
