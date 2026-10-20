import { Suspense } from "react";
import { GitCompareArrows } from "lucide-react";
import CompareView from "@/components/CompareView";
import { getAlgoResults, getBenchmarks, getWebResults } from "@/lib/db";
import { isLang, t } from "@/lib/i18n";

export const revalidate = 60;

// All data is loaded once; picking series happens in the browser, so it responds instantly
export default async function ComparePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = isLang(rawLang) ? rawLang : "en";
  const text = t(lang);
  const [benchmarks, webRows, algoRows] = await Promise.all([getBenchmarks(), getWebResults(null), getAlgoResults(null)]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <GitCompareArrows className="h-6 w-6 text-accent" />
          {text.compare.title}
        </h1>
        <p className="mt-1 max-w-2xl text-muted">{text.compare.intro}</p>
      </div>
      <Suspense>
        <CompareView lang={lang} benchmarks={benchmarks} webRows={webRows} algoRows={algoRows} />
      </Suspense>
    </div>
  );
}
