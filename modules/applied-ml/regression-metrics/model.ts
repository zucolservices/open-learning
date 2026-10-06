/** Delivery-time predictions and regression metrics. Data made up. */

export const ORDERS: [number, number][] = [
  [32, 30],
  [45, 41],
  [28, 33],
  [51, 48],
  [38, 40],
  [60, 55],
  [25, 27],
  [42, 47],
  [35, 34],
  [48, 44],
  [30, 29],
  [55, 58],
];

export function metrics(pairs: [number, number][]) {
  const n = pairs.length;
  const err = pairs.map(([y, p]) => p - y);
  const mae = err.reduce((a, e) => a + Math.abs(e), 0) / n;
  const rmse = Math.sqrt(err.reduce((a, e) => a + e * e, 0) / n);
  const mapeTerms = pairs.map(([y, p]) => (y === 0 ? Infinity : Math.abs(p - y) / Math.abs(y)));
  const mape = mapeTerms.reduce((a, v) => a + v, 0) / n;
  const mean = pairs.reduce((a, [y]) => a + y, 0) / n;
  const ssRes = err.reduce((a, e) => a + e * e, 0);
  const ssTot = pairs.reduce((a, [y]) => a + (y - mean) ** 2, 0);
  return { err, mae, rmse, mape, r2: 1 - ssRes / ssTot };
}

export const SKEWED = [12, 14, 15, 15, 16, 17, 18, 19, 21, 24, 30, 58];
export const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y);
  return (s[Math.floor((s.length - 1) / 2)] + s[Math.ceil((s.length - 1) / 2)]) / 2;
};
export const meanOf = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
export const maeOf = (a: number[], c: number) => meanOf(a.map((v) => Math.abs(v - c)));
export const mseOf = (a: number[], c: number) => meanOf(a.map((v) => (v - c) ** 2));

function rnd(i: number, k: number) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export type Pattern = "random" | "funnel" | "curve";
export function residuals(p: Pattern): [number, number][] {
  return Array.from({ length: 40 }, (_, i) => {
    const x = i / 39;
    const n = (rnd(i, 1) + rnd(i, 2) - 1) * 2;
    const r =
      p === "random"
        ? n * 0.6
        : p === "funnel"
          ? n * (0.1 + x * 1.3)
          : n * 0.25 + (x - 0.5) ** 2 * 6 - 0.5;
    return [x, r];
  });
}
