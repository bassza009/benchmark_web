import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Thai } from "next/font/google";
import Header from "@/components/Header";
import Sidebar, { type SidebarGroup } from "@/components/Sidebar";
import { getBenchmarks, getLatestBatch } from "@/lib/db";
import { fmtDate } from "@/lib/format";
import { benchmarkTitle, isLang, LANGS, t } from "@/lib/i18n";
import "../globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

// Thai text (Geist has no Thai glyphs)
const plex = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
});

export const metadata: Metadata = {
  title: "Programming Benchmark",
  description: "Go, PHP, Node.js, Java and Python benchmarks on bare metal and Docker",
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

// Runs before the page paints: applies a saved light theme (dark is the default) without a flash,
// and marks that JS runs so scroll animations may start hidden.
const bootScript = `document.documentElement.classList.add('js');try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.add('light')}catch(e){}`;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = isLang(rawLang) ? rawLang : "en";
  const text = t(lang);
  const [benchmarks, batch] = await Promise.all([getBenchmarks(), getLatestBatch()]);

  // Sidebar: web benchmarks grouped by database engine, then algorithms
  const groups: SidebarGroup[] = [];
  for (const b of benchmarks) {
    const label = b.category === "web" ? text.dash.webGroup(b.db_engine ?? "") : text.dash.algoGroup;
    let group = groups.find((g) => g.label === label);
    if (!group) groups.push((group = { label, items: [] }));
    group.items.push({ slug: b.slug, title: benchmarkTitle(b, lang) });
  }

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} ${plex.variable} font-sans antialiased`}>
        <div aria-hidden className="backdrop pointer-events-none fixed inset-0 z-0" />
        <Header lang={lang} batchId={batch?.id ?? null} />
        <Sidebar
          lang={lang}
          groups={groups}
          title={text.dash.suites}
          compareLabel={text.nav.compare}
          lastSync={batch ? `${text.dash.lastSync} ${fmtDate(batch.created_at, lang)}` : null}
        />
        <div className="relative z-10 pt-14 md:pl-60">
          <main className="mx-auto max-w-[1400px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">{children}</main>
          <footer className="mx-auto flex max-w-[1400px] items-center gap-3 border-t border-line px-4 py-6 font-mono text-xs uppercase tracking-widest text-faint sm:px-6 lg:px-8">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {text.siteName}
          </footer>
        </div>
      </body>
    </html>
  );
}
