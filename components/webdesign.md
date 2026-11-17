<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CYBERBENCH // SYSTEM CORE MATRIX</title>
<!-- Fonts & Icons -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600;700&amp;family=Geist:wght@300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#09090b",
            "on-primary": "#0a0012",
            "on-tertiary": "#001a12",
            "on-background": "#fafafa",
            "on-secondary-fixed": "#18181b",
            "on-surface": "#fafafa",
            "error-container": "#3b1111",
            "primary-fixed": "#ede9fe",
            "surface-container-lowest": "#09090b",
            "inverse-surface": "#fafafa",
            "surface-tint": "#a78bfa",
            "on-primary-fixed": "#2e1065",
            "on-tertiary-fixed-variant": "#047857",
            "secondary-fixed-dim": "#71717a",
            "surface-container": "#121215",
            "inverse-on-surface": "#09090b",
            "primary": "#a78bfa",
            "tertiary-fixed": "#bbf7d0",
            "on-error": "#1a0000",
            "primary-container": "#7c3aed",
            "outline-variant": "#27272a",
            "on-secondary-container": "#a1a1aa",
            "on-error-container": "#fca5a5",
            "surface": "#0c0c0f",
            "primary-fixed-dim": "#c4b5fd",
            "on-primary-fixed-variant": "#5b21b6",
            "on-tertiary-fixed": "#003318",
            "outline": "#52525b",
            "on-surface-variant": "#a1a1aa",
            "tertiary": "#34d399",
            "secondary-container": "#27272a",
            "surface-variant": "#18181b",
            "on-secondary-fixed-variant": "#3f3f46",
            "secondary-fixed": "#a1a1aa",
            "secondary": "#71717a",
            "tertiary-container": "#065f46",
            "on-tertiary-container": "#bbf7d0",
            "on-primary-container": "#ede9fe",
            "surface-dim": "#0c0c0f",
            "tertiary-fixed-dim": "#6ee7b7",
            "surface-container-high": "#18181b",
            "surface-container-highest": "#1e1e22",
            "on-secondary": "#09090b",
            "inverse-primary": "#5b21b6",
            "error": "#ef4444",
            "surface-container-low": "#0f0f12",
            "surface-bright": "#18181b"
          },
          borderRadius: {
            "DEFAULT": "0.25rem",
            "lg": "0.5rem",
            "xl": "0.75rem",
            "full": "9999px"
          },
          fontFamily: {
            headline: ["Geist", "sans-serif"],
            display: ["Geist", "sans-serif"],
            body: ["Geist", "sans-serif"],
            label: ["Geist", "sans-serif"],
            mono: ["Geist Mono", "monospace"]
          }
        }
      }
    }
  </script>
<style>
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
      font-size: 18px;
      line-height: 1;
    }
    /* Cyberpunk Scanline overlay */
    .cyber-scanlines {
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02));
      background-size: 100% 3px, 6px 100%;
      pointer-events: none;
    }
    /* Glow Utilities */
    .glow-violet {
      box-shadow: 0 0 16px -2px rgba(167, 139, 250, 0.4);
    }
    .glow-emerald {
      box-shadow: 0 0 14px -2px rgba(52, 211, 153, 0.35);
    }
    .glow-amber {
      box-shadow: 0 0 14px -2px rgba(245, 158, 11, 0.35);
    }
    .neon-text-violet {
      text-shadow: 0 0 8px rgba(167, 139, 250, 0.6);
    }
    .neon-text-emerald {
      text-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
    }
    /* Angular corner trims */
    .tech-border {
      position: relative;
    }
    .tech-border::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 6px;
      height: 6px;
      border-top: 1px solid #a78bfa;
      border-right: 1px solid #a78bfa;
    }
  </style>
</head>
<body class="bg-background text-on-surface font-body antialiased min-h-screen selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
<!-- Subtle Cyberpunk Grid Backdrop -->
<div class="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.08)_0%,transparent_75%)] pointer-events-none z-0"></div>
<div class="fixed inset-0 cyber-scanlines z-10 opacity-40"></div>
<!-- ================= TOP NAV BAR (Shared Component Anchor) ================= -->
<header class="fixed top-0 left-0 w-full h-14 flex justify-between items-center px-6 border-b border-outline-variant bg-background/95 backdrop-blur z-50">
<div class="flex items-center gap-6">
<div class="flex items-center gap-3">
<span class="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#a78bfa]"></span>
<span class="font-headline text-base font-black tracking-wider text-primary uppercase drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]">
          NEURAL BENCH
        </span>
<span class="text-[10px] font-mono tracking-widest text-outline px-1.5 py-0.5 rounded border border-outline-variant uppercase">
          V3.4_SYS
        </span>
</div>
<!-- Navigation Links -->
<nav class="hidden md:flex items-center gap-6 font-headline text-sm tracking-tight pl-4 border-l border-outline-variant">
<a class="text-primary font-bold border-b-2 border-primary pb-1 transition-all duration-150 active:scale-[0.98]" href="#telemetry">Telemetry</a>
<a class="text-on-surface-variant hover:text-on-surface pb-1 transition-all duration-150 active:scale-[0.98]" href="#suites">Suites</a>
<a class="text-on-surface-variant hover:text-on-surface pb-1 transition-all duration-150 active:scale-[0.98]" href="#leaderboard">Leaderboard</a>
<a class="text-on-surface-variant hover:text-on-surface pb-1 transition-all duration-150 active:scale-[0.98]" href="#hardware">Hardware</a>
<a class="text-on-surface-variant hover:text-on-surface pb-1 transition-all duration-150 active:scale-[0.98]" href="#compilers">Compilers</a>
</nav>
</div>
<!-- Trailing Action Cluster & Search -->
<div class="flex items-center gap-4">
<!-- Search Bar on Right -->
<div class="relative hidden lg:block">
<span class="absolute inset-y-0 left-0 flex items-center pl-2.5 text-on-surface-variant">
<span class="material-symbols-outlined" style="font-size: 16px;">search</span>
</span>
<input class="bg-surface-container border border-outline-variant rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-48 transition-all" placeholder="FILTER BENCHMARKS..." type="text"/>
</div>
<!-- Quick Icon Actions -->
<div class="flex items-center gap-1">
<button class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-150" title="Terminal View">
<span class="material-symbols-outlined">terminal</span>
</button>
<button class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-150" title="System Config">
<span class="material-symbols-outlined">tune</span>
</button>
<button class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-150" title="Sync Nodes">
<span class="material-symbols-outlined">refresh</span>
</button>
</div>
<div class="h-4 w-px bg-outline-variant"></div>
<!-- Actions -->
<button class="hidden sm:inline-flex items-center gap-1.5 text-xs font-headline font-semibold text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded-lg border border-outline-variant hover:border-outline transition-colors">
        System Specs
      </button>
