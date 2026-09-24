/**
 * DuckDB-WASM, loaded on demand from jsDelivr (the wasm files are ~34 MB, too big to self-host on
 * many static hosts). Only this module imports it, so it stays out of every other bundle.
 */
import type { AsyncDuckDB, AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

export const ROWS = 1_000_000;
export const ROW_GROUP = 100_000;
export const FILES = ["orders_sorted.parquet", "orders_random.parquet"] as const;

export interface Duck {
  db: AsyncDuckDB;
  conn: AsyncDuckDBConnection;
  version: string;
  sizes: Record<string, number>;
}

/** Deterministic fake Brewline orders: one year, sorted by date in one file, shuffled in the other. */
const SETUP = `
CREATE TABLE orders AS
SELECT
  i AS order_id,
  DATE '2026-01-01' + CAST(i * 365 // ${ROWS} AS INTEGER) AS order_date,
  (['Bengaluru','Mumbai','Delhi','Pune','Chennai','Hyderabad','Kolkata','Kochi'])[CAST(1 + hash(i) % 8 AS INTEGER)] AS city,
  CAST(1 + hash(i * 7) % 50000 AS INTEGER) AS customer_id,
  ROUND(50 + (hash(i * 13) % 150000) / 100.0, 2) AS amount,
  (['upi','card','wallet','cash'])[CAST(1 + hash(i * 17) % 4 AS INTEGER)] AS payment,
  (['android','ios','web'])[CAST(1 + hash(i * 19) % 3 AS INTEGER)] AS device,
  'order ' || i || ': ' || repeat(chr(CAST(97 + hash(i * 23) % 26 AS INTEGER)), CAST(40 + hash(i * 29) % 80 AS INTEGER)) AS notes
FROM range(${ROWS}) t(i);
COPY (SELECT * FROM orders ORDER BY order_date, order_id) TO 'orders_sorted.parquet' (FORMAT parquet, ROW_GROUP_SIZE ${ROW_GROUP});
COPY (SELECT * FROM orders ORDER BY hash(order_id * 31)) TO 'orders_random.parquet' (FORMAT parquet, ROW_GROUP_SIZE ${ROW_GROUP});
DROP TABLE orders;
`;

let pending: Promise<Duck> | null = null;

export function getDuck(): Promise<Duck> {
  if (!pending) {
    pending = boot().catch((e) => {
      pending = null; // allow a retry
      throw e;
    });
  }
  return pending;
}

async function boot(): Promise<Duck> {
  const duckdb = await import("@duckdb/duckdb-wasm");
  const bundle = await duckdb.selectBundle(duckdb.getJsDelivrBundles());
  const workerUrl = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker!}");`], { type: "text/javascript" }),
  );
  const worker = new Worker(workerUrl);
  const db = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(workerUrl);
  const conn = await db.connect();
  await conn.query(SETUP);
  const sizes: Record<string, number> = {};
  for (const f of FILES) sizes[f] = (await db.copyFileToBuffer(f)).byteLength;
  const version = String((await conn.query("SELECT version() AS v")).toArray()[0].toJSON().v);
  return { db, conn, version, sizes };
}

export interface QueryResult {
  columns: string[];
  rows: string[][];
  total: number;
  ms: number;
}

function cell(v: unknown, type: string): string {
  if (v === null || v === undefined) return "NULL";
  if (type.startsWith("Date") && typeof v === "number")
    return new Date(v).toISOString().slice(0, 10);
  if (type.startsWith("Timestamp") && typeof v === "number")
    return new Date(v).toISOString().replace("T", " ").slice(0, 19);
  if (typeof v === "bigint") return v.toString();
  if (typeof v === "number")
    return Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100);
  if (typeof v === "object")
    return JSON.stringify(v, (_, x) => (typeof x === "bigint" ? x.toString() : x));
  return String(v);
}

export async function run(sql: string, limit = 200): Promise<QueryResult> {
  const { conn } = await getDuck();
  const t0 = performance.now();
  const table = await conn.query(sql);
  const ms = performance.now() - t0;
  const fields = table.schema.fields;
  const rows: string[][] = [];
  const n = Math.min(table.numRows, limit);
  for (let i = 0; i < n; i++) {
    const r = table.get(i);
    rows.push(fields.map((f) => cell(r?.[f.name as keyof typeof r], String(f.type))));
  }
  return { columns: fields.map((f) => f.name), rows, total: table.numRows, ms };
}

export function fmtMB(bytes: number) {
  return `${(bytes / 1e6).toFixed(1)} MB`;
}
