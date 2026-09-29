/**
 * DuckDB-WASM, loaded on demand from jsDelivr, holding the made-up Kalpanagar applications table.
 * Only this module imports it, so it stays out of every other bundle.
 */
import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import data from "./data.json";

const lit = (v: unknown) =>
  v === null ? "NULL" : typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`;

const SETUP = `
CREATE TABLE applications (id TEXT, service TEXT, ward INTEGER, applied_on DATE, status TEXT, decided_on DATE, days_taken INTEGER);
INSERT INTO applications VALUES ${data.rows.map((r) => `(${r.map(lit).join(",")})`).join(",")};
`;

let pending: Promise<AsyncDuckDBConnection> | null = null;

function getConn() {
  if (!pending) {
    pending = boot().catch((e) => {
      pending = null; // allow a retry
      throw e;
    });
  }
  return pending;
}

async function boot() {
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
  return conn;
}

export interface Result {
  cols: string[];
  rows: string[][];
  total: number;
}

function cell(v: unknown, type: string): string {
  if (v === null || v === undefined) return "NULL";
  if (type.startsWith("Date") && typeof v === "number")
    return new Date(v).toISOString().slice(0, 10);
  if (typeof v === "bigint") return v.toString();
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : String(v);
  return String(v);
}

export async function run(sql: string, limit = 20): Promise<Result> {
  const conn = await getConn();
  const table = await conn.query(sql);
  const fields = table.schema.fields;
  const rows: string[][] = [];
  for (let i = 0; i < Math.min(table.numRows, limit); i++) {
    const r = table.get(i);
    rows.push(fields.map((f) => cell(r?.[f.name as keyof typeof r], String(f.type))));
  }
  return { cols: fields.map((f) => f.name), rows, total: table.numRows };
}