<button class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-headline text-xs font-bold tracking-tight glow-violet hover:bg-primary-fixed transition-all duration-150 active:scale-[0.98]" id="runBtn">
<span class="material-symbols-outlined" style="font-size: 16px;">bolt</span>
<span>Run Benchmark</span>
</button>
<!-- User Avatar Profile -->
<div class="w-8 h-8 rounded-lg border border-primary/40 bg-surface-container-high flex items-center justify-center text-primary font-mono text-xs font-bold shadow-[0_0_8px_rgba(167,139,250,0.2)]">
        0x1
      </div>
</div>
</header>
<!-- ================= SIDE NAV BAR (Shared Component Anchor) ================= -->
<aside class="fixed left-0 top-14 bottom-0 w-64 flex flex-col justify-between p-4 border-r border-outline-variant bg-surface z-40 hidden md:flex">
<div class="space-y-4">
<!-- Suite / Node Architecture Header -->
<div class="px-2 py-3 border-b border-outline-variant/80">
<div class="flex items-center gap-2 mb-1">
<div class="w-5 h-5 rounded border border-primary/60 bg-primary/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined" style="font-size: 14px;">hub</span>
</div>
<h2 class="font-headline text-sm font-bold text-on-surface uppercase tracking-wider">
            CYBERSYNTH v3.4
          </h2>
