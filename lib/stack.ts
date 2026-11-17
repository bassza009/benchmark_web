// Runtime + web framework of each language in the web benchmarks
// (from Programming-Benchmark/README.md, "Primary Baseline Frameworks").

export type Stack = { tag: string; runtime: string; framework: string; model: string };

const STACK: Record<string, Stack> = {
  Go: { tag: "GO.FIBER", runtime: "Go 1.22", framework: "Fiber v2", model: "Goroutines" },
  "Node.js": { tag: "NODE.FASTIFY", runtime: "Node.js 20", framework: "Fastify", model: "Cluster + event loop" },
  PHP: { tag: "PHP.SWOOLE", runtime: "PHP 8.3", framework: "Swoole", model: "Coroutine event loop" },
  Java: { tag: "JAVA.SPRING", runtime: "Java 21", framework: "Spring Boot 3", model: "JVM thread pool" },
  Python: { tag: "PY.FASTAPI", runtime: "Python 3.12", framework: "FastAPI + Uvicorn", model: "Multi-process async" },
  "Python (opt.)": { tag: "PY.FASTAPI.OPT", runtime: "Python 3.12", framework: "FastAPI (tuned)", model: "Multi-process async" },
};

export function stackOf(language: string): Stack | null {
  return STACK[language] ?? null;
}

// Machine every benchmark ran on (bare metal = this host; Docker runs on the same host)
export const TEST_HOST = "Intel Xeon E5-2698 v3 · 64 threads · 64 GB RAM · Ubuntu 24.04";
