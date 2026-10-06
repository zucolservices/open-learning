/** A random forest and AdaBoost, trained live on the loan applicants from the decision-tree module. */

import { TRAIN, VALID, type Pt } from "../decision-trees/model";

export { TRAIN, VALID };

type Feat = "income" | "debt";
type T = { leaf: true; bad: boolean } | { leaf: false; feat: Feat; thr: number; l: T; r: T };

function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const gini = (pts: { p: Pt; w: number }[]) => {
  const tot = pts.reduce((a, x) => a + x.w, 0);
  if (!tot) return 0;
  const bad = pts.reduce((a, x) => a + (x.p.bad ? x.w : 0), 0) / tot;
  return 1 - bad * bad - (1 - bad) * (1 - bad);
};

function grow(pts: { p: Pt; w: number }[], depth: number, pickFeat: () => Feat[]): T {
  const tot = pts.reduce((a, x) => a + x.w, 0);
  const bad = pts.reduce((a, x) => a + (x.p.bad ? x.w : 0), 0);
  const leaf: T = { leaf: true, bad: bad * 2 > tot };
  if (depth === 0 || bad === 0 || bad === tot) return leaf;
  let best: { feat: Feat; thr: number; s: number } | null = null;
  for (const feat of pickFeat()) {
    const vals = [...new Set(pts.map((x) => x.p[feat]))].sort((a, b) => a - b);
    for (let i = 0; i < vals.length - 1; i++) {
      const thr = (vals[i] + vals[i + 1]) / 2;
      const l = pts.filter((x) => x.p[feat] <= thr);
      const r = pts.filter((x) => x.p[feat] > thr);
      const wl = l.reduce((a, x) => a + x.w, 0);
      const s = (wl * gini(l) + (tot - wl) * gini(r)) / tot;
      if (!best || s < best.s) best = { feat, thr, s };
    }
  }
  if (!best) return leaf;
  const b = best;
  return {
    leaf: false,
    feat: b.feat,
    thr: b.thr,
    l: grow(
      pts.filter((x) => x.p[b.feat] <= b.thr),
      depth - 1,
      pickFeat,
    ),
    r: grow(
      pts.filter((x) => x.p[b.feat] > b.thr),
      depth - 1,
      pickFeat,
    ),
  };
}

const pred = (t: T, p: Pt): boolean => (t.leaf ? t.bad : pred(p[t.feat] <= t.thr ? t.l : t.r, p));

/** 60 trees of depth 5, each on a bootstrap sample, choosing one random feature per split. */
export const FOREST: T[] = Array.from({ length: 60 }, (_, k) => {
  const r = rng(k + 1);
  const sample = Array.from({ length: TRAIN.length }, () => ({
    p: TRAIN[Math.floor(r() * TRAIN.length)],
    w: 1,
  }));
  return grow(sample, 5, () => [r() < 0.5 ? "income" : "debt"]);
});

export const forestPredict = (n: number, p: Pt) =>
  FOREST.slice(0, n).filter((t) => pred(t, p)).length * 2 > n;

/** AdaBoost with depth-1 trees (stumps), 60 rounds. */
export const BOOST: { t: T; alpha: number }[] = (() => {
  let w = TRAIN.map(() => 1 / TRAIN.length);
  const out: { t: T; alpha: number }[] = [];
  for (let k = 0; k < 60; k++) {
    const t = grow(
      TRAIN.map((p, i) => ({ p, w: w[i] })),
      1,
      () => ["income", "debt"],
    );
    const err = Math.min(
      0.499,
      Math.max(
        1e-6,
        TRAIN.reduce((a, p, i) => a + (pred(t, p) !== p.bad ? w[i] : 0), 0),
      ),
    );
    const alpha = 0.5 * Math.log((1 - err) / err);
    w = w.map((wi, i) => wi * Math.exp(pred(t, TRAIN[i]) !== TRAIN[i].bad ? alpha : -alpha));
    const s = w.reduce((a, b) => a + b, 0);
    w = w.map((x) => x / s);
    out.push({ t, alpha });
  }
  return out;
})();

export const boostPredict = (n: number, p: Pt) =>
  BOOST.slice(0, n).reduce((a, m) => a + (pred(m.t, p) ? m.alpha : -m.alpha), 0) > 0;

export const acc = (f: (p: Pt) => boolean, pts: Pt[]) =>
  pts.filter((p) => f(p) === p.bad).length / pts.length;

export const SINGLE = grow(
  TRAIN.map((p) => ({ p, w: 1 })),
  9,
  () => ["income", "debt"],
);
export const singlePredict = (p: Pt) => pred(SINGLE, p);
