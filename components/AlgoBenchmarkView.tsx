"use client";

import { useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, ErrorBar, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis,
} from "recharts";
import { Container, Download, Gauge, ScatterChart as ScatterIcon, Table2, Timer, Turtle } from "lucide-react";
import DataTable, { type Column } from "./DataTable";
import { axisProps, Card, Chip, ChartTooltip, FilterGroup, gridProps, Legend, StatTile, Toggle } from "./ui";
import { downloadCsv } from "@/lib/csv";
import { fmtInt, fmtPct, fmtSec, fmtSecAxis } from "@/lib/format";
import { t, type Lang } from "@/lib/i18n";
import { DOCKER_OPACITY, langColor, sortLanguages } from "@/lib/languages";
import type { AlgoResult, Env } from "@/lib/types";

const ENVS: Env[] = ["bme", "docker"];

export default function AlgoBenchmarkView({ lang, slug, rows }: { lang: Lang; slug: string; rows: AlgoResult[] }) {
  const text = t(lang);
  const allLanguages = sortLanguages([...new Set(rows.map((r) => r.language))]);

  const [envs, setEnvs] = useState<Env[]>(["bme", "docker"]);
  const [languages, setLanguages] = useState<string[]>(allLanguages);
  const [logScale, setLogScale] = useState(false);

  function toggle<T>(list: T[], item: T, set: (v: T[]) => void) {
    set(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  }

  const visible = rows.filter((r) => languages.includes(r.language) && envs.includes(r.environment));
  const find = (language: string, env: Env) => rows.find((r) => r.language === language && r.environment === env);
  const shownLanguages = allLanguages.filter((l) => languages.includes(l));

  // Chart 1: one group per language, one bar per environment
  const barData = shownLanguages.map((language) => {
    const point: Record<string, string | number | null> = { name: language };
    for (const env of ENVS) {
      const r = find(language, env);
      point[env] = r?.mean_s ?? null;
      point[`${env}_sd`] = r?.sd_s ?? 0;
    }
    return point;
  });

  // Chart 2: every single run as a dot
  const dotSeries = shownLanguages.flatMap((language) =>
    ENVS.filter((env) => envs.includes(env)).map((env) => {
      const label = `${language} · ${text.env[env]}`;
      return {
        language,
        env,
        label,
        points: (find(language, env)?.times ?? []).map((time) => ({ x: label, y: time })),
      };
    }),
  );

  // Docker overhead = how much slower Docker is than bare metal
  const overhead = (language: string) => {
    const bme = find(language, "bme")?.mean_s;
    const docker = find(language, "docker")?.mean_s;
    return bme && docker ? ((docker - bme) / bme) * 100 : null;
  };

  const byTime = [...visible].filter((r) => r.mean_s).sort((a, b) => a.mean_s! - b.mean_s!);
  const fastest = byTime[0];
  const slowest = byTime[byTime.length - 1];
  // Median (not mean) so one odd language does not dominate the tile
  const overheads = shownLanguages.map(overhead).filter((v): v is number => v !== null).sort((a, b) => a - b);
  const mid = Math.floor(overheads.length / 2);
  const medianOverhead = !overheads.length
    ? null
    : overheads.length % 2
      ? overheads[mid]
      : (overheads[mid - 1] + overheads[mid]) / 2;

  const columns: Column<AlgoResult>[] = [
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
    { key: "mean", label: text.cols.mean, align: "right", sortValue: (r) => r.mean_s, render: (r) => fmtSec(r.mean_s) },
    { key: "sd", label: text.cols.sd, align: "right", sortValue: (r) => r.sd_s, render: (r) => fmtSec(r.sd_s) },
    { key: "median", label: text.cols.median, align: "right", sortValue: (r) => r.median_s, render: (r) => fmtSec(r.median_s) },
    { key: "min", label: text.cols.min, align: "right", sortValue: (r) => r.min_s, render: (r) => fmtSec(r.min_s) },
    { key: "max", label: text.cols.max, align: "right", sortValue: (r) => r.max_s, render: (r) => fmtSec(r.max_s) },
    { key: "runs", label: text.cols.runs, align: "right", sortValue: (r) => r.runs_count, render: (r) => fmtInt(r.runs_count) },
    {
      key: "overhead", label: text.algo.overhead, align: "right",
      sortValue: (r) => (r.environment === "docker" ? overhead(r.language) : null),
      render: (r) => (r.environment === "docker" ? fmtPct(overhead(r.language)) : "–"),
    },
  ];

  function exportCsv() {
    downloadCsv(
      `${slug}.csv`,
      ["language", "environment", "mean_s", "sd_s", "median_s", "min_s", "max_s", "runs"],
      visible.map((r) => [r.language, r.environment, r.mean_s, r.sd_s, r.median_s, r.min_s, r.max_s, r.runs_count]),
    );
  }

  const yAxis = (
    <YAxis
      {...axisProps}
      width={72}
      scale={logScale ? "log" : "auto"}
      domain={logScale ? ["auto", "auto"] : [0, "auto"]}
      allowDataOverflow
      tickFormatter={(v) => fmtSecAxis(v)}
    />
  );
  const legend = ENVS.filter((env) => envs.includes(env)).map((env) => ({
    label: text.env[env],
    color: "var(--muted)",
    docker: env === "docker",
  }));

  return (
    <div className="space-y-4">
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
          <Toggle label={text.filters.logScale} checked={logScale} onChange={setLogScale} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatTile icon={Gauge} label={text.algo.fastest} value={fastest ? fmtSec(fastest.mean_s) : "–"} sub={fastest ? `${fastest.language} · ${text.env[fastest.environment]}` : undefined} />
        <StatTile icon={Turtle} label={text.algo.slowest} value={slowest ? fmtSec(slowest.mean_s) : "–"} sub={slowest ? `${slowest.language} · ${text.env[slowest.environment]}` : undefined} />
        <StatTile icon={Container} label={text.algo.avgOverhead} value={fmtPct(medianOverhead)} sub={`Docker vs ${text.env.bme}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={text.algo.meanTime} hint={text.algo.meanTimeHint} icon={Timer}>
          <ResponsiveContainer width="100%" height={320} initialDimension={{ width: 800, height: 320 }}>
            <BarChart data={barData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barCategoryGap="25%" barGap={2}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="name" {...axisProps} />
              {yAxis}
              <Tooltip cursor={{ fill: "var(--accent-soft)" }} content={<ChartTooltip format={(v) => fmtSec(v)} />} />
              {ENVS.filter((env) => envs.includes(env)).map((env) => (
                <Bar key={env} dataKey={env} name={text.env[env]} radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {barData.map((d) => (
                    <Cell
                      key={String(d.name)}
                      fill={langColor(String(d.name))}
                      fillOpacity={env === "docker" ? DOCKER_OPACITY : 1}
                    />
                  ))}
                  <ErrorBar dataKey={`${env}_sd`} width={4} stroke="var(--muted)" strokeWidth={1} />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
          <Legend items={legend} />
        </Card>

        <Card title={text.algo.runs} hint={text.algo.runsHint} icon={ScatterIcon}>
          <ResponsiveContainer width="100%" height={320} initialDimension={{ width: 800, height: 320 }}>
            <ScatterChart margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis
                dataKey="x"
                type="category"
                allowDuplicatedCategory={false}
                {...axisProps}
                tick={{ fill: "var(--faint)", fontSize: 11 }}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={70}
              />
              <YAxis dataKey="y" type="number" {...axisProps} width={72} scale={logScale ? "log" : "auto"} domain={["auto", "auto"]} tickFormatter={(v) => fmtSecAxis(v)} />
              <Tooltip cursor={false} content={<ChartTooltip format={(v) => fmtSec(v)} />} />
              {dotSeries.map((s) => (
                <Scatter
                  key={s.label}
                  name={s.label}
                  data={s.points}
                  fill={langColor(s.language)}
                  fillOpacity={s.env === "docker" ? DOCKER_OPACITY + 0.2 : 0.9}
                  shape="circle"
                  isAnimationActive={false}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card
        title={text.algo.table}
        icon={Table2}
        actions={
          <button onClick={exportCsv} className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-sm text-muted hover:border-accent hover:text-accent-text">
            <Download className="h-4 w-4" />
            {text.exportCsv}
          </button>
        }
      >
        <DataTable columns={columns} rows={visible} />
      </Card>
    </div>
  );
}
