/**
 * Approval-style model for one month of 100 finished changes (illustrative). Bigger batches mean a
 * release is more likely to contain a faulty change, and recovery is slower.
 */

export type Approval = "board" | "delivery" | "deployment";
export type Checks = "basic" | "thorough";

export const APPROVALS: Record<
  Approval,
  { name: string; short: string; batch: number; lead: string; leadHours: number; who: string }
> = {
  board: {
    name: "Weekly change board",
    short: "Change board",
    batch: 25,
    lead: "about 4 days",
    leadHours: 96,
    who: "A committee outside the team approves the week's release in one meeting.",
  },
  delivery: {
    name: "Continuous delivery",
    short: "Delivery",
    batch: 3,
    lead: "about 6 hours",
    leadHours: 6,
    who: "A teammate reviews each change; someone presses 'deploy' a few times a day.",
  },
  deployment: {
    name: "Continuous deployment",
    short: "Deployment",
    batch: 1,
    lead: "under an hour",
    leadHours: 0.75,
    who: "A teammate reviews each change; every change that passes goes out by itself.",
  },
};

const CHANGES = 100;

/** Chance a single change carries a fault that reaches production. */
function faultRate(a: Approval, c: Checks) {
  // DORA found no evidence external approval lowers change failure; peer review does help.
  const review = a === "board" ? 1 : 0.75;
  const checks = c === "thorough" ? 0.45 : 1;
  return 0.02 * review * checks;
}

export interface Month {
  deploys: number;
  failed: number;
  failRate: number;
  /** Typical hours to recover from a failed release. */
  recoverHours: number;
}

export function month(a: Approval, c: Checks): Month {
  const { batch } = APPROVALS[a];
  const deploys = Math.round(CHANGES / batch);
  const p = faultRate(a, c);
  const failRate = 1 - (1 - p) ** batch;
  const failed = deploys * failRate;
  // Finding the culprit in a big batch is slow; small releases are rolled back quickly, and
  // thorough checks (canary + automatic rollback) catch most failures within minutes.
  const base = a === "board" ? 20 : a === "delivery" ? 1.5 : 0.75;
  const recoverHours = c === "thorough" ? base * (a === "board" ? 0.8 : 0.3) : base;
  return { deploys, failed, failRate, recoverHours };
}

export function fmtHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)} min`;
  if (h < 24) return `${Number.isInteger(h) ? h : h.toFixed(1)} h`;
  return `${(h / 24).toFixed(1)} days`;
}
