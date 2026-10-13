/** Results day: requests per minute against capacity, with and without each technique. Illustrative numbers. */

export interface Tech {
  cache: boolean;
  light: boolean;
  queue: boolean;
  sms: boolean;
}

export const TECHS: [keyof Tech, string, string][] = [
  [
    "cache",
    "Pre-build and cache every result page",
    "Serve ready-made pages instead of querying the database each time.",
  ],
  [
    "light",
    "Strip the results page down",
    "No banners or heavy scripts on the busiest day of the year.",
  ],
  ["queue", "Add a fair waiting room", "Excess visitors wait their turn instead of seeing errors."],
  [
    "sms",
    "Send results by SMS to registered phones",
    "Many students never need to visit the site.",
  ],
];

const PEAK = 3_000_000;
const BASE = 100_000;
const CAPACITY = 200_000;

export function simulate(t: Tech) {
  const capacity = CAPACITY * (t.cache ? 10 : 1) * (t.light ? 2 : 1);
  let backlog = 0;
  let failed = 0;
  let total = 0;
  let maxWait = 0;
  const buckets = Array.from({ length: 12 }, (_, i) => {
    const minute = i * 5;
    const demand = Math.round((PEAK * Math.exp(-minute / 12) + BASE) * (t.sms ? 0.6 : 1));
    total += demand * 5;
    let served: number;
    if (t.queue) {
      const want = demand + backlog / 5;
      served = Math.min(want, capacity);
      backlog = Math.max(0, (want - capacity) * 5);
      maxWait = Math.max(maxWait, backlog / capacity);
    } else {
      served = Math.min(demand, capacity);
      failed += Math.max(0, demand - capacity) * 5;
    }
    return { minute, demand, served };
  });
  return { buckets, capacity, failedShare: failed / total, maxWait: Math.round(maxWait) };
}
