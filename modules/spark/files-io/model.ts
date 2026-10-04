/** Writing 100 GB with partitionBy, then reading one day back. Sizes are illustrative. */

export const DATA_MB = 100 * 1024;
export const TASKS = 200;
const MAX_PARTITION_MB = 128;
const OPEN_COST_MB = 4;

export type Col = "none" | "country" | "date" | "user_id";
export const COLS: { id: Col; label: string; card: number }[] = [
  { id: "none", label: "no partitionBy", card: 1 },
  { id: "country", label: "country (50)", card: 50 },
  { id: "date", label: "date (365)", card: 365 },
  { id: "user_id", label: "user_id (2 million)", card: 2_000_000 },
];

export function plan(col: Col, repart: boolean) {
  const card = COLS.find((c) => c.id === col)!.card;
  const files = col === "none" ? TASKS : repart ? card : TASKS * card;
  const avgMb = DATA_MB / files;
  const verdict: "small" | "good" | "big" = avgMb < 16 ? "small" : avgMb > 1024 ? "big" : "good";
  // Reading WHERE date = '2026-10-01'
  const pruned = col === "date";
  const scanMb = pruned ? DATA_MB / 365 : DATA_MB;
  const filesRead = pruned ? Math.max(1, files / 365) : files;
  const perFile = scanMb / filesRead;
  const readTasks = Math.max(
    1,
    Math.ceil((filesRead * (perFile + OPEN_COST_MB)) / MAX_PARTITION_MB),
  );
  return { files, avgMb, verdict, scanMb, filesRead, readTasks, pruned };
}

export const fmtMb = (mb: number) =>
  mb >= 1024
    ? `${(mb / 1024).toLocaleString("en-GB", { maximumFractionDigits: 1 })} GB`
    : mb >= 1
      ? `${mb.toLocaleString("en-GB", { maximumFractionDigits: 1 })} MB`
      : `${Math.round(mb * 1024)} KB`;

export const fmtN = (n: number) => Math.round(n).toLocaleString("en-GB");
