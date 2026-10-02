/** A tiny continuous-query simulator: feed orders in one at a time and track the result and its changelog. */
import type { Query } from "./state";

export interface Order {
  ts: number; // minute
  customer: string;
  city: string;
  amount: number;
}

export const ORDERS: Order[] = [
  { ts: 1, customer: "asha", city: "Pune", amount: 450 },
  { ts: 2, customer: "ravi", city: "Delhi", amount: 1800 },
  { ts: 3, customer: "asha", city: "Pune", amount: 1200 },
  { ts: 4, customer: "meera", city: "Chennai", amount: 300 },
  { ts: 6, customer: "ravi", city: "Delhi", amount: 2500 },
  { ts: 7, customer: "asha", city: "Mumbai", amount: 90 },
  { ts: 8, customer: "kiran", city: "Pune", amount: 5200 },
  { ts: 11, customer: "meera", city: "Chennai", amount: 1500 },
];

export const SQL: Record<Query, string> = {
  count: "SELECT customer, COUNT(*) AS orders\nFROM orders\nGROUP BY customer;",
  sum: "SELECT city, SUM(amount) AS total\nFROM orders\nGROUP BY city;",
  filter: "SELECT ts, customer, amount\nFROM orders\nWHERE amount > 1000;",
  window:
    "SELECT window_start, COUNT(*) AS orders\nFROM TABLE(TUMBLE(TABLE orders,\n  DESCRIPTOR(ts), INTERVAL '5' MINUTES))\nGROUP BY window_start, window_end;",
};

export type Kind = "+I" | "-U" | "+U" | "-D";
export interface Change {
  kind: Kind;
  row: string;
  key: string;
}

/** Returns the current result rows (key → value) and the changelog produced by the first n orders. */
export function run(q: Query, n: number): { result: [string, string][]; log: Change[] } {
  const log: Change[] = [];
  const res = new Map<string, string>();
  const seen = ORDERS.slice(0, n);
  if (q === "filter") {
    for (const o of seen) {
      if (o.amount > 1000) {
        const row = `${o.ts} · ${o.customer} · ₹${o.amount}`;
        res.set(`${o.ts}`, row);
        log.push({ kind: "+I", row, key: `${o.ts}` });
      }
    }
    return { result: [...res.entries()], log };
  }
  if (q === "window") {
    const counts = new Map<number, number>();
    const emitted = new Set<number>();
    for (const o of seen) {
      const w = Math.floor(o.ts / 5) * 5;
      counts.set(w, (counts.get(w) ?? 0) + 1);
      // A window is final once an order arrives past its end (a simple stand-in for the watermark).
      for (const [ws, c] of counts) {
        if (!emitted.has(ws) && o.ts >= ws + 5) {
          emitted.add(ws);
          const row = `${String(ws).padStart(2, "0")}–${String(ws + 5).padStart(2, "0")} min: ${c}`;
          res.set(`${ws}`, row);
          log.push({ kind: "+I", row, key: `${ws}` });
        }
      }
    }
    return { result: [...res.entries()], log };
  }
  const agg = new Map<string, number>();
  for (const o of seen) {
    const key = q === "count" ? o.customer : o.city;
    const before = agg.get(key);
    const after = (before ?? 0) + (q === "count" ? 1 : o.amount);
    const fmt = (v: number) =>
      q === "count" ? `${key} · ${v}` : `${key} · ₹${v.toLocaleString("en-IN")}`;
    if (before === undefined) log.push({ kind: "+I", row: fmt(after), key });
    else {
      log.push({ kind: "-U", row: fmt(before), key });
      log.push({ kind: "+U", row: fmt(after), key });
    }
    agg.set(key, after);
    res.set(key, fmt(after));
  }
  return { result: [...res.entries()], log };
}
