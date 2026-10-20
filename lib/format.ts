// Number formatting used in tables, tiles and tooltips

export function fmtNum(value: number | null | undefined, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return "–";
  return value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function fmtInt(value: number | null | undefined) {
  return fmtNum(value, 0);
}

export function fmtRps(value: number | null | undefined) {
  return `${fmtNum(value, 0)} req/s`;
}

export function fmtMs(value: number | null | undefined) {
  if (value === null || value === undefined) return "–";
  return `${fmtNum(value, value < 10 ? 2 : 1)} ms`;
}

// Seconds -> shows ms when below one second
export function fmtSec(value: number | null | undefined) {
  if (value === null || value === undefined) return "–";
  if (value < 1) return `${fmtNum(value * 1000, 2)} ms`;
  return `${fmtNum(value, 3)} s`;
}

// Short version for chart axes: 3600 -> "3,600 s", 0.5 -> "500 ms"
export function fmtSecAxis(value: number) {
  if (value === 0) return "0";
  if (value < 1) return `${fmtNum(value * 1000, value < 0.01 ? 1 : 0)} ms`;
  return `${fmtNum(value, value < 10 ? 1 : 0)} s`;
}

export function fmtPct(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "–";
  const sign = value > 0 ? "+" : "";
  return `${sign}${fmtNum(value, 1)}%`;
}

export function fmtDate(iso: string, lang: string) {
  return new Date(iso).toLocaleString(lang === "th" ? "th-TH" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  });
}
