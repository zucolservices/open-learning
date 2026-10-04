/** Ten tasks, each with its own chance of success per try. Probabilities are illustrative. */

export const TASKS: { name: string; p: number }[] = [
  { name: "Change delivery address", p: 0.95 },
  { name: "Cancel an order", p: 0.9 },
  { name: "Refund a damaged item", p: 0.8 },
  { name: "Exchange for a new size", p: 0.75 },
  { name: "Split a refund across cards", p: 0.6 },
  { name: "Apply a loyalty discount", p: 0.7 },
  { name: "Reschedule a delivery slot", p: 0.85 },
  { name: "Combine two orders", p: 0.45 },
  { name: "Return part of a bundle", p: 0.5 },
  { name: "Update a gift message", p: 0.9 },
];

export const atLeastOnce = (p: number, k: number) => 1 - (1 - p) ** k;
export const everyTime = (p: number, k: number) => p ** k;

export const avg = (f: (p: number) => number) =>
  TASKS.reduce((a, t) => a + f(t.p), 0) / TASKS.length;

/** A pseudo-random try outcome, stable for a task, try number and seed. */
export function tryOk(task: number, attempt: number, seed: number) {
  const x = Math.sin((task * 31 + attempt * 7 + seed * 101) * 12.9898) * 43758.5453;
  return x - Math.floor(x) < TASKS[task].p;
}

export const FEYNMAN = [
  { text: "Richard Feynman was born on May 11, 1918, in Queens, New York…" },
  { text: "Richard Feynman was born on May 11, 1918, in New York City…" },
];

/** Width of a 95% interval (points) with r runs per question; illustrative. */
export function width(r: number) {
  const questionVar = 0.6;
  const samplingVar = 1.4;
  return 2 * 1.96 * Math.sqrt((questionVar + samplingVar / r) / 2);
}
