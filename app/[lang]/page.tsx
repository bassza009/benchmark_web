import Link from "next/link";
import {
  ArrowRight, Container, Cpu, Database, Flame, GitCompareArrows, Grid3x3, Layers, RefreshCw, Sparkles, type LucideIcon,
} from "lucide-react";
import { DockerChart, IndexChart } from "@/components/HomeCharts";
import SpeedHeatmap from "@/components/SpeedHeatmap";
import WebFeatured from "@/components/WebFeatured";
import { Card } from "@/components/ui";
import { getAlgoResults, getBenchmarks, getLatestBatch, getWebResults } from "@/lib/db";
import { fmtDate, fmtNum } from "@/lib/format";
import { buildHighlights, buildWebCards } from "@/lib/highlights";
import { benchmarkDescription, benchmarkTitle, isLang, t } from "@/lib/i18n";
import { PRESETS, presetHref } from "@/lib/presets";
import type { Benchmark } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = isLang(rawLang) ? rawLang : "en";
  const text = t(lang);
  const f = text.findings;
  const [benchmarks, batch, webRows, algoRows] = await Promise.all([
    getBenchmarks(),
    getLatestBatch(),
    getWebResults(null),
    getAlgoResults(null),
  ]);

  const algorithm = benchmarks.filter((b) => b.category === "algorithm");
  const h = buildHighlights(benchmarks, webRows, algoRows);
  const webCards = buildWebCards(benchmarks, webRows);
  const gapBenchmark = benchmarks.find((b) => b.slug === h.gapSlug);
  const indexPreset = PRESETS.find((p) => p.series[0]?.includes("|4join"));

  function BenchmarkCard({ b }: { b: Benchmark }) {
    const sub = benchmarkDescription(b, lang);
    return (
      <Link
        href={`/${lang}/benchmark/${b.slug}`}
        className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-card p-4 hover:border-accent"
      >
        <div>
          <div className="font-medium">{benchmarkTitle(b, lang)}</div>
          {sub && <div className="text-sm text-muted">{sub}</div>}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-faint group-hover:text-accent" />
      </Link>
    );
  }

  // Big-number card at the top of the page
  function FindingCard({ icon: Icon, label, value, body, href }: { icon: LucideIcon; label: string; value: string; body: string; href: string }) {
    return (
      <Link href={href} className="group flex flex-col rounded-2xl border border-line bg-card p-5 transition-colors hover:border-accent">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <span className="rounded-lg bg-accent-soft p-1.5">
            <Icon className="h-4 w-4 text-accent" />
          </span>
          {label}
        </div>
        <div className="tabular mt-3 text-5xl font-bold tracking-tight text-accent-text">{value}</div>
        <p className="mt-2 flex-1 text-muted">{body}</p>
        <span className="mt-3 flex items-center gap-1 text-sm font-medium text-accent-text">
          {f.explore}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-card px-6 py-10 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-60 blur-3xl"
          style={{ background: "color-mix(in srgb, var(--accent) 35%, transparent)" }}
        />
        <div className="relative">
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">{text.home.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">{text.home.intro}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/${lang}/compare`}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-white hover:opacity-90"
            >
              <GitCompareArrows className="h-4 w-4" />
              {text.nav.compare}
            </Link>
            {batch && (
              <span className="flex items-center gap-1.5 text-sm text-faint">
                <RefreshCw className="h-3.5 w-3.5" />
                {text.home.lastSync}: {fmtDate(batch.created_at, lang)}
                {batch.git_commit && <span className="tabular">· {batch.git_commit.slice(0, 7)}</span>}
              </span>
            )}
          </div>
        </div>
      </section>

      {benchmarks.length === 0 && <p className="text-muted">{text.noData}</p>}

      {/* Web benchmarks: the main results, so they come first */}
      {webCards.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Database className="h-6 w-6 text-accent" />
              {text.home.web}
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">{text.home.mainBadge}</span>
            </h2>
            <p className="mt-1 text-muted">{text.home.webHint}</p>
          </div>
          <WebFeatured lang={lang} cards={webCards} />
        </section>
      )}

      {/* Key findings */}
      {(h.bestIndex || h.worstDocker || h.gap) && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Sparkles className="h-5 w-5 text-accent" />
            {f.title}
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {h.bestIndex && (
              <FindingCard
                icon={Layers}
                label={f.indexLabel}
                value={`×${fmtNum(h.bestIndex.speedup, 1)}`}
                body={f.indexText(h.bestIndex.language, `×${fmtNum(h.bestIndex.speedup, 1)}`)}
                href={indexPreset ? presetHref(lang, indexPreset) : `/${lang}/compare`}
              />
            )}
            {h.worstDocker && (
              <FindingCard
                icon={Container}
                label={f.dockerLabel}
                value={`${fmtNum(h.worstDocker.change, 0)}%`}
                body={f.dockerText(h.worstDocker.language, `${fmtNum(Math.abs(h.worstDocker.change), 0)}%`)}
                href={`/${lang}/benchmark/${h.dockerSettings.slug}`}
              />
            )}
            {h.gap && (
              <FindingCard
                icon={Flame}
                label={f.gapLabel}
                value={`×${fmtNum(h.gap.ratio, 0)}`}
                body={f.gapText(h.gap.slow.language, h.gap.fast.language, `×${fmtNum(h.gap.ratio, 0)}`, gapBenchmark ? benchmarkTitle(gapBenchmark, lang) : h.gapSlug)}
                href={`/${lang}/benchmark/${h.gapSlug}`}
              />
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
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
          </div>

          {h.heatmap.benchmarks.length > 0 && (
            <Card title={f.heatTitle} hint={f.heatHint} icon={Grid3x3}>
              <SpeedHeatmap lang={lang} data={h.heatmap} fastestLabel={f.heatFastest} slowestLabel={f.heatSlowest} />
            </Card>
          )}
        </section>
      )}

      {algorithm.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Cpu className="h-5 w-5 text-accent" />
            {text.home.algorithm}
          </h2>
          <p className="mb-3 text-sm text-muted">{text.home.algorithmHint}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {algorithm.map((b) => (
              <BenchmarkCard key={b.slug} b={b} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <GitCompareArrows className="h-5 w-5 text-accent" />
          {text.home.presets}
        </h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <Link
              key={p.en}
              href={presetHref(lang, p)}
              className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-sm text-muted hover:border-accent hover:text-accent-text"
            >
              {lang === "th" ? p.th : p.en}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
