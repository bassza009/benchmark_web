// Small shared building blocks: cards, filter chips, selects, stat tiles, legend, tooltip

import type { LucideIcon } from "lucide-react";
import { DOCKER_DASH, DOCKER_OPACITY } from "@/lib/languages";

export function Card({
  title,
  hint,
  icon: Icon,
  actions,
  children,
}: {
  title?: string;
  hint?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-card p-4 sm:p-5">
      {(title || actions) && (
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            {title && (
              <h2 className="flex items-center gap-2 font-semibold">
                {Icon && <Icon className="h-4 w-4 text-accent" />}
                {title}
              </h2>
            )}
            {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Chip({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
        active ? "border-accent bg-accent-soft text-ink" : "border-line text-faint hover:text-muted"
      }`}
    >
      {color && <span className="h-2.5 w-2.5 rounded-full" style={{ background: color, opacity: active ? 1 : 0.35 }} />}
      {children}
    </button>
  );
}

export function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-full text-xs font-medium uppercase tracking-wide text-faint sm:w-auto">{label}</span>
      {children}
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && <span className="text-xs font-medium uppercase tracking-wide text-faint">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-line bg-card px-2.5 py-1.5 text-ink focus:border-accent focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-[var(--accent)]" />
      {label}
    </label>
  );
}

export function StatTile({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: string; icon: LucideIcon }) {
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Icon className="h-4 w-4 text-accent" />
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {sub && <div className="mt-0.5 text-sm text-muted">{sub}</div>}
    </div>
  );
}

export type LegendItem = { label: string; color: string; docker?: boolean };

// Swatch: solid line = Bare Metal, dashed / faded = Docker
export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <svg width="22" height="10" aria-hidden>
            <line
              x1="1" y1="5" x2="21" y2="5"
              stroke={item.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={item.docker ? DOCKER_DASH : undefined}
              opacity={item.docker ? Math.max(DOCKER_OPACITY, 0.8) : 1}
            />
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  );
}

// Tooltip box for Recharts. `format` turns a raw value into display text.
export function ChartTooltip({
  active,
  payload,
  label,
  format,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; stroke?: string; fill?: string; dataKey?: string }[];
  label?: string;
  format: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const items = payload.filter((p) => typeof p.value === "number");
  return (
    <div className="rounded-lg border border-line bg-card px-3 py-2 text-sm shadow-md">
      {label && <div className="mb-1 font-medium">{label}</div>}
      {items.map((p) => (
        <div key={String(p.dataKey ?? p.name)} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.stroke || p.color || p.fill }} />
          <span className="text-muted">{p.name}</span>
          <span className="tabular ml-auto pl-3 font-medium">{format(p.value as number)}</span>
        </div>
      ))}
    </div>
  );
}

// Shared axis / grid styling for every chart
export const axisProps = {
  stroke: "var(--line)",
  tick: { fill: "var(--faint)", fontSize: 12 },
  tickLine: false,
};
export const gridProps = { stroke: "var(--line)", strokeDasharray: "0", vertical: false };
