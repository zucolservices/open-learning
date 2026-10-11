/**
 * A made-up café's delivery-fee rules, the spec a learner tests against, and a buggy implementation
 * with an off-by-one at the free-delivery boundary. Partitions and boundaries are derived from the
 * spec, the way equivalence partitioning and boundary value analysis work.
 */

/** The rules as written: what the fee should be. null means "we don't deliver that far". */
export function spec(km: number, subtotal: number): number | null {
  if (km > 8) return null;
  if (subtotal >= 500) return 0;
  if (km <= 3) return 30;
  return 30 + 10 * Math.ceil(km - 3);
}

/** The code as written: free delivery uses > instead of >=. */
export function impl(km: number, subtotal: number): number | null {
  if (km > 8) return null;
  if (subtotal > 500) return 0;
  if (km <= 3) return 30;
  return 30 + 10 * Math.ceil(km - 3);
}

export interface Partition {
  id: string;
  label: string;
  axis: "km" | "subtotal";
  has(km: number, subtotal: number): boolean;
}

export const PARTITIONS: Partition[] = [
  { id: "near", label: "Up to 3 km", axis: "km", has: (k) => k <= 3 },
  { id: "mid", label: "3–8 km", axis: "km", has: (k) => k > 3 && k <= 8 },
  { id: "far", label: "Over 8 km", axis: "km", has: (k) => k > 8 },
  { id: "paid", label: "Under ₹500", axis: "subtotal", has: (_, s) => s < 500 },
  { id: "free", label: "₹500 or more", axis: "subtotal", has: (_, s) => s >= 500 },
];

export interface Boundary {
  id: string;
  label: string;
  /** The values on each side of the edge. */
  values: [number, number];
  axis: "km" | "subtotal";
}

export const BOUNDARIES: Boundary[] = [
  { id: "b3", label: "3 / 3.5 km", values: [3, 3.5], axis: "km" },
  { id: "b8", label: "8 / 8.5 km", values: [8, 8.5], axis: "km" },
  { id: "b500", label: "₹490 / ₹500", values: [490, 500], axis: "subtotal" },
];

export function boundaryHits(tests: [number, number][], b: Boundary): number {
  const vals = tests.map(([k, s]) => (b.axis === "km" ? k : s));
  return b.values.filter((v) => vals.includes(v)).length;
}

export const fmtFee = (v: number | null) => (v === null ? "no delivery" : `₹${v}`);
