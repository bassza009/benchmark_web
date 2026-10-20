import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Cpu, Database } from "lucide-react";
import AlgoBenchmarkView from "@/components/AlgoBenchmarkView";
import WebBenchmarkView from "@/components/WebBenchmarkView";
import { getAlgoResults, getBenchmark, getWebResults } from "@/lib/db";
import { benchmarkDescription, benchmarkTitle, isLang, t } from "@/lib/i18n";

export const revalidate = 60;

export default async function BenchmarkPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: rawLang, slug } = await params;
  const lang = isLang(rawLang) ? rawLang : "en";
  const text = t(lang);

  const benchmark = await getBenchmark(slug);
  if (!benchmark) notFound();

  const isWeb = benchmark.category === "web";
  const Icon = isWeb ? Database : Cpu;
  const sub = isWeb ? `${benchmark.db_engine} · ${benchmark.suite} suite` : benchmarkDescription(benchmark, lang);

  return (
    <div className="space-y-4">
      <div>
        <Link href={`/${lang}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent-text">
          <ChevronLeft className="h-4 w-4" />
          {text.nav.home}
        </Link>
        <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold">
          <Icon className="h-6 w-6 text-accent" />
          {benchmarkTitle(benchmark, lang)}
        </h1>
        {sub && <p className="text-muted">{sub}</p>}
      </div>

      {isWeb ? (
        <WebBenchmarkView lang={lang} slug={slug} rows={await getWebResults(slug)} />
      ) : (
        <AlgoBenchmarkView lang={lang} slug={slug} rows={await getAlgoResults(slug, true)} />
      )}
    </div>
  );
}

// Build pages on first visit, then cache them (refreshed every 60 s)
export function generateStaticParams() {
  return [];
}
