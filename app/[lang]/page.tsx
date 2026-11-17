import Link from "next/link";
import {
  Activity, ArrowRight, Container, Cpu, Flame, GitCompareArrows, Grid3x3, Layers, Server, Terminal, Wrench, type LucideIcon,
} from "lucide-react";
import { DockerChart, IndexChart } from "@/components/HomeCharts";
import LangLogo from "@/components/LangLogo";
import Reveal from "@/components/Reveal";
import SpeedHeatmap from "@/components/SpeedHeatmap";
import SuiteBoard from "@/components/SuiteBoard";
import { Card } from "@/components/ui";
import { buildBoard } from "@/lib/board";
import { getAlgoResults, getBenchmarks, getLatestBatch, getWebResults } from "@/lib/db";
import { fmtDate, fmtNum } from "@/lib/format";
import { buildHighlights } from "@/lib/highlights";
import { benchmarkDescription, benchmarkTitle, endpointLabel, isLang, t } from "@/lib/i18n";
import { PRESETS, presetHref } from "@/lib/presets";
import { TEST_HOST } from "@/lib/stack";

export const revalidate = 60;

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = isLang(rawLang) ? rawLang : "en";
  const text = t(lang);
  const f = text.findings;
  const d = text.dash;
  const [benchmarks, batch, webRows, algoRows] = await Promise.all([
    getBenchmarks(),
    getLatestBatch(),
    getWebResults(null),
    getAlgoResults(null),
  ]);

  const algorithm = benchmarks.filter((b) => b.category === "algorithm");
  const h = buildHighlights(benchmarks, webRows, algoRows);
  const board = buildBoard(benchmarks, webRows);
  const gapBenchmark = benchmarks.find((b) => b.slug === h.gapSlug);
  const indexPreset = PRESETS.find((p) => p.series[0]?.includes("|4join"));

  // Highest bare-metal req/s anywhere in the web benchmarks
  const peak = webRows
    .filter((r) => r.environment === "bme" && r.rps_mean)
    .sort((a, b) => b.rps_mean! - a.rps_mean!)[0];
  const peakBenchmark = peak && benchmarks.find((b) => b.slug === peak.benchmark_slug);

  // Sync log: rows per benchmark in the latest batch
  const counts = benchmarks.map((b) => ({
    slug: b.slug,
    n: webRows.filter((r) => r.benchmark_slug === b.slug).length + algoRows.filter((r) => r.benchmark_slug === b.slug).length,
  }));
  const syncTime = batch ? new Date(batch.created_at).toLocaleTimeString("en-GB", { hour12: false }) : "";

  function Pill({ icon: Icon, children, live }: { icon?: LucideIcon; children: React.ReactNode; live?: boolean }) {
    return (
      <span className="flex items-center gap-1.5 rounded-lg border border-line bg-card-2 px-2.5 py-1 font-mono text-xs text-muted">
        {live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-data" />}
        {Icon && <Icon className="h-3.5 w-3.5 text-faint" />}
        {children}
      </span>
    );
  }

  function Kpi({
    i, icon: Icon, label, value, unit, foot, badge, href, tone = "accent",
  }: {
    i: number; icon: LucideIcon; label: string; value: string; unit?: string; foot: React.ReactNode; badge: string; href: string; tone?: "accent" | "data";
  }) {
    const color = tone === "accent" ? "text-accent" : "text-data";
    return (
      <Reveal style={{ transitionDelay: `${i * 80}ms` }}>
        <Link href={href} className="hud group flex h-full flex-col p-4">
          <div className="mb-2 flex items-center justify-between text-muted">
            <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`tabular font-mono text-3xl font-extrabold tracking-tight text-ink ${tone === "accent" ? "neon" : "neon-data"}`}>{value}</span>
            {unit && <span className={`font-mono text-xs font-semibold ${color}`}>{unit}</span>}
          </div>
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-2 font-mono text-xs">
            <span className="flex min-w-0 items-center gap-1.5 truncate text-muted">{foot}</span>
            <span
              className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-bold ${
                tone === "accent" ? "border-accent/30 bg-accent-soft text-accent" : "border-data/30 text-data"
              }`}
            >
              {badge}
            </span>
          </div>
        </Link>
      </Reveal>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title + telemetry */}
      <section className="hud p-5">
        <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">{text.home.title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">{text.home.intro}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <Pill live>
            <span className="font-bold text-data">{d.live}</span>
          </Pill>
          {batch && (
            <>
              <Pill icon={Activity}>
                {d.batch} #{batch.id} · {fmtDate(batch.created_at, lang)}
              </Pill>
              {batch.git_commit && <Pill icon={Terminal}>{d.commit} {batch.git_commit.slice(0, 7)}</Pill>}
            </>
          )}
          <Pill icon={Server}>
            <span className="text-faint">{d.host}:</span> {TEST_HOST}
          </Pill>
          <Pill icon={Wrench}>{d.tools}</Pill>
          <Link
            href={`/${lang}/compare`}
            className="ml-auto flex items-center gap-2 rounded-lg bg-accent px-3.5 py-1.5 text-xs font-bold text-on-accent shadow-[0_0_16px_-2px_var(--glow)] transition-transform active:scale-[0.98]"
          >
            <GitCompareArrows className="h-4 w-4" />
            {text.nav.compare}
          </Link>
        </div>
      </section>

      {benchmarks.length === 0 && <p className="text-muted">{text.noData}</p>}

      {/* KPI row */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {peak && peakBenchmark && (
          <Kpi
            i={0}
            icon={Activity}
            label={d.peak}
            value={fmtNum(peak.rps_mean!, 0)}
            unit="req/s"
            foot={
              <>
                <LangLogo language={peak.language} size={14} />
                <strong className="text-ink">{peak.language}</strong> · {benchmarkTitle(peakBenchmark, lang)}
              </>
            }
            badge={text.tiers[peak.tier] ?? peak.tier}
            href={`/${lang}/benchmark/${peak.benchmark_slug}`}
          />
        )}
        {h.bestIndex && (
          <Kpi
            i={1}
            icon={Layers}
            tone="data"
            label={f.indexLabel}
            value={`×${fmtNum(h.bestIndex.speedup, 1)}`}
            foot={
              <>
                <LangLogo language={h.bestIndex.language} size={14} />
                <strong className="text-ink">{h.bestIndex.language}</strong> · {endpointLabel("4join", lang)}
              </>
            }
            badge="INDEX"
            href={indexPreset ? presetHref(lang, indexPreset) : `/${lang}/compare`}
          />
        )}
        {h.worstDocker && (
          <Kpi
            i={2}
            icon={Container}
            label={f.dockerLabel}
            value={`${fmtNum(h.worstDocker.change, 0)}%`}
            foot={
              <>
                <LangLogo language={h.worstDocker.language} size={14} />
                <strong className="text-ink">{h.worstDocker.language}</strong> · Bare Metal → Docker
              </>
            }
            badge="DOCKER"
            href={`/${lang}/benchmark/${h.dockerSettings.slug}`}
          />
        )}
        {h.gap && (
          <Kpi
            i={3}
            icon={Flame}
            tone="data"
            label={f.gapLabel}
            value={`×${fmtNum(h.gap.ratio, 0)}`}
            foot={
              <>
                <strong className="text-ink">{h.gap.slow.language}</strong> vs <strong className="text-ink">{h.gap.fast.language}</strong>
              </>
            }
            badge={gapBenchmark ? benchmarkTitle(gapBenchmark, lang).toUpperCase() : h.gapSlug}
            href={`/${lang}/benchmark/${h.gapSlug}`}
          />
        )}
      </section>

      {/* Ranking board: bars + Docker retention + leaderboard */}
      {board.suites.length > 0 && <SuiteBoard lang={lang} board={board} />}

      {/* Key findings charts */}
      {(h.indexRows.length > 0 || h.dockerRows.length > 0) && (
        <section className="grid gap-6 lg:grid-cols-2">
          {h.indexRows.length > 0 && (
            <Card title={f.indexTitle} hint={f.indexHint} icon={Layers}>
              <IndexChart rows={h.indexRows} noIndexLabel={f.noIndex} withIndexLabel={f.withIndex} />
            </Card>
          )}
          {h.dockerRows.length > 0 && (
            <Card title={f.dockerTitle} hint={f.dockerHint} icon={Container}>
              <DockerChart rows={h.dockerRows} />
            </Card>
          )}
        </section>
      )}

      {h.heatmap.benchmarks.length > 0 && (
        <Card title={f.heatTitle} hint={f.heatHint} icon={Grid3x3}>
          <SpeedHeatmap lang={lang} data={h.heatmap} fastestLabel={f.heatFastest} slowestLabel={f.heatSlowest} />
        </Card>
      )}

      {/* Algorithms + quick comparisons */}
      <section className="grid gap-6 lg:grid-cols-3">
        {algorithm.length > 0 && (
          <Reveal className="hud p-5 lg:col-span-2">
            <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider">
              <Cpu className="h-4 w-4 text-accent" />
              {text.home.algorithm}
            </h2>
            <p className="mb-4 mt-1 font-mono text-xs text-muted">{text.home.algorithmHint}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {algorithm.map((b) => {
                const sub = benchmarkDescription(b, lang);
                return (
                  <Link
                    key={b.slug}
                    href={`/${lang}/benchmark/${b.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-card-2 px-3 py-2.5 transition-colors hover:border-accent/50"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{benchmarkTitle(b, lang)}</div>
                      {sub && <div className="truncate font-mono text-[11px] text-faint">{sub}</div>}
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                  </Link>
                );
              })}
            </div>
          </Reveal>
        )}

        <Reveal className="hud p-5">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider">
            <GitCompareArrows className="h-4 w-4 text-accent" />
            {text.home.presets}
          </h2>
          <ul className="mt-4 space-y-2">
            {PRESETS.map((p) => (
              <li key={p.en}>
                <Link
                  href={presetHref(lang, p)}
                  className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2 text-sm text-muted transition-colors hover:border-accent/50 hover:text-ink"
                >
                  {lang === "th" ? p.th : p.en}
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Sync log */}
      {batch && (
        <Reveal as="section" className="hud overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-line bg-card-2 px-4 py-2.5">
            <span className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-ink">
              <span className="h-2 w-2 rounded-full bg-data shadow-[0_0_6px_var(--data)]" />
              {d.logTitle} // batch #{batch.id}
            </span>
            <span className="hidden font-mono text-[10px] text-faint sm:inline">{d.logHint}</span>
          </div>
          <ol className="max-h-72 space-y-0.5 overflow-y-auto bg-bg/60 p-4 font-mono text-xs leading-relaxed">
            {counts.map((c, i) => (
              <li key={c.slug} className="reveal-line flex gap-3" style={{ ["--i" as string]: i }}>
                <span className="shrink-0 text-faint">[{syncTime}]</span>
                <span className="text-accent-text">load</span>
                <span className="min-w-0 flex-1 truncate text-ink">{c.slug}</span>
                <span className={c.n ? "text-data" : "text-warn"}>
                  {c.n} {d.logRows}
                </span>
              </li>
            ))}
            <li className="reveal-line flex gap-3 pt-1" style={{ ["--i" as string]: counts.length }}>
              <span className="shrink-0 text-faint">[{syncTime}]</span>
              <span className="font-bold text-data">
                ✓ {d.logDone(webRows.length, algoRows.length)}
                {batch.git_commit && ` · ${batch.git_commit.slice(0, 7)}`}
              </span>
            </li>
          </ol>
        </Reveal>
      )}
    </div>
  );
}
