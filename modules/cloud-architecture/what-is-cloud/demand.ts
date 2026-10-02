/**
 * Made-up daily demand for three kinds of system over one year, in "servers needed".
 * Illustrative only: the shapes matter, not the numbers.
 */
export type Workload = "results" | "payroll" | "steady";

export const WORKLOADS: [Workload, string, string][] = [
  ["results", "Exam results portal", "Quiet all year, then a huge rush on results day."],
  ["payroll", "Payroll system", "Busy for a few days at the end of every month."],
  ["steady", "Internal records system", "Much the same load every working day."],
];

/** Deterministic small wobble, so the curves look lived-in without randomness. */
const wobble = (d: number) => 0.15 * Math.sin(d * 1.7) + 0.1 * Math.sin(d * 0.43);

export function demand(w: Workload): number[] {
  return Array.from({ length: 365 }, (_, d) => {
    const weekday = d % 7 < 5;
    if (w === "results") {
      const peak = Math.exp(-(((d - 150) / 2.2) ** 2)) * 18 + Math.exp(-(((d - 151) / 6) ** 2)) * 4;
      return Math.max(0.5, 1 + wobble(d) + peak);
    }
    if (w === "payroll") {
      const inMonth = d % 30;
      const rush = inMonth >= 27 ? 6 : 0;
      return Math.max(0.5, 1.5 + wobble(d) + rush);
    }
    return Math.max(0.5, (weekday ? 4 : 2) + wobble(d));
  });
}

/** Illustrative unit costs: renting a server for a day costs more than owning one, per day of use. */
export const OWN_PER_SERVER_DAY = 1; // purchase spread over its life, plus power, space and care
export const RENT_PER_SERVER_DAY = 2.5;
