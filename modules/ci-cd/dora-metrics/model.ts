/**
 * A month of delivery for one team (illustrative). 300 changes are finished over 30 days. The team
 * deploys every `every` days; each change has a small chance of a fault its checks miss. The five
 * DORA measures are then computed the way you would from pipeline and incident data.
 */

export const CADENCES = [0.25, 1, 3, 7, 14] as const;
export type Cadence = (typeof CADENCES)[number];
export type Checks = "strong" | "weak";

export const CADENCE_LABEL: Record<Cadence, string> = {
  0.25: "4× a day",
  1: "Daily",
  3: "Every 3 days",
  7: "Weekly",
  14: "Fortnightly",
};

const DAYS = 30;
const CHANGES_PER_DAY = 10;

export interface Metrics {
  deploys: number;
  /** Median hours from commit to production. */
  leadHours: number;
  /** Median minutes to recover from a failed deploy. */
  recoverMin: number;
  changeFailRate: number;
  reworkRate: number;
  /** Deploy index list marked failed, for the timeline. */
  failedIdx: number[];
}

export function metrics(every: Cadence, checks: Checks): Metrics {
  const deploys = Math.round(DAYS / every);
  const batch = (CHANGES_PER_DAY * DAYS) / deploys;
  const p = checks === "strong" ? 0.003 : 0.01;
  const changeFailRate = 1 - (1 - p) ** batch;
  const failed = Math.round(deploys * changeFailRate);
  // Spread failures evenly through the month for the picture.
  const failedIdx = Array.from({ length: failed }, (_, i) =>
    Math.floor(((i + 0.5) * deploys) / failed),
  );
  const pipelineHours = checks === "strong" ? 0.5 : 4;
  const leadHours = pipelineHours + (every * 24) / 2;
  // Bigger releases take longer to diagnose; weak checks mean slower, manual rollbacks.
  const recoverMin = Math.round(
    (checks === "strong" ? 20 : 60) * (1 + Math.log2(Math.max(1, batch)) / 3),
  );
  // Each failure forces one unplanned (hotfix or rollback) deployment.
  const reworkRate = changeFailRate / (1 + changeFailRate);
  return { deploys, leadHours, recoverMin, changeFailRate, reworkRate, failedIdx };
}

export function fmtLead(h: number): string {
  if (h < 24) return `${h < 10 ? h.toFixed(1) : Math.round(h)} h`;
  return `${(h / 24).toFixed(1)} days`;
}

export function fmtMin(m: number): string {
  return m < 120 ? `${m} min` : `${(m / 60).toFixed(1)} h`;
}
