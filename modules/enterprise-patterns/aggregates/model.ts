/**
 * Two clerks add lines to the same order at once. The rule (invariant): an order's total may not
 * exceed the customer's approved limit of ₹10,000. Three designs, three outcomes. Illustrative.
 */

export type Design = "loose" | "noversion" | "versioned";

export const DESIGNS: Record<Design, string> = {
  loose: "Lines saved on their own",
  noversion: "Order aggregate, no version check",
  versioned: "Order aggregate with a version",
};

export interface Line {
  who: "A" | "B" | "";
  text: string;
  tone?: "good" | "bad";
}

export function run(d: Design): { lines: Line[]; total: number; ok: boolean; note: string } {
  const start: Line[] = [
    { who: "", text: "Order #1042: total ₹3,000, limit ₹10,000, version 1" },
    { who: "A", text: "loads the order (total ₹3,000, v1)" },
    { who: "B", text: "loads the order (total ₹3,000, v1)" },
    { who: "A", text: "adds a ₹4,000 line: ₹7,000 ≤ ₹10,000 ✓" },
    { who: "B", text: "adds a ₹5,000 line: ₹8,000 ≤ ₹10,000 ✓" },
  ];
  if (d === "loose")
    return {
      lines: [
        ...start,
        { who: "A", text: "saves its new line row" },
        { who: "B", text: "saves its new line row" },
        { who: "", text: "Order now has ₹12,000 of lines", tone: "bad" },
      ],
      total: 12000,
      ok: false,
      note: "Each line was saved separately, so nothing ever checked the whole order. Both clerks' checks passed on stale totals; the rule is broken.",
    };
  if (d === "noversion")
    return {
      lines: [
        ...start,
        { who: "A", text: "saves the order: total ₹7,000" },
        { who: "B", text: "saves the order: total ₹8,000, overwriting A's line", tone: "bad" },
        { who: "", text: "A's ₹4,000 line has silently vanished", tone: "bad" },
      ],
      total: 8000,
      ok: false,
      note: "The order is saved as a whole, but B's save replaced A's. A lost update: the customer is never charged for A's line.",
    };
  return {
    lines: [
      ...start,
      { who: "A", text: "saves: version still 1? yes → total ₹7,000, version 2", tone: "good" },
      { who: "B", text: "saves: version still 1? no, it's 2 → rejected", tone: "good" },
      { who: "B", text: "reloads (₹7,000, v2), tries ₹5,000: ₹12,000 > ₹10,000 ✗" },
      { who: "", text: "The rule holds: B is told the order is over its limit", tone: "good" },
    ],
    total: 7000,
    ok: true,
    note: "The whole order is one consistency boundary, and its version number makes a stale save fail. B retries with fresh data, and the rule is checked against the real total.",
  };
}
