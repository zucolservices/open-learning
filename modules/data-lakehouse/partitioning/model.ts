/**
 * An illustrative model of how a partition scheme shapes a table and its
 * queries. Assumptions are listed in ASSUMPTIONS and shown to the learner.
 */

export const DAYS = 1095; // three years
export const GB_PER_DAY = 1;
export const TARGET_MB = 256; // files are compacted toward this size, never across partitions
export const CUSTOMERS = 1_000_000;
export const BATCHES_PER_DAY = 24; // data lands hourly

/** Share of orders by country: skewed, like many real datasets. */
export const COUNTRY_SHARE = [0.6, 0.12, 0.06, ...Array.from({ length: 17 }, () => 0.22 / 17)];

export const SCAN_GB_PER_S = 5; // cluster-wide read throughput
export const FILE_MS = 2; // per-file open/footer cost
export const PARALLEL = 32; // files opened in parallel
export const PLAN_MS_PER_FILE = 0.02; // planning: listing / metadata per file

export const ASSUMPTIONS = [
  `Three years of orders, ~${GB_PER_DAY} GB per day (~${((DAYS * GB_PER_DAY) / 1000).toFixed(1)} TB), arriving hourly`,
  `Files compacted toward ${TARGET_MB} MB, but a file never spans two partitions`,
  `Reads at ${SCAN_GB_PER_S} GB/s; each file costs ~${FILE_MS} ms to open (${PARALLEL} at a time), plus planning time per file`,
  "Only partition pruning is modelled; file statistics can skip more (next module)",
  `Orders by country are skewed: 60% in one country, 20 countries in total; ${CUSTOMERS.toLocaleString("en-IN")} customers`,
];

export type Scheme =
  "none" | "year" | "month" | "day" | "hour" | "country" | "day_country" | "customer";

export const SCHEMES: { id: Scheme; label: string; path: string }[] = [
  { id: "none", label: "None", path: "orders/part-….parquet" },
  { id: "year", label: "Year", path: "orders/year=2026/…" },
  { id: "month", label: "Month", path: "orders/month=2026-09/…" },
  { id: "day", label: "Day", path: "orders/date=2026-09-24/…" },
  { id: "hour", label: "Hour", path: "orders/date=2026-09-24/hour=09/…" },
  { id: "country", label: "Country", path: "orders/country=IN/…" },
  { id: "day_country", label: "Day + country", path: "orders/date=2026-09-24/country=IN/…" },
  { id: "customer", label: "Customer ID", path: "orders/customer_id=4821/…" },
];

export type QueryId = "day" | "customer" | "monthly";

export const QUERIES: { id: QueryId; label: string; sql: string }[] = [
  { id: "day", label: "One day", sql: "WHERE order_date = '2026-09-24'" },
  {
    id: "customer",
    label: "One customer",
    sql: "WHERE customer_id = 4821 AND order_date >= '2025-09-24'",
  },
  {
    id: "monthly",
    label: "Monthly, all time",
    sql: "GROUP BY month(order_date)  -- no filter",
  },
];

/** A group of identical partitions: `count` partitions of `mb` each. */
interface Group {
  count: number;
  mb: number;
}

const TOTAL_MB = DAYS * GB_PER_DAY * 1000;

function groups(s: Scheme): Group[] {
  switch (s) {
    case "none":
      return [{ count: 1, mb: TOTAL_MB }];
    case "year":
      return [{ count: 3, mb: TOTAL_MB / 3 }];
    case "month":
      return [{ count: 36, mb: TOTAL_MB / 36 }];
    case "day":
      return [{ count: DAYS, mb: GB_PER_DAY * 1000 }];
    case "hour":
      return [{ count: DAYS * 24, mb: (GB_PER_DAY * 1000) / 24 }];
    case "country":
      return COUNTRY_SHARE.map((sh) => ({ count: 1, mb: TOTAL_MB * sh }));
    case "day_country":
      return COUNTRY_SHARE.map((sh) => ({ count: DAYS, mb: GB_PER_DAY * 1000 * sh }));
    case "customer":
      return [{ count: CUSTOMERS, mb: TOTAL_MB / CUSTOMERS }];
  }
}

const filesIn = (mb: number) => Math.max(1, Math.ceil(mb / TARGET_MB));

