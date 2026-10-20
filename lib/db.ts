// Read data from Supabase through its REST API (PostgREST).
// Pages re-fetch at most once every 60 seconds, so a new sync shows up within a minute.

import type { AlgoResult, Batch, Benchmark, WebResult } from "./types";

// Only read on the server, so the NEXT_PUBLIC_ prefix is optional (both names work)
const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const PAGE_SIZE = 1000; // Supabase returns at most 1000 rows per request

const WEB_COLUMNS = [
  "benchmark_slug", "language", "environment", "tier", "tier_order", "tier_name", "tier_scenario",
  "threads", "connections", "duration", "endpoint",
  "rps_mean", "rps_sd", "rps_ci95_margin", "rps_ci95_low", "rps_ci95_high",
  "lat_mean_ms", "lat_sd_ms", "lat_p50_ms", "lat_p90_ms", "lat_p95_ms", "lat_p99_ms", "lat_max_ms",
  "errors", "runs_count",
].join(",");

const ALGO_COLUMNS = [
  "benchmark_slug", "language", "environment", "command",
  "mean_s", "sd_s", "median_s", "min_s", "max_s", "runs_count",
].join(",");

async function query<T>(table: string, params: Record<string, string>): Promise<T[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    const missing = [
      !SUPABASE_URL && "SUPABASE_URL",
      !SUPABASE_KEY && "SUPABASE_PUBLISHABLE_KEY",
    ].filter(Boolean);
    // On Vercel: Settings -> Environment Variables (tick Production), then redeploy
    throw new Error(`Missing env: ${missing.join(", ")} (local: .env, Vercel: Settings -> Environment Variables)`);
  }

  const rows: T[] = [];
  let from = 0;
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?${new URLSearchParams(params)}`;
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_KEY, Range: `${from}-${from + PAGE_SIZE - 1}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`Supabase ${table} failed (${res.status}): ${await res.text()}`);
    }
    const page: T[] = await res.json();
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return rows;
}

export function getBenchmarks() {
  return query<Benchmark>("benchmarks", { select: "*", order: "sort_order" });
}

export async function getBenchmark(slug: string) {
  const rows = await query<Benchmark>("benchmarks", { select: "*", slug: `eq.${slug}` });
  return rows[0] ?? null;
}

export async function getLatestBatch() {
  const rows = await query<Batch>("latest_batch", { select: "id,created_at,git_commit" });
  return rows[0] ?? null;
}

// slug = null -> every web benchmark (used by the compare page)
export function getWebResults(slug: string | null) {
  const params: Record<string, string> = { select: WEB_COLUMNS, order: "id" };
  if (slug) params.benchmark_slug = `eq.${slug}`;
  return query<WebResult>("latest_web_results", params);
}

// withTimes = true also loads every single run time (for the dot plot)
export function getAlgoResults(slug: string | null, withTimes = false) {
  const params: Record<string, string> = {
    select: withTimes ? `${ALGO_COLUMNS},times` : ALGO_COLUMNS,
    order: "id",
  };
  if (slug) params.benchmark_slug = `eq.${slug}`;
  return query<AlgoResult>("latest_algo_results", params);
}
