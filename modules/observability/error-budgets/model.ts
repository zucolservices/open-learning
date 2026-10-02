/**
 * Error budget for four weeks at 99.9% with 3,000,000 requests: 3,000 bad requests allowed
 * (the SRE Workbook's own example). Events spend it (illustrative sizes).
 */

export const REQUESTS = 3_000_000;
export const SLO = 99.9;
export const BUDGET = Math.round(REQUESTS * (1 - SLO / 100));

export const EVENTS: { id: string; label: string; bad: number }[] = [
  { id: "release", label: "A release with a bug, rolled back in 20 minutes", bad: 500 },
  { id: "outage", label: "A 25-minute outage of the payment gateway", bad: 1500 },
  { id: "blip", label: "A database failover blip", bad: 250 },
  { id: "experiment", label: "A risky experiment on 5% of users", bad: 200 },
  { id: "deps", label: "A bank's API timing out for an hour", bad: 700 },
];

export function status(spent: number) {
  const left = BUDGET - spent;
  if (left <= 0) return { left, level: "out" as const };
  if (left < BUDGET * 0.25) return { left, level: "low" as const };
  return { left, level: "ok" as const };
}

/** Hours until a 30-day budget is empty at a given burn rate. */
export function hoursToEmpty(burn: number) {
  return (30 * 24) / burn;
}
