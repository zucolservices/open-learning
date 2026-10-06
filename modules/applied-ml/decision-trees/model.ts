/** A tiny CART decision tree (Gini) grown on made-up loan applicants. */

export interface Pt {
  income: number; // ₹ lakh a year, 2–30
  debt: number; // debt-to-income %, 0–80
  bad: boolean; // defaulted
}

function rnd(i: number, k: number) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function make(n: number, seed: number): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const income = Math.round((2 + rnd(i + seed, 1) * 28) * 10) / 10;
    const debt = Math.round(rnd(i + seed, 2) * 80);
    const pBad = Math.min(
      0.95,
      Math.max(0.04, 0.25 + (debt / 80) * 0.75 - ((income - 2) / 28) * 0.6),
    );
    const bad = rnd(i + seed, 3) < pBad;
    return { income, debt, bad };
  });
}

export const TRAIN = make(70, 0);
export const VALID = make(70, 500);

type Feat = "income" | "debt";
export type Node =
  | { leaf: true; bad: boolean; n: number; nBad: number }
  | { leaf: false; feat: Feat; thr: number; left: Node; right: Node; n: number; nBad: number };

export const gini = (p: number) => 1 - p * p - (1 - p) * (1 - p);
export const entropy = (p: number) =>
  p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);

function impurity(pts: Pt[]) {
  if (!pts.length) return 0;
  return gini(pts.filter((p) => p.bad).length / pts.length);
}

export function grow(pts: Pt[], depth: number): Node {
  const nBad = pts.filter((p) => p.bad).length;
  const leaf: Node = { leaf: true, bad: nBad * 2 > pts.length, n: pts.length, nBad };
  if (depth === 0 || nBad === 0 || nBad === pts.length || pts.length < 2) return leaf;
  let best: { feat: Feat; thr: number; score: number } | null = null;
  for (const feat of ["income", "debt"] as Feat[]) {
    const vals = [...new Set(pts.map((p) => p[feat]))].sort((a, b) => a - b);
    for (let i = 0; i < vals.length - 1; i++) {
      const thr = (vals[i] + vals[i + 1]) / 2;
      const l = pts.filter((p) => p[feat] <= thr);
      const r = pts.filter((p) => p[feat] > thr);
      const score = (l.length * impurity(l) + r.length * impurity(r)) / pts.length;
      if (!best || score < best.score - 1e-9) best = { feat, thr, score };
    }
  }
  if (!best || best.score >= impurity(pts) - 1e-9) return leaf;
  const l = pts.filter((p) => p[best!.feat] <= best!.thr);
  const r = pts.filter((p) => p[best!.feat] > best!.thr);
  return {
    leaf: false,
    feat: best.feat,
    thr: Math.round(best.thr * 10) / 10,
    left: grow(l, depth - 1),
    right: grow(r, depth - 1),
    n: pts.length,
    nBad,
  };
}

export function predict(t: Node, p: Pt): boolean {
  if (t.leaf) return t.bad;
  return predict(p[t.feat] <= t.thr ? t.left : t.right, p);
}

export const accuracy = (t: Node, pts: Pt[]) =>
  pts.filter((p) => predict(t, p) === p.bad).length / pts.length;

export interface Box {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  bad: boolean;
}

export function boxes(t: Node, b: Omit<Box, "bad"> = { x0: 2, x1: 30, y0: 0, y1: 80 }): Box[] {
  if (t.leaf) return [{ ...b, bad: t.bad }];
  if (t.feat === "income")
    return [...boxes(t.left, { ...b, x1: t.thr }), ...boxes(t.right, { ...b, x0: t.thr })];
  return [...boxes(t.left, { ...b, y1: t.thr }), ...boxes(t.right, { ...b, y0: t.thr })];
}

export function leaves(t: Node): number {
  return t.leaf ? 1 : leaves(t.left) + leaves(t.right);
}

export function rules(t: Node, path: string[] = []): string[] {
  if (t.leaf)
    return [
      `${path.join(" and ") || "always"} → ${t.bad ? "decline" : "approve"} (${t.n} applicants)`,
    ];
  const name = t.feat === "income" ? "income" : "debt ratio";
  const unit = t.feat === "income" ? " lakh" : "%";
  return [
    ...rules(t.left, [...path, `${name} ≤ ${t.thr}${unit}`]),
    ...rules(t.right, [...path, `${name} > ${t.thr}${unit}`]),
  ];
}

export function describeRoot(t: Node) {
  if (t.leaf) return "no split";
  return t.feat === "income" ? `income ≤ ${t.thr} lakh?` : `debt ratio ≤ ${t.thr}%?`;
}
