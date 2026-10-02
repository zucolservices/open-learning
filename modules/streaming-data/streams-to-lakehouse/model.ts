export const MBPS = 10; // illustrative stream: 10 MB/s of Parquet-bound data
export const TARGET_MB = 512; // Iceberg write.target-file-size-bytes default

export const INTERVALS: [number, string][] = [
  [10, "10 s"],
  [60, "1 min"],
  [300, "5 min"],
  [900, "15 min"],
  [3600, "1 h"],
];

/** Files a streaming writer leaves in one day, and how big they are. */
export function files(
  interval: number,
  writers: number,
  partitions: number,
  shuffle: boolean,
  compact: boolean,
) {
  const commits = 86_400 / interval;
  const chunks = shuffle ? partitions : writers * partitions; // one open file per writer per partition
  const perCommit = chunks * Math.ceil((MBPS * interval) / chunks / TARGET_MB); // files roll at the target size
  const written = commits * perCommit;
  const dayMB = MBPS * 86_400;
  const avgMB = (MBPS * interval) / perCommit;
  const kept = compact ? partitions * Math.ceil(dayMB / partitions / TARGET_MB) : written;
  return { commits, perCommit, written, kept, avgMB, keptMB: dayMB / kept };
}

export function fmtMB(mb: number) {
  if (mb >= 1) return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
  return `${Math.round(mb * 1024)} KB`;
}
