/** The Brewline `orders` table as an Iceberg table, partitioned by day(order_ts). */

export interface DataFile {
  id: string;
  min: number;
  max: number;
  rows: number;
}

export interface Manifest {
  id: string;
  day: string;
  files: DataFile[];
}

export const MANIFESTS: Manifest[] = [
  {
    id: "m1",
    day: "2026-09-22",
    files: [
      { id: "f1", min: 20, max: 180, rows: 4_100 },
      { id: "f2", min: 90, max: 350, rows: 3_900 },
      { id: "f3", min: 150, max: 420, rows: 4_000 },
    ],
  },
  {
    id: "m2",
    day: "2026-09-23",
    files: [
      { id: "f4", min: 30, max: 240, rows: 4_200 },
      { id: "f5", min: 60, max: 310, rows: 3_800 },
      { id: "f6", min: 110, max: 395, rows: 4_050 },
    ],
  },
  {
    id: "m3",
    day: "2026-09-24",
    files: [
      { id: "f7", min: 40, max: 260, rows: 4_150 },
      { id: "f8", min: 210, max: 520, rows: 3_950 },
      { id: "f9", min: 80, max: 330, rows: 4_000 },
    ],
  },
];

export const ALL_FILES = MANIFESTS.flatMap((m) => m.files);

export type QueryId = "day" | "amount" | "all";

export interface Query {
  id: QueryId;
  label: string;
  sql: string;
  /** Can the manifest list skip this manifest? (partition summary) */
  keepManifest(m: Manifest): boolean;
  /** Can the manifest's column stats skip this file? */
  keepFile(f: DataFile): boolean;
  manifestWhy: string;
  fileWhy: string;
}

export const QUERIES: Record<QueryId, Query> = {
  day: {
    id: "day",
    label: "Sep 24, over ₹400",
    sql: "SELECT * FROM orders\nWHERE order_ts >= '2026-09-24' AND order_ts < '2026-09-25'\n  AND amount > 400",
    keepManifest: (m) => m.day === "2026-09-24",
    keepFile: (f) => f.max > 400,
    manifestWhy:
      "Each manifest's entry in the manifest list says which days it covers. Only m3 can hold Sep 24 rows.",
    fileWhy: "Inside m3, each file's max amount is recorded. Only f8 goes above 400.",
  },
  amount: {
    id: "amount",
    label: "Any day, over ₹400",
    sql: "SELECT * FROM orders\nWHERE amount > 400",
    keepManifest: () => true,
    keepFile: (f) => f.max > 400,
    manifestWhy:
      "The manifest list only summarises partition values (days). amount isn't a partition column, so no manifest can be skipped.",
    fileWhy: "File-level stats still help: only f3 and f8 have a max amount above 400.",
  },
  all: {
    id: "all",
    label: "No filter",
    sql: "SELECT SUM(amount) FROM orders",
    keepManifest: () => true,
    keepFile: () => true,
    manifestWhy: "With no filter, every manifest is needed.",
    fileWhy: "…and every file. The tree can't help if the query really needs everything.",
  },
};

/* Partition transforms ------------------------------------------------------ */

export interface SampleRow {
  order_id: number;
  customer_id: number;
  order_ts: string; // UTC, "YYYY-MM-DD HH:MM"
  amount: number;
}

export const SAMPLE_ROWS: SampleRow[] = [
  { order_id: 1041, customer_id: 34, order_ts: "2026-09-23 22:58", amount: 240 },
  { order_id: 1042, customer_id: 7, order_ts: "2026-09-24 00:04", amount: 410 },
  { order_id: 1043, customer_id: 34, order_ts: "2026-09-24 09:31", amount: 180 },
  { order_id: 1044, customer_id: 1203, order_ts: "2026-09-24 09:47", amount: 95 },
  { order_id: 1045, customer_id: 88, order_ts: "2026-10-01 13:12", amount: 520 },
];

export type TransformId = "day" | "month" | "hour" | "bucket";

export const TRANSFORMS: Record<
  TransformId,
  { sql: string; source: keyof SampleRow; note: string }
> = {
  day: {
    sql: "days(order_ts)",
    source: "order_ts",
    note: "One partition per day. A common default for event data.",
  },
  month: {
    sql: "months(order_ts)",
    source: "order_ts",
    note: "Fewer, bigger partitions. Good when each day is small.",
  },
  hour: {
    sql: "hours(order_ts)",
    source: "order_ts",
    note: "Many small partitions. Only worth it for very high volumes.",
  },
  bucket: {
    sql: "bucket(8, customer_id)",
    source: "customer_id",
    note: "Hashes the value into 8 buckets, spreading customers evenly. Lets a lookup by customer_id skip 7 of 8 buckets.",
  },
};

export function applyTransform(t: TransformId, row: SampleRow): string {
  const ts = row.order_ts;
  switch (t) {
    case "day":
      return ts.slice(0, 10);
    case "month":
      return ts.slice(0, 7);
    case "hour":
      return `${ts.slice(0, 10)}-${ts.slice(11, 13)}`;
    case "bucket":
      return String(bucketLong(row.customer_id, 8));
  }
}

/**
 * Iceberg's bucket transform for int/long values:
 * (murmur3_x86_32(8-byte little-endian long) & Integer.MAX_VALUE) % N.
 * Spec test vector: hash(34L) = 2017239379.
 */
export function bucketLong(value: number, n: number): number {
  return (murmur3Long(value) & 0x7fffffff) % n;
}

export function murmur3Long(value: number): number {
  const lo = value | 0; // safe for the small ids we use
  const hi = value < 0 ? -1 : Math.floor(value / 2 ** 32) | 0;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  let h = 0;
  for (const k0 of [lo, hi]) {
    let k = Math.imul(k0, c1);
    k = (k << 15) | (k >>> 17);
    k = Math.imul(k, c2);
    h ^= k;
    h = (h << 13) | (h >>> 19);
    h = (Math.imul(h, 5) + 0xe6546b64) | 0;
  }
  h ^= 8;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h | 0;
}
