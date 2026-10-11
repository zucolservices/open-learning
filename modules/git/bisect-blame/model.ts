/**
 * Bisect over 1,000 commits: commit 0 is known good, 999 known bad, and the bug arrived at a fixed,
 * hidden commit. Each step tests the midpoint and halves the range: about log2(1000) ≈ 10 steps.
 * bisect run exit codes: 0 good, 1–127 bad (except 125 = skip), others abort.
 */

export const N = 1000;
export const BROKE_AT = 731;

export interface Range {
  good: number;
  bad: number;
  steps: number;
  tested: { at: number; bad: boolean }[];
}

export const START: Range = { good: 0, bad: N - 1, steps: 0, tested: [] };

export const mid = (r: Range) => Math.floor((r.good + r.bad) / 2);
export const isBad = (i: number) => i >= BROKE_AT;

export function mark(r: Range, bad: boolean): Range {
  const m = mid(r);
  return {
    good: bad ? r.good : m,
    bad: bad ? m : r.bad,
    steps: r.steps + 1,
    tested: [...r.tested, { at: m, bad }],
  };
}

export const done = (r: Range) => r.bad - r.good <= 1;

export function runAll(): Range {
  let r = START;
  while (!done(r)) r = mark(r, isBad(mid(r)));
  return r;
}

export interface BlameLine {
  text: string;
  plain: { id: string; who: string; msg: string };
  real: { id: string; who: string; msg: string };
}

const FMT = { id: "f00dcafe", who: "Formatter bot", msg: "Reformat whole codebase" };
export const BLAME: BlameLine[] = [
  {
    text: "function total(items) {",
    plain: FMT,
    real: { id: "1a2b3c4d", who: "Kavya", msg: "Add bill totals" },
  },
  {
    text: "  const sum = items.reduce(add, 0);",
    plain: FMT,
    real: { id: "1a2b3c4d", who: "Kavya", msg: "Add bill totals" },
  },
  {
    text: "  return round(sum * 1.05);",
    plain: { id: "9e8d7c6b", who: "Tom", msg: "Round GST once on the total" },
    real: { id: "9e8d7c6b", who: "Tom", msg: "Round GST once on the total" },
  },
  { text: "}", plain: FMT, real: { id: "1a2b3c4d", who: "Kavya", msg: "Add bill totals" } },
];