</div>
<p class="font-mono text-[10px] text-tertiary tracking-tight">x86_64 vs ARM64 Neoverse</p>
<div class="mt-2 flex items-center gap-2">
<span class="inline-block w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
<span class="text-[10px] font-mono text-on-surface-variant">NODE_01: SUB-MILLISECOND RT</span>
</div>
</div>
<!-- Navigation Tabs (5 primary suites) -->
<nav class="space-y-1 font-body text-xs tracking-tight">
<a class="bg-surface-container-high text-primary font-semibold border-l-2 border-primary rounded-r-lg px-3 py-2 flex items-center gap-3 transition-all duration-150 active:translate-x-0.5" href="#suite-matrix">
<span class="material-symbols-outlined text-primary">grid_view</span>
<span class="truncate">Matrix Multiply</span>
</a>
<a class="text-on-surface-variant hover:text-on-surface px-3 py-2 flex items-center gap-3 rounded-lg hover:bg-surface-container-high transition-colors duration-150" href="#suite-cpu">
<span class="material-symbols-outlined">memory</span>
<span class="truncate">CPU Multi-thread</span>
</a>
<a class="text-on-surface-variant hover:text-on-surface px-3 py-2 flex items-center gap-3 rounded-lg hover:bg-surface-container-high transition-colors duration-150" href="#suite-mem">
<span class="material-symbols-outlined">data_usage</span>
<span class="truncate">Memory Allocation</span>
</a>
<a class="text-on-surface-variant hover:text-on-surface px-3 py-2 flex items-center gap-3 rounded-lg hover:bg-surface-container-high transition-colors duration-150" href="#suite-server">
<span class="material-symbols-outlined">dns</span>
<span class="truncate">Server Throughput</span>
</a>
<a class="text-on-surface-variant hover:text-on-surface px-3 py-2 flex items-center gap-3 rounded-lg hover:bg-surface-container-high transition-colors duration-150" href="#suite-json">
<span class="material-symbols-outlined">code</span>
<span class="truncate">JSON Parsing</span>
</a>
</nav>
<!-- Suite CTA -->
<div class="pt-2">
<button class="w-full py-2 px-3 rounded-lg bg-surface-container border border-primary/30 text-primary font-headline text-xs font-semibold tracking-wide hover:bg-primary/10 hover:border-primary transition-all flex items-center justify-center gap-2">
<span class="material-symbols-outlined" style="font-size: 16px;">play_circle</span>
<span>Execute Suite</span>
</button>
</div>
</div>
<!-- Footer Controls -->
<div class="border-t border-outline-variant pt-3 space-y-1">
<a class="text-on-surface-variant hover:text-on-surface px-3 py-2 flex items-center gap-3 rounded-lg hover:bg-surface-container-high transition-colors duration-150 text-xs" href="#settings">
<span class="material-symbols-outlined">settings</span>
<span>Settings</span>
</a>
<a class="text-on-surface-variant hover:text-on-surface px-3 py-2 flex items-center gap-3 rounded-lg hover:bg-surface-container-high transition-colors duration-150 text-xs" href="#logs">
<span class="material-symbols-outlined">terminal</span>
<div class="flex items-center justify-between w-full">
<span>Logs</span>
<span class="font-mono text-[9px] px-1 rounded bg-tertiary-container text-on-tertiary-container">STREAMING</span>
</div>
</a>
</div>
</aside>
<!-- ================= MAIN CONTENT CANVAS ================= -->
<main class="md:pl-64 pt-14 min-h-screen flex flex-col relative z-20">
<div class="p-6 md:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
<!-- SECTION 1: Top Telemetry & Control Bar -->
<section class="rounded-lg border border-outline-variant bg-surface-container p-4 tech-border">
<div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
<!-- Node Status & Kernel Pill -->
<div class="flex flex-wrap items-center gap-3">
<div class="flex items-center gap-2 px-2.5 py-1 rounded bg-surface border border-outline-variant">
<span class="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_6px_#34d399]"></span>
<span class="text-xs font-mono font-bold text-tertiary">NODE: ONLINE</span>
</div>
<div class="flex items-center gap-2 px-2.5 py-1 rounded bg-surface border border-outline-variant">
<span class="material-symbols-outlined text-on-surface-variant" style="font-size: 14px;">speed</span>
<span class="text-xs font-mono text-on-surface-variant">LATENCY:</span>
<span class="text-xs font-mono text-tertiary font-bold">1.2ms</span>
</div>
<div class="flex items-center gap-2 px-2.5 py-1 rounded bg-surface border border-outline-variant">
<span class="material-symbols-outlined text-primary" style="font-size: 14px;">terminal</span>
<span class="text-xs font-mono text-on-surface">KERNEL 6.10.4-rt12-x86_64</span>
</div>
<!-- Hardware Spec Pill -->
<div class="hidden 2xl:flex items-center gap-2 px-3 py-1 rounded bg-surface-container-high border border-outline-variant">
<span class="material-symbols-outlined text-on-surface-variant" style="font-size: 14px;">developer_board</span>
<span class="text-[11px] font-mono text-on-surface-variant">AMD EPYC 9654 96-Core // 1.5TB DDR5-4800 // Linux Realtime RT</span>
</div>
</div>
<!-- Suite Selector and Execution CTA -->
<div class="flex flex-wrap items-center gap-3">
<div class="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
<span>ACTIVE SUITE:</span>
<div class="relative">
<select class="bg-surface border border-outline-variant rounded px-3 py-1.5 text-xs font-mono text-on-surface appearance-none pr-8 cursor-pointer focus:border-primary focus:outline-none">
<option selected="">Matrix Multiplication 4096x4096 (FP64 SIMD)</option>
<option>Web Server 1M Req (Keep-Alive, 128 Concurrency)</option>
<option>JSON Parse 500MB (Synthetic AST Stream)</option>
<option>Concurrent Channels 10M (M:N Scheduler Burst)</option>
</select>
<span class="material-symbols-outlined absolute right-2 top-2 pointer-events-none text-on-surface-variant" style="font-size: 16px;">unfold_more</span>
</div>
</div>
<!-- Iterations Selector -->
<div class="flex items-center gap-1 bg-surface border border-outline-variant rounded p-1">
<button class="px-2 py-0.5 text-[10px] font-mono rounded bg-primary text-on-primary font-bold">100x</button>
<button class="px-2 py-0.5 text-[10px] font-mono rounded text-on-surface-variant hover:text-on-surface">1,000x</button>
<button class="px-2 py-0.5 text-[10px] font-mono rounded text-on-surface-variant hover:text-on-surface">10,000x</button>
</div>
</div>
</div>
</section>
<!-- SECTION 2: Live Metrics & Cyberpunk HUD KPI Cards -->
<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
<!-- KPI 1: Fastest Execution -->
<div class="bg-surface-container rounded-lg border border-outline-variant p-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
<div class="flex items-center justify-between text-on-surface-variant mb-2">
<span class="font-mono text-xs tracking-wider uppercase">FASTEST EXECUTION</span>
<span class="material-symbols-outlined text-primary" style="font-size: 16px;">timer</span>
</div>
<div class="flex items-baseline gap-2">
<span class="font-mono text-3xl font-extrabold text-on-surface tracking-tight neon-text-violet">0.39</span>
<span class="font-mono text-xs text-primary font-semibold">ms</span>
</div>
<div class="mt-3 flex items-center justify-between pt-2 border-t border-outline-variant/60 font-mono text-xs">
<span class="text-on-surface-variant">LANG: <strong class="text-on-surface">C++23 / GCC14</strong></span>
<span class="px-1.5 py-0.2 rounded bg-primary/10 text-primary text-[10px] font-bold border border-primary/30">BASELINE 1.00x</span>
</div>
</div>
<!-- KPI 2: Highest Throughput -->
<div class="bg-surface-container rounded-lg border border-outline-variant p-4 relative overflow-hidden group hover:border-tertiary/50 transition-colors">
<div class="flex items-center justify-between text-on-surface-variant mb-2">
<span class="font-mono text-xs tracking-wider uppercase">PEAK THROUGHPUT</span>
<span class="material-symbols-outlined text-tertiary" style="font-size: 16px;">grouped_bar_chart</span>
</div>
<div class="flex items-baseline gap-2">
<span class="font-mono text-3xl font-extrabold text-on-surface tracking-tight neon-text-emerald">1,840.2</span>
<span class="font-mono text-xs text-tertiary font-semibold">kops/s</span>
</div>
<div class="mt-3 flex items-center justify-between pt-2 border-t border-outline-variant/60 font-mono text-xs">
<span class="text-on-surface-variant">RUNNER: <strong class="text-on-surface">Rust 1.80</strong></span>
<span class="text-tertiary text-[10px] flex items-center gap-1 font-bold">
<span class="material-symbols-outlined" style="font-size: 12px;">trending_up</span> +14.2% vs v3.3
            </span>
