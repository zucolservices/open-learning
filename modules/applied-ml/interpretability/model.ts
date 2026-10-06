/** A deliberately simple additive loan-risk model, so its SHAP values are exact and easy to check. */

export type Feat = "income" | "debt" | "late" | "years";

export interface Applicant {
  name: string;
  income: number; // ₹ lakh a year
  debt: number; // debt-to-income %
  late: number; // late payments in the last two years
  years: number; // years in current job
}

export const FEATS: { id: Feat; label: string; unit: string }[] = [
  { id: "income", label: "Income", unit: "₹ lakh/yr" },
  { id: "debt", label: "Debt-to-income", unit: "%" },
  { id: "late", label: "Late payments", unit: "in 2 yrs" },
  { id: "years", label: "Years in job", unit: "yrs" },
];

/** Average applicant (the baseline every explanation starts from). */
export const MEAN: Record<Feat, number> = { income: 12, debt: 35, late: 1, years: 4 };
const W: Record<Feat, number> = { income: -0.8, debt: 0.4, late: 5, years: -0.8 };
export const BASE = 25; // average predicted default risk, %

export const APPLICANTS: Applicant[] = [
  { name: "Asha", income: 9, debt: 62, late: 3, years: 1 },
  { name: "Ravi", income: 18, debt: 30, late: 0, years: 5 },
  { name: "Meera", income: 14, debt: 48, late: 0, years: 2 },
];

export const push = (a: Applicant, f: Feat) => W[f] * (a[f] - MEAN[f]);

export function risk(a: Applicant) {
  return BASE + FEATS.reduce((s, f) => s + push(a, f.id), 0);
}

/* Permutation importance on made-up held-out applicants ------------------------------------------ */

function rnd(i: number, k: number) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface Row extends Applicant {
  debt2: number;
  bad: number;
}

const ROWS: Row[] = Array.from({ length: 400 }, (_, i) => {
  const a: Applicant = {
    name: "",
    income: 4 + rnd(i, 1) * 16,
    debt: 10 + rnd(i, 2) * 50,
    late: Math.floor(rnd(i, 3) * 3),
    years: Math.floor(rnd(i, 4) * 9),
  };
  const p = Math.min(0.95, Math.max(0.02, risk(a) / 100));
  return { ...a, debt2: a.debt + (rnd(i, 5) - 0.5) * 2, bad: rnd(i, 6) < p ? 1 : 0 };
});

function predict(r: Row, dup: boolean) {
  const a = dup ? { ...r, debt: (r.debt + r.debt2) / 2 } : r;
  return Math.min(0.99, Math.max(0.01, risk(a) / 100));
}

const brier = (rows: Row[], dup: boolean) =>
  rows.reduce((s, r) => s + (predict(r, dup) - r.bad) ** 2, 0) / rows.length;

export type PermFeat = Feat | "debt2";

/** How much the Brier score worsens (×1000) when one column is shuffled. */
export function permutation(dup: boolean): { id: PermFeat; label: string; drop: number }[] {
  const base = brier(ROWS, dup);
  const cols: { id: PermFeat; label: string }[] = [
    ...FEATS.map((f) => ({ id: f.id as PermFeat, label: f.label })),
    ...(dup ? [{ id: "debt2" as PermFeat, label: "Debt-to-income (copy)" }] : []),
  ];
  return cols.map((c) => {
    const shuffled = ROWS.map((r, i) => ({
      ...r,
      [c.id]: ROWS[(i * 157 + 61) % ROWS.length][c.id],
    }));
    return { ...c, drop: Math.round((brier(shuffled, dup) - base) * 1000 * 10) / 10 };
  });
}

/** Running totals for a waterfall chart, starting at the average. */
export function waterfall(a: Applicant) {
  return FEATS.map((f, i) => {
    const from = BASE + FEATS.slice(0, i).reduce((s, g) => s + push(a, g.id), 0);
    const p = push(a, f.id);
    return { ...f, p, from, to: from + p };
  });
}
