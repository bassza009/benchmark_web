"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bar, BarChart, CartesianGrid, Cell, ErrorBar, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, BarChart3, Plus, Table2, X } from "lucide-react";
import { axisProps, Card, ChartTooltip, Select } from "./ui";
import { fmtInt, fmtMs, fmtNum, fmtPct, fmtRps, fmtSec, fmtSecAxis } from "@/lib/format";
import { benchmarkTitle, endpointLabel, t, type Lang } from "@/lib/i18n";
import { DOCKER_OPACITY, langColor, sortLanguages } from "@/lib/languages";
import type { AlgoResult, Benchmark, Env, WebResult } from "@/lib/types";

// The whole selection lives in the URL, e.g.
//   /en/compare?type=web&metric=rps_mean&s=web-main-get-no-index|Go|bme|general|1table&s=...
// so the page can be bookmarked and shared.

const MAX_SERIES = 6;
const TIERS = ["poc", "small", "general", "high", "stress"];
const WEB_METRICS = ["rps_mean", "lat_mean_ms", "lat_p99_ms"] as const;
const HIGHER_IS_BETTER: Record<string, boolean> = { rps_mean: true, lat_mean_ms: false, lat_p99_ms: false, mean_s: false };

type Type = "web" | "algorithm";
// web: [slug, language, env, tier, endpoint]   algorithm: [slug, language, env]
type SeriesParts = string[];