</div>
</div>
<!-- KPI 3: Lowest Memory Delta -->
<div class="bg-surface-container rounded-lg border border-outline-variant p-4 relative overflow-hidden group hover:border-outline transition-colors">
<div class="flex items-center justify-between text-on-surface-variant mb-2">
<span class="font-mono text-xs tracking-wider uppercase">LOWEST RESIDENT MEM</span>
<span class="material-symbols-outlined text-secondary-fixed" style="font-size: 16px;">memory</span>
</div>
<div class="flex items-baseline gap-2">
<span class="font-mono text-3xl font-extrabold text-on-surface tracking-tight">1.82</span>
<span class="font-mono text-xs text-on-surface-variant font-semibold">MB RSS</span>
</div>
<div class="mt-3 flex items-center justify-between pt-2 border-t border-outline-variant/60 font-mono text-xs">
<span class="text-on-surface-variant">MINIMAL: <strong class="text-on-surface">Zig 0.13.0</strong></span>
<span class="text-on-surface-variant text-[10px]">ZERO GC RUNTIME</span>
</div>
</div>
<!-- KPI 4: Energy Efficiency Index -->
<div class="bg-surface-container rounded-lg border border-outline-variant p-4 relative overflow-hidden group hover:border-tertiary/50 transition-colors">
<div class="flex items-center justify-between text-on-surface-variant mb-2">
<span class="font-mono text-xs tracking-wider uppercase">POWER EFFICIENCY</span>
<span class="material-symbols-outlined text-tertiary" style="font-size: 16px;">energy_savings_leaf</span>
</div>
<div class="flex items-baseline gap-2">
<span class="font-mono text-3xl font-extrabold text-tertiary tracking-tight">98.4</span>
<span class="font-mono text-xs text-tertiary font-semibold">% INDEX</span>
</div>
<div class="mt-3 flex items-center justify-between pt-2 border-t border-outline-variant/60 font-mono text-xs">
<span class="text-on-surface-variant">THERMAL DISSIPATION</span>
<span class="px-1.5 py-0.2 rounded bg-tertiary-container text-on-tertiary-container text-[10px] font-bold">OPTIMAL 48°C</span>
</div>
</div>
</section>
<!-- SECTION 3: Main Benchmark Visualization & HUD Radar -->
<section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
<!-- Comparative Execution Time Bar Chart (2 Cols) -->
<div class="xl:col-span-2 rounded-lg border border-outline-variant bg-surface-container p-6 space-y-4">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant">
<div>
<div class="flex items-center gap-2">
<span class="w-2 h-2 bg-primary rounded-full"></span>
<h3 class="font-headline text-sm font-bold tracking-tight uppercase text-on-surface">
                  Execution Latency // Relative Speed Factor
                </h3>
</div>
<p class="font-mono text-[11px] text-on-surface-variant mt-0.5">
                Matrix Dimension: 4096×4096 FP64 · Lower is faster · 100 warm iterations averaged
              </p>
</div>
<div class="flex items-center gap-3 font-mono text-xs">
<span class="flex items-center gap-1.5 text-on-surface">
<span class="w-3 h-1.5 rounded-sm bg-primary shadow-[0_0_6px_#a78bfa]"></span> &lt; 1.0 ms
              </span>
<span class="flex items-center gap-1.5 text-on-surface-variant">
<span class="w-3 h-1.5 rounded-sm bg-tertiary"></span> 1 - 5 ms
              </span>
<span class="flex items-center gap-1.5 text-on-surface-variant">
<span class="w-3 h-1.5 rounded-sm bg-outline"></span> &gt; 5 ms
              </span>
</div>
</div>
<!-- Benchmark Rows -->
<div class="space-y-3 pt-2 font-mono text-xs">
<!-- C++23 -->
<div class="space-y-1">
<div class="flex justify-between items-center text-xs">
<span class="text-on-surface font-bold flex items-center gap-2">
<span class="w-5 text-outline">01</span> C++23 (GCC 14.1)
                </span>
<span class="text-primary font-bold">0.39 ms <span class="text-[10px] text-outline font-normal">/ 1.00x</span></span>
</div>
<div class="w-full h-3 bg-surface-container-high rounded overflow-hidden p-0.5 flex">
<div class="h-full bg-primary rounded-sm transition-all duration-500 glow-violet" style="width: 4%;"></div>
</div>
</div>
<!-- Rust -->
<div class="space-y-1">
<div class="flex justify-between items-center text-xs">
<span class="text-on-surface font-bold flex items-center gap-2">
<span class="w-5 text-outline">02</span> Rust 1.80 (LLVM 18)
                </span>
<span class="text-primary font-bold">0.41 ms <span class="text-[10px] text-outline font-normal">/ 1.05x</span></span>
</div>
<div class="w-full h-3 bg-surface-container-high rounded overflow-hidden p-0.5 flex">
<div class="h-full bg-primary rounded-sm transition-all duration-500" style="width: 4.3%;"></div>
</div>
</div>
<!-- Zig -->
<div class="space-y-1">
<div class="flex justify-between items-center text-xs">
<span class="text-on-surface font-bold flex items-center gap-2">
<span class="w-5 text-outline">03</span> Zig 0.13.0 (ReleaseFast)
                </span>
<span class="text-primary font-bold">0.44 ms <span class="text-[10px] text-outline font-normal">/ 1.12x</span></span>
</div>
<div class="w-full h-3 bg-surface-container-high rounded overflow-hidden p-0.5 flex">
<div class="h-full bg-primary/90 rounded-sm transition-all duration-500" style="width: 4.8%;"></div>
</div>
</div>
<!-- Go -->
<div class="space-y-1">
<div class="flex justify-between items-center text-xs">
<span class="text-on-surface font-medium flex items-center gap-2">
<span class="w-5 text-outline">04</span> Go 1.23.0
                </span>
<span class="text-on-surface">1.28 ms <span class="text-[10px] text-outline font-normal">/ 3.28x</span></span>
</div>
<div class="w-full h-3 bg-surface-container-high rounded overflow-hidden p-0.5 flex">
<div class="h-full bg-tertiary rounded-sm transition-all duration-500" style="width: 10%;"></div>
</div>
</div>
<!-- C# .NET 9 -->
<div class="space-y-1">
<div class="flex justify-between items-center text-xs">
<span class="text-on-surface font-medium flex items-center gap-2">
<span class="w-5 text-outline">05</span> C# .NET 9 NativeAOT
                </span>
