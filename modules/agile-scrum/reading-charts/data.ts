/**
 * Data for the four charts. The burndown and burnup are illustrative; the cumulative flow diagram
 * and cycle-time scatterplot come from the Kanban board simulation in the previous module
 * (`../kanban-wip/model`), so they behave like a real system.
 */
import { DAYS, simulate } from "../kanban-wip/model";

/** A 10-day Sprint of 40 points where work is closed in a rush at the end. */
export const BURNDOWN = { total: 40, remaining: [40, 40, 39, 39, 38, 38, 37, 34, 22, 8, 3] };

/** A release over 12 weeks: done grows steadily while the scope line steps up. */
export const BURNUP = {
  done: [0, 8, 15, 24, 31, 40, 47, 55, 62, 70, 78, 85, 93],
  scope: [100, 100, 100, 100, 115, 115, 115, 130, 130, 130, 140, 140, 140],
};

function cfdFrom(dev: number, test: number) {
  const r = simulate(dev, test);
  const days = Array.from({ length: DAYS }, (_, d) => d);
  const count = (f: (i: (typeof r.items)[number]) => number | undefined) =>
    days.map((d) => r.items.filter((i) => (f(i) ?? Infinity) <= d).length);
  return {
    arrived: count((i) => i.arrive),
    started: count((i) => i.start),
    tested: count((i) => i.testStart),
    done: count((i) => i.finish),
    result: r,
  };
}

/** No WIP limits: work piles up in Develop and little reaches Done. */
export const CFD = cfdFrom(99, 99);

/** Finished items from a healthier board, for the scatterplot. */
const healthy = simulate(5, 2);
export const SCATTER = healthy.items
  .filter((i) => i.finish !== undefined)
  .map((i) => ({ day: i.finish!, cycle: i.finish! - i.start! + 1 }));

export function percentile(values: number[], p: number) {
  const s = [...values].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.ceil((p / 100) * s.length) - 1)];
}
