// Fixed order + color for each programming language.
// The color always follows the language (never its rank), so filters never repaint a line.
// Actual hex values live in app/globals.css (--lang-*), with separate light / dark steps.

export const LANGUAGE_ORDER = ["Go", "PHP", "Node.js", "Java", "Python", "Python (opt.)"];

const COLOR_VAR: Record<string, string> = {
  Go: "var(--lang-go)",
  PHP: "var(--lang-php)",
  "Node.js": "var(--lang-node)",
  Java: "var(--lang-java)",
  Python: "var(--lang-python)",
  "Python (opt.)": "var(--lang-python-opt)",
};

export function langColor(language: string) {
  return COLOR_VAR[language] ?? "var(--faint)";
}

export function sortLanguages(languages: string[]) {
  const rank = (l: string) => {
    const i = LANGUAGE_ORDER.indexOf(l);
    return i === -1 ? 99 : i;
  };
  return [...languages].sort((a, b) => rank(a) - rank(b));
}

// Docker is drawn dashed (lines) or lighter (bars) so it is not told apart by color alone
export const DOCKER_DASH = "6 4";
export const DOCKER_OPACITY = 0.45;
