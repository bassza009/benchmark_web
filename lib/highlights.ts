// Numbers for the home page "key findings". Everything is calculated from the latest data,
// so the cards update by themselves after a new sync. Change the settings below to pick
// which benchmark / tier / endpoint each finding uses.

import { sortLanguages } from "./languages";
import type { AlgoResult, Benchmark, WebResult } from "./types";

const INDEX = { noIndex: "web-main-get-no-index", withIndex: "web-main-get-with-index", tier: "general", endpoint: "4join", env: "bme" };
const DOCKER = { slug: "web-main-get-no-index", tier: "general", endpoint: "1table" };
const GAP_SLUG = "algo-fibonacci"; // heavy CPU task, so start-up time does not distort the gap
const WEB_CARD = { tier: "general", env: "bme" }; // what the big web cards on top show

export type IndexRow = { language: string; noIndex: number; withIndex: number; speedup: number };
export type DockerRow = { language: string; bme: number; docker: number; change: number };
export type Heatmap = {
  benchmarks: Benchmark[];
  languages: string[];
  ratio: Record<string, Record<string, number | null>>; // [slug][language] = times slower than fastest
  maxRatio: number;
};

export type WebCard = {
  benchmark: Benchmark;
  endpoint: string;
  tier: string;
  bars: { language: string; rps: number; p99: number | null }[]; // fastest first
};

// One big card per web benchmark: req/s of every language (General load, first endpoint, bare metal)
export function buildWebCards(benchmarks: Benchmark[], web: WebResult[]): WebCard[] {
  return benchmarks
    .filter((b) => b.category === "web")
    .map((benchmark) => {
      const rows = web.filter((r) => r.benchmark_slug === benchmark.slug);
      const endpoint = [...new Set(rows.map((r) => r.endpoint))].sort()[0] ?? "";
      const bars = rows
        .filter((r) => r.tier === WEB_CARD.tier && r.environment === WEB_CARD.env && r.endpoint === endpoint && r.rps_mean)
        .map((r) => ({ language: r.language, rps: r.rps_mean!, p99: r.lat_p99_ms }))
        .sort((a, b) => b.rps - a.rps);
      return { benchmark, endpoint, tier: WEB_CARD.tier, bars };
    })
    .filter((card) => card.bars.length > 0);
}

export function buildHighlights(benchmarks: Benchmark[], web: WebResult[], algo: AlgoResult[]) {
  const rps = (slug: string, language: string, env: string, tier: string, endpoint: string) =>
    web.find((r) => r.benchmark_slug === slug && r.language === language && r.environment === env && r.tier === tier && r.endpoint === endpoint)
      ?.rps_mean ?? null;

  const webLanguages = sortLanguages([...new Set(web.map((r) => r.language))]);

  // 1) Index vs no index
  const indexRows: IndexRow[] = [];
  for (const language of webLanguages) {
    const noIndex = rps(INDEX.noIndex, language, INDEX.env, INDEX.tier, INDEX.endpoint);
    const withIndex = rps(INDEX.withIndex, language, INDEX.env, INDEX.tier, INDEX.endpoint);
    if (noIndex && withIndex) indexRows.push({ language, noIndex, withIndex, speedup: withIndex / noIndex });
  }
  const bestIndex = [...indexRows].sort((a, b) => b.speedup - a.speedup)[0] ?? null;

  // 2) Docker vs bare metal
  const dockerRows: DockerRow[] = [];
  for (const language of webLanguages) {
    const bme = rps(DOCKER.slug, language, "bme", DOCKER.tier, DOCKER.endpoint);
    const docker = rps(DOCKER.slug, language, "docker", DOCKER.tier, DOCKER.endpoint);
    if (bme && docker) dockerRows.push({ language, bme, docker, change: ((docker - bme) / bme) * 100 });
  }
  const worstDocker = [...dockerRows].sort((a, b) => a.change - b.change)[0] ?? null;

  // 3) Fastest vs slowest language on one algorithm (bare metal)
  const gapRows = algo.filter((r) => r.benchmark_slug === GAP_SLUG && r.environment === "bme" && r.mean_s);
  const byTime = [...gapRows].sort((a, b) => a.mean_s! - b.mean_s!);
  const gap =
    byTime.length >= 2
      ? { fast: byTime[0], slow: byTime[byTime.length - 1], ratio: byTime[byTime.length - 1].mean_s! / byTime[0].mean_s! }
      : null;

  // 4) Heatmap: every algorithm x language, bare metal
  const algoBenchmarks = benchmarks.filter((b) => b.category === "algorithm");
  const algoLanguages = sortLanguages([...new Set(algo.map((r) => r.language))]);
  const ratio: Heatmap["ratio"] = {};
  let maxRatio = 1;
  for (const b of algoBenchmarks) {
    const rows = algo.filter((r) => r.benchmark_slug === b.slug && r.environment === "bme" && r.mean_s);
    const fastest = Math.min(...rows.map((r) => r.mean_s!));
    ratio[b.slug] = {};
    for (const language of algoLanguages) {
      const mean = rows.find((r) => r.language === language)?.mean_s;
      const value = mean ? mean / fastest : null;
      ratio[b.slug][language] = value;
      if (value && value > maxRatio) maxRatio = value;
    }
  }

  return {
    indexRows,
    bestIndex,
    indexSettings: INDEX,
    dockerRows,
    worstDocker,
    dockerSettings: DOCKER,
    gap,
    gapSlug: GAP_SLUG,
    heatmap: { benchmarks: algoBenchmarks, languages: algoLanguages, ratio, maxRatio } as Heatmap,
  };
}