export interface Layout {
  partitions: number;
  files: number;
  avgFileMB: number;
  smallestFileMB: number;
  /** Files each hourly batch writes (before compaction). */
  filesPerBatch: number;
}

export function layout(s: Scheme): Layout {
  const g = groups(s);
  const partitions = g.reduce((n, x) => n + x.count, 0);
  const files = g.reduce((n, x) => n + x.count * filesIn(x.mb), 0);
  const smallestFileMB = Math.min(...g.map((x) => x.mb / filesIn(x.mb)));
  const perHourRows = 10_000_000 / BATCHES_PER_DAY; // ~10M orders a day
  const activeCustomers = Math.round(CUSTOMERS * (1 - Math.exp(-perHourRows / CUSTOMERS)));
  const filesPerBatch =
    s === "customer"
      ? activeCustomers
      : s === "country" || s === "day_country"
        ? COUNTRY_SHARE.length
        : 1;
  return { partitions, files, avgFileMB: TOTAL_MB / files, smallestFileMB, filesPerBatch };
}

export interface QueryCost {
  partitionsRead: number;
  filesRead: number;
  gbRead: number;
  seconds: number;
}

/** Which partitions a query must read under each scheme (partition pruning only). */
export function queryCost(s: Scheme, q: QueryId): QueryCost {
  const g = groups(s);
  let parts: Group[];
  if (q === "monthly") parts = g;
  else if (q === "day") {
    parts =
      s === "none" || s === "country" || s === "customer"
        ? g
        : s === "year"
          ? [{ count: 1, mb: TOTAL_MB / 3 }]
          : s === "month"
            ? [{ count: 1, mb: TOTAL_MB / 36 }]
            : s === "day"
              ? [{ count: 1, mb: GB_PER_DAY * 1000 }]
              : s === "hour"
                ? [{ count: 24, mb: (GB_PER_DAY * 1000) / 24 }]
                : COUNTRY_SHARE.map((sh) => ({ count: 1, mb: GB_PER_DAY * 1000 * sh }));
  } else {
    // One customer (living in the biggest country), last 365 days.
    const lastYearMB = 365 * GB_PER_DAY * 1000;
    parts =
      s === "customer"
        ? [{ count: 1, mb: TOTAL_MB / CUSTOMERS }]
        : s === "none"
          ? g
          : s === "year"
            ? [{ count: 2, mb: TOTAL_MB / 3 }] // spans two calendar years
            : s === "month"
              ? [{ count: 13, mb: TOTAL_MB / 36 }]
              : s === "day"
                ? [{ count: 365, mb: GB_PER_DAY * 1000 }]
                : s === "hour"
                  ? [{ count: 365 * 24, mb: (GB_PER_DAY * 1000) / 24 }]
                  : s === "country"
                    ? [{ count: 1, mb: TOTAL_MB * COUNTRY_SHARE[0] }]
                    : [{ count: 365, mb: (lastYearMB / 365) * COUNTRY_SHARE[0] }];
  }
  const partitionsRead = parts.reduce((n, x) => n + x.count, 0);
  const filesRead = parts.reduce((n, x) => n + x.count * filesIn(x.mb), 0);
  const gbRead = parts.reduce((n, x) => n + x.count * x.mb, 0) / 1000;
  const seconds =
    gbRead / SCAN_GB_PER_S +
    (filesRead * FILE_MS) / PARALLEL / 1000 +
    (filesRead * PLAN_MS_PER_FILE) / 1000;
  return { partitionsRead, filesRead, gbRead, seconds };
}

export const fmtN = (n: number) =>
  n >= 1_000_000
    ? `${+(n / 1_000_000).toFixed(1)}M`
    : n >= 10_000
      ? `${Math.round(n / 1000)}k`
      : Math.round(n).toLocaleString("en-IN");

export const fmtGB = (gb: number) =>
  gb >= 1000
    ? `${(gb / 1000).toFixed(2)} TB`
    : gb >= 1
      ? `${gb.toFixed(gb >= 100 ? 0 : 1)} GB`
      : `${Math.max(1, Math.round(gb * 1000))} MB`;

export const fmtS = (s: number) =>
  s >= 60
    ? `${(s / 60).toFixed(s >= 600 ? 0 : 1)} min`
    : s >= 1
      ? `${s.toFixed(s >= 10 ? 0 : 1)} s`
      : `${Math.max(1, Math.round(s * 1000))} ms`;
