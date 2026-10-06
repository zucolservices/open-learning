/** Three kinds of model scores, reliability diagrams, Brier score and Platt scaling. Data made up. */

function rnd(i: number, k: number) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const logit = (p: number) => Math.log(p / (1 - p));
const sig = (z: number) => 1 / (1 + Math.exp(-z));

export type Kind = "calibrated" | "hedging" | "overconfident";

export const KINDS: { id: Kind; name: string; note: string }[] = [
  { id: "calibrated", name: "Well calibrated", note: "Close to the diagonal: its 70% means 70%." },
  {
    id: "hedging",
    name: "Hedging (like boosted trees)",
    note: "Scores bunch towards the middle: its 70% cases happen more often than 70%.",
  },
  {
    id: "overconfident",
    name: "Overconfident",
    note: "Scores pushed towards 0 and 1: its 95% cases happen far less often.",
  },
];

function make(n: number, seed: number) {
  return Array.from({ length: n }, (_, i) => {
    const p = 0.03 + rnd(i + seed, 1) * 0.94;
    return { p, y: rnd(i + seed, 2) < p ? 1 : 0 };
  });
}

const CAL = make(600, 0);
const TEST = make(1500, 900);

export function score(kind: Kind, p: number) {
  if (kind === "calibrated") return p;
  if (kind === "hedging") return 0.5 + (p - 0.5) * 0.55;
  return sig(2.6 * logit(p));
}

/** Platt scaling: fit sigmoid(a·logit(s) + b) on the calibration set by gradient descent. */
export function platt(kind: Kind) {
  let a = 1;
  let b = 0;
  const xs = CAL.map((d) => ({
    x: logit(Math.min(0.999, Math.max(0.001, score(kind, d.p)))),
    y: d.y,
  }));
  for (let it = 0; it < 400; it++) {
    let ga = 0;
    let gb = 0;
    xs.forEach(({ x, y }) => {
      const e = sig(a * x + b) - y;
      ga += e * x;
      gb += e;
    });
    a -= (0.5 * ga) / xs.length;
    b -= (0.5 * gb) / xs.length;
  }
  return (s: number) => sig(a * logit(Math.min(0.999, Math.max(0.001, s))) + b);
}

export function evaluate(kind: Kind, recal: boolean) {
  const fix = recal ? platt(kind) : (s: number) => s;
  const preds = TEST.map((d) => ({ s: fix(score(kind, d.p)), y: d.y }));
  const bins = Array.from({ length: 10 }, (_, i) => {
    const inBin = preds.filter((q) => q.s >= i / 10 && (i === 9 ? q.s <= 1 : q.s < (i + 1) / 10));
    const mean = inBin.length ? inBin.reduce((a, q) => a + q.s, 0) / inBin.length : (i + 0.5) / 10;
    const freq = inBin.length ? inBin.reduce((a, q) => a + q.y, 0) / inBin.length : 0;
    return { n: inBin.length, mean, freq };
  });
  const brier = preds.reduce((a, q) => a + (q.s - q.y) ** 2, 0) / preds.length;
  const ece = bins.reduce((a, b) => a + (b.n / preds.length) * Math.abs(b.mean - b.freq), 0);
  return { bins, brier, ece };
}
