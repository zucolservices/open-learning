/**
 * An illustrative model of a streaming writer: how the trigger interval
 * trades freshness against file count and size. Assumptions are shown in
 * the UI; numbers are for comparison, not a benchmark.
 */

export const EVENT_BYTES = 500; // one app event, compressed in Parquet
export const WRITER_TASKS = 4; // parallel writers → files per commit
export const COMMIT_OVERHEAD_S = 2; // time to write + commit a micro-batch
export const TARGET_MB = 128;

export const ASSUMPTIONS = [
  `Each event is ~${EVENT_BYTES} bytes once compressed in Parquet`,
  `${WRITER_TASKS} parallel writer tasks, so each commit writes ${WRITER_TASKS} files`,
  `Writing and committing a batch takes ~${COMMIT_OVERHEAD_S} s`,
  `A healthy file is ~${TARGET_MB} MB; smaller files need compaction later`,
];

export const INTERVALS = [1, 5, 10, 30, 60, 300, 900, 3600]; // seconds
export const RATES = [100, 1000, 10000, 100000]; // events per second

export function streamStats(intervalS: number, eventsPerS: number) {
  const commitsPerDay = Math.floor(86400 / intervalS);
  const filesPerDay = commitsPerDay * WRITER_TASKS;
  const bytesPerCommit = intervalS * eventsPerS * EVENT_BYTES;
  const fileMB = bytesPerCommit / WRITER_TASKS / 1_000_000;
  // Average wait: half an interval to be picked up, plus the commit itself.
  const latencyS = intervalS / 2 + COMMIT_OVERHEAD_S;
  const filesPerTargetFile = Math.max(1, TARGET_MB / Math.max(fileMB, 1e-6));
  return { commitsPerDay, filesPerDay, fileMB, latencyS, filesPerTargetFile };
}

export const fmtDur = (s: number) =>
  s < 60
    ? `${s < 10 ? s.toFixed(1) : Math.round(s)} s`
    : s < 3600
      ? `${Math.round(s / 60)} min`
      : `${(s / 3600).toFixed(1)} h`;
export const fmtN = (n: number) =>
  n >= 1_000_000
    ? `${+(n / 1_000_000).toFixed(1)}M`
    : n >= 10_000
      ? `${Math.round(n / 1000)}k`
      : Math.round(n).toLocaleString("en-IN");
export const fmtMB = (mb: number) =>
  mb >= 1000
    ? `${(mb / 1000).toFixed(1)} GB`
    : mb >= 1
      ? `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`
      : `${Math.max(1, Math.round(mb * 1000))} KB`;
