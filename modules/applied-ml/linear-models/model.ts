/** House sizes and prices (₹ lakh), a hand-fitted line and gradient descent. Data made up. */

export const HOUSES: [number, number][] = [
  [45, 58],
  [55, 72],
  [60, 70],
  [70, 86],
  [75, 85],
  [85, 101],
  [90, 98],
  [100, 115],
  [110, 122],
  [120, 131],
  [130, 146],
  [145, 152],
];

const xs = HOUSES.map((h) => h[0]);
const ys = HOUSES.map((h) => h[1]);
const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
export const MX = mean(xs);
const SX = Math.sqrt(mean(xs.map((x) => (x - MX) ** 2)));

export function mse(slope: number, intercept: number) {
  return mean(HOUSES.map(([x, y]) => (y - (intercept + slope * x)) ** 2));
}

/** Exact least-squares fit. */
export function ols() {
  const my = mean(ys);
  const slope =
    HOUSES.reduce((s, [x, y]) => s + (x - MX) * (y - my), 0) /
    HOUSES.reduce((s, [x]) => s + (x - MX) ** 2, 0);
  return { slope, intercept: my - slope * MX };
}

/** Gradient descent on standardised size, from zero, for n steps; returns path of (slope, intercept, loss). */
export function descend(n: number, lr: number) {
  let w = 0;
  let b = 0;
  const path: { slope: number; intercept: number; loss: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const slope = w / SX;
    const intercept = b - slope * MX;
    const loss = mse(slope, intercept);
    path.push({ slope, intercept, loss: Number.isFinite(loss) ? loss : 1e9 });
    if (i === n) break;
    let gw = 0;
    let gb = 0;
    HOUSES.forEach(([x, y]) => {
      const z = (x - MX) / SX;
      const err = b + w * z - y;
      gw += (2 * err * z) / HOUSES.length;
      gb += (2 * err) / HOUSES.length;
    });
    w -= lr * gw;
    b -= lr * gb;
  }
  return path;
}

export const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
