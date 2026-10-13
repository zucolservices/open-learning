/**
 * Version 2.4 of the café app has a crash in group ordering. Day by day: how many customers are on
 * 2.4, and how many hit the crash, depending on rollout, halting, a feature flag and a fix.
 * All shares are illustrative.
 */

export type Mode = "all" | "phased";

/** Apple's phased release: share of automatic-update users offered the update, days 1–7. */
export const PHASED = [1, 2, 5, 10, 20, 50, 100];
const ALL = [60, 80, 90, 92, 94, 95, 96];
/** Share of 2.4 users who use group ordering (and so hit the crash). */
const GROUP = 0.3;
const REVIEW_DAYS = 2;

export interface Plan {
  mode: Mode;
  haltDay: number | null;
  flagDay: number | null;
  fixDay: number | null;
}

export function dayState(p: Plan, day: number) {
  const curve = p.mode === "phased" ? PHASED : ALL;
  const at = (d: number) => curve[Math.max(0, Math.min(6, d - 1))];
  const on24 = day === 0 ? 0 : p.haltDay !== null && day > p.haltDay ? at(p.haltDay) : at(day);
  const fixLive = p.fixDay !== null ? p.fixDay + REVIEW_DAYS : null;
  const updated =
    fixLive !== null && day >= fixLive ? [0.4, 0.75, 0.9, 0.95][Math.min(3, day - fixLive)] : 0;
  const stillBroken = on24 * (1 - updated);
  const flagged = p.flagDay !== null && day >= p.flagDay;
  const crashing = flagged ? 0 : Math.round(stillBroken * GROUP * 10) / 10;
  return { on24: Math.round(on24), crashing, fixLive, flagged };
}

export function cumulative(p: Plan, upTo: number) {
  let t = 0;
  for (let d = 1; d <= upTo; d++) t += dayState(p, d).crashing;
  return Math.round(t * 10) / 10;
}
