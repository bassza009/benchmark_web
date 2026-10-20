"use client";

import { useState } from "react";
import {
  Bar, BarChart, CartesianGrid, ErrorBar, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { AlertTriangle, Download, Table2, Timer, TrendingUp, Zap } from "lucide-react";
import DataTable, { type Column } from "./DataTable";
import { axisProps, Card, Chip, ChartTooltip, FilterGroup, gridProps, Legend, Select, StatTile, Toggle } from "./ui";
import { downloadCsv } from "@/lib/csv";
import { fmtInt, fmtMs, fmtNum, fmtRps } from "@/lib/format";
import { endpointLabel, t, type Lang } from "@/lib/i18n";
import { DOCKER_DASH, DOCKER_OPACITY, langColor, sortLanguages } from "@/lib/languages";
import type { Env, WebResult } from "@/lib/types";

const TIERS = ["poc", "small", "general", "high", "stress"];
const ENVS: Env[] = ["bme", "docker"];
const PERCENTILES = [
  { key: "lat_p50_ms", label: "p50" },
  { key: "lat_p90_ms", label: "p90" },
  { key: "lat_p95_ms", label: "p95" },
  { key: "lat_p99_ms", label: "p99" },
] as const;

// One line / bar group = one language in one environment
type Series = { key: string; language: string; env: Env; label: string };

export default function WebBenchmarkView({ lang, slug, rows }: { lang: Lang; slug: string; rows: WebResult[] }) {
  const text = t(lang);
  const allLanguages = sortLanguages([...new Set(rows.map((r) => r.language))]);
  const allEndpoints = [...new Set(rows.map((r) => r.endpoint))].sort();

  // ----- filters -----
  const [envs, setEnvs] = useState<Env[]>(["bme"]);
  const [languages, setLanguages] = useState<string[]>(allLanguages);
  const [endpoint, setEndpoint] = useState(allEndpoints[0] ?? "");
  const [tier, setTier] = useState("general");
  const [logLatency, setLogLatency] = useState(false);

  function toggle<T>(list: T[], item: T, set: (v: T[]) => void) {
    set(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  }

  // ----- data for the charts -----
  const series: Series[] = [];
  for (const language of allLanguages) {
    for (const env of ENVS) {
      if (!languages.includes(language) || !envs.includes(env)) continue;
      if (!rows.some((r) => r.language === language && r.environment === env)) continue;
      series.push({ key: `${language}|${env}`, language, env, label: `${language} · ${text.env[env]}` });
    }
  }

  const find = (s: Series, tierKey: string, ep: string) =>
    rows.find((r) => r.language === s.language && r.environment === s.env && r.tier === tierKey && r.endpoint === ep);

  // Chart 1: one point per tier
  const tierData = TIERS.map((tierKey) => {
    const point: Record<string, string | number | null> = { name: text.tiers[tierKey] };
    for (const s of series) {
      const r = find(s, tierKey, endpoint);
      point[s.key] = r?.rps_mean ?? null;
      point[`${s.key}_ci`] = r?.rps_ci95_margin ?? 0;
    }
    return point;
  });

  // Chart 2: one group per percentile
  const percentileData = PERCENTILES.map((p) => {
    const point: Record<string, string | number | null> = { name: p.label };
    for (const s of series) {
      const value = find(s, tier, endpoint)?.[p.key] ?? null;
      point[s.key] = logLatency && value !== null && value <= 0 ? null : value;
    }
    return point;
  });

  // Chart 3: one group per endpoint
  const endpointData = allEndpoints.map((ep) => {
    const point: Record<string, string | number | null> = { name: endpointLabel(ep, lang) };
    for (const s of series) point[s.key] = find(s, tier, ep)?.rps_mean ?? null;
    return point;
  });

  // ----- stat tiles (selected tier + endpoint) -----
  const current = series
    .map((s) => ({ s, r: find(s, tier, endpoint) }))
    .filter((x): x is { s: Series; r: WebResult } => !!x.r);
  const best = (pick: (r: WebResult) => number | null, highest: boolean) =>
    current
      .filter((x) => pick(x.r) !== null && pick(x.r)! > 0)
      .sort((a, b) => (highest ? pick(b.r)! - pick(a.r)! : pick(a.r)! - pick(b.r)!))[0];
  const fastest = best((r) => r.rps_mean, true);
  const lowestP99 = best((r) => r.lat_p99_ms, false);
  const lowestMean = best((r) => r.lat_mean_ms, false);
  const totalErrors = current.reduce((sum, x) => sum + (x.r.errors ?? 0), 0);

  // ----- table (every tier, selected endpoint) -----
  const tableRows = rows
    .filter((r) => r.endpoint === endpoint && languages.includes(r.language) && envs.includes(r.environment))
    .sort((a, b) => a.tier_order - b.tier_order);

  const columns: Column<WebResult>[] = [
    {
      key: "language", label: text.cols.language, sortValue: (r) => r.language,
      render: (r) => (
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: langColor(r.language) }} />
          {r.language}
        </span>
      ),
    },
    { key: "env", label: text.cols.env, sortValue: (r) => r.environment, render: (r) => text.env[r.environment] },
    { key: "tier", label: text.cols.tier, sortValue: (r) => r.tier_order, render: (r) => text.tiers[r.tier] },
    { key: "rps", label: text.cols.rps, align: "right", sortValue: (r) => r.rps_mean, render: (r) => fmtNum(r.rps_mean, 0) },
    { key: "sd", label: text.cols.sd, align: "right", sortValue: (r) => r.rps_sd, render: (r) => fmtNum(r.rps_sd, 1) },
    {
      key: "ci", label: text.cols.ci95, align: "right", sortValue: (r) => r.rps_ci95_low,
      render: (r) => `${fmtNum(r.rps_ci95_low, 0)} – ${fmtNum(r.rps_ci95_high, 0)}`,
    },
    { key: "lat", label: text.cols.latMean, align: "right", sortValue: (r) => r.lat_mean_ms, render: (r) => fmtNum(r.lat_mean_ms) },
    { key: "p50", label: text.cols.p50, align: "right", sortValue: (r) => r.lat_p50_ms, render: (r) => fmtNum(r.lat_p50_ms) },
    { key: "p90", label: text.cols.p90, align: "right", sortValue: (r) => r.lat_p90_ms, render: (r) => fmtNum(r.lat_p90_ms) },
    { key: "p95", label: text.cols.p95, align: "right", sortValue: (r) => r.lat_p95_ms, render: (r) => fmtNum(r.lat_p95_ms) },
    { key: "p99", label: text.cols.p99, align: "right", sortValue: (r) => r.lat_p99_ms, render: (r) => fmtNum(r.lat_p99_ms) },
    { key: "max", label: text.cols.max, align: "right", sortValue: (r) => r.lat_max_ms, render: (r) => fmtNum(r.lat_max_ms) },
    { key: "errors", label: text.cols.errors, align: "right", sortValue: (r) => r.errors, render: (r) => fmtInt(r.errors) },
  ];

  function exportCsv() {
    downloadCsv(
      `${slug}-${endpoint}.csv`,
      ["language", "environment", "tier", "endpoint", "rps_mean", "rps_sd", "rps_ci95_low", "rps_ci95_high",
       "lat_mean_ms", "lat_p50_ms", "lat_p90_ms", "lat_p95_ms", "lat_p99_ms", "lat_max_ms", "errors"],
      tableRows.map((r) => [r.language, r.environment, r.tier, r.endpoint, r.rps_mean, r.rps_sd, r.rps_ci95_low,
        r.rps_ci95_high, r.lat_mean_ms, r.lat_p50_ms, r.lat_p90_ms, r.lat_p95_ms, r.lat_p99_ms, r.lat_max_ms, r.errors]),
    );
  }

  const legend = series.map((s) => ({ label: s.label, color: langColor(s.language), docker: s.env === "docker" }));
  const tierInfo = rows.find((r) => r.tier === tier);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-3">
          <FilterGroup label={text.filters.environment}>
            {ENVS.map((env) => (
              <Chip key={env} active={envs.includes(env)} onClick={() => toggle(envs, env, setEnvs)}>
                {text.env[env]}
              </Chip>
            ))}
          </FilterGroup>
          <FilterGroup label={text.filters.languages}>
            {allLanguages.map((l) => (
              <Chip key={l} active={languages.includes(l)} color={langColor(l)} onClick={() => toggle(languages, l, setLanguages)}>
                {l}
              </Chip>
            ))}
          </FilterGroup>
          <div className="flex flex-wrap items-end gap-4">
            <Select
              label={text.filters.endpoint}
              value={endpoint}
              onChange={setEndpoint}
              options={allEndpoints.map((ep) => ({ value: ep, label: endpointLabel(ep, lang) }))}
            />
            <Select
              label={text.filters.tier}
              value={tier}
              onChange={setTier}
              options={TIERS.map((k) => ({ value: k, label: text.tiers[k] }))}
            />
            {tierInfo && (
              <p className="pb-1.5 text-sm text-muted">
                {tierInfo.tier_scenario} · {tierInfo.connections} {text.web.connections} · {tierInfo.duration}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Zap} label={text.web.fastest} value={fastest ? fmtRps(fastest.r.rps_mean) : "–"} sub={fastest?.s.label} />
        <StatTile icon={Timer} label={text.web.lowestP99} value={lowestP99 ? fmtMs(lowestP99.r.lat_p99_ms) : "–"} sub={lowestP99?.s.label} />
        <StatTile icon={Timer} label={text.web.lowestMean} value={lowestMean ? fmtMs(lowestMean.r.lat_mean_ms) : "–"} sub={lowestMean?.s.label} />
        <StatTile icon={AlertTriangle} label={text.web.totalErrors} value={fmtInt(totalErrors)} sub={`${text.web.atTier} ${text.tiers[tier]}`} />
      </div>

      {/* Chart 1: throughput vs tier */}
      <Card title={text.web.throughputVsTier} hint={text.web.throughputVsTierHint} icon={TrendingUp}>
        <ResponsiveContainer width="100%" height={320} initialDimension={{ width: 800, height: 320 }}>
          <LineChart data={tierData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v) => fmtNum(v, 0)} width={64} />
            <Tooltip content={<ChartTooltip format={(v) => fmtRps(v)} />} />
            {series.map((s) => (
              <Line
                key={s.key}
                dataKey={s.key}
                name={s.label}
                stroke={langColor(s.language)}
                strokeWidth={2}
                strokeDasharray={s.env === "docker" ? DOCKER_DASH : undefined}
                dot={{ r: 4, strokeWidth: 2, fill: "var(--card)" }}
                activeDot={{ r: 6 }}
                connectNulls
                isAnimationActive={false}
              >
                <ErrorBar dataKey={`${s.key}_ci`} width={4} stroke={langColor(s.language)} strokeWidth={1} />
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
        <Legend items={legend} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Chart 2: latency percentiles */}
        <Card
          title={text.web.percentiles}
          hint={text.web.percentilesHint}
          icon={Timer}
          actions={<Toggle label={text.filters.logScale} checked={logLatency} onChange={setLogLatency} />}
        >
          <ResponsiveContainer width="100%" height={300} initialDimension={{ width: 500, height: 300 }}>
            <BarChart data={percentileData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barCategoryGap="20%" barGap={2}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis
                {...axisProps}
                width={64}
                scale={logLatency ? "log" : "auto"}
                domain={logLatency ? ["auto", "auto"] : [0, "auto"]}
                allowDataOverflow
                tickFormatter={(v) => fmtNum(v, v < 10 ? 1 : 0)}
              />
              <Tooltip cursor={{ fill: "var(--accent-soft)" }} content={<ChartTooltip format={(v) => fmtMs(v)} />} />
              {series.map((s) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.label}
                  fill={langColor(s.language)}
                  fillOpacity={s.env === "docker" ? DOCKER_OPACITY : 1}
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <Legend items={legend} />
        </Card>

        {/* Chart 3: endpoints */}
        <Card title={text.web.endpoints} hint={text.web.endpointsHint} icon={Zap}>
          <ResponsiveContainer width="100%" height={300} initialDimension={{ width: 500, height: 300 }}>
            <BarChart data={endpointData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barCategoryGap="20%" barGap={2}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} width={64} tickFormatter={(v) => fmtNum(v, 0)} />
              <Tooltip cursor={{ fill: "var(--accent-soft)" }} content={<ChartTooltip format={(v) => fmtRps(v)} />} />
              {series.map((s) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.label}
                  fill={langColor(s.language)}
                  fillOpacity={s.env === "docker" ? DOCKER_OPACITY : 1}
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <Legend items={legend} />
        </Card>
      </div>

      {/* Full table */}
      <Card
        title={`${text.web.table} · ${endpointLabel(endpoint, lang)}`}
        icon={Table2}
        actions={
          <button onClick={exportCsv} className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-sm text-muted hover:border-accent hover:text-accent-text">
            <Download className="h-4 w-4" />
            {text.exportCsv}
          </button>
        }
      >
        <DataTable columns={columns} rows={tableRows} />
      </Card>
    </div>
  );
}
