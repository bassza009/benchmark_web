"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Container, Trophy } from "lucide-react";
import type { Board } from "@/lib/board";
import { fmtNum } from "@/lib/format";
import { benchmarkTitle, endpointLabel, t, type Lang } from "@/lib/i18n";
import { langColor } from "@/lib/languages";
import { stackOf } from "@/lib/stack";
import type { Env } from "@/lib/types";
import LangLogo from "./LangLogo";
import Reveal from "./Reveal";

const ENVS: Env[] = ["bme", "docker"];

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex rounded-lg border border-line bg-card-2 p-0.5 font-mono text-xs">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`rounded-md px-2.5 py-1 transition-colors ${
            value === o.value ? "border border-accent/30 bg-accent-soft font-bold text-accent" : "border border-transparent text-muted hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Docker share of bare metal -> status color
function keptColor(pct: number) {
  return pct >= 90 ? "var(--data)" : pct >= 50 ? "var(--warn)" : "var(--bad)";
}

export default function SuiteBoard({ lang, board }: { lang: Lang; board: Board }) {
  const text = t(lang);
  const d = text.dash;
  const [slug, setSlug] = useState(board.suites[0]?.slug ?? "");
  const [tier, setTier] = useState(board.tiers.includes("general") ? "general" : board.tiers[0]);
  const [env, setEnv] = useState<Env>("bme");

  const suite = board.suites.find((s) => s.slug === slug) ?? board.suites[0];

  const ranked = useMemo(
    () => board.rows.filter((r) => r.s === slug && r.t === tier && r.e === env).sort((a, b) => b.rps - a.rps),
    [board.rows, slug, tier, env],
  );

  const kept = useMemo(() => {
    const own = board.rows.filter((r) => r.s === slug && r.t === tier);
    return own
      .filter((r) => r.e === "bme")
      .map((b) => {
        const dk = own.find((r) => r.e === "docker" && r.l === b.l);
        return dk ? { language: b.l, pct: (dk.rps / b.rps) * 100 } : null;
      })
      .filter((x): x is { language: string; pct: number } => x !== null)
      .sort((a, b) => b.pct - a.pct);
  }, [board.rows, slug, tier]);

  if (!suite) return null;
  const max = ranked[0]?.rps ?? 1;
  const tierName = text.tiers[tier] ?? tier;
  const envName = text.env[env];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="hud flex flex-col gap-3 p-4 xl:flex-row xl:items-center xl:justify-between">
        <label className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          <span className="uppercase tracking-widest">{d.suite}:</span>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="rounded-lg border border-line bg-card-2 px-3 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
          >
            {board.suites.map((s) => (
              <option key={s.slug} value={s.slug}>
                {benchmarkTitle(s, lang)} · {s.db_engine}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <Segmented label={d.tier} value={tier} onChange={setTier} options={board.tiers.map((x) => ({ value: x, label: text.tiers[x] ?? x }))} />
          <Segmented label={d.env} value={env} onChange={setEnv} options={ENVS.map((x) => ({ value: x, label: text.env[x] }))} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ranked bars */}
        <Reveal className="hud p-5 lg:col-span-2">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider">
                <span className="h-4 w-1 rounded-sm bg-accent shadow-[0_0_6px_var(--accent)]" />
                {d.boardTitle} // {benchmarkTitle(suite, lang)}
              </h2>
              <p className="mt-1 font-mono text-xs text-muted">{d.boardHint(endpointLabel(suite.endpoint, lang), tierName, envName)}</p>
            </div>
            <Link href={`/${lang}/benchmark/${suite.slug}`} className="flex items-center gap-1 font-mono text-xs text-accent-text hover:text-ink">
              {d.openSuite}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {ranked.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">{d.noRows}</p>
          ) : (
            <ol className="space-y-3 font-mono text-xs">
              {ranked.map((r, i) => {
                const stack = stackOf(r.l);
                return (
                  <li key={r.l} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2 font-bold text-ink">
                        <span className="w-5 text-faint">{String(i + 1).padStart(2, "0")}</span>
                        <LangLogo language={r.l} size={14} />
                        <span className="truncate">
                          {r.l}
                          {stack && <span className="ml-1.5 font-normal text-faint">{stack.framework}</span>}
                        </span>
                      </span>
                      <span className={`tabular shrink-0 font-bold ${i === 0 ? "neon text-accent" : "text-ink"}`}>
                        {fmtNum(r.rps, 0)} req/s
                        <span className="ml-1 font-normal text-faint">/ ×{fmtNum(max / r.rps, 2)}</span>
                      </span>
                    </div>
                    <div className="flex h-3 w-full overflow-hidden rounded bg-card-2 p-0.5">
                      <div
                        className="reveal-bar h-full rounded-sm"
                        style={{
                          width: `${Math.max(1.5, (r.rps / max) * 100)}%`,
                          background: langColor(r.l),
                          boxShadow: i === 0 ? `0 0 12px ${langColor(r.l)}` : undefined,
                          ["--i" as string]: i,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-faint">×N = {d.vsFastest}</p>
        </Reveal>

        {/* Docker retention */}
        <Reveal className="hud flex flex-col p-5">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider">
            <Container className="h-4 w-4 text-data" />
            {d.keptTitle}
          </h2>
          <p className="mt-1 font-mono text-xs text-muted">{d.keptHint(tierName)}</p>

          <ul className="mt-5 flex-1 space-y-3 font-mono text-xs">
            {kept.map((k, i) => (
              <li key={k.language}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-ink">
                    <LangLogo language={k.language} size={14} />
                    {k.language}
                  </span>
                  <span className="tabular font-bold" style={{ color: keptColor(k.pct) }}>
                    {fmtNum(k.pct, 0)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-card-2">
                  <div
                    className="reveal-bar h-full rounded-full"
                    style={{ width: `${Math.min(100, k.pct)}%`, background: keptColor(k.pct), ["--i" as string]: i }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-3 border-t border-line pt-3 font-mono text-[10px] text-muted">
            {[
              [d.keptGood, "var(--data)"],
              [d.keptMid, "var(--warn)"],
              [d.keptBad, "var(--bad)"],
            ].map(([label, color]) => (
              <span key={label} className="flex items-center gap-1.5">
                <span className="h-1.5 w-3 rounded-sm" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Leaderboard table */}
      <Reveal className="hud overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-line p-5">
          <div>
            <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider">
              <Trophy className="h-4 w-4 text-accent" />
              {d.tableTitle} // {benchmarkTitle(suite, lang)} · {tierName} · {envName}
            </h2>
            <p className="mt-1 font-mono text-xs text-muted">{d.tableHint}</p>
          </div>
          <BarChart3 className="h-4 w-4 text-faint" aria-hidden />
        </div>
        <div className="overflow-x-auto">
          <table className="tabular w-full min-w-[860px] text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-line bg-card-2 text-[10px] uppercase tracking-widest text-faint">
                <th className="px-5 py-2.5 font-medium">{d.rank}</th>
                <th className="px-3 py-2.5 font-medium">{d.runtime}</th>
                <th className="px-3 py-2.5 text-right font-medium">{d.rps}</th>
                <th className="px-3 py-2.5 text-right font-medium">{d.ci}</th>
                <th className="px-3 py-2.5 text-right font-medium">{d.mean}</th>
                <th className="px-3 py-2.5 text-right font-medium">{d.p99}</th>
                <th className="px-3 py-2.5 text-right font-medium">{d.errors}</th>
                <th className="px-3 py-2.5 font-medium">{d.model}</th>
                <th className="px-5 py-2.5 text-right font-medium">{d.score}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ranked.map((r, i) => {
                const stack = stackOf(r.l);
                const score = (r.rps / max) * 100;
                return (
                  <tr key={r.l} className="transition-colors hover:bg-card-2">
                    <td className={`px-5 py-3 font-bold ${i === 0 ? "text-accent" : "text-faint"}`}>#{String(i + 1).padStart(2, "0")}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <LangLogo language={r.l} size={16} />
                        <div>
                          <div className="text-[10px] text-faint">[{stack?.tag ?? r.l.toUpperCase()}]</div>
                          <div className="font-sans text-[13px] font-semibold text-ink">
                            {stack ? `${stack.runtime} · ${stack.framework}` : r.l}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-ink">{fmtNum(r.rps, 0)}</td>
                    <td className="px-3 py-3 text-right text-muted">{r.ci !== null ? `±${fmtNum(r.ci, 0)}` : "–"}</td>
                    <td className="px-3 py-3 text-right text-muted">{r.lat !== null ? `${fmtNum(r.lat, 1)} ms` : "–"}</td>
                    <td className="px-3 py-3 text-right text-muted">{r.p99 !== null ? `${fmtNum(r.p99, 1)} ms` : "–"}</td>
                    <td className={`px-3 py-3 text-right ${r.err ? "font-bold text-bad" : "text-muted"}`}>{r.err !== null ? fmtNum(r.err, 0) : "–"}</td>
                    <td className="px-3 py-3 text-muted">{stack?.model ?? "–"}</td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`inline-block rounded border px-2 py-0.5 text-[11px] font-bold ${
                          i === 0 ? "border-accent/40 bg-accent-soft text-accent" : "border-line bg-card-2 text-ink"
                        }`}
                      >
                        {fmtNum(score, 1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}
