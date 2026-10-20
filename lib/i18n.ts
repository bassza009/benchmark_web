// All UI text, English + Thai. To change wording, edit the strings here.

export const LANGS = ["en", "th"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

const en = {
  siteName: "Programming Benchmark",
  nav: { home: "Benchmarks", compare: "Compare" },
  theme: { light: "Light mode", dark: "Dark mode" },
  switchLang: "ภาษาไทย",

  home: {
    title: "Programming language benchmarks",
    intro:
      "Go, PHP, Node.js, Java and Python measured on bare metal and in Docker: web frameworks under load (wrk) and pure algorithms (hyperfine).",
    lastSync: "Data synced",
    web: "Web benchmarks",
    webHint: "Throughput and latency under 5 load tiers, from a small POC to stress testing.",
    algorithm: "Algorithm benchmarks",
    algorithmHint: "Execution time of CPU-bound programs, 20 runs each.",
    presets: "Quick comparisons",
    open: "Open",
  },

  filters: {
    environment: "Environment",
    languages: "Languages",
    endpoint: "Endpoint",
    tier: "Load tier",
    logScale: "Log scale",
  },

  env: { bme: "Bare Metal", docker: "Docker" },

  tiers: {
    poc: "POC",
    small: "Small",
    general: "General",
    high: "High-density",
    stress: "Stress",
  } as Record<string, string>,

  web: {
    fastest: "Highest throughput",
    lowestP99: "Lowest p99 latency",
    lowestMean: "Lowest mean latency",
    totalErrors: "Total errors",
    atTier: "at",
    throughputVsTier: "Throughput vs load tier",
    throughputVsTierHint: "Mean requests/sec with 95% confidence interval. Where a line flattens or drops, the server is saturated.",
    percentiles: "Latency percentiles",
    percentilesHint: "p50 / p90 / p95 / p99 latency at the selected tier. Lower is better.",
    endpoints: "Cost of joins",
    endpointsHint: "Throughput as the query touches more tables, at the selected tier.",
    table: "Full statistics",
    connections: "connections",
  },

  algo: {
    meanTime: "Mean execution time",
    meanTimeHint: "Mean of all runs, whiskers show ±1 standard deviation. Lower is better.",
    runs: "Every run",
    runsHint: "Each dot is one run. A tight cluster means stable timing.",
    table: "Statistics",
    overhead: "Docker overhead",
    fastest: "Fastest",
    slowest: "Slowest",
    avgOverhead: "Docker overhead (median)",
  },

  cols: {
    language: "Language",
    env: "Env",
    tier: "Tier",
    endpoint: "Endpoint",
    rps: "Req/s",
    sd: "SD",
    ci95: "95% CI",
    latMean: "Mean lat.",
    p50: "p50",
    p90: "p90",
    p95: "p95",
    p99: "p99",
    max: "Max",
    errors: "Errors",
    mean: "Mean",
    median: "Median",
    min: "Min",
    runs: "Runs",
  },

  compare: {
    title: "Compare",
    intro: "Build up to 6 series and compare them side by side. The link in the address bar keeps your selection, so you can share it.",
    type: "Type",
    web: "Web",
    algorithm: "Algorithm",
    benchmark: "Benchmark",
    metric: "Metric",
    addSeries: "Add series",
    remove: "Remove",
    series: "Series",
    vsFirst: "vs S1",
    better: "better",
    worse: "worse",
    noData: "No data for this combination",
    metrics: {
      rps_mean: "Throughput (req/s)",
      lat_mean_ms: "Mean latency (ms)",
      lat_p99_ms: "p99 latency (ms)",
      mean_s: "Mean time",
    } as Record<string, string>,
  },

  exportCsv: "Export CSV",
  noData: "No data yet. Run scripts/sync_to_supabase.py in Programming-Benchmark.",
};

type Dict = typeof en;

const th: Dict = {
  siteName: "Programming Benchmark",
  nav: { home: "Benchmark", compare: "เปรียบเทียบ" },
  theme: { light: "โหมดสว่าง", dark: "โหมดมืด" },
  switchLang: "English",

  home: {
    title: "ผลทดสอบประสิทธิภาพภาษาโปรแกรม",
    intro:
      "วัด Go, PHP, Node.js, Java และ Python ทั้งบน Bare Metal และใน Docker: web framework ภายใต้โหลด (wrk) และ algorithm ล้วน (hyperfine)",
    lastSync: "ซิงก์ข้อมูลล่าสุด",
    web: "Web benchmark",
    webHint: "Throughput และ latency ใน 5 ระดับโหลด ตั้งแต่ POC เล็กๆ จนถึง stress test",
    algorithm: "Algorithm benchmark",
    algorithmHint: "เวลาประมวลผลของโปรแกรมที่ใช้ CPU ล้วน รันชุดละ 20 รอบ",
    presets: "เปรียบเทียบด่วน",
    open: "เปิด",
  },

  filters: {
    environment: "สภาพแวดล้อม",
    languages: "ภาษา",
    endpoint: "Endpoint",
    tier: "ระดับโหลด",
    logScale: "สเกล log",
  },

  env: { bme: "Bare Metal", docker: "Docker" },

  tiers: {
    poc: "POC",
    small: "เล็ก",
    general: "ทั่วไป",
    high: "หนาแน่น",
    stress: "Stress",
  },

  web: {
    fastest: "Throughput สูงสุด",
    lowestP99: "p99 latency ต่ำสุด",
    lowestMean: "Latency เฉลี่ยต่ำสุด",
    totalErrors: "Error ทั้งหมด",
    atTier: "ที่",
    throughputVsTier: "Throughput ตามระดับโหลด",
    throughputVsTierHint: "ค่าเฉลี่ย requests/sec พร้อมช่วงความเชื่อมั่น 95% ถ้าเส้นเริ่มแบนหรือตก แปลว่า server อิ่มตัวแล้ว",
    percentiles: "Latency percentile",
    percentilesHint: "Latency p50 / p90 / p95 / p99 ที่ระดับโหลดที่เลือก ยิ่งต่ำยิ่งดี",
    endpoints: "ผลกระทบของการ join",
    endpointsHint: "Throughput เมื่อ query ใช้จำนวนตารางมากขึ้น ที่ระดับโหลดที่เลือก",
    table: "สถิติทั้งหมด",
    connections: "connections",
  },

  algo: {
    meanTime: "เวลาประมวลผลเฉลี่ย",
    meanTimeHint: "ค่าเฉลี่ยของทุกรอบ เส้นขีดแสดง ±1 ส่วนเบี่ยงเบนมาตรฐาน ยิ่งต่ำยิ่งดี",
    runs: "ทุกรอบที่รัน",
    runsHint: "แต่ละจุดคือหนึ่งรอบ ถ้าจุดเกาะกลุ่มกันแน่น แปลว่าเวลานิ่ง",
    table: "สถิติ",
    overhead: "Docker overhead",
    fastest: "เร็วที่สุด",
    slowest: "ช้าที่สุด",
    avgOverhead: "Docker overhead (มัธยฐาน)",
  },

  cols: {
    language: "ภาษา",
    env: "Env",
    tier: "ระดับ",
    endpoint: "Endpoint",
    rps: "Req/s",
    sd: "SD",
    ci95: "95% CI",
    latMean: "Lat. เฉลี่ย",
    p50: "p50",
    p90: "p90",
    p95: "p95",
    p99: "p99",
    max: "สูงสุด",
    errors: "Error",
    mean: "เฉลี่ย",
    median: "มัธยฐาน",
    min: "ต่ำสุด",
    runs: "รอบ",
  },

  compare: {
    title: "เปรียบเทียบ",
    intro: "สร้างได้สูงสุด 6 ชุดแล้วเทียบกันแบบเคียงข้าง ลิงก์ในแถบที่อยู่จะจำสิ่งที่เลือกไว้ คัดลอกไปแชร์ได้เลย",
    type: "ประเภท",
    web: "Web",
    algorithm: "Algorithm",
    benchmark: "Benchmark",
    metric: "ค่าที่ใช้เทียบ",
    addSeries: "เพิ่มชุด",
    remove: "ลบ",
    series: "ชุด",
    vsFirst: "เทียบ S1",
    better: "ดีกว่า",
    worse: "แย่กว่า",
    noData: "ไม่มีข้อมูลของชุดนี้",
    metrics: {
      rps_mean: "Throughput (req/s)",
      lat_mean_ms: "Latency เฉลี่ย (ms)",
      lat_p99_ms: "Latency p99 (ms)",
      mean_s: "เวลาเฉลี่ย",
    },
  },

  exportCsv: "ดาวน์โหลด CSV",
  noData: "ยังไม่มีข้อมูล ให้รัน scripts/sync_to_supabase.py ใน Programming-Benchmark",
};

const dictionaries: Record<Lang, Dict> = { en, th };

export function t(lang: Lang) {
  return dictionaries[lang];
}

// '1table' -> '1 table', '3join' -> '3 tables (join)', 'post-2table' -> '2 tables'
export function endpointLabel(endpoint: string, lang: Lang) {
  const n = endpoint.match(/\d+/)?.[0] ?? "";
  const isJoin = endpoint.includes("join");
  if (lang === "th") return isJoin ? `${n} ตาราง (join)` : `${n} ตาราง`;
  return `${n} ${n === "1" ? "table" : "tables"}${isJoin ? " (join)" : ""}`;
}

export function benchmarkTitle(b: { title_en: string; title_th: string }, lang: Lang) {
  return lang === "th" ? b.title_th : b.title_en;
}

export function benchmarkDescription(b: { description_en: string | null; description_th: string | null }, lang: Lang) {
  return lang === "th" ? b.description_th : b.description_en;
}
