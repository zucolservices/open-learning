/**
 * A deliberately simple cost model for Copy-on-Write vs Merge-on-Read.
 * Every assumption is listed in ASSUMPTIONS and shown to the learner; the
 * numbers are illustrative, not a benchmark.
 */

export const FILES = 100;
export const FILE_MB = 128;
export const ROWS_PER_FILE = 1_000_000;
export const ROW_BYTES = 128;
export const BATCHES_PER_HOUR = 12; // an update job every 5 minutes
export const DV_MB = 0.004; // a deletion vector bitmap for one file (~4 KB)
export const OPEN_FILE_MB = 1; // cost of opening one extra small file, as MB-equivalent
export const MERGE_ROW_MB = 0.0005; // cost of applying one pending change on read (~0.5 KB)

export const ASSUMPTIONS = [
  `${FILES} data files of ${FILE_MB} MB (${(FILES * FILE_MB) / 1000} GB), ~${ROWS_PER_FILE.toLocaleString("en-IN")} rows each`,
  `Updates arrive in ${BATCHES_PER_HOUR} batches an hour`,
  "Each read scans the whole table",
  `Merge-on-Read: each pending change costs readers ~0.5 KB of work; each extra small file ~${OPEN_FILE_MB} MB`,
  "Deletion-vector style Merge-on-Read (a bitmap per touched file + a small file of new rows per batch)",
];

export interface Workload {
  updatesPerHour: number;
  readsPerHour: number;
  /** "random": updated rows are spread over the table; "clustered": they sit together (e.g. recent dates). */
  spread: "random" | "clustered";
  /** Merge-on-Read compaction interval, hours. */
  compactEvery: number;
}

/** Expected number of distinct files touched by n updated rows. */
export function filesTouched(n: number, spread: Workload["spread"]) {
  if (n <= 0) return 0;
  if (spread === "clustered") return Math.min(FILES, Math.ceil(n / ROWS_PER_FILE));
  return FILES * (1 - Math.pow(1 - 1 / FILES, n));
}

export interface Costs {
  write: number; // MB per hour spent writing changes
  compaction: number; // MB per hour spent compacting (MoR only)
  readExtra: number; // extra MB-equivalent per hour spent by readers
  total: number;
  /** Per-query extra work (MoR) and bytes written per batch (CoW), for captions. */
  perQueryExtra: number;
  perBatchWrite: number;
  pendingFiles: number;
  pendingRows: number;
}

export function cowCosts(w: Workload): Costs {
  const perBatch = w.updatesPerHour / BATCHES_PER_HOUR;
  const perBatchWrite = filesTouched(perBatch, w.spread) * FILE_MB;
  const write = perBatchWrite * BATCHES_PER_HOUR;
  return {
    write,
    compaction: 0,
    readExtra: 0,
    total: write,
    perQueryExtra: 0,
    perBatchWrite,
    pendingFiles: 0,
    pendingRows: 0,
  };
}

export function morCosts(w: Workload): Costs {
  const perBatch = w.updatesPerHour / BATCHES_PER_HOUR;
  const perBatchWrite =
    filesTouched(perBatch, w.spread) * DV_MB + (perBatch * ROW_BYTES) / 1_000_000;
  const write = perBatchWrite * BATCHES_PER_HOUR;
  // Between compactions, pending changes grow linearly; readers see half the peak on average.
  const batchesBetween = w.compactEvery * BATCHES_PER_HOUR;
  const pendingFiles = batchesBetween / 2;
  const pendingRows = (w.updatesPerHour * w.compactEvery) / 2;
  const perQueryExtra = pendingFiles * OPEN_FILE_MB + pendingRows * MERGE_ROW_MB;
  const readExtra = perQueryExtra * w.readsPerHour;
  // Compaction rewrites every file touched since the last compaction.
  const compaction =
    (filesTouched(w.updatesPerHour * w.compactEvery, w.spread) * FILE_MB) / w.compactEvery;
  return {
    write,
    compaction,
    readExtra,
    total: write + compaction + readExtra,
    perQueryExtra,
    perBatchWrite,
    pendingFiles,
    pendingRows,
  };
}

/** Read debt (extra work per query) over a day, sampled every 15 minutes, for the sawtooth chart. */
export function sawtooth(w: Workload, hours = 24) {
  const points: { t: number; extra: number }[] = [];
  for (let m = 0; m <= hours * 60; m += 15) {
    const sinceCompaction = (m / 60) % w.compactEvery;
    const batches = Math.floor(sinceCompaction * BATCHES_PER_HOUR);
    const rows = w.updatesPerHour * sinceCompaction;
    points.push({ t: m / 60, extra: batches * OPEN_FILE_MB + rows * MERGE_ROW_MB });
  }
  return points;
}

export const fmtMB = (mb: number) =>
  mb <= 0
    ? "0"
    : mb >= 1_000_000
      ? `${(mb / 1_000_000).toFixed(1)} TB`
      : mb >= 1000
        ? `${(mb / 1000).toFixed(mb >= 10_000 ? 0 : 1)} GB`
        : mb >= 1
          ? `${Math.round(mb)} MB`
          : `${Math.max(1, Math.round(mb * 1000))} KB`;
