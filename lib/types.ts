// Shapes of the rows we read from Supabase (see supabase/migrations/001_init.sql)

export type Benchmark = {
  id: number;
  slug: string;
  category: "web" | "algorithm";
  suite: string | null;
  title_en: string;
  title_th: string;
  description_en: string | null;
  description_th: string | null;
  db_engine: string | null;
  unit: string;
  sort_order: number;
};

export type Env = "bme" | "docker";

export type WebResult = {
  benchmark_slug: string;
  language: string;
  environment: Env;
  tier: string;
  tier_order: number;
  tier_name: string | null;
  tier_scenario: string | null;
  threads: number | null;
  connections: number | null;
  duration: string | null;
  endpoint: string;
  rps_mean: number | null;
  rps_sd: number | null;
  rps_ci95_margin: number | null;
  rps_ci95_low: number | null;
  rps_ci95_high: number | null;
  lat_mean_ms: number | null;
  lat_sd_ms: number | null;
  lat_p50_ms: number | null;
  lat_p90_ms: number | null;
  lat_p95_ms: number | null;
  lat_p99_ms: number | null;
  lat_max_ms: number | null;
  errors: number | null;
  runs_count: number | null;
};

export type AlgoResult = {
  benchmark_slug: string;
  language: string;
  environment: Env;
  command: string | null;
  mean_s: number | null;
  sd_s: number | null;
  median_s: number | null;
  min_s: number | null;
  max_s: number | null;
  runs_count: number | null;
  times?: number[] | null;
};

export type Batch = {
  id: number;
  created_at: string;
  git_commit: string | null;
};
