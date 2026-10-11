/**
 * 40 requests arrive at once on a 4-core server, handled three ways. Simplified model; all
 * numbers are illustrative.
 */

export type Model = "pool" | "loop" | "light";
export type Work = "io" | "cpu";

export const MODELS: { id: Model; label: string; who: string }[] = [
  {
    id: "pool",
    label: "Thread pool (8 threads)",
    who: "Classic Java servlets, many Python and Ruby servers",
  },
  { id: "loop", label: "Event loop", who: "Node.js, Python asyncio" },
  { id: "light", label: "Lightweight threads", who: "Go goroutines, Java virtual threads" },
];

const N = 40;
const CORES = 4;

export function run(model: Model, work: Work, blocking: boolean) {
  const W = work === "io" ? 200 : 10;
  const C = work === "io" ? 2 : 50;
  let total: number;
  if (model === "pool") total = Math.ceil(N / 8) * (W + C * (work === "cpu" ? 2 : 1));
  else if (model === "loop") total = blocking ? N * (W + C) : W + N * C;
  else total = W + Math.ceil(N / CORES) * C;
  const memory =
    model === "pool"
      ? "≈ 1 MB per thread: 10,000 waiting requests would need ≈ 10 GB"
      : model === "loop"
        ? "A few KB per waiting request: one thread for all"
        : "A few KB per goroutine or virtual thread: 10,000 fit in tens of MB";
  return { total, memory };
}
