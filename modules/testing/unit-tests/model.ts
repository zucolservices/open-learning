/**
 * A café bill calculator, five broken or refactored versions of it, and a library of candidate
 * unit tests. The learner builds a suite and runs it against each version, for real, in the browser.
 */

import { expect, type Test } from "../_shared/runner";

export interface Item {
  price: number;
  qty: number;
}
export interface Opts {
  student?: boolean;
  tip?: number;
}

export interface Impl {
  bill(items: Item[], opts?: Opts): number;
  /** How many times the internal rounding helper ran: an implementation detail. */
  helperCalls(): number;
}

export type Variant = "correct" | "refactor" | "noQty" | "doubleStudent" | "tipFirst" | "noRound";

function make(v: Variant): Impl {
  let calls = 0;
  const round2 = (x: number) => {
    calls++;
    return Math.round(x * 100) / 100;
  };
  return {
    helperCalls: () => calls,
    bill(items, opts = {}) {
      calls = 0;
      let sub = items.reduce((s, i) => s + i.price * (v === "noQty" ? 1 : i.qty), 0);
      const before = sub;
      if (opts.student) sub = sub * 0.9;
      if (opts.student && v === "doubleStudent") sub = sub * 0.9;
      const tip = ((v === "tipFirst" ? before : sub) * (opts.tip ?? 0)) / 100;
      const total = sub + tip;
      if (v === "noRound") return total;
      if (v === "refactor") return Math.round(total * 100) / 100;
      return round2(total);
    },
  };
}

export const VARIANTS: { id: Variant; label: string; kind: "ok" | "refactor" | "bug" }[] = [
  { id: "correct", label: "Correct", kind: "ok" },
  { id: "refactor", label: "Refactored (same behaviour)", kind: "refactor" },
  { id: "noQty", label: "Bug: ignores quantity", kind: "bug" },
  { id: "doubleStudent", label: "Bug: student discount twice", kind: "bug" },
  { id: "tipFirst", label: "Bug: tip before discount", kind: "bug" },
  { id: "noRound", label: "Bug: no rounding", kind: "bug" },
];

export const impl = (v: Variant) => make(v);

export const TESTS: (Test<Impl> & { id: string; note: string })[] = [
  {
    id: "qty",
    name: "two chais cost ₹240",
    code: "expect(bill([{ price: 120, qty: 2 }])).toBe(240)",
    note: "Checks quantity.",
    run: (f) => expect(f.bill([{ price: 120, qty: 2 }])).toBe(240),
  },
  {
    id: "one",
    name: "one chai costs ₹120",
    code: "expect(bill([{ price: 120, qty: 1 }])).toBe(120)",
    note: "With a quantity of 1, a quantity bug is invisible.",
    run: (f) => expect(f.bill([{ price: 120, qty: 1 }])).toBe(120),
  },
  {
    id: "student",
    name: "students pay 90%",
    code: "expect(bill([{ price: 120, qty: 1 }], { student: true })).toBe(108)",
    note: "Checks the discount.",
    run: (f) => expect(f.bill([{ price: 120, qty: 1 }], { student: true })).toBe(108),
  },
  {
    id: "tip",
    name: "tip is worked out after the discount",
    code: "expect(bill([{ price: 120, qty: 1 }], { student: true, tip: 10 })).toBe(118.8)",
    note: "Checks the order of steps.",
    run: (f) => expect(f.bill([{ price: 120, qty: 1 }], { student: true, tip: 10 })).toBe(118.8),
  },
  {
    id: "round",
    name: "totals are rounded to the paisa",
    code: "expect(bill([{ price: 33.33, qty: 1 }], { tip: 10 })).toBe(36.66)",
    note: "Checks rounding.",
    run: (f) => expect(f.bill([{ price: 33.33, qty: 1 }], { tip: 10 })).toBe(36.66),
  },
  {
    id: "empty",
    name: "an empty basket costs ₹0",
    code: "expect(bill([])).toBe(0)",
    note: "A useful edge case, though none of today's bugs live there.",
    run: (f) => expect(f.bill([])).toBe(0),
  },
  {
    id: "type",
    name: "bill returns a number",
    code: 'expect(typeof bill([{ price: 120, qty: 2 }])).toBe("number")',
    note: "Too weak: almost any bug still returns a number.",
    run: (f) => expect(typeof f.bill([{ price: 120, qty: 2 }])).toBe("number"),
  },
  {
    id: "helper",
    name: "calls the rounding helper exactly once",
    code: "bill([...]); expect(round2Spy.calls).toBe(1)",
    note: "Tests how the code works, not what it does. A harmless refactor breaks it.",
    run: (f) => {
      f.bill([{ price: 120, qty: 1 }]);
      expect(f.helperCalls()).toBe(1);
    },
  },
];
