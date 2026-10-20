"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import type { Lang } from "@/lib/i18n";

// Same page, other language: /en/compare?x=1 -> /th/compare?x=1
export default function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  const pathname = usePathname();
  const other = lang === "en" ? "th" : "en";
  const href = pathname.replace(/^\/(en|th)/, `/${other}`);

  return (
    <Link
      href={href}
      // keep the query string (e.g. compare selections) when switching
      onClick={(e) => {
        if (window.location.search) {
          e.preventDefault();
          window.location.href = href + window.location.search;
        }
      }}
      className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-sm text-muted hover:border-accent hover:text-accent-text"
    >
      <Languages className="h-4 w-4" />
      {label}
    </Link>
  );
}