<span class="text-on-surface">1.92 ms <span class="text-[10px] text-outline font-normal">/ 4.92x</span></span>
</div>
<div class="w-full h-3 bg-surface-container-high rounded overflow-hidden p-0.5 flex">
<div class="h-full bg-tertiary/80 rounded-sm transition-all duration-500" style="width: 14.5%;"></div>
</div>
</div>
<!-- Java 21 -->
<div class="space-y-1">
<div class="flex justify-between items-center text-xs">
<span class="text-on-surface font-medium flex items-center gap-2">
<span class="w-5 text-outline">06</span> Java 21 (GraalVM EE)
                </span>
<span class="text-on-surface">2.05 ms <span class="text-[10px] text-outline font-normal">/ 5.25x</span></span>
</div>
<div class="w-full h-3 bg-surface-container-high rounded overflow-hidden p-0.5 flex">
<div class="h-full bg-tertiary/70 rounded-sm transition-all duration-500" style="width: 16%;"></div>
</div>
</div>
<!-- Bun -->
<div class="space-y-1">
<div class="flex justify-between items-center text-xs">
<span class="text-on-surface-variant flex items-center gap-2">
<span class="w-5 text-outline">07</span> Bun v1.1.20
                </span>
<span class="text-on-surface-variant">5.14 ms <span class="text-[10px] text-outline font-normal">/ 13.1x</span></span>
</div>
<div class="w-full h-3 bg-surface-container-high rounded overflow-hidden p-0.5 flex">
<div class="h-full bg-outline rounded-sm transition-all duration-500" style="width: 31%;"></div>
</div>
</div>
<!-- Node.js 22 -->
<div class="space-y-1">
<div class="flex justify-between items-center text-xs">
<span class="text-on-surface-variant flex items-center gap-2">
<span class="w-5 text-outline">08</span> Node.js v22.4 (V8 JIT)
                </span>
<span class="text-on-surface-variant">7.80 ms <span class="text-[10px] text-outline font-normal">/ 20.0x</span></span>
</div>
<div class="w-full h-3 bg-surface-container-high rounded overflow-hidden p-0.5 flex">
<div class="h-full bg-outline/70 rounded-sm transition-all duration-500" style="width: 44%;"></div>
</div>
</div>
<!-- Python 3.12 -->
<div class="space-y-1">
<div class="flex justify-between items-center text-xs">
<span class="text-on-surface-variant flex items-center gap-2">
<span class="w-5 text-outline">09</span> Python 3.12.4 (CPython)
                </span>
<span class="text-error font-mono">24.10 ms <span class="text-[10px] text-outline font-normal">/ 61.8x</span></span>
</div>
<div class="w-full h-3 bg-surface-container-high rounded overflow-hidden p-0.5 flex">
<div class="h-full bg-error-container rounded-sm border border-error/50 transition-all duration-500" style="width: 100%;"></div>
</div>
</div>
</div>
</div>
<!-- Side HUD Widget: Memory vs Throughput Radar & Matrix Telemetry -->
<div class="rounded-lg border border-outline-variant bg-surface-container p-6 flex flex-col justify-between space-y-4">
<div>
<div class="flex items-center justify-between pb-3 border-b border-outline-variant">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-tertiary" style="font-size: 16px;">radar</span>
<h3 class="font-headline text-sm font-bold tracking-tight uppercase text-on-surface">
                  Hardware Envelope
                </h3>
</div>
<span class="text-[10px] font-mono text-tertiary px-1.5 py-0.5 rounded bg-tertiary/10 border border-tertiary/30">
                ACTIVE_CORE_LOCK
              </span>
</div>
<!-- Radar / Vector Graphic Mockup -->
<div class="relative py-6 flex items-center justify-center">
<div class="w-48 h-48 rounded-full border border-outline-variant/60 flex items-center justify-center relative">
<div class="w-36 h-36 rounded-full border border-outline-variant/40 flex items-center justify-center">
<div class="w-24 h-24 rounded-full border border-primary/20 flex items-center justify-center">
<span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
</div>
</div>
<!-- Crosshairs -->
<div class="absolute inset-x-0 h-px bg-outline-variant/40"></div>
<div class="absolute inset-y-0 w-px bg-outline-variant/40"></div>
<!-- Polygonal Cyber Footprint (SVG) -->
<svg class="absolute inset-0 w-full h-full" viewbox="0 0 192 192">
<polygon class="fill-primary/15 stroke-primary stroke-1" points="96,28 152,72 136,140 56,140 40,72"></polygon>
<circle class="fill-primary" cx="96" cy="28" r="3"></circle>
<circle class="fill-primary" cx="152" cy="72" r="3"></circle>
<circle class="fill-primary" cx="136" cy="140" r="3"></circle>
<circle class="fill-primary" cx="56" cy="140" r="3"></circle>
<circle class="fill-primary" cx="40" cy="72" r="3"></circle>
</svg>
<div class="absolute top-1 text-[9px] font-mono text-on-surface-variant font-bold">L1/L2 CACHE</div>
<div class="absolute bottom-1 text-[9px] font-mono text-on-surface-variant font-bold">MEM RSS</div>
<div class="absolute left-1 text-[9px] font-mono text-on-surface-variant font-bold">SIMD</div>
<div class="absolute right-1 text-[9px] font-mono text-on-surface-variant font-bold">IOPS</div>
</div>
</div>
<!-- Scatter Metric Cards -->
<div class="grid grid-cols-2 gap-2 pt-2 font-mono">
<div class="p-2.5 rounded bg-surface border border-outline-variant">
<span class="text-[10px] text-on-surface-variant block">L3 CACHE MISS</span>
<span class="text-sm font-bold text-on-surface">0.004%</span>
<span class="text-[9px] text-tertiary block mt-0.5">Optimal Prefetch</span>
</div>
<div class="p-2.5 rounded bg-surface border border-outline-variant">
<span class="text-[10px] text-on-surface-variant block">BRANCH MISPRED</span>
<span class="text-sm font-bold text-on-surface">0.12%</span>
<span class="text-[9px] text-primary block mt-0.5">Target Speculative</span>
</div>
</div>
</div>
<!-- Bottom Micro Status -->
<div class="p-2.5 rounded bg-surface-container-high border border-outline-variant flex items-center justify-between text-xs font-mono">
<span class="text-on-surface-variant">AVX-512 VNNI Vector Status:</span>
<span class="text-tertiary font-bold">ENGAGED</span>
</div>
</div>
</section>
<!-- SECTION 4: Comprehensive Interactive Matrix Leaderboard Table -->
<section class="rounded-lg border border-outline-variant bg-surface-container overflow-hidden" id="leaderboard">
<div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant">
<div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary" style="font-size: 18px;">trophy</span>
<h3 class="font-headline text-base font-bold text-on-surface tracking-tight uppercase">
                System Core Matrix // Official Rankings
              </h3>
