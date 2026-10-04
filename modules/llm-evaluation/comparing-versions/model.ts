/** Paired versus unpaired comparison of two versions on the same questions. */

export const N = 200;
export const BOTH_RIGHT_BASE = 144;

function erf(x: number) {
  // Abramowitz–Stegun 7.1.26
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-x * x);
  return x >= 0 ? y : -y;
}

const phi = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2));

/** Two-sided p-value treating the two scores as independent samples. */
export function unpairedP(a: number, b: number, n: number) {
  const p = (a + b) / (2 * n);
  const se = Math.sqrt(p * (1 - p) * (2 / n));
  if (se === 0) return 1;
  const z = Math.abs(b - a) / n / se;
  return 2 * (1 - phi(z));
}

function choose(n: number, k: number) {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

/** Exact McNemar test: only the questions that flipped count. */
export function mcnemarP(fixed: number, broke: number) {
  const n = fixed + broke;
  if (n === 0) return 1;
  const k = Math.min(fixed, broke);
  let tail = 0;
  for (let i = 0; i <= k; i++) tail += choose(n, i) * 0.5 ** n;
  return Math.min(1, 2 * tail);
}

export function table(fixed: number, broke: number) {
  const bothRight = BOTH_RIGHT_BASE;
  const bothWrong = N - bothRight - fixed - broke;
  const a = bothRight + broke; // version A right
  const b = bothRight + fixed; // version B right
  return { bothRight, bothWrong, a, b };
}

/** p-values for k variants that are really no better than the baseline (stable per seed). */
export function nullPValues(k: number, seed: number) {
  return Array.from({ length: k }, (_, i) => {
    const x = Math.sin((seed * 97 + i) * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  });
}
