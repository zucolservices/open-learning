/**
 * An illustrative model of six months in a table's life, with and without
 * maintenance. Every assumption is listed in ASSUMPTIONS and shown to the
 * learner; the numbers are for comparison, not a benchmark.
 */

export const START_GB = 1000; // live table at the start
export const APPEND_GB_PER_MONTH = 100; // streamed in, one small file a minute
export const MINUTES_PER_MONTH = 30 * 24 * 60;
export const SMALL_FILE_MB = (APPEND_GB_PER_MONTH * 1000) / MINUTES_PER_MONTH; // ≈ 2.3 MB
export const TARGET_MB = 256;
export const MERGE_CHURN_GB_PER_DAY = 20; // a daily MERGE rewrites ~20 GB of files
export const ORPHAN_GB_PER_MONTH = 10; // failed jobs leave uncommitted files
export const QUERY_DAYS = 30; // a typical query reads the last 30 days
export const SCAN_GB_PER_S = 5;
export const FILE_MS = 10; // an object-store request plus a footer read, per file
export const PARALLEL = 32;

export const ASSUMPTIONS = [
  `Starts at ${START_GB / 1000} TB; ${APPEND_GB_PER_MONTH} GB a month arrives by streaming, one ~${SMALL_FILE_MB.toFixed(1)} MB file a minute`,
  `A daily MERGE rewrites ~${MERGE_CHURN_GB_PER_DAY} GB of files (the old versions stay in storage until cleaned)`,
  `Failed jobs leave ~${ORPHAN_GB_PER_MONTH} GB of never-committed files a month`,
  `A typical query reads the last ${QUERY_DAYS} days; ${SCAN_GB_PER_S} GB/s scan, ~${FILE_MS} ms per file (${PARALLEL} at a time)`,
  `Compaction rewrites small files into ~${TARGET_MB} MB files once a week`,
];

export interface Policy {
  compact: boolean;
  /** Days of old versions kept; null = never cleaned up. */
  retentionDays: number | null;
  orphans: boolean;
}

export const NO_MAINTENANCE: Policy = { compact: false, retentionDays: null, orphans: false };

export interface MonthState {
  month: number;
  liveGB: number;
  oldVersionsGB: number;
  orphanGB: number;
  storageGB: number;
  files: number;
  smallFiles: number;
  queryFiles: number;
  querySeconds: number;
  timeTravelDays: number | null;
}

export function simulate(policy: Policy, months = 6): MonthState[] {
  const out: MonthState[] = [];
  for (let m = 0; m <= months; m++) {
    const days = m * 30;
    const liveGB = START_GB + APPEND_GB_PER_MONTH * m;
    // Old versions: MERGE churn, plus small files replaced by compaction.
    const churnPerDay = MERGE_CHURN_GB_PER_DAY + (policy.compact ? APPEND_GB_PER_MONTH / 30 : 0);
    const keptDays = policy.retentionDays === null ? days : Math.min(days, policy.retentionDays);
    const oldVersionsGB = churnPerDay * keptDays;
    const orphanGB = policy.orphans
      ? Math.min(m, 1) * ORPHAN_GB_PER_MONTH * (3 / 30)
      : ORPHAN_GB_PER_MONTH * m;
    // Files: the starting table is well-sized; appends are small until compacted.
    const baseFiles = Math.ceil((START_GB * 1000) / TARGET_MB);
    const smallFiles =
      m === 0 ? 0 : policy.compact ? Math.round(MINUTES_PER_MONTH / 4 / 2) : MINUTES_PER_MONTH * m;
    const compactedFiles = policy.compact
      ? Math.ceil((APPEND_GB_PER_MONTH * m * 1000) / TARGET_MB)
      : 0;
    const files = baseFiles + smallFiles + compactedFiles;
    // A 30-day query reads a month of appended data.
    const queryGB = m === 0 ? (START_GB * QUERY_DAYS) / 365 : APPEND_GB_PER_MONTH;
    const queryFiles =
      m === 0
        ? Math.ceil((queryGB * 1000) / TARGET_MB)
        : policy.compact
          ? Math.ceil((queryGB * 1000) / TARGET_MB) + Math.round(MINUTES_PER_MONTH / 4 / 2)
          : MINUTES_PER_MONTH;
    const querySeconds = queryGB / SCAN_GB_PER_S + (queryFiles * FILE_MS) / PARALLEL / 1000;
    out.push({
      month: m,
      liveGB,
      oldVersionsGB,
      orphanGB,
      storageGB: liveGB + oldVersionsGB + orphanGB,
      files,
      smallFiles,
      queryFiles,
      querySeconds,
      timeTravelDays: policy.retentionDays === null ? days : Math.min(days, policy.retentionDays),
    });
  }
  return out;
}

export const fmtGB = (gb: number) =>
  gb >= 1000 ? `${(gb / 1000).toFixed(2)} TB` : `${Math.round(gb)} GB`;
export const fmtN = (n: number) =>
  n >= 1_000_000
    ? `${+(n / 1_000_000).toFixed(1)}M`
    : n >= 10_000
      ? `${Math.round(n / 1000)}k`
      : Math.round(n).toLocaleString("en-IN");
export const fmtS = (s: number) => (s >= 60 ? `${(s / 60).toFixed(1)} min` : `${s.toFixed(1)} s`);
