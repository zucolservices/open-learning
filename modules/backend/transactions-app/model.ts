/** Two made-up customers buying the last masala chai at the same moment, under four strategies. */

export type Mode = "none" | "atomic" | "lock" | "optimistic";

export const MODES: { id: Mode; label: string }[] = [
  { id: "none", label: "No protection" },
  { id: "atomic", label: "Conditional update" },
  { id: "lock", label: "Lock the row" },
  { id: "optimistic", label: "Version check" },
];

export interface Row {
  who: "Asha" | "Ravi";
  sql: string;
  stock: number;
  note?: string;
}

export const TIMELINES: Record<
  Mode,
  { rows: Row[]; orders: number; verdict: string; ok: boolean }
> = {
  none: {
    rows: [
      { who: "Asha", sql: "SELECT stock FROM items WHERE id='chai'  → 1", stock: 1 },
      { who: "Ravi", sql: "SELECT stock FROM items WHERE id='chai'  → 1", stock: 1 },
      { who: "Asha", sql: "UPDATE items SET stock = 0; INSERT order #1", stock: 0 },
      {
        who: "Ravi",
        sql: "UPDATE items SET stock = 0; INSERT order #2",
        stock: 0,
        note: "Both saw 1 in stock.",
      },
    ],
    orders: 2,
    verdict:
      "Two orders for one chai: oversold. Each request checked, then wrote, and they overlapped.",
    ok: false,
  },
  atomic: {
    rows: [
      {
        who: "Asha",
        sql: "UPDATE items SET stock = stock - 1 WHERE id='chai' AND stock >= 1  → 1 row",
        stock: 0,
      },
      { who: "Asha", sql: "INSERT order #1", stock: 0 },
      {
        who: "Ravi",
        sql: "UPDATE items SET stock = stock - 1 WHERE id='chai' AND stock >= 1  → 0 rows",
        stock: 0,
        note: "The check and the change happen in one statement.",
      },
    ],
    orders: 1,
    verdict:
      "One order; Ravi is told it's sold out. Simplest fix when the rule fits in one statement.",
    ok: true,
  },
  lock: {
    rows: [
      { who: "Asha", sql: "SELECT stock … FOR UPDATE  → 1 (row locked)", stock: 1 },
      { who: "Ravi", sql: "SELECT stock … FOR UPDATE  → waits…", stock: 1 },
      { who: "Asha", sql: "UPDATE stock = 0; INSERT order #1; COMMIT", stock: 0 },
      {
        who: "Ravi",
        sql: "(lock released)  → 0: sold out",
        stock: 0,
        note: "Pessimistic: the second buyer waits their turn.",
      },
    ],
    orders: 1,
    verdict: "One order. Good when conflicts are common; keep the lock short.",
    ok: true,
  },
  optimistic: {
    rows: [
      { who: "Asha", sql: "SELECT stock, version  → 1, v7", stock: 1 },
      { who: "Ravi", sql: "SELECT stock, version  → 1, v7", stock: 1 },
      {
        who: "Asha",
        sql: "UPDATE … SET stock=0, version=8 WHERE version=7  → 1 row; order #1",
        stock: 0,
      },
      {
        who: "Ravi",
        sql: "UPDATE … WHERE version=7  → 0 rows: retry → stock 0: sold out",
        stock: 0,
        note: "Optimistic: no waiting; detect the clash and retry.",
      },
    ],
    orders: 1,
    verdict:
      "One order. Good when clashes are rare; JPA @Version and EF Core concurrency tokens do this for you.",
    ok: true,
  },
};
