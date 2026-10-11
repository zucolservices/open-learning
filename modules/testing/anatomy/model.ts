/**
 * The code under test and the blocks a learner assembles into a test. The test really runs, against
 * the correct function or a broken one, using the track's in-browser runner.
 */

import { expect, runTests, type Outcome } from "../_shared/runner";

export interface Item {
  name: string;
  price: number;
  qty: number;
}

export type Impl = (items: Item[]) => number;

export const correct: Impl = (items) => items.reduce((sum, i) => sum + i.price * i.qty, 0);
/** The bug: quantity ignored. */
export const broken: Impl = (items) => items.reduce((sum, i) => sum + i.price, 0);

export const ARRANGE: { code: string; items: Item[] }[] = [
  {
    code: 'const basket = [{ name: "chai", price: 120, qty: 2 }];',
    items: [{ name: "chai", price: 120, qty: 2 }],
  },
  { code: "const basket = [];", items: [] },
];

export const ACT: { code: string; ok: boolean }[] = [
  { code: "const total = basketTotal(basket);", ok: true },
];

export const ASSERT: { code: string; check: ((total: number) => void) | null }[] = [
  { code: "expect(total).toBe(240);", check: (t) => expect(t).toBe(240) },
  { code: "expect(total).toBe(0);", check: (t) => expect(t).toBe(0) },
  { code: "console.log(total);", check: null },
];

export function runAssembled(a: number, s: number, impl: Impl): Outcome[] {
  return runTests(
    [
      {
        name: "basket total multiplies price by quantity",
        run: (f: Impl) => {
          const total = f(ARRANGE[a].items);
          ASSERT[s].check?.(total);
        },
      },
    ],
    impl,
  );
}

/** What the learner should take from their combination. */
export function verdict(a: number, s: number): { good: boolean; text: string } {
  if (ASSERT[s].check === null)
    return {
      good: false,
      text: "This test can never fail: it prints the total but checks nothing. Break the code and see.",
    };
  const right = (a === 0 && s === 0) || (a === 1 && s === 1);
  if (!right)
    return {
      good: false,
      text: "The test fails on correct code: the expected value doesn't match the arranged basket. The test itself is wrong.",
    };
  if (a === 1)
    return {
      good: false,
      text: "It passes, but an empty basket can't catch the quantity bug: 0 × anything is 0. Break the code and see.",
    };
  return {
    good: true,
    text: "A real test: it passes on correct code and fails on the bug. Try breaking the code.",
  };
}
