/**
 * Bytes-scanned model for the "what makes a query cheap" step. Illustrative:
 * a 2 TB orders table, 730 daily partitions of equal size, 25 columns of equal
 * size, row groups of ~128 MB with min/max statistics.
 */

export const TABLE_TB = 2;
export const DAYS = 730;
export const COLUMNS = 25;
export const FILES = 36_500; // 50 files per day

export type DateFilter = "none" | "month" | "day";
export type CustFilter = "none" | "customer";

export interface QueryShape {
  date: DateFilter;
  customer: CustFilter;
  clustered: boolean; // table clustered / sorted by customer_id
  columns: number; // columns selected (25 = SELECT *)
}

export interface ScanResult {
  bytesTB: number;
  files: number;
  stages: { label: string; tb: number; note: string }[];
}

export function scan(q: QueryShape): ScanResult {
  const dayFrac = q.date === "day" ? 1 / DAYS : q.date === "month" ? 30 / DAYS : 1;
  // Without clustering every file holds every customer, so min/max can't skip anything.
  const custFrac = q.customer === "customer" ? (q.clustered ? 0.01 : 1) : 1;
  const colFrac = q.columns / COLUMNS;

  const afterPartitions = TABLE_TB * dayFrac;
  const files = Math.max(1, Math.round(FILES * dayFrac * custFrac));
  // You can't read less than the files you open.
  const afterFiles = Math.max(afterPartitions * custFrac, (files * TABLE_TB) / FILES);
  const afterColumns = afterFiles * colFrac;

  return {
    bytesTB: afterColumns,
    files,
    stages: [
      { label: "Whole table", tb: TABLE_TB, note: `${FILES.toLocaleString("en-IN")} files` },
      {
        label: "After partition pruning",
        tb: afterPartitions,
        note: q.date === "none" ? "no date filter: nothing skipped" : "only the matching dates",
      },
      {
        label: "After min/max skipping",
        tb: afterFiles,
        note:
          q.customer === "none"
            ? "no other filter"
            : q.clustered
              ? "clustered: most files' ranges exclude the customer"
              : "not clustered: every file's range includes the customer",
      },
      {
        label: "After column pruning",
        tb: afterColumns,
        note: `${q.columns} of ${COLUMNS} columns`,
      },
    ],
  };
}

export function fmtBytes(tb: number): string {
  const gb = tb * 1000;
  if (gb >= 1000) return `${(gb / 1000).toFixed(gb >= 10_000 ? 0 : 1)} TB`;
  if (gb >= 1) return `${gb.toFixed(gb >= 100 ? 0 : 1)} GB`;
  return `${(gb * 1000).toFixed(0)} MB`;
}
