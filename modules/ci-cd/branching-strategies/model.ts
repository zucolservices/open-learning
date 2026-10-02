/**
 * Branch-lifetime simulation (illustrative): five developers work for 20 days on one codebase.
 * Each day each developer edits two files. A branch is merged into main after `life` days; a
 * merge conflicts on every file the branch edited that someone else merged changes to since the
 * branch was started.
 */

export const DEVS = ["Asha", "Ben", "Chen", "Divya", "Eli"];
export const DAYS = 20;
export const FILES = [
  "checkout.ts",
  "cart.ts",
  "routes.ts",
  "payment.ts",
  "user.ts",
  "search.ts",
  "styles.css",
  "api.ts",
  "db.ts",
  "email.ts",
  "config.ts",
  "auth.ts",
];
/** Some files are edited far more than others, as in real codebases. */
const WEIGHTS = [6, 4, 5, 3, 2, 2, 3, 3, 1, 1, 2, 2];

export const LIVES = [10, 5, 2, 1] as const;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

function pick(r: () => number): number {
  const total = WEIGHTS.reduce((a, b) => a + b, 0);
  let x = r() * total;
  for (let i = 0; i < WEIGHTS.length; i++) {
    x -= WEIGHTS[i];
    if (x < 0) return i;
  }
  return WEIGHTS.length - 1;
}

/** Files each developer edits each day: edits[dev][day] = file indexes. Same for every strategy. */
export const EDITS: number[][][] = (() => {
  const r = rng(42);
  return DEVS.map(() =>
    Array.from({ length: DAYS }, () => {
      const a = pick(r);
      let b = pick(r);
      while (b === a) b = pick(r);
      return [a, b];
    }),
  );
})();

export interface Merge {
  dev: number;
  /** First day of the branch (0-based) and the day it merges (end of day). */
  start: number;
  end: number;
  files: number[];
  conflicts: number[];
  /** Pairs of overlapping edits to untangle (your edits × theirs, per conflicting file). */
  tangles: number;
}

export interface BranchResult {
  merges: Merge[];
  conflicts: number;
  tangles: number;
  /** Average days finished work waits on a branch before reaching main. */
  waitDays: number;
}

export function simulate(life: number): BranchResult {
  // Branch boundaries per developer, staggered so merges don't all land on one day.
  const plans: { dev: number; start: number; end: number }[] = [];
  DEVS.forEach((_, d) => {
    const offset = life === 1 ? 0 : Math.round((d * life) / DEVS.length);
    let start = 0;
    let end = offset > 0 ? offset - 1 : life - 1;
    while (start < DAYS) {
      plans.push({ dev: d, start, end: Math.min(end, DAYS - 1) });
      start = end + 1;
      end = start + life - 1;
    }
  });
  plans.sort((a, b) => a.end - b.end || a.dev - b.dev);
  const history: { day: number; dev: number; files: Map<number, number> }[] = [];
  const merges: Merge[] = plans.map((p) => {
    const files = new Map<number, number>();
    for (let day = p.start; day <= p.end; day++)
      EDITS[p.dev][day].forEach((f) => files.set(f, (files.get(f) ?? 0) + 1));
    const theirs = new Map<number, number>();
    for (const h of history) {
      if (h.dev !== p.dev && h.day >= p.start)
        h.files.forEach((n, f) => theirs.set(f, (theirs.get(f) ?? 0) + n));
    }
    const conflicts = [...files.keys()].filter((f) => theirs.has(f)).sort((a, b) => a - b);
    const tangles = conflicts.reduce((n, f) => n + files.get(f)! * theirs.get(f)!, 0);
    history.push({ day: p.end, dev: p.dev, files });
    return { ...p, files: [...files.keys()].sort((a, b) => a - b), conflicts, tangles };
  });
  // A day's work waits (end - day) days; average over all developer-days.
  let wait = 0;
  for (const m of merges) for (let day = m.start; day <= m.end; day++) wait += m.end - day;
  return {
    merges,
    conflicts: merges.reduce((n, m) => n + m.conflicts.length, 0),
    tangles: merges.reduce((n, m) => n + m.tangles, 0),
    waitDays: wait / (DEVS.length * DAYS),
  };
}
