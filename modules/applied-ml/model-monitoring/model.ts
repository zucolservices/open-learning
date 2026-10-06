/** Six months of a deployed loan-risk model (from module 17) while the world shifts under it. */

import { risk, type Applicant } from "../interpretability/model";

function rnd(i: number, k: number) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export const WEEKS = 24;
export const LAG = 4; // true outcomes arrive four weeks late
export const START = 10; // the change begins in week 10
const PER_WEEK = 300;
const THRESHOLD = 30;

export type Drift = "none" | "data" | "concept";
export type Speed = "sudden" | "gradual";

/** 0 before the change, rising to 1 (at once, or over eight weeks). */
const amount = (w: number, speed: Speed) =>
  w < START ? 0 : speed === "sudden" ? 1 : Math.min(1, (w - START + 1) / 8);

function week(w: number, drift: Drift, speed: Speed) {
  const k = drift === "none" ? 0 : amount(w, speed);
  return Array.from({ length: PER_WEEK }, (_, j) => {
    const i = w * 1000 + j;
    const a: Applicant = {
      name: "",
      // Data drift: a new marketing campaign brings in lower-income applicants.
      income: Math.max(2, 4 + rnd(i, 1) * 20 - (drift === "data" ? 8 * k * rnd(i, 7) : 0)),
      debt: 10 + rnd(i, 2) * 60,
      late: Math.floor(rnd(i, 3) * 4),
      years: Math.floor(rnd(i, 4) * 10),
    };
    // Concept drift: a downturn makes the same applicant more likely to default.
    const truth = risk(a) + (drift === "concept" ? 25 * k : 0);
    return { a, bad: rnd(i, 5) < truth / 100 };
  });
}

/** Population Stability Index over ten fixed income bins. */
export function psi(expected: number[], actual: number[]) {
  const edges = Array.from({ length: 9 }, (_, i) => 4 + (i + 1) * 2);
  const share = (xs: number[]) => {
    const c = Array(10).fill(0);
    xs.forEach((x) => c[edges.filter((e) => x > e).length]++);
    return c.map((n) => Math.max(n / xs.length, 1e-4));
  };
  const e = share(expected);
  const a = share(actual);
  return e.reduce((s, ei, i) => s + (a[i] - ei) * Math.log(a[i] / ei), 0);
}

const REF = week(0, "none", "sudden").map((r) => r.a.income);

export interface Week {
  w: number;
  psi: number;
  refused: number; // share refused, %
  badRate: number | null; // defaults among approved, %; null until outcomes arrive
}

export function timeline(drift: Drift, speed: Speed): Week[] {
  return Array.from({ length: WEEKS }, (_, w) => {
    const rows = week(w, drift, speed);
    const refuse = rows.map((r) => risk(r.a) >= THRESHOLD);
    return {
      w,
      psi:
        Math.round(
          psi(
            REF,
            rows.map((r) => r.a.income),
          ) * 1000,
        ) / 1000,
      refused: Math.round((refuse.filter(Boolean).length / rows.length) * 100),
      badRate:
        w < WEEKS - LAG
          ? Math.round(
              (rows.filter((r, i) => !refuse[i] && r.bad).length /
                Math.max(1, refuse.filter((d) => !d).length)) *
                100,
            )
          : null,
    };
  });
}

/* PSI explorer: a normal-ish income histogram shifted by some amount ---------------------------- */

export function shifted(shift: number) {
  return Array.from({ length: 2000 }, (_, i) => {
    const z = (rnd(i, 21) + rnd(i, 22) + rnd(i, 23) - 1.5) * 2;
    return 14 + z * 3 - shift;
  });
}

export function histogram(xs: number[]) {
  const c = Array(10).fill(0);
  xs.forEach((x) => c[Math.min(9, Math.max(0, Math.floor((x - 4) / 2)))]++);
  return c.map((n) => n / xs.length);
}
