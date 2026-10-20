-- Benchmark-web: initial schema
-- Run once in Supabase Dashboard → SQL Editor.
--
-- Data flow: Programming-Benchmark/scripts/sync_to_supabase.py (secret key)
--   1. inserts a run_batches row with status 'pending'
--   2. upserts benchmarks, inserts web_results / algo_results for that batch
--   3. flips the batch to 'complete'
-- The website (publishable key) reads only the latest_* views.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.run_batches (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  status      text not null default 'pending' check (status in ('pending', 'complete')),
  git_commit  text,
  host_note   text
);

create table public.benchmarks (
  id              bigint generated always as identity primary key,
  slug            text not null unique,              -- e.g. 'web-pos-get-no-index', 'algo-fibonacci'
  category        text not null check (category in ('web', 'algorithm')),
  suite           text,                               -- web: 'main' | 'pos'; algorithm: 'recursive' | 'interactive'
  title_en        text not null,
  title_th        text not null,
  description_en  text,
  description_th  text,
  db_engine       text,                               -- web only: 'MySQL' | 'PostgreSQL'
  unit            text not null,                      -- 'req/s' (web) | 's' (algorithm)
  sort_order      int not null default 0
);

create table public.web_results (
  id               bigint generated always as identity primary key,
  batch_id         bigint not null references public.run_batches(id) on delete cascade,
  benchmark_id     bigint not null references public.benchmarks(id) on delete cascade,
  language         text not null,                     -- display label, e.g. 'Node.js', 'Python (opt.)'
  environment      text not null check (environment in ('bme', 'docker')),
  tier             text not null check (tier in ('poc', 'small', 'general', 'high', 'stress')),
  tier_order       smallint not null,                 -- 1..5, POC → Stress
  tier_name        text,
  tier_scenario    text,
  threads          int,
  connections      int,
  duration         text,
  endpoint         text not null,                     -- '1table' | '2join' | ... | 'post-4table'
  endpoint_path    text not null,                     -- original wrk path, e.g. '/raw/2join'

  rps_mean         double precision,
  rps_sd           double precision,
  rps_ci95_margin  double precision,
  rps_ci95_low     double precision,
  rps_ci95_high    double precision,

  lat_mean_ms      double precision,
  lat_sd_ms        double precision,
  lat_ci95_margin  double precision,
  lat_ci95_low     double precision,
  lat_ci95_high    double precision,
  lat_p50_ms       double precision,
  lat_p90_ms       double precision,
  lat_p95_ms       double precision,
  lat_p99_ms       double precision,
  lat_max_ms       double precision,

  cpu_temp_avg_c   double precision,
  cpu_temp_max_c   double precision,
  errors           bigint,
  runs_count       int,
  raw_runs         jsonb,                             -- per-run wrk metrics from raw_results/*.json

  unique (batch_id, benchmark_id, language, environment, tier, endpoint)
);

create table public.algo_results (
  id            bigint generated always as identity primary key,
  batch_id      bigint not null references public.run_batches(id) on delete cascade,
  benchmark_id  bigint not null references public.benchmarks(id) on delete cascade,
  language      text not null,
  environment   text not null check (environment in ('bme', 'docker')),
  command       text,
  mean_s        double precision,
  sd_s          double precision,
  median_s      double precision,
  min_s         double precision,
  max_s         double precision,
  user_s        double precision,
  system_s      double precision,
  runs_count    int,
  times         jsonb,                                -- hyperfine per-run times (seconds)

  unique (batch_id, benchmark_id, language, environment)
);

create index web_results_batch_bench_idx  on public.web_results  (batch_id, benchmark_id);
create index algo_results_batch_bench_idx on public.algo_results (batch_id, benchmark_id);

-- ---------------------------------------------------------------------------
-- Latest-batch views (what the website reads)
-- ---------------------------------------------------------------------------

create view public.latest_batch
with (security_invoker = true) as
  select * from public.run_batches
  where status = 'complete'
  order by id desc
  limit 1;

create view public.latest_web_results
with (security_invoker = true) as
  select r.*, b.slug as benchmark_slug
  from public.web_results r
  join public.benchmarks b on b.id = r.benchmark_id
  where r.batch_id = (select id from public.latest_batch);

create view public.latest_algo_results
with (security_invoker = true) as
  select r.*, b.slug as benchmark_slug
  from public.algo_results r
  join public.benchmarks b on b.id = r.benchmark_id
  where r.batch_id = (select id from public.latest_batch);

-- ---------------------------------------------------------------------------
-- Row Level Security: public read-only; writes only via the secret key
-- (the secret key bypasses RLS, so no insert/update policies are defined).
-- ---------------------------------------------------------------------------

alter table public.run_batches  enable row level security;
alter table public.benchmarks   enable row level security;
alter table public.web_results  enable row level security;
alter table public.algo_results enable row level security;

create policy "public read" on public.run_batches  for select to anon, authenticated using (true);
create policy "public read" on public.benchmarks   for select to anon, authenticated using (true);
create policy "public read" on public.web_results  for select to anon, authenticated using (true);
create policy "public read" on public.algo_results for select to anon, authenticated using (true);

revoke insert, update, delete, truncate on
  public.run_batches, public.benchmarks, public.web_results, public.algo_results
  from anon, authenticated;

grant select on public.latest_batch, public.latest_web_results, public.latest_algo_results
  to anon, authenticated;