export default function CompareView({
  lang,
  benchmarks,
  webRows,
  algoRows,
}: {
  lang: Lang;
  benchmarks: Benchmark[];
  webRows: WebResult[];
  algoRows: AlgoResult[];
}) {
  const text = t(lang);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const type: Type = params.get("type") === "algorithm" ? "algorithm" : "web";
  const metric = type === "algorithm" ? "mean_s" : WEB_METRICS.find((m) => m === params.get("metric")) ?? "rps_mean";
  const typeBenchmarks = benchmarks.filter((b) => b.category === type);
  const rowsOf = (slug: string) =>
    (type === "web" ? webRows : algoRows).filter((r) => r.benchmark_slug === slug) as (WebResult | AlgoResult)[];

  // ----- read series from the URL (or build two defaults) -----
  let series: SeriesParts[] = params.getAll("s").map((s) => s.split("|"));
  if (series.length === 0) series = defaultSeries();

  function defaultSeries(): SeriesParts[] {
    const slug = typeBenchmarks[0]?.slug;
    if (!slug) return [];
    const languages = sortLanguages([...new Set(rowsOf(slug).map((r) => r.language))]).slice(0, 2);
    return languages.map((l) => (type === "web" ? [slug, l, "bme", "general", firstEndpoint(slug)] : [slug, l, "bme"]));
  }

  function firstEndpoint(slug: string) {
    return [...new Set((rowsOf(slug) as WebResult[]).map((r) => r.endpoint))].sort()[0] ?? "";
  }

  function update(next: { type?: Type; metric?: string; series?: SeriesParts[] }) {
    const p = new URLSearchParams();
    const nextType = next.type ?? type;
    p.set("type", nextType);
    if (nextType === "web") p.set("metric", next.metric ?? metric);
    // Switching type starts over with defaults (series formats differ)
    if (!next.type) (next.series ?? series).forEach((s) => p.append("s", s.join("|")));
    router.replace(`${pathname}?${p}`, { scroll: false });
  }

  // Change one field of one series; if the benchmark changes, keep other fields only if still valid
  function setPart(index: number, part: number, value: string) {
    const nextSeries = series.map((s) => [...s]);
    const s = nextSeries[index];
    s[part] = value;
    if (part === 0 && type === "web") {
      const endpoints = new Set((rowsOf(value) as WebResult[]).map((r) => r.endpoint));
      if (!endpoints.has(s[4])) s[4] = firstEndpoint(value);
    }
    update({ series: nextSeries });
  }

  // ----- look up the row for each series -----
  const resolved = series.map((s, i) => {
    const [slug, language, env, tier, endpoint] = s;
    const row = rowsOf(slug).find(
      (r) =>
        r.language === language &&
        r.environment === env &&
        (type === "algorithm" || ((r as WebResult).tier === tier && (r as WebResult).endpoint === endpoint)),
    );
    const bench = benchmarks.find((b) => b.slug === slug);
    const parts = [language, text.env[env as Env], bench ? benchmarkTitle(bench, lang) : slug];
    if (type === "web") parts.push(text.tiers[tier] ?? tier, endpointLabel(endpoint ?? "", lang));
    return { id: `S${i + 1}`, parts: s, language, env, row, label: parts.join(" · ") };
  });

  const valueOf = (row: WebResult | AlgoResult | undefined) =>
    row ? ((row as Record<string, unknown>)[metric] as number | null) : null;
  const errorOf = (row: WebResult | AlgoResult | undefined) => {
    if (!row) return 0;
    if (metric === "rps_mean") return (row as WebResult).rps_ci95_margin ?? 0;
    if (metric === "mean_s") return (row as AlgoResult).sd_s ?? 0;
    return 0;
  };
  const format = (v: number | null) =>
    metric === "rps_mean" ? fmtRps(v) : metric === "mean_s" ? fmtSec(v) : fmtMs(v);

  const base = valueOf(resolved[0]?.row);
  const chartData = resolved.map((s) => ({
    name: s.id,
    label: s.label,
    value: valueOf(s.row),
    err: errorOf(s.row),
    language: s.language,
    env: s.env,
  }));

  const chartHeight = Math.max(160, resolved.length * 52 + 40);

  // ----- options for the series pickers -----
  const benchmarkOptions = typeBenchmarks.map((b) => ({ value: b.slug, label: benchmarkTitle(b, lang) }));
  const languageOptions = (slug: string) =>
    sortLanguages([...new Set(rowsOf(slug).map((r) => r.language))]).map((l) => ({ value: l, label: l }));
  const envOptions = (["bme", "docker"] as Env[]).map((e) => ({ value: e, label: text.env[e] }));
  const tierOptions = TIERS.map((k) => ({ value: k, label: text.tiers[k] }));
  const endpointOptions = (slug: string) =>
    [...new Set((rowsOf(slug) as WebResult[]).map((r) => r.endpoint))].sort().map((e) => ({ value: e, label: endpointLabel(e, lang) }));

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-end gap-4">
          <Select
            label={text.compare.type}
            value={type}
            onChange={(v) => update({ type: v as Type })}
            options={[
              { value: "web", label: text.compare.web },
              { value: "algorithm", label: text.compare.algorithm },
            ]}
          />
          {type === "web" && (
            <Select
              label={text.compare.metric}
              value={metric}
              onChange={(v) => update({ metric: v })}
              options={WEB_METRICS.map((m) => ({ value: m, label: text.compare.metrics[m] }))}
            />
          )}
        </div>

        {/* One row of pickers per series */}
        <div className="mt-4 space-y-3">
          {series.map((s, i) => (
            <div key={i} className="flex flex-wrap items-end gap-2 border-t border-line pt-3">
              <span
                className="mb-1 flex h-8 w-10 items-center justify-center rounded-md border-2 bg-card text-xs font-semibold"
                style={{ borderColor: langColor(s[1]) }}
              >
                S{i + 1}
              </span>
              <Select label={text.compare.benchmark} value={s[0]} onChange={(v) => setPart(i, 0, v)} options={benchmarkOptions} />
              <Select label={text.cols.language} value={s[1]} onChange={(v) => setPart(i, 1, v)} options={languageOptions(s[0])} />
              <Select label={text.cols.env} value={s[2]} onChange={(v) => setPart(i, 2, v)} options={envOptions} />
              {type === "web" && (
                <>
                  <Select label={text.cols.tier} value={s[3]} onChange={(v) => setPart(i, 3, v)} options={tierOptions} />
                  <Select label={text.cols.endpoint} value={s[4]} onChange={(v) => setPart(i, 4, v)} options={endpointOptions(s[0])} />
                </>
              )}
              {series.length > 1 && (
                <button
                  onClick={() => update({ series: series.filter((_, j) => j !== i) })}
                  title={text.compare.remove}
                  aria-label={text.compare.remove}
                  className="mb-0.5 rounded-md border border-line p-2 text-faint hover:border-accent hover:text-accent-text"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {series.length < MAX_SERIES && series.length > 0 && (
          <button
            onClick={() => update({ series: [...series, [...series[series.length - 1]]] })}
            className="mt-3 flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            {text.compare.addSeries}
          </button>
        )}
      </Card>

      <Card title={text.compare.metrics[metric]} icon={BarChart3}>
        <ResponsiveContainer width="100%" height={chartHeight} initialDimension={{ width: 800, height: chartHeight }}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }} barCategoryGap="25%">
            <CartesianGrid stroke="var(--line)" horizontal={false} />
            <XAxis type="number" {...axisProps} tickFormatter={(v) => (metric === "mean_s" ? fmtSecAxis(v) : fmtNum(v, 0))} />
            <YAxis type="category" dataKey="name" {...axisProps} width={36} />
            <Tooltip
              cursor={{ fill: "var(--accent-soft)" }}
              content={({ active, payload }) => {
                const d = payload?.[0]?.payload as (typeof chartData)[number] | undefined;
                if (!active || !d) return null;
                return (
                  <div className="rounded-lg border border-line bg-card px-3 py-2 text-sm shadow-md">
                    <div className="font-medium">{d.name}</div>
                    <div className="text-muted">{d.label}</div>
                    <div className="tabular mt-1 font-medium">{format(d.value)}</div>
                  </div>
                );
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false}>
              {chartData.map((d) => (
                <Cell key={d.name} fill={langColor(d.language)} fillOpacity={d.env === "docker" ? DOCKER_OPACITY : 1} />
              ))}
              <ErrorBar dataKey="err" width={4} stroke="var(--muted)" strokeWidth={1} direction="x" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title={text.compare.series} icon={Table2}>
        <div className="overflow-x-auto">
          <table className="tabular w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-faint">
                <th className="px-2 py-2 font-medium">#</th>
                <th className="px-2 py-2 font-medium">{text.compare.series}</th>
                <th className="px-2 py-2 text-right font-medium">{text.compare.metrics[metric]}</th>
                <th className="px-2 py-2 text-right font-medium">{text.compare.vsFirst}</th>
                {type === "web" ? (
                  <>
                    <th className="px-2 py-2 text-right font-medium">{text.cols.ci95}</th>
                    <th className="px-2 py-2 text-right font-medium">{text.cols.p50}</th>
                    <th className="px-2 py-2 text-right font-medium">{text.cols.p99}</th>
                    <th className="px-2 py-2 text-right font-medium">{text.cols.errors}</th>
                  </>
                ) : (
                  <>
                    <th className="px-2 py-2 text-right font-medium">{text.cols.sd}</th>
                    <th className="px-2 py-2 text-right font-medium">{text.cols.median}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {resolved.map((s, i) => {
                const value = valueOf(s.row);
                const diff = i > 0 && base && value !== null ? ((value - base) / base) * 100 : null;
                const better = diff !== null && diff !== 0 && (diff > 0) === HIGHER_IS_BETTER[metric];
                const web = s.row as WebResult | undefined;
                const algo = s.row as AlgoResult | undefined;
                return (
                  <tr key={s.id} className="border-b border-line last:border-0">
                    <td className="px-2 py-1.5 font-semibold">{s.id}</td>
                    <td className="px-2 py-1.5">
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: langColor(s.language) }} />
                        {s.label}
                      </span>
                      {!s.row && <span className="text-sm text-accent-text">{text.compare.noData}</span>}
                    </td>
                    <td className="px-2 py-1.5 text-right font-medium">{format(value)}</td>
                    <td className="px-2 py-1.5 text-right">
                      {diff === null ? (
                        "–"
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          {diff > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                          {fmtPct(diff)}
                          <span className="text-muted">({better ? text.compare.better : text.compare.worse})</span>
                        </span>
                      )}
                    </td>
                    {type === "web" ? (
                      <>
                        <td className="px-2 py-1.5 text-right">
                          {web ? `${fmtNum(web.rps_ci95_low, 0)} – ${fmtNum(web.rps_ci95_high, 0)}` : "–"}
                        </td>
                        <td className="px-2 py-1.5 text-right">{fmtMs(web?.lat_p50_ms)}</td>
                        <td className="px-2 py-1.5 text-right">{fmtMs(web?.lat_p99_ms)}</td>
                        <td className="px-2 py-1.5 text-right">{fmtInt(web?.errors)}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-2 py-1.5 text-right">{fmtSec(algo?.sd_s)}</td>
                        <td className="px-2 py-1.5 text-right">{fmtSec(algo?.median_s)}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
