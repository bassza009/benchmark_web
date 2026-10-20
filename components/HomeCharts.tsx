"use client";

// The two charts on the home page: "index vs no index" and "Docker tax"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisProps, ChartTooltip, gridProps } from "./ui";
import { fmtNum, fmtPct, fmtRps } from "@/lib/format";
import { langColor } from "@/lib/languages";
import type { DockerRow, IndexRow } from "@/lib/highlights";

export function IndexChart({ rows, noIndexLabel, withIndexLabel }: { rows: IndexRow[]; noIndexLabel: string; withIndexLabel: string }) {
  return (
    <>
      <ResponsiveContainer width="100%" height={300} initialDimension={{ width: 560, height: 300 }}>
        <BarChart data={rows} margin={{ top: 24, right: 8, left: 8, bottom: 0 }} barCategoryGap="22%" barGap={3}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="language" {...axisProps} interval={0} tick={{ fill: "var(--faint)", fontSize: 11 }} />
          <YAxis {...axisProps} width={56} tickFormatter={(v) => fmtNum(v, 0)} />
          <Tooltip cursor={{ fill: "var(--accent-soft)" }} content={<ChartTooltip format={(v) => fmtRps(v)} />} />
          <Bar dataKey="noIndex" name={noIndexLabel} fill="var(--faint)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="withIndex" name={withIndexLabel} fill="var(--accent)" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            <LabelList
              dataKey="speedup"
              position="top"
              formatter={(v: unknown) => `×${fmtNum(Number(v), 0)}`}
              style={{ fill: "var(--ink)", fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <ul className="mt-2 flex gap-4 text-sm text-muted">
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-faint" />
          {noIndexLabel}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
          {withIndexLabel}
        </li>
      </ul>
    </>
  );
}

export function DockerChart({ rows }: { rows: DockerRow[] }) {
  const sorted = [...rows].sort((a, b) => a.change - b.change);
  return (
    <ResponsiveContainer width="100%" height={300} initialDimension={{ width: 560, height: 300 }}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 56, left: 8, bottom: 0 }} barCategoryGap="28%">
        <CartesianGrid stroke="var(--line)" horizontal={false} />
        <XAxis type="number" {...axisProps} domain={[-110, 30]} ticks={[-100, -75, -50, -25, 0, 25]} tickFormatter={(v) => `${v}%`} />
        <YAxis type="category" dataKey="language" {...axisProps} width={64} />
        <ReferenceLine x={0} stroke="var(--muted)" />
        <Tooltip
          cursor={{ fill: "var(--accent-soft)" }}
          content={({ active, payload }) => {
            const d = payload?.[0]?.payload as DockerRow | undefined;
            if (!active || !d) return null;
            return (
              <div className="tabular rounded-lg border border-line bg-card px-3 py-2 text-sm shadow-md">
                <div className="font-medium">{d.language}</div>
                <div className="text-muted">Bare Metal: {fmtRps(d.bme)}</div>
                <div className="text-muted">Docker: {fmtRps(d.docker)}</div>
                <div className="mt-1 font-medium">{fmtPct(d.change)}</div>
              </div>
            );
          }}
        />
        <Bar dataKey="change" radius={4} isAnimationActive={false}>
          {sorted.map((d) => (
            <Cell key={d.language} fill={langColor(d.language)} />
          ))}
          <LabelList
            dataKey="change"
            position="right"
            formatter={(v: unknown) => fmtPct(Number(v))}
            style={{ fill: "var(--ink)", fontSize: 12, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
