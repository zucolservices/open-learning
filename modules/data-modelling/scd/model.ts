/** Asha moves from Pune to Mumbai on 1 July 2026, handled four ways. Made-up data. */

export type ScdType = 0 | 1 | 2 | 3;

export const PURCHASES = [
  { date: "2026-02-10", amount: 2000 },
  { date: "2026-05-22", amount: 3000 },
  { date: "2026-08-03", amount: 1000 },
  { date: "2026-11-15", amount: 2000 },
];
export const MOVE_DATE = "2026-07-01";

export interface View {
  head: string[];
  rows: (string | number)[][];
  report: [string, number][];
  reportNote: string;
  verdict: string;
  good: boolean;
}

export function view(t: ScdType, moved: boolean): View {
  const before = PURCHASES.filter((p) => p.date < MOVE_DATE).reduce((a, p) => a + p.amount, 0);
  const after = PURCHASES.filter((p) => p.date >= MOVE_DATE).reduce((a, p) => a + p.amount, 0);
  const total = before + after;
  if (!moved) {
    return {
      head: ["customer_key", "customer_id", "name", "city"],
      rows: [[101, "C-17", "Asha", "Pune"]],
      report: [["Pune", before]],
      reportNote: "Before the move: one row, one city.",
      verdict: "",
      good: true,
    };
  }
  switch (t) {
    case 0:
      return {
        head: ["customer_key", "customer_id", "name", "city (original)"],
        rows: [[101, "C-17", "Asha", "Pune"]],
        report: [["Pune", total]],
        reportNote: "All of 2026 is credited to Pune.",
        verdict:
          "Type 0, retain original: the value never changes. Right for things like original sign-up city; wrong if you need where she lives now.",
        good: false,
      };
    case 1:
      return {
        head: ["customer_key", "customer_id", "name", "city"],
        rows: [[101, "C-17", "Asha", "Mumbai"]],
        report: [["Mumbai", total]],
        reportNote: "Her February and May purchases now show up under Mumbai.",
        verdict:
          "Type 1, overwrite: always current, but history is destroyed. Last year's report changes when you re-run it.",
        good: false,
      };
    case 2:
      return {
        head: ["customer_key", "customer_id", "name", "city", "valid_from", "valid_to", "current"],
        rows: [
          [101, "C-17", "Asha", "Pune", "2025-03-01", "2026-07-01", "N"],
          [102, "C-17", "Asha", "Mumbai", "2026-07-01", "9999-12-31", "Y"],
        ],
        report: [
          ["Pune", before],
          ["Mumbai", after],
        ],
        reportNote: "Purchases before July point to key 101, later ones to 102.",
        verdict:
          "Type 2, add a row: full history. Each fact keeps the version in effect when it happened.",
        good: true,
      };
    case 3:
      return {
        head: ["customer_key", "customer_id", "name", "city", "previous_city"],
        rows: [[101, "C-17", "Asha", "Mumbai", "Pune"]],
        report: [["Mumbai (by city)", total]],
        reportNote:
          "Group by previous_city instead and all of 2026 goes to Pune: an 'alternate reality'.",
        verdict:
          "Type 3, add a column: current and one previous value side by side. Good for a one-off reorganisation; only one step of history.",
        good: false,
      };
  }
}

export const HYBRIDS: [string, string][] = [
  [
    "Type 4: mini-dimension",
    "Attributes that change often (age band, credit score band) split into a small separate dimension, with its own key on the fact.",
  ],
  [
    "Type 5",
    "Type 4, plus a current pointer to the mini-dimension kept in the main dimension (4 + 1 = 5).",
  ],
  [
    "Type 6",
    "A type 2 row that also carries the current value, overwritten on every version: 2 + 3 + 1 = 6.",
  ],
  [
    "Type 7",
    "The fact holds both the version's surrogate key (as it was) and the durable customer key (as it is now).",
  ],
];
