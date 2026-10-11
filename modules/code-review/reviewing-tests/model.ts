/**
 * A delivery-fee function, four tests from a pull request, and three broken versions of the code
 * ("mutants"). Weak tests pass against every mutant; fixed tests catch them. Prices are made up.
 */

export type Impl = "real" | "boundary" | "distance" | "zero";

export const IMPLS: { id: Impl; label: string; bug: string }[] = [
  { id: "real", label: "Real code", bug: "The code as written." },
  { id: "boundary", label: "Mutant 1", bug: "Free delivery starts above ₹500 instead of at ₹500." },
  { id: "distance", label: "Mutant 2", bug: "The per-kilometre charge is dropped." },
  { id: "zero", label: "Mutant 3", bug: "Every delivery is free." },
];

/** Fee in paise: free from ₹500; otherwise ₹40 plus ₹10 per km beyond 3 km. */
export function fee(totalPaise: number, km: number, impl: Impl): number {
  if (impl === "zero") return 0;
  const free = impl === "boundary" ? totalPaise > 50000 : totalPaise >= 50000;
  if (free) return 0;
  if (impl === "distance") return 4000;
  return 4000 + Math.max(0, km - 3) * 1000;
}

export interface TestCase {
  id: string;
  weak?: { name: string; code: string[]; why: string; run(impl: Impl): boolean };
  fixed: { name: string; code: string[]; run(impl: Impl): boolean };
}

export const TESTS: TestCase[] = [
  {
    id: "a",
    weak: {
      name: "returns a number",
      code: ["const f = fee(30000, 2);", "expect(typeof f).toBe('number');"],
      why: "Any number passes, including a wrong one. It checks the type, not the behaviour.",
      run: (i) => typeof fee(30000, 2, i) === "number",
    },
    fixed: {
      name: "charges ₹40 for a small nearby order",
      code: ["expect(fee(30000, 2)).toBe(4000);"],
      run: (i) => fee(30000, 2, i) === 4000,
    },
  },
  {
    id: "b",
    fixed: {
      name: "is free for a ₹600 order",
      code: ["expect(fee(60000, 2)).toBe(0);"],
      run: (i) => fee(60000, 2, i) === 0,
    },
  },
  {
    id: "c",
    weak: {
      name: "charges for distance",
      code: ["const calc = stub({ fee: () => 5000 });", "expect(calc.fee(30000, 5)).toBe(5000);"],
      why: "It calls the stub, not the real function, so it only proves the stub returns what it was told to.",
      run: () => true,
    },
    fixed: {
      name: "adds ₹10 per km beyond 3 km",
      code: ["expect(fee(30000, 5)).toBe(6000);"],
      run: (i) => fee(30000, 5, i) === 6000,
    },
  },
  {
    id: "d",
    weak: {
      name: "handles the ₹500 boundary",
      code: ["const f = fee(50000, 2);", "expect(f).toBeDefined();"],
      why: "It visits the boundary but never says what should happen there.",
      run: (i) => fee(50000, 2, i) !== undefined,
    },
    fixed: {
      name: "is free at exactly ₹500",
      code: ["expect(fee(50000, 2)).toBe(0);"],
      run: (i) => fee(50000, 2, i) === 0,
    },
  },
];
