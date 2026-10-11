/**
 * A made-up parcel-fee function, six mutants of it (one equivalent: it can never be killed), and a
 * library of tests. Every mutant really runs against the learner's chosen tests.
 */

import { expect, runTests, type Test } from "../_shared/runner";

type Fee = (kg: number, express: boolean) => number;

export const ORIGINAL = [
  "function fee(kg, express) {",
  '  if (kg <= 0) throw new Error("weight must be positive");',
  "  let f = kg <= 2 ? 40 : 40 + (kg - 2) * 15;",
  "  if (express) f = f * 2;",
  "  return f;",
  "}",
];

const make =
  (opts: {
    zero?: "<=" | "<";
    small?: "<=" | "<";
    minus?: boolean;
    express?: "cond" | "true" | "none";
    times?: boolean;
  }): Fee =>
  (kg, express) => {
    if (opts.zero === "<" ? kg < 0 : kg <= 0) throw new Error("weight must be positive");
    let f = (opts.small === "<" ? kg < 2 : kg <= 2)
      ? 40
      : 40 + (opts.minus === false ? kg + 2 : kg - 2) * 15;
    const ex = opts.express ?? "cond";
    if (ex !== "none" && (ex === "true" || express)) f = opts.times === false ? f + 2 : f * 2;
    return f;
  };

export const original = make({});

export const MUTANTS: {
  id: string;
  line: number;
  from: string;
  to: string;
  op: string;
  impl: Fee;
  equivalent?: boolean;
}[] = [
  { id: "m1", line: 2, from: "kg <= 0", to: "kg < 0", op: "Boundary", impl: make({ zero: "<" }) },
  {
    id: "m2",
    line: 3,
    from: "kg <= 2",
    to: "kg < 2",
    op: "Boundary",
    impl: make({ small: "<" }),
    equivalent: true,
  },
  {
    id: "m3",
    line: 3,
    from: "kg - 2",
    to: "kg + 2",
    op: "Arithmetic",
    impl: make({ minus: false }),
  },
  {
    id: "m4",
    line: 4,
    from: "if (express)",
    to: "if (true)",
    op: "Condition",
    impl: make({ express: "true" }),
  },
  { id: "m5", line: 4, from: "f * 2", to: "f + 2", op: "Arithmetic", impl: make({ times: false }) },
  {
    id: "m6",
    line: 4,
    from: "if (express) f = f * 2;",
    to: "(line removed)",
    op: "Statement deletion",
    impl: make({ express: "none" }),
  },
];

export const TESTS: (Test<Fee> & { id: string })[] = [
  { id: "t1", name: "1 kg standard costs ₹40", run: (f) => expect(f(1, false)).toBe(40) },
  { id: "t2", name: "5 kg standard costs ₹85", run: (f) => expect(f(5, false)).toBe(85) },
  { id: "t3", name: "1 kg express costs ₹80", run: (f) => expect(f(1, true)).toBe(80) },
  { id: "t4", name: "0 kg is refused", run: (f) => expect(() => f(0, false)).toThrow() },
  { id: "t5", name: "exactly 2 kg costs ₹40", run: (f) => expect(f(2, false)).toBe(40) },
];

export function killedBy(mutant: (typeof MUTANTS)[number], chosen: string[]): string[] {
  const tests = TESTS.filter((t) => chosen.includes(t.id));
  return runTests(tests, mutant.impl)
    .map((o, i) => (o.ok ? null : tests[i].id))
    .filter((x): x is string => x !== null);
}
