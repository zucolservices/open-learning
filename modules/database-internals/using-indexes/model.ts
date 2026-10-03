/** One million orders: which index serves which query? (illustrative page counts) */

export type Ix = "none" | "cust" | "custDate" | "dateCust" | "covering";

export const INDEXES: Record<Ix, { label: string; sql: string }> = {
  none: { label: "No index", sql: "-- only the primary key" },
  cust: { label: "(customer_id)", sql: "CREATE INDEX ON orders (customer_id);" },
  custDate: {
    label: "(customer_id, created_at)",
    sql: "CREATE INDEX ON orders (customer_id, created_at);",
  },
  dateCust: {
    label: "(created_at, customer_id)",
    sql: "CREATE INDEX ON orders (created_at, customer_id);",
  },
  covering: {
    label: "(customer_id, created_at) INCLUDE (amount)",
    sql: "CREATE INDEX ON orders (customer_id, created_at)\n  INCLUDE (amount);",
  },
};

export const QUERIES: { id: string; label: string; sql: string }[] = [
  {
    id: "latest",
    label: "A customer's 10 latest orders",
    sql: "WHERE customer_id = 42\nORDER BY created_at DESC LIMIT 10",
  },
  { id: "today", label: "Everything ordered today", sql: "WHERE created_at >= current_date" },
  {
    id: "delivered",
    label: "All delivered orders (90% of them)",
    sql: "WHERE status = 'delivered'",
  },
  {
    id: "amounts",
    label: "A customer's dates and amounts",
    sql: "SELECT created_at, amount\nWHERE customer_id = 42",
  },
];

const SEQ = 25000;

export function plan(ix: Ix, q: string): { plan: string; pages: number; good: boolean } {
  const seq = { plan: "Seq Scan", pages: SEQ, good: false };
  if (q === "delivered")
    return { plan: "Seq Scan (90% match: an index wouldn't help)", pages: SEQ, good: true };
  if (q === "latest") {
    if (ix === "custDate" || ix === "covering")
      return { plan: "Index Scan Backward: reads just 10 entries", pages: 13, good: true };
    if (ix === "cust")
      return {
        plan: "Index Scan, then Sort all ~100 of the customer's orders",
        pages: 104,
        good: false,
      };
    if (ix === "dateCust")
      return { plan: "Index Scan by date, filtering for customer 42", pages: 9000, good: false };
    return { plan: "Seq Scan, then Sort", pages: SEQ, good: false };
  }
  if (q === "today") {
    if (ix === "dateCust") return { plan: "Index Scan on a date range", pages: 60, good: true };
    if (ix === "custDate" || ix === "covering")
      return { plan: "Seq Scan: created_at isn't the leading column", pages: SEQ, good: false };
    return seq;
  }
  // amounts
  if (ix === "covering")
    return { plan: "Index Only Scan: the index has every column needed", pages: 4, good: true };
  if (ix === "cust" || ix === "custDate")
    return { plan: "Index Scan, then fetch each row from the table", pages: 103, good: false };
  if (ix === "dateCust")
    return { plan: "Seq Scan: customer_id isn't the leading column", pages: SEQ, good: false };
  return seq;
}