</div>
<p class="font-mono text-xs text-on-surface-variant mt-0.5">
              Strict deterministic testing mode · 96 cores pinned · CPU governor: performance
            </p>
</div>
<div class="flex items-center gap-2 font-mono text-xs">
<span class="text-outline text-[11px]">SORT BY:</span>
<button class="px-2.5 py-1 rounded bg-surface-container-high border border-primary/40 text-primary font-bold">LATENCY</button>
<button class="px-2.5 py-1 rounded bg-surface border border-outline-variant text-on-surface-variant hover:text-on-surface">MEMORY</button>
<button class="px-2.5 py-1 rounded bg-surface border border-outline-variant text-on-surface-variant hover:text-on-surface">THROUGHPUT</button>
</div>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left font-mono text-xs border-collapse">
<thead>
<tr class="bg-surface border-b border-outline-variant text-on-surface-variant uppercase text-[10px] tracking-wider">
<th class="py-3 px-4 w-14">Rank</th>
<th class="py-3 px-4">Language &amp; System Identifier</th>
<th class="py-3 px-4">Time (ms)</th>
<th class="py-3 px-4">Memory RSS</th>
<th class="py-3 px-4">Throughput</th>
<th class="py-3 px-4">Compiler Flags</th>
<th class="py-3 px-4">Concurrency Model</th>
<th class="py-3 px-4 text-right">Relative Score</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant">
<!-- #01 C++ -->
<tr class="hover:bg-surface-container-high transition-colors bg-surface-container/40">
<td class="py-3.5 px-4 font-bold text-primary">#01</td>
<td class="py-3.5 px-4">
<div class="flex items-center gap-2">
<span class="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 border border-primary/30 text-primary font-bold">[SYS.CPP.GCC14]</span>
<span class="text-on-surface font-semibold">C++23 Standard</span>
</div>
</td>
<td class="py-3.5 px-4 text-primary font-bold">0.39 ms</td>
<td class="py-3.5 px-4 text-on-surface-variant">2.1 MB</td>
<td class="py-3.5 px-4 text-on-surface">1,820 kops/s</td>
<td class="py-3.5 px-4 text-outline font-mono text-[11px]">-O3 -march=native -flto</td>
<td class="py-3.5 px-4 text-on-surface-variant">pthreads + SIMD512</td>
<td class="py-3.5 px-4 text-right">
<span class="inline-block px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/40 font-bold glow-violet">
                    99.8 PTS
                  </span>
</td>
</tr>
<!-- #02 Rust -->
<tr class="hover:bg-surface-container-high transition-colors">
<td class="py-3.5 px-4 font-bold text-primary">#02</td>
<td class="py-3.5 px-4">
<div class="flex items-center gap-2">
<span class="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 border border-primary/30 text-primary font-bold">[SYS.RUST.1.80]</span>
<span class="text-on-surface font-semibold">Rust Edition 2021</span>
</div>
</td>
<td class="py-3.5 px-4 text-primary font-bold">0.41 ms</td>
<td class="py-3.5 px-4 text-on-surface-variant">2.4 MB</td>
<td class="py-3.5 px-4 text-tertiary font-bold">1,840 kops/s</td>
<td class="py-3.5 px-4 text-outline font-mono text-[11px]">--release -C target-cpu=native</td>
<td class="py-3.5 px-4 text-on-surface-variant">Rayon + Crossbeam</td>
<td class="py-3.5 px-4 text-right">
<span class="inline-block px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/40 font-bold glow-violet">
                    99.4 PTS
                  </span>
</td>
</tr>
<!-- #03 Zig -->
<tr class="hover:bg-surface-container-high transition-colors">
<td class="py-3.5 px-4 font-bold text-primary">#03</td>
<td class="py-3.5 px-4">
<div class="flex items-center gap-2">
<span class="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 border border-primary/30 text-primary font-bold">[SYS.ZIG.0.13]</span>
<span class="text-on-surface font-semibold">Zig master</span>
</div>
</td>
<td class="py-3.5 px-4 text-on-surface font-bold">0.44 ms</td>
<td class="py-3.5 px-4 text-tertiary font-bold">1.8 MB</td>
<td class="py-3.5 px-4 text-on-surface">1,790 kops/s</td>
<td class="py-3.5 px-4 text-outline font-mono text-[11px]">-O ReleaseFast</td>
<td class="py-3.5 px-4 text-on-surface-variant">std.Thread + Arenas</td>
<td class="py-3.5 px-4 text-right">
<span class="inline-block px-2 py-0.5 rounded bg-surface-container-highest text-on-surface border border-outline-variant font-bold">
                    98.1 PTS
                  </span>
