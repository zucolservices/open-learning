/**
 * A toy model of integration and release frequency (illustrative rates, not measured data).
 * Five developers each finish about one small change a day, over a 10-day Sprint.
 * - Merging: branches drift apart faster the longer they stay apart, so each merge costs
 *   more than proportionally to the days since the last one.
 * - Releasing: every release has a fixed overhead (manual regression testing and deployment,
 *   or an automated pipeline), plus clean-up when a release breaks, which is likelier and
 *   harder to untangle the more changes it bundles.
 */

export const DEVS = 5;
export const DAYS = 10;
export const INTERVALS = [1, 2, 5, 10] as const;
export type Interval = (typeof INTERVALS)[number];

const MERGE = 0.2; // hours per dev per merge, times (days apart)²
const OVERHEAD = { manual: 12, auto: 0.5 }; // hours per release
const VERIFY = { manual: 2, auto: 0.1 }; // days to check a release before it ships
const FAIL_PER_CHANGE = 0.02; // chance each change breaks the release
const DEBUG_PER_CHANGE = 0.5; // hours to find the culprit, per change in a broken release

export interface Outcome {
  lead: number; // days from finished code to users, on average
  merge: number; // hours per Sprint
  release: number; // hours per Sprint
  cleanup: number; // expected hours per Sprint
  perRelease: number; // changes bundled into each release
  total: number;
}

/** You can only release what has been integrated, so releases are never more frequent. */
export function outcome(integrate: Interval, releaseEvery: Interval, auto: boolean): Outcome {
  const release = Math.max(releaseEvery, integrate);
  const k = auto ? "auto" : "manual";
  const merge = DEVS * (DAYS / integrate) * MERGE * integrate ** 2;
  const releases = DAYS / release;
  const perRelease = DEVS * release;
  const failP = 1 - (1 - FAIL_PER_CHANGE) ** perRelease;
  const cleanup = releases * failP * perRelease * DEBUG_PER_CHANGE;
  const rel = releases * OVERHEAD[k];
  return {
    lead: integrate / 2 + release / 2 + VERIFY[k],
    merge,
    release: rel,
    cleanup,
    perRelease,
    total: merge + rel + cleanup,
  };
}
