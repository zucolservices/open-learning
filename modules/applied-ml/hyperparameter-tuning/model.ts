/** A made-up validation-score landscape over learning rate and tree depth, and three search strategies. */

function rnd(i: number, k: number) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** x: log10(learning rate) in [-3, 0]; y: max depth in [2, 12]. */
export function truth(x: number, y: number) {
  return 0.8 + 0.07 * Math.exp(-((x + 1.3) ** 2) / 0.12) + 0.012 * Math.exp(-((y - 6) ** 2) / 14);
}

const noisy = (x: number, y: number, i: number) => truth(x, y) + (rnd(i, 7) - 0.5) * 0.016;

export type Method = "grid" | "random" | "bayes";

export interface Trial {
  x: number;
  y: number;
  v: number;
}

export function search(method: Method, budget: number): Trial[] {
  const out: Trial[] = [];
  if (method === "grid") {
    const k = Math.max(2, Math.round(Math.sqrt(budget)));
    for (let i = 0; i < k; i++)
      for (let j = 0; j < k; j++) {
        if (out.length >= budget) break;
        const x = -3 + (3 * i) / (k - 1);
        const y = 2 + (10 * j) / (k - 1);
        out.push({ x, y, v: noisy(x, y, out.length) });
      }
    return out;
  }
  for (let i = 0; i < budget; i++) {
    let x: number;
    let y: number;
    if (method === "random" || i < 5) {
      x = -3 + rnd(i, 1) * 3;
      y = 2 + rnd(i, 2) * 10;
    } else {
      // Learn from earlier trials: sample near the best so far, with a shrinking radius.
      const best = out.reduce((a, b) => (b.v > a.v ? b : a));
      const r = Math.max(0.1, 1 - i / budget);
      x = Math.min(0, Math.max(-3, best.x + (rnd(i, 3) - 0.5) * 1.2 * r));
      y = Math.min(12, Math.max(2, best.y + (rnd(i, 4) - 0.5) * 6 * r));
    }
    out.push({ x, y, v: noisy(x, y, i + 100) });
  }
  return out;
}
