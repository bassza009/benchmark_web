import Link from "next/link";
import { ArrowRight, Database, Trophy } from "lucide-react";
import { fmtNum } from "@/lib/format";
import type { WebCard } from "@/lib/highlights";
import { benchmarkTitle, endpointLabel, t, type Lang } from "@/lib/i18n";
import { langColor } from "@/lib/languages";
import LangLogo from "./LangLogo";

// Big cards for the web benchmarks at the top of the home page.
// Each card: the winner + a bar per language (plain HTML bars, no chart library needed).

export default function WebFeatured({ lang, cards }: { lang: Lang; cards: WebCard[] }) {
  const text = t(lang).home;
  const tiers = t(lang).tiers;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {cards.map((card) => {
        const winner = card.bars[0];
        const slowest = card.bars[card.bars.length - 1];
        const max = winner.rps;
        return (
          <Link
            key={card.benchmark.slug}
            href={`/${lang}/benchmark/${card.benchmark.slug}`}
            className="hud group flex flex-col p-5"
          >
            {/* Title */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-semibold">{benchmarkTitle(card.benchmark, lang)}</h3>
                <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-faint">
                  <Database className="h-3.5 w-3.5" />
                  {card.benchmark.db_engine}
                </p>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
            </div>

            {/* Winner */}
            <div className="mt-4 border-l-2 border-accent bg-accent-soft p-4">
              <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-accent-text">
                <Trophy className="h-4 w-4" />
                {text.winner}: {winner.language}
                <LangLogo language={winner.language} size={18} />
              </div>
              <div className="tabular mt-1 font-display text-3xl font-bold">
                {fmtNum(winner.rps, 0)} <span className="text-base font-medium text-muted">req/s</span>
              </div>
              {slowest !== winner && (
                <div className="text-sm text-muted">{text.timesSlowest(`×${fmtNum(winner.rps / slowest.rps, 1)}`)}</div>
              )}
            </div>

            {/* One bar per language */}
            <ul className="mt-4 space-y-2">
              {card.bars.map((bar) => (
                <li key={bar.language} className="grid grid-cols-[7.5rem_1fr_4rem] items-center gap-2 text-sm">
                  <span className="flex items-center gap-1.5 truncate text-muted">
                    <LangLogo language={bar.language} size={16} />
                    {bar.language}
                  </span>
                  <span className="h-1.5 bg-bg">
                    <span
                      className="block h-full"
                      style={{
                        width: `${Math.max(2, (bar.rps / max) * 100)}%`,
                        background: langColor(bar.language),
                        boxShadow: `0 0 8px color-mix(in srgb, ${langColor(bar.language)} 60%, transparent)`,
                      }}
                    />
                  </span>
                  <span className="tabular text-right font-mono text-xs">{fmtNum(bar.rps, 0)}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 font-mono text-[11px] text-faint">{text.webCardNote(tiers[card.tier], endpointLabel(card.endpoint, lang))}</p>
          </Link>
        );
      })}
    </div>
  );
}
