// Read data from the local PostgreSQL database (schema: db/schema.sql).
// Pages re-render at most once every 60 seconds (export const revalidate = 60),
// so a new sync shows up within a minute.
// Server-only: this file is imported only by server components.

import { Pool, types } from "pg";
import type { AlgoResult, Batch, Benchmark, WebResult } from "./types";

// bigint (int8) columns -> number (pg returns strings by default; our values are far below 2^53)
types.setTypeParser(20, (v) => Number(v));

// Reuse one pool across hot reloads in dev
const globalForPg = globalThis as unknown as { pgPool?: Pool };

function pool(): Pool {
  if (!globalForPg.pgPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("Missing env: DATABASE_URL (see .env.example)");
    }
    globalForPg.pgPool = new Pool({ connectionString, max: 5 });
  }
  return globalForPg.pgPool;
}

async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const res = await pool().query(sql, params);
  return res.rows as T[];
}

const WEB_COLUMNS = [
  "benchmark_slug", "language", "environment", "tier", "tier_order", "tier_name", "tier_scenario",
  "threads", "connections", "duration", "endpoint",
  "rps_mean", "rps_sd", "rps_ci95_margin", "rps_ci95_low", "rps_ci95_high",
  "lat_mean_ms", "lat_sd_ms", "lat_p50_ms", "lat_p90_ms", "lat_p95_ms", "lat_p99_ms", "lat_max_ms",
  "errors", "runs_count",
].join(", ");

const ALGO_COLUMNS = [
  "benchmark_slug", "language", "environment", "command",
  "mean_s", "sd_s", "median_s", "min_s", "max_s", "runs_count",
].join(", ");

export function getBenchmarks() {
  return query<Benchmark>("select * from benchmarks order by sort_order");
}

export async function getBenchmark(slug: string) {
  const rows = await query<Benchmark>("select * from benchmarks where slug = $1", [slug]);
  return rows[0] ?? null;
}

export async function getLatestBatch() {
  // created_at as an ISO string (same shape the page expects), not a Date object
  const rows = await query<Batch>(
    "select id, to_json(created_at) #>> '{}' as created_at, git_commit from latest_batch",
  );
  return rows[0] ?? null;
}

// slug = null -> every web benchmark (used by the compare page)
export function getWebResults(slug: string | null) {
  return slug
    ? query<WebResult>(`select ${WEB_COLUMNS} from latest_web_results where benchmark_slug = $1 order by id`, [slug])
    : query<WebResult>(`select ${WEB_COLUMNS} from latest_web_results order by id`);
}

// withTimes = true also loads every single run time (for the dot plot)
export function getAlgoResults(slug: string | null, withTimes = false) {
  const cols = withTimes ? `${ALGO_COLUMNS}, times` : ALGO_COLUMNS;
  return slug
    ? query<AlgoResult>(`select ${cols} from latest_algo_results where benchmark_slug = $1 order by id`, [slug])
    : query<AlgoResult>(`select ${cols} from latest_algo_results order by id`);
}
