import Link from "next/link";
import { ArrowRight, Cpu, Database, GitCompareArrows, RefreshCw } from "lucide-react";
import { getBenchmarks, getLatestBatch } from "@/lib/db";
import { fmtDate } from "@/lib/format";
import { benchmarkDescription, benchmarkTitle, isLang, t } from "@/lib/i18n";
import { PRESETS, presetHref } from "@/lib/presets";
import type { Benchmark } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = isLang(rawLang) ? rawLang : "en";
  const text = t(lang);
  const [benchmarks, batch] = await Promise.all([getBenchmarks(), getLatestBatch()]);

  const web = benchmarks.filter((b) => b.category === "web");
  const algorithm = benchmarks.filter((b) => b.category === "algorithm");

  function BenchmarkCard({ b }: { b: Benchmark }) {
    const sub = b.category === "web" ? `${b.db_engine} · ${b.suite} suite` : benchmarkDescription(b, lang);
    return (
      <Link
        href={`/${lang}/benchmark/${b.slug}`}
        className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-card p-4 hover:border-accent"
      >
        <div>
          <div className="font-medium">{benchmarkTitle(b, lang)}</div>
          {sub && <div className="text-sm text-muted">{sub}</div>}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-faint group-hover:text-accent" />
      </Link>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold sm:text-3xl">{text.home.title}</h1>
        <p className="mt-2 max-w-2xl text-muted">{text.home.intro}</p>
        {batch && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-faint">
            <RefreshCw className="h-3.5 w-3.5" />
            {text.home.lastSync}: {fmtDate(batch.created_at, lang)}
            {batch.git_commit && <span className="tabular">· {batch.git_commit.slice(0, 7)}</span>}
          </p>
        )}
      </section>

      {benchmarks.length === 0 && <p className="text-muted">{text.noData}</p>}

      {web.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Database className="h-5 w-5 text-accent" />
            {text.home.web}
          </h2>
          <p className="mb-3 text-sm text-muted">{text.home.webHint}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {web.map((b) => (
              <BenchmarkCard key={b.slug} b={b} />
            ))}
          </div>
        </section>
      )}

      {algorithm.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Cpu className="h-5 w-5 text-accent" />
            {text.home.algorithm}
          </h2>
          <p className="mb-3 text-sm text-muted">{text.home.algorithmHint}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {algorithm.map((b) => (
              <BenchmarkCard key={b.slug} b={b} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <GitCompareArrows className="h-5 w-5 text-accent" />
          {text.home.presets}
        </h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <Link
              key={p.en}
              href={presetHref(lang, p)}
              className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-sm text-muted hover:border-accent hover:text-accent-text"
            >
              {lang === "th" ? p.th : p.en}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
