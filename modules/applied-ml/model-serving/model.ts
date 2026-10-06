/** Training-serving skew: the loan-risk model from module 17, fed by a buggy live pipeline. */

import { risk, type Applicant } from "../interpretability/model";

function rnd(i: number, k: number) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Made-up held-out applicants with what actually happened. */
const ROWS = Array.from({ length: 300 }, (_, i) => {
  const a: Applicant = {
    name: "",
    income: Math.round(4 + rnd(i, 11) * 20),
    debt: Math.round(10 + rnd(i, 12) * 60),
    late: Math.floor(rnd(i, 13) * 4),
    years: Math.floor(rnd(i, 14) * 10),
  };
  return { a, bad: rnd(i, 15) < risk(a) / 100 };
});

export const N = ROWS.length;
export const THRESHOLD = 30; // refuse when predicted risk is 30% or more

export type Bug = "units" | "months";

export const BUGS: { id: Bug; name: string; detail: string }[] = [
  {
    id: "units",
    name: "Income per month",
    detail: "Training used yearly income; the app's code sends monthly income.",
  },
  {
    id: "months",
    name: "Job tenure in months",
    detail: "Training used years in the current job; the app's code sends months.",
  },
];

function liveInput(a: Applicant, bugs: Bug[], shared: boolean): Applicant {
  if (shared) return a;
  return {
    ...a,
    income: bugs.includes("units") ? a.income / 12 : a.income,
    years: bugs.includes("months") ? a.years * 12 : a.years,
  };
}

const refuse = (a: Applicant) => risk(a) >= THRESHOLD;

export function stats(bugs: Bug[], shared: boolean, isLive: boolean) {
  const decisions = ROWS.map((r) => refuse(isLive ? liveInput(r.a, bugs, shared) : r.a));
  const correct = decisions.filter((d, i) => d === ROWS[i].bad).length;
  const approved = decisions.filter((d) => !d).length;
  const approvedBad = decisions.filter((d, i) => !d && ROWS[i].bad).length;
  return {
    accuracy: Math.round((correct / N) * 100),
    approved: Math.round((approved / N) * 100),
    approvedBad,
  };
}

/** Applicants who get a different decision live than the identical applicant got offline. */
export const flipped = (bugs: Bug[], shared: boolean) =>
  ROWS.filter((r) => refuse(r.a) !== refuse(liveInput(r.a, bugs, shared))).length;
