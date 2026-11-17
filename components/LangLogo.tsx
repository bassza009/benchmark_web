// Logo of a programming language (from simple-icons), drawn in that language's chart color
// so the logo, the chips and the chart lines all match.
// Java uses the OpenJDK logo (simple-icons has no official Java logo).

import { siGo, siNodedotjs, siOpenjdk, siPhp, siPython } from "simple-icons";
import { langColor } from "@/lib/languages";

const LOGOS: Record<string, { path: string }> = {
  Go: siGo,
  PHP: siPhp,
  "Node.js": siNodedotjs,
  Java: siOpenjdk,
  Python: siPython,
  "Python (opt.)": siPython,
};

export default function LangLogo({ language, size = 18, faded = false }: { language: string; size?: number; faded?: boolean }) {
  const logo = LOGOS[language];
  if (!logo) {
    return <span className="inline-block shrink-0 rounded-full" style={{ width: size * 0.6, height: size * 0.6, background: langColor(language) }} />;
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-label={language}
      className="shrink-0"
      style={{ fill: langColor(language), opacity: faded ? 0.35 : 1 }}
    >
      <path d={logo.path} />
    </svg>
  );
}
