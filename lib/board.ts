// Data for the home-page leaderboard: every web benchmark, its first endpoint,
// all load tiers, both environments. Kept small because it is sent to the browser.

import type { Benchmark, Env, WebResult } from "./types";

export type BoardSuite = {
  slug: string;
  title_en: string;
  title_th: string;
  db_engine: string | null;
  endpoint: string;
};

export type BoardRow = {
  s: string; // benchmark slug
  l: string; // language
  e: Env;
  t: string; // tier
  rps: number;
  ci: number | null; // 95% CI margin of req/s
  lat: number | null; // mean latency ms
  p99: number | null;
  err: number | null;
};

export type Board = { suites: BoardSuite[]; tiers: string[]; rows: BoardRow[] };

export function buildBoard(benchmarks: Benchmark[], web: WebResult[]): Board {
  const suites: BoardSuite[] = [];
  const rows: BoardRow[] = [];
  const tierOrder = new Map<string, number>();

  for (const b of benchmarks.filter((x) => x.category === "web")) {
    const own = web.filter((r) => r.benchmark_slug === b.slug);
    const endpoint = [...new Set(own.map((r) => r.endpoint))].sort()[0];
    if (!endpoint) continue;
    suites.push({ slug: b.slug, title_en: b.title_en, title_th: b.title_th, db_engine: b.db_engine, endpoint });

    for (const r of own) {
      if (r.endpoint !== endpoint || !r.rps_mean) continue;
      tierOrder.set(r.tier, r.tier_order);
      rows.push({
        s: b.slug, l: r.language, e: r.environment, t: r.tier,
        rps: r.rps_mean, ci: r.rps_ci95_margin, lat: r.lat_mean_ms, p99: r.lat_p99_ms, err: r.errors,
      });
    }
  }

  const tiers = [...tierOrder.entries()].sort((a, b) => a[1] - b[1]).map(([t]) => t);
  return { suites, tiers, rows };
}
