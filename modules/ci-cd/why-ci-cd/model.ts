/**
 * Batch size simulation (illustrative): one quarter's work is 240 finished changes, and 7 of them
 * carry a bug. Release them in batches of different sizes and compare what happens.
 */

export const CHANGES = 240;
/** Working days in the quarter. */
export const DAYS = 60;
/** Positions (0-based) of the changes that carry a bug. */
export const BUGS = [17, 52, 88, 131, 160, 199, 228];

export const BATCHES = [240, 60, 20, 8, 4, 1] as const;
export type Batch = (typeof BATCHES)[number];

export interface BatchResult {
  batch: number;
  releases: number;
  /** Releases that contain at least one buggy change. */
  failed: number;
  /** Changes to search through when a release fails. */
  suspects: number;
  /** Builds needed to find one culprit by halving (git bisect). */
  bisectSteps: number;
  /** Days between releases. */
  everyDays: number;
  /** Average days a finished change waits before users get it. */
  waitDays: number;
}

export function simulate(batch: number): BatchResult {
  const releases = Math.ceil(CHANGES / batch);
  const hit = new Set(BUGS.map((b) => Math.floor(b / batch)));
  const everyDays = (DAYS * batch) / CHANGES;
  return {
    batch,
    releases,
    failed: hit.size,
    suspects: batch,
    bisectSteps: Math.ceil(Math.log2(batch)),
    everyDays,
    waitDays: everyDays / 2,
  };
}

/** Which release each change belongs to, and whether that release failed (for the strip chart). */
export function strip(batch: number): { release: number; bug: boolean; failed: boolean }[] {
  const hit = new Set(BUGS.map((b) => Math.floor(b / batch)));
  return Array.from({ length: CHANGES }, (_, i) => ({
    release: Math.floor(i / batch),
    bug: BUGS.includes(i),
    failed: hit.has(Math.floor(i / batch)),
  }));
}

export function fmtDays(d: number): string {
  if (d >= 1) return `${Number.isInteger(d) ? d : d.toFixed(1)} day${d === 1 ? "" : "s"}`;
  return `${Math.round(d * 8)} hour${Math.round(d * 8) === 1 ? "" : "s"}`;
}
