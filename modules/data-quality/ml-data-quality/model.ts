/** A tiny classifier (3 nearest neighbours) trained on 2-D points, with label noise and two kinds of drift. Illustrative. */

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** True rule: "will this order arrive late?" depends on distance (x) and basket size (y). */
const truth = (x: number, y: number, shift: number) => (y > 0.75 - 0.5 * x + shift ? 1 : 0);

export interface Pt {
  x: number;
  y: number;
  label: number;
  flipped?: boolean;
}

const r1 = rng(7);
const BASE = Array.from({ length: 90 }, () => ({ x: r1(), y: r1(), u: r1() }));
const r2 = rng(11);
const TEST = Array.from({ length: 300 }, () => ({ x: r2(), y: r2() }));

export function training(noise: number): Pt[] {
  return BASE.map((p) => {
    const t = truth(p.x, p.y, 0);
    const flip = p.u < noise / 100;
    return { x: p.x, y: p.y, label: flip ? 1 - t : t, flipped: flip };
  });
}

export function predict(train: Pt[], x: number, y: number) {
  const near = train
    .map((p) => ({ d: (p.x - x) ** 2 + (p.y - y) ** 2, l: p.label }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3);
  return near.reduce((s, n) => s + n.l, 0) >= 2 ? 1 : 0;
}

/** Production: inputs shift right by `data`; the true rule moves by `concept`. */
export function production(data: number, concept: number): Pt[] {
  return TEST.map((p) => {
    const x = p.x + data;
    return { x, y: p.y, label: truth(x, p.y, -concept) };
  });
}

export function evaluate(noise: number, data: number, concept: number) {
  const train = training(noise);
  const prod = production(data, concept);
  const correct = prod.filter((p) => predict(train, p.x, p.y) === p.label).length;
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const tx = train.map((p) => p.x);
  const sd = Math.sqrt(mean(tx.map((x) => (x - mean(tx)) ** 2)));
  // production inputs are the same population moved by `data`, so the shift in std devs is data / sd
  const shiftSd = data / sd;
  return { train, prod, accuracy: correct / prod.length, shiftSd, driftAlert: shiftSd > 0.5 };
}
