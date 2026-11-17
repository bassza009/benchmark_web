"use client";

// Scroll animation wrapper. data-in flips to true when the block scrolls into view
// and back to false when it leaves, so the animation plays forward on the way down
// and rewinds on the way back up. Until the observer reports (server HTML, slow JS)
// data-in is absent and the block is simply visible. The motion itself lives in app/globals.css:
//   .reveal              fade + slide up
//   .reveal .reveal-bar  bars grow from zero (stagger with style={{ "--i": index }})
//   .reveal .recharts-wrapper  charts wipe in from the left

import { createElement, useEffect, useRef, useState } from "react";

export default function Reveal({
  as = "div",
  className = "",
  style,
  children,
}: {
  as?: "div" | "section" | "li" | "article";
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState<boolean | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(as, { ref, "data-in": inView === null ? undefined : String(inView), className: `reveal ${className}`, style }, children);
}
