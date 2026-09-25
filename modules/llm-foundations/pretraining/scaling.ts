/**
 * Chinchilla-style fitted loss L(N, D) = E + A/N^α + B/D^β, using the corrected fit of
 * Besiroglu et al. (2024) to Hoffmann et al.'s (2022) data. (The original paper's own fit,
 * E = 1.69, A = 406.4, B = 410.7, α = 0.34, β = 0.28, was found not to match its other methods.)
 */
export const E = 1.8172;
export const A = 482.01;
export const B = 2085.43;
export const ALPHA = 0.3478;
export const BETA = 0.3658;

export const loss = (n: number, d: number) => E + A / n ** ALPHA + B / d ** BETA;
/** Training compute ≈ 6 × parameters × tokens. */
export const tokensFor = (c: number, n: number) => c / (6 * n);

export function optimum(c: number) {
  let best = { n: 0, l: Infinity };
  for (let lg = 7; lg <= 13; lg += 0.01) {
    const n = 10 ** lg;
    const l = loss(n, tokensFor(c, n));
    if (l < best.l) best = { n, l };
  }
  return best;
}
