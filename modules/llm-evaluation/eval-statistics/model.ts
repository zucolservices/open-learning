/** Sampling error for eval scores: reruns, intervals and sample sizes. */

export const TRUE_P = 0.8;

function rnd(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Score on one random sample of n questions from a universe where the true accuracy is TRUE_P. */
export function sampleScore(n: number, run: number) {
  let correct = 0;
  for (let i = 0; i < n; i++) if (rnd(run * 10007 + i * 7 + n) < TRUE_P) correct++;
  return correct / n;
}

export function simple(p: number, n: number) {
  const m = 1.96 * Math.sqrt((p * (1 - p)) / n);
  return [p - m, p + m] as const;
}

/** Wilson score interval (1927): behaves well for small n and scores near 0 or 1. */
export function wilson(p: number, n: number) {
  const z = 1.96;
  const d = 1 + (z * z) / n;
  const c = (p + (z * z) / (2 * n)) / d;
  const m = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  return [c - m, c + m] as const;
}

/** Questions per version to detect a gap (in points) with ~80% power at p≈0.8. */
export function needed(gapPts: number, paired: boolean, rho = 0.5) {
  const g = gapPts / 100;
  const base = ((1.96 + 0.84) ** 2 * 2 * TRUE_P * (1 - TRUE_P)) / (g * g);
  return Math.ceil(paired ? base * (1 - rho) : base);
}
