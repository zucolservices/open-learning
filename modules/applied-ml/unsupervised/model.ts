/** k-means on made-up customers, two moons for DBSCAN, and PCA on correlated data. */

export type P = [number, number];

function rnd(i: number, k: number) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
const gauss = (i: number, k: number) => (rnd(i, k) + rnd(i, k + 7) + rnd(i, k + 13) - 1.5) * 1.4;

/** Visits per month (x) and average basket in ₹ hundreds (y): four loose groups. */
const CENTRES: P[] = [
  [2, 12],
  [9, 4],
  [10, 14],
  [4, 4],
];
export const CUSTOMERS: P[] = Array.from({ length: 96 }, (_, i) => {
  const c = CENTRES[i % 4];
  return [Math.max(0.3, c[0] + gauss(i, 1) * 1.3), Math.max(0.3, c[1] + gauss(i, 2) * 1.6)];
});

const d2 = (a: P, b: P) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;

function init(pts: P[], k: number, seed: number): P[] {
  // k-means++-style: first centre at random, then far points more likely.
  const cs: P[] = [pts[Math.floor(rnd(seed, 3) * pts.length)]];
  let j = 0;
  while (cs.length < k) {
    const dist = pts.map((p) => Math.min(...cs.map((c) => d2(p, c))));
    const tot = dist.reduce((a, b) => a + b, 0);
    let r = rnd(seed + j++, 5) * tot;
    let idx = 0;
    while (idx < pts.length - 1 && (r -= dist[idx]) > 0) idx++;
    cs.push(pts[idx]);
  }
  return cs;
}

export function kmeans(pts: P[], k: number, seed: number, iters: number) {
  let cs = init(pts, k, seed);
  let labels = pts.map(() => 0);
  for (let it = 0; it <= iters; it++) {
    labels = pts.map((p) => cs.reduce((best, c, i) => (d2(p, c) < d2(p, cs[best]) ? i : best), 0));
    if (it === iters) break;
    cs = cs.map((c, i) => {
      const mine = pts.filter((_, j) => labels[j] === i);
      return mine.length
        ? [
            mine.reduce((a, p) => a + p[0], 0) / mine.length,
            mine.reduce((a, p) => a + p[1], 0) / mine.length,
          ]
        : c;
    });
  }
  const inertia = pts.reduce((a, p, j) => a + d2(p, cs[labels[j]]), 0);
  return { cs, labels, inertia };
}

export function silhouette(pts: P[], labels: number[], k: number) {
  if (k < 2) return 0;
  const d = (a: P, b: P) => Math.sqrt(d2(a, b));
  let total = 0;
  pts.forEach((p, i) => {
    const mean = (c: number) => {
      const o = pts.filter((_, j) => labels[j] === c && j !== i);
      return o.length ? o.reduce((s, q) => s + d(p, q), 0) / o.length : 0;
    };
    const a = mean(labels[i]);
    const b = Math.min(
      ...Array.from({ length: k }, (_, c) => c)
        .filter((c) => c !== labels[i])
        .map(mean),
    );
    total += Number.isFinite(b) && Math.max(a, b) > 0 ? (b - a) / Math.max(a, b) : 0;
  });
  return total / pts.length;
}

/** Two rings, one inside the other; ring index is what a density method finds. */
export const MOONS: { p: P; moon: number }[] = Array.from({ length: 90 }, (_, i) => {
  const moon = i % 3 === 0 ? 0 : 1;
  const t = rnd(i, 8) * Math.PI * 2;
  const r = (moon ? 1 : 0.38) + (rnd(i, 9) - 0.5) * 0.12;
  return { p: [r * Math.cos(t), r * Math.sin(t)], moon };
});

/** Correlated 2D data for PCA. */
export const CORR: P[] = Array.from({ length: 60 }, (_, i) => {
  const t = gauss(i, 20) * 1.6;
  return [t + gauss(i, 21) * 0.35, 0.7 * t + gauss(i, 22) * 0.35];
});

export function varianceAlong(angle: number) {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const mx = CORR.reduce((a, p) => a + p[0], 0) / CORR.length;
  const my = CORR.reduce((a, p) => a + p[1], 0) / CORR.length;
  const proj = CORR.map(([x, y]) => (x - mx) * ux + (y - my) * uy);
  const v = proj.reduce((a, s) => a + s * s, 0) / CORR.length;
  const total = CORR.reduce((a, [x, y]) => a + (x - mx) ** 2 + (y - my) ** 2, 0) / CORR.length;
  return { v, share: v / total, mx, my };
}
