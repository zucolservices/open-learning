/** 10 customers × 6 months of records, split three ways. Scores are illustrative. */

export const CUSTOMERS = 10;
export const MONTHS = 6;
export const REAL = 0.71; // how well the model really does on new customers next month

export type Split = "random" | "group" | "time";

function rnd(i: number) {
  const x = Math.sin(i * 91.3 + 7.1) * 43758.5453;
  return x - Math.floor(x);
}

/** true = test row */
export function assign(split: Split): boolean[][] {
  return Array.from({ length: CUSTOMERS }, (_, c) =>
    Array.from({ length: MONTHS }, (_, m) => {
      if (split === "random") return rnd(c * MONTHS + m) < 0.25;
      if (split === "group") return c >= 8;
      return m === MONTHS - 1 && c >= 0; // last month is the test
    }),
  );
}

export function evaluate(split: Split) {
  const a = assign(split);
  let test = 0;
  let sameCustomer = 0;
  let future = 0;
  for (let c = 0; c < CUSTOMERS; c++)
    for (let m = 0; m < MONTHS; m++) {
      if (!a[c][m]) continue;
      test++;
      if (a[c].some((t, mm) => !t && mm !== m)) sameCustomer++;
      if (a.some((row) => row.some((t, mm) => !t && mm > m))) future++;
    }
  const leakCustomer = sameCustomer / test;
  const leakFuture = future / test;
  // Time split still has the same customers, but only from the past: a small, realistic optimism.
  const measured = Math.min(
    0.97,
    REAL + 0.16 * leakCustomer * (split === "time" ? 0.15 : 1) + 0.07 * leakFuture,
  );
  return { test, leakCustomer, leakFuture, measured };
}

/** Fold index for each of n chunks in k-fold cross-validation. */
export const folds = (k: number) => Array.from({ length: k }, (_, i) => i);
