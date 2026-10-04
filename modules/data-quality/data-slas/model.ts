/** A month of weekday mornings: when the sales data was complete, against a deadline and an objective. */

/** Hour of day (local) when yesterday's orders were all in the dashboard, for 22 weekdays. Illustrative. */
export const READY = [
  6.4, 6.1, 6.6, 6.3, 7.2, 6.2, 6.5, 6.0, 11.6, 13.2, 9.4, 6.3, 6.7, 6.2, 8.4, 6.5, 6.1, 6.6, 7.6,
  6.3, 6.4, 6.2,
];

export const TARGETS = [90, 95, 99] as const;
export type Target = (typeof TARGETS)[number];

export function evaluate(deadline: number, target: Target) {
  const misses = READY.map((h) => h > deadline);
  const allowed = Math.floor(((100 - target) / 100) * READY.length + 1e-9);
  let used = 0;
  const budget = misses.map((m) => {
    if (m) used++;
    return allowed - used;
  });
  const missed = misses.filter(Boolean).length;
  const met = ((READY.length - missed) / READY.length) * 100;
  return { misses, allowed, budget, missed, met, ok: missed <= allowed };
}

export const fmt = (h: number) =>
  `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
