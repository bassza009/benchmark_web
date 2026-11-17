"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Dark is the default ("light" class switches). The choice is remembered in localStorage.
export default function ThemeToggle({ lightLabel, darkLabel }: { lightLabel: string; darkLabel: string }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(!document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("light", !next);
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
      className="border border-line p-1.5 text-muted hover:border-accent hover:text-accent-text"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
