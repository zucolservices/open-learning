/** A small rating study and a preference leaderboard. All data illustrative. */

function h(i: number, k: number) {
  const x = Math.sin(i * 91.7 + k * 47.3) * 43758.5453;
  return x - Math.floor(x);
}

export const ITEMS = 16;
export const RATERS = 4;

/** Items 3 and 11 are genuinely borderline. */
const BORDERLINE = new Set([3, 11]);

export interface Setup {
  guidelines: boolean;
  calibration: boolean;
  screened: boolean;
}

export function labels(s: Setup): boolean[][] {
  let err = 0.32;
  if (s.guidelines) err -= 0.13;
  if (s.calibration) err -= 0.08;
  if (s.screened) err -= 0.06;
  return Array.from({ length: ITEMS }, (_, i) => {
    const truth = h(i, 1) < 0.6;
    return Array.from({ length: RATERS }, (_, r) => {
      if (BORDERLINE.has(i)) return r < 2 ? truth : !truth; // splits 2–2 whatever the setup
      return h(i, r + 2) < err ? !truth : truth;
    });
  });
}

/** Fleiss' kappa for two categories. */
export function fleiss(rows: boolean[][]) {
  const n = rows[0].length;
  const N = rows.length;
  let pBarSum = 0;
  let yes = 0;
  rows.forEach((r) => {
    const a = r.filter(Boolean).length;
    const b = n - a;
    yes += a;
    pBarSum += (a * (a - 1) + b * (b - 1)) / (n * (n - 1));
  });
  const pBar = pBarSum / N;
  const p = yes / (N * n);
  const pe = p * p + (1 - p) * (1 - p);
  return pe === 1 ? 1 : (pBar - pe) / (1 - pe);
}

export function unanimous(rows: boolean[][]) {
  return rows.filter((r) => r.every((x) => x === r[0])).length;
}

export const MODELS: { name: string; strength: number }[] = [
  { name: "Model A", strength: 1310 },
  { name: "Model B", strength: 1290 },
  { name: "Model C", strength: 1270 },
  { name: "Model D", strength: 1205 },
];

/** Rough ± range on a rating, shrinking with the number of votes (illustrative). */
export function interval(votes: number) {
  return Math.round(600 / Math.sqrt(votes));
}
