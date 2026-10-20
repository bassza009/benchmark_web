import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import Header from "@/components/Header";
import { isLang, LANGS, t } from "@/lib/i18n";
import "../globals.css";

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

// Runs before the page paints, so a saved dark theme does not flash white first
const themeScript = `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = isLang(rawLang) ? rawLang : "en";

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${plex.variable} font-sans antialiased`}>
        <Header lang={lang} />
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 pb-8 text-sm text-faint sm:px-6">{t(lang).siteName}</footer>
      </body>
    </html>
  );
}
