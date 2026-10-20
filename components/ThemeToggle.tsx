"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Light is the default. The choice is remembered in localStorage.
export default function ThemeToggle({ lightLabel, darkLabel }: { lightLabel: string; darkLabel: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  const label = dark ? lightLabel : darkLabel;
  return (
    <button
      onClick={toggle}
      title={label}
      aria-label={label}
      className="rounded-md border border-line p-1.5 text-muted hover:border-accent hover:text-accent-text"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