</td>
</tr>
<!-- #04 Go -->
<tr class="hover:bg-surface-container-high transition-colors">
<td class="py-3.5 px-4 font-bold text-outline">#04</td>
<td class="py-3.5 px-4">
<div class="flex items-center gap-2">
<span class="px-1.5 py-0.5 rounded text-[10px] bg-surface-variant border border-outline-variant text-on-surface-variant">[SYS.GO.1.23]</span>
<span class="text-on-surface">Go Runtime</span>
</div>
</td>
<td class="py-3.5 px-4 text-on-surface">1.28 ms</td>
<td class="py-3.5 px-4 text-on-surface-variant">8.9 MB</td>
<td class="py-3.5 px-4 text-on-surface">1,120 kops/s</td>
<td class="py-3.5 px-4 text-outline font-mono text-[11px]">-ldflags="-s -w"</td>
<td class="py-3.5 px-4 text-on-surface-variant">Goroutines (M:N)</td>
<td class="py-3.5 px-4 text-right">
<span class="inline-block px-2 py-0.5 rounded bg-surface-container-highest text-on-surface border border-outline-variant font-bold">
                    84.2 PTS
                  </span>
</td>
</tr>
<!-- #05 C# -->
<tr class="hover:bg-surface-container-high transition-colors">
<td class="py-3.5 px-4 font-bold text-outline">#05</td>
<td class="py-3.5 px-4">
<div class="flex items-center gap-2">
<span class="px-1.5 py-0.5 rounded text-[10px] bg-surface-variant border border-outline-variant text-on-surface-variant">[SYS.CS.NET9]</span>
<span class="text-on-surface">C# 13 (.NET 9)</span>
</div>
</td>
<td class="py-3.5 px-4 text-on-surface">1.92 ms</td>
<td class="py-3.5 px-4 text-on-surface-variant">14.2 MB</td>
<td class="py-3.5 px-4 text-on-surface">940 kops/s</td>
<td class="py-3.5 px-4 text-outline font-mono text-[11px]">PublishAot=true -c Release</td>
<td class="py-3.5 px-4 text-on-surface-variant">ThreadPool WorkStealing</td>
<td class="py-3.5 px-4 text-right">
<span class="inline-block px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant border border-outline-variant font-medium">
                    78.9 PTS
                  </span>
</td>
</tr>
<!-- #06 Java -->
<tr class="hover:bg-surface-container-high transition-colors">
<td class="py-3.5 px-4 font-bold text-outline">#06</td>
<td class="py-3.5 px-4">
<div class="flex items-center gap-2">
<span class="px-1.5 py-0.5 rounded text-[10px] bg-surface-variant border border-outline-variant text-on-surface-variant">[SYS.JVM.GRAAL]</span>
<span class="text-on-surface">Java 21 LTS</span>
</div>
</td>
<td class="py-3.5 px-4 text-on-surface">2.05 ms</td>
<td class="py-3.5 px-4 text-on-surface-variant">32.6 MB</td>
<td class="py-3.5 px-4 text-on-surface">880 kops/s</td>
<td class="py-3.5 px-4 text-outline font-mono text-[11px]">--march=native native-image</td>
<td class="py-3.5 px-4 text-on-surface-variant">Virtual Threads (Loom)</td>
<td class="py-3.5 px-4 text-right">
<span class="inline-block px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant border border-outline-variant font-medium">
                    75.6 PTS
                  </span>
</td>
</tr>
<!-- #07 Bun -->
<tr class="hover:bg-surface-container-high transition-colors">
<td class="py-3.5 px-4 font-bold text-outline">#07</td>
<td class="py-3.5 px-4">
<div class="flex items-center gap-2">
<span class="px-1.5 py-0.5 rounded text-[10px] bg-surface-variant border border-outline-variant text-on-surface-variant">[SYS.JS.BUN]</span>
<span class="text-on-surface">Bun 1.1.20</span>
</div>
</td>
<td class="py-3.5 px-4 text-on-surface-variant">5.14 ms</td>
<td class="py-3.5 px-4 text-on-surface-variant">44.8 MB</td>
<td class="py-3.5 px-4 text-on-surface-variant">420 kops/s</td>
<td class="py-3.5 px-4 text-outline font-mono text-[11px]">--smol --bytecode</td>
<td class="py-3.5 px-4 text-on-surface-variant">EventLoop (JSCore)</td>
<td class="py-3.5 px-4 text-right">
<span class="inline-block px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant border border-outline-variant font-medium">
                    58.2 PTS
                  </span>
</td>
</tr>
<!-- #08 Node.js -->
<tr class="hover:bg-surface-container-high transition-colors">
<td class="py-3.5 px-4 font-bold text-outline">#08</td>
<td class="py-3.5 px-4">
<div class="flex items-center gap-2">
<span class="px-1.5 py-0.5 rounded text-[10px] bg-surface-variant border border-outline-variant text-on-surface-variant">[SYS.JS.NODE22]</span>
<span class="text-on-surface-variant">Node.js v22.4</span>
</div>
</td>
<td class="py-3.5 px-4 text-on-surface-variant">7.80 ms</td>
<td class="py-3.5 px-4 text-on-surface-variant">52.1 MB</td>
<td class="py-3.5 px-4 text-on-surface-variant">285 kops/s</td>
<td class="py-3.5 px-4 text-outline font-mono text-[11px]">--turbo-fast-api-calls</td>
<td class="py-3.5 px-4 text-on-surface-variant">Libuv Workers</td>
<td class="py-3.5 px-4 text-right">
<span class="inline-block px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant border border-outline-variant font-medium">
                    46.1 PTS
                  </span>
