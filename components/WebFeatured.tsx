import Link from "next/link";
import { ArrowRight, Database, Trophy } from "lucide-react";
import { fmtNum } from "@/lib/format";
import type { WebCard } from "@/lib/highlights";
import { benchmarkTitle, endpointLabel, t, type Lang } from "@/lib/i18n";
import { langColor } from "@/lib/languages";

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
            className="group flex flex-col rounded-2xl border border-line bg-card p-5 transition-colors hover:border-accent"
          >
            {/* Title */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold">{benchmarkTitle(card.benchmark, lang)}</h3>
                <p className="flex items-center gap-1.5 text-sm text-muted">
                  <Database className="h-3.5 w-3.5" />
                  {card.benchmark.db_engine}
                </p>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
            </div>

            {/* Winner */}
            <div className="mt-4 rounded-xl bg-accent-soft p-4">
              <div className="flex items-center gap-1.5 text-sm font-medium text-accent-text">
                <Trophy className="h-4 w-4" />
                {text.winner}: {winner.language}
              </div>
              <div className="tabular mt-1 text-3xl font-bold">
                {fmtNum(winner.rps, 0)} <span className="text-base font-medium text-muted">req/s</span>
              </div>
              {slowest !== winner && (
                <div className="text-sm text-muted">{text.timesSlowest(`×${fmtNum(winner.rps / slowest.rps, 1)}`)}</div>
              )}
            </div>

            {/* One bar per language */}
            <ul className="mt-4 space-y-2">
              {card.bars.map((bar) => (
                <li key={bar.language} className="grid grid-cols-[6.5rem_1fr_4rem] items-center gap-2 text-sm">
                  <span className="truncate text-muted">{bar.language}</span>
                  <span className="h-2.5 rounded-full bg-bg">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${Math.max(2, (bar.rps / max) * 100)}%`, background: langColor(bar.language) }}
                    />
                  </span>
                  <span className="tabular text-right font-medium">{fmtNum(bar.rps, 0)}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-xs text-faint">{text.webCardNote(tiers[card.tier], endpointLabel(card.endpoint, lang))}</p>
          </Link>
        );
      })}
    </div>
  );
}
