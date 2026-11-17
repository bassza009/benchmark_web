import type { Config } from "tailwindcss";

// Colors point to CSS variables in app/globals.css (dark + light values live there)
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        "card-2": "var(--card-2)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        line: "var(--line)",
        outline: "var(--outline)",
        accent: "var(--accent)",
        "accent-text": "var(--accent-text)",
        "accent-soft": "var(--accent-soft)",
        "on-accent": "var(--on-accent)",
        data: "var(--data)",
        warn: "var(--warn)",
        bad: "var(--bad)",
      },
      fontFamily: {
        // Geist for Latin, IBM Plex Sans Thai picks up Thai characters
        sans: ["var(--font-geist)", "var(--font-plex)", "system-ui", "sans-serif"],
        display: ["var(--font-geist)", "var(--font-plex)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "var(--font-plex)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
