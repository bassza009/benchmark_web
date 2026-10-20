import Link from "next/link";
import { fmtNum } from "@/lib/format";
import type { Heatmap } from "@/lib/highlights";
import { benchmarkTitle, type Lang } from "@/lib/i18n";
import { langColor } from "@/lib/languages";

// Table of "times slower than the fastest". Darker orange = slower.
// Uses a log scale, because the gaps go from ×1 to ×400.

function shade(ratio: number, maxRatio: number) {
  const strength = maxRatio > 1 ? Math.log(ratio) / Math.log(maxRatio) : 0; // 0..1
  return Math.round(6 + strength * 80); // % of orange mixed into the card color
}

function label(ratio: number) {
  return `×${fmtNum(ratio, ratio < 10 ? 1 : 0)}`;
}

export default function SpeedHeatmap({
  lang,
  data,
  fastestLabel,
  slowestLabel,
}: {
  lang: Lang;
  data: Heatmap;
  fastestLabel: string;
  slowestLabel: string;
}) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="tabular w-full border-separate border-spacing-1 text-sm">
          <thead>
            <tr>
              <th />
              {data.benchmarks.map((b) => (
                <th key={b.slug} className="px-1 pb-1 text-left font-medium">
                  <Link href={`/${lang}/benchmark/${b.slug}`} className="text-muted hover:text-accent-text">
                    {benchmarkTitle(b, lang)}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.languages.map((language) => (
              <tr key={language}>
                <th className="whitespace-nowrap pr-2 text-left font-medium">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: langColor(language) }} />
                    {language}
                  </span>
                </th>
                {data.benchmarks.map((b) => {
                  const ratio = data.ratio[b.slug]?.[language];
                  if (!ratio) return <td key={b.slug} className="rounded-md text-center text-faint">–</td>;
                  const pct = shade(ratio, data.maxRatio);
                  return (
                    <td
                      key={b.slug}
                      title={`${language} · ${benchmarkTitle(b, lang)}: ${label(ratio)}`}
                      className={`h-11 min-w-20 rounded-md px-2 text-center ${ratio < 1.05 ? "font-bold" : "font-medium"}`}
                      style={{
                        background: `color-mix(in srgb, var(--accent) ${pct}%, var(--card))`,
                        color: pct > 55 ? "#ffffff" : "var(--ink)",
                      }}
                    >
                      {label(ratio)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Color key */}
      <div className="mt-3 flex items-center gap-2 text-xs text-muted">
        <span>×1 {fastestLabel}</span>
        <span
          className="h-2.5 w-40 rounded-full"
          style={{ background: "linear-gradient(to right, color-mix(in srgb, var(--accent) 6%, var(--card)), var(--accent))" }}
        />
        <span>
          {label(data.maxRatio)} {slowestLabel}
        </span>
      </div>
    </div>
  );
}
