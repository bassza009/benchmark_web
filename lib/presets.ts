// Ready-made comparisons shown on the home page. Each one is just a /compare link.
// Series format:  web:       slug|language|env|tier|endpoint
//                 algorithm: slug|language|env

type Preset = { en: string; th: string; type: "web" | "algorithm"; metric: string; series: string[] };

export const PRESETS: Preset[] = [
  {
    en: "Docker overhead (Go, GET 1 table)",
    th: "Docker overhead (Go, GET 1 ตาราง)",
    type: "web",
    metric: "rps_mean",
    series: ["web-main-get-no-index|Go|bme|general|1table", "web-main-get-no-index|Go|docker|general|1table"],
  },
  {
    en: "Index speedup (PHP, 4-table join)",
    th: "ผลของ index (PHP, join 4 ตาราง)",
    type: "web",
    metric: "rps_mean",
    series: ["web-main-get-no-index|PHP|bme|general|4join", "web-main-get-with-index|PHP|bme|general|4join"],
  },
  {
    en: "Saturation: PHP from POC to Stress",
    th: "จุดอิ่มตัว: PHP จาก POC ถึง Stress",
    type: "web",
    metric: "lat_p99_ms",
    series: ["poc", "small", "general", "high", "stress"].map((tier) => `web-main-get-no-index|PHP|bme|${tier}|1table`),
  },
  {
    en: "GET vs POST (Node.js)",
    th: "GET เทียบ POST (Node.js)",
    type: "web",
    metric: "rps_mean",
    series: ["web-main-get-no-index|Node.js|bme|general|1table", "web-main-post|Node.js|bme|general|post-1table"],
  },
  {
    en: "Fibonacci: every language",
    th: "Fibonacci: ทุกภาษา",
    type: "algorithm",
    metric: "mean_s",
    series: ["Go", "PHP", "Node.js", "Java", "Python"].map((l) => `algo-fibonacci|${l}|bme`),
  },
];

export function presetHref(lang: string, preset: Preset) {
  const params = new URLSearchParams({ type: preset.type, metric: preset.metric });
  preset.series.forEach((s) => params.append("s", s));
  return `/${lang}/compare?${params}`;
}
