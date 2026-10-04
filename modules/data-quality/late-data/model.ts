/** A week of orders that arrive late, loaded three ways. Days are 1–7; the job runs early each morning for earlier days. Illustrative. */

export interface Event {
  id: number;
  day: number;
  arrives: number;
  amount: number;
}

const DELAYS = [0, 0, 0, 1, 0, 2, 0, 1, 4, 0, 0, 1, 0, 3, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 5, 0, 0, 0];
export const EVENTS: Event[] = DELAYS.map((d, i) => {
  const day = 1 + Math.floor(i / 4);
  return { id: i, day, arrives: day + d, amount: 100 + ((i * 37) % 90) };
});

export const DAYS = [1, 2, 3, 4, 5, 6, 7];
/** The job runs on the morning of day r, seeing everything that arrived up to the end of day r − 1. */
export const RUNS = [2, 3, 4, 5, 6, 7, 8];

export type Strategy = "append" | "yesterday" | "lookback";

export function load(strategy: Strategy, lookback: number, retryDay: number | null) {
  let table: Event[] = [];
  for (const r of RUNS) {
    const times = r === retryDay ? 2 : 1;
    for (let t = 0; t < times; t++) {
      if (strategy === "append") {
        table = [...table, ...EVENTS.filter((e) => e.arrives === r - 1)];
      } else {
        const from = strategy === "yesterday" ? r - 1 : r - lookback;
        const window = (e: Event) => e.day >= from && e.day <= r - 1;
        table = [
          ...table.filter((e) => !window(e)),
          ...EVENTS.filter((e) => window(e) && e.arrives <= r - 1),
        ];
      }
    }
  }
  return DAYS.map((d) => {
    const truth = EVENTS.filter((e) => e.day === d && e.arrives <= 7).reduce(
      (a, e) => a + e.amount,
      0,
    );
    const got = table.filter((e) => e.day === d).reduce((a, e) => a + e.amount, 0);
    return { day: d, truth, got };
  });
}

export const NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
