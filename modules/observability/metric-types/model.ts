/**
 * A tiny metrics simulator (illustrative). Each tick is one second of traffic to one server:
 * requests arrive, take some time, and update a counter, a gauge and a histogram.
 */

export const BUCKETS = [0.1, 0.25, 0.5, 1, Infinity];

export interface MetricsState {
  t: number;
  /** http_requests_total since the process started. */
  counter: number;
  /** in_flight_requests right now. */
  gauge: number;
  /** Cumulative bucket counts (le=0.1, 0.25, 0.5, 1, +Inf). */
  buckets: number[];
  /** History for the charts: counter value and gauge value per second. */
  history: { counter: number; gauge: number }[];
}

export const start = (): MetricsState => ({
  t: 0,
  counter: 0,
  gauge: 0,
  buckets: BUCKETS.map(() => 0),
  history: [],
});

function noise(t: number, k: number) {
  const x = Math.sin(t * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Advance one second at `rps` requests per second; `slow` makes the server sluggish. */
export function tick(s: MetricsState, rps: number, slow: boolean): MetricsState {
  const t = s.t + 1;
  const arrivals = Math.max(0, Math.round(rps * (0.8 + noise(t, 1) * 0.4)));
  const buckets = [...s.buckets];
  for (let i = 0; i < arrivals; i++) {
    // Duration: mostly fast, with a tail; slower overall when the server struggles.
    const u = noise(t, i + 2);
    const d = (slow ? 0.3 : 0.05) + (u > 0.95 ? 1.2 : u * (slow ? 0.6 : 0.2));
    BUCKETS.forEach((b, k) => {
      if (d <= b) buckets[k] += 1;
    });
  }
  const counter = s.counter + arrivals;
  // Little's law: requests in flight ≈ arrival rate × average time in the system.
  const gauge = Math.round(arrivals * (slow ? 0.6 : 0.15) + noise(t, 99) * 2);
  const history = [...s.history, { counter, gauge }].slice(-40);
  return { t, counter, gauge, buckets, history };
}

/** A restart: the process starts again, so counters go back to zero. */
export function restart(s: MetricsState): MetricsState {
  const history = [...s.history, { counter: 0, gauge: 0 }].slice(-40);
  return { ...s, counter: 0, gauge: 0, buckets: BUCKETS.map(() => 0), history };
}

/** Per-second rate over the last `w` samples, handling counter resets like PromQL's rate(). */
export function rate(h: { counter: number }[], w: number): number {
  const xs = h.slice(-w - 1);
  if (xs.length < 2) return 0;
  let inc = 0;
  for (let i = 1; i < xs.length; i++) {
    const d = xs[i].counter - xs[i - 1].counter;
    inc += d >= 0 ? d : xs[i].counter; // a drop means a reset: count from zero
  }
  return inc / (xs.length - 1);
}