</td>
</tr>
<!-- #09 Python -->
<tr class="hover:bg-surface-container-high transition-colors">
<td class="py-3.5 px-4 font-bold text-outline">#09</td>
<td class="py-3.5 px-4">
<div class="flex items-center gap-2">
<span class="px-1.5 py-0.5 rounded text-[10px] bg-surface-variant border border-outline-variant text-on-surface-variant">[SYS.PY.CPY312]</span>
<span class="text-on-surface-variant">Python 3.12 (GIL)</span>
</div>
</td>
<td class="py-3.5 px-4 text-error font-bold">24.10 ms</td>
<td class="py-3.5 px-4 text-on-surface-variant">21.8 MB</td>
<td class="py-3.5 px-4 text-on-surface-variant">92 kops/s</td>
<td class="py-3.5 px-4 text-outline font-mono text-[11px]">-O -m compileall</td>
<td class="py-3.5 px-4 text-on-surface-variant">multiprocessing Pool</td>
<td class="py-3.5 px-4 text-right">
<span class="inline-block px-2 py-0.5 rounded bg-error-container text-on-error-container border border-error/30 font-medium">
                    18.4 PTS
                  </span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<!-- SECTION 5: System Terminal / Console Output Log stream -->
<section class="rounded-lg border border-outline-variant bg-surface-container-lowest p-4 font-mono text-xs" id="logs">
<div class="flex items-center justify-between pb-2 border-b border-outline-variant/60 mb-3">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
<span class="text-on-surface font-bold text-xs uppercase tracking-wide">
              STDOUT STREAM // SYSLOG TTY0
            </span>
<span class="text-[10px] text-outline">[BUFFER: 4096 KB]</span>
</div>
<div class="flex items-center gap-2 text-[11px]">
<button class="text-outline hover:text-on-surface transition-colors flex items-center gap-1">
<span class="material-symbols-outlined" style="font-size: 14px;">pause</span> Pause
            </button>
<button class="text-outline hover:text-on-surface transition-colors flex items-center gap-1">
<span class="material-symbols-outlined" style="font-size: 14px;">delete_sweep</span> Clear
            </button>
<button class="text-outline hover:text-on-surface transition-colors flex items-center gap-1">
<span class="material-symbols-outlined" style="font-size: 14px;">download</span> Export
            </button>
</div>
</div>
<!-- Terminal Output Lines -->
<div class="space-y-1.5 text-on-surface-variant h-36 overflow-y-auto pr-2 select-text font-mono text-[11px]" id="terminal-stream">
<div class="flex items-start gap-2">
<span class="text-outline">[00:00:00.012]</span>
<span class="text-primary font-semibold">[KERNEL]</span>
<span>Spawning 96 real-time worker threads on node 0x0 (NUMA node-0 affinity: OK)</span>
</div>
<div class="flex items-start gap-2">
<span class="text-outline">[00:00:00.048]</span>
<span class="text-tertiary font-semibold">[PASS]</span>
<span>Warmup iteration complete in 12ms. L1 Cache normalized: 48KB/core.</span>
</div>
<div class="flex items-start gap-2">
<span class="text-outline">[00:00:00.104]</span>
<span class="text-on-surface font-semibold">[DISPATCH]</span>
<span>Executing Suite: 'Matrix Multiplication 4096x4096' on target: [SYS.CPP.GCC14]</span>
</div>
<div class="flex items-start gap-2">
<span class="text-outline">[00:00:00.494]</span>
<span class="text-tertiary font-semibold">[PASS]</span>
<span>Run 1/100: GCC 14.1 returned RC=0; Wall time: 0.392ms; Peak RSS: 2.14MB.</span>
</div>
<div class="flex items-start gap-2">
<span class="text-outline">[00:00:00.910]</span>
<span class="text-on-surface font-semibold">[DISPATCH]</span>
<span>Executing Suite: 'Matrix Multiplication 4096x4096' on target: [SYS.RUST.1.80]</span>
</div>
<div class="flex items-start gap-2">
<span class="text-outline">[00:00:01.322]</span>
<span class="text-tertiary font-semibold">[PASS]</span>
<span>Run 1/100: Rust 1.80 returned RC=0; Wall time: 0.411ms; Peak RSS: 2.38MB.</span>
</div>
<div class="flex items-start gap-2">
<span class="text-outline">[00:00:01.764]</span>
<span class="text-primary font-semibold">[TELEMETRY]</span>
<span>Thermal sensors reporting 48.2°C across all 96 cores. No throttling detected.</span>
</div>
<div class="flex items-start gap-2">
<span class="text-outline">[00:00:02.100]</span>
<span class="text-tertiary font-semibold">[SYNC]</span>
<span class="text-on-surface">Matrix snapshot compiled. Ready for trigger cycle.</span>
</div>
</div>
<div class="mt-2 pt-2 border-t border-outline-variant/40 flex items-center justify-between text-[10px] text-outline">
<div class="flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
<span>DAEMON: ACTIVE (PID 40812)</span>
</div>
<span>PRESS CTRL+C TO INTERRUPT CORE HARNESS</span>
</div>
</section>
</div>
</main>
<!-- Interactive Terminal Simulation Script -->
<script>
    document.addEventListener("DOMContentLoaded", () => {
      const runBtn = document.getElementById("runBtn");
      const terminal = document.getElementById("terminal-stream");

      if (runBtn && terminal) {
        runBtn.addEventListener("click", () => {
          const timestamp = new Date().toISOString().substring(11, 23);
          
          const newEntries = [
            `<div class="flex items-start gap-2 text-primary">
              <span class="text-outline">[${timestamp}]</span>
              <span class="font-semibold">[TRIGGER]</span>
              <span>Manual suite execution requested by 0x1 operator. Resetting perf counters...</span>
            </div>`,
            `<div class="flex items-start gap-2 text-tertiary">
              <span class="text-outline">[${timestamp}]</span>
              <span class="font-semibold">[PASS]</span>
              <span>All 96 hardware threads re-locked to sched_deadline. Benchmarks active.</span>
            </div>`
          ];

          newEntries.forEach(entry => {
            const div = document.createElement("div");
            div.innerHTML = entry;
            terminal.appendChild(div.firstChild);
          });

          terminal.scrollTop = terminal.scrollHeight;
        });
      }
    });
  </script>
</body></html>
