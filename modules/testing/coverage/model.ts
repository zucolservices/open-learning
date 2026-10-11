/**
 * A made-up discount function with a bug that only shows on paths a single test never takes.
 * Coverage is worked out from the inputs each chosen test uses; the tests themselves really run.
 */

import { expect, runTests, type Outcome, type Test } from "../_shared/runner";

export const CODE: { n: number; text: string; stmt: boolean }[] = [
  { n: 1, text: "function discount(total, member) {", stmt: false },
  { n: 2, text: "  let d;", stmt: true },
  { n: 3, text: "  if (member) {", stmt: true },
  { n: 4, text: "    d = total * 0.1;", stmt: true },
  { n: 5, text: "  }", stmt: false },
  { n: 6, text: "  if (total > 1000) {", stmt: true },
  { n: 7, text: "    d = d + 50;", stmt: true },
  { n: 8, text: "  }", stmt: false },
  { n: 9, text: "  return Math.min(d, 200);", stmt: true },
  { n: 10, text: "}", stmt: false },
];

type Impl = (total: number, member: boolean) => number;

export const buggy: Impl = (total, member) => {
  let d: number | undefined;
  if (member) d = total * 0.1;
  if (total > 1000) d = (d as number) + 50;
  return Math.min(d as number, 200);
};
export const fixed: Impl = (total, member) => {
  let d = 0;
  if (member) d = total * 0.1;
  if (total > 1000) d = d + 50;
  return Math.min(d, 200);
};

export interface Case {
  id: string;
  total: number;
  member: boolean;
  expected: number | null;
  label: string;
}

/** The rule: members get 10%, orders over ₹1,000 get ₹50 more, capped at ₹200. */
export const CASES: Case[] = [
  { id: "a", total: 2000, member: true, expected: 200, label: "member, ₹2,000 → ₹200 (capped)" },
  { id: "b", total: 500, member: true, expected: 50, label: "member, ₹500 → ₹50" },
  { id: "c", total: 2000, member: false, expected: 50, label: "non-member, ₹2,000 → ₹50" },
  { id: "d", total: 500, member: false, expected: 0, label: "non-member, ₹500 → ₹0" },
  {
    id: "e",
    total: 2000,
    member: true,
    expected: null,
    label: "calls discount(2000, true), asserts nothing",
  },
];

export function linesHit(cases: Case[]): Set<number> {
  const hit = new Set<number>();
  for (const c of cases) {
    [2, 3, 6, 9].forEach((n) => hit.add(n));
    if (c.member) hit.add(4);
    if (c.total > 1000) hit.add(7);
  }
  return hit;
}

export function branchesHit(cases: Case[]): Set<string> {
  const b = new Set<string>();
  for (const c of cases) {
    b.add(c.member ? "3T" : "3F");
    b.add(c.total > 1000 ? "6T" : "6F");
  }
  return b;
}

export const STATEMENT_LINES = CODE.filter((l) => l.stmt).map((l) => l.n);

export function runCases(cases: Case[], impl: Impl): Outcome[] {
  const tests: Test<Impl>[] = cases.map((c) => ({
    name: c.label,
    run: (f) => {
      const v = f(c.total, c.member);
      if (c.expected !== null) expect(v).toBe(c.expected);
    },
  }));
  return runTests(tests, impl);
}
