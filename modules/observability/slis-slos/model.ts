/** Candidate indicators for a checkout journey, and the nines (SRE book Appendix A). */

export const CANDIDATES: { id: string; label: string; ok: boolean; why: string }[] = [
  {
    id: "cpu",
    label: "Share of minutes when server CPU is below 80%",
    ok: false,
    why: "Users don't feel CPU. Servers can be calm while checkout fails, or busy while it works fine.",
  },
  {
    id: "uptime",
    label: "Share of minutes the checkout servers are running",
    ok: false,
    why: "A server can be up and still return errors or time out. 'Running' isn't 'working for users'.",
  },
  {
    id: "http200",
    label: "Share of checkout requests that return HTTP 200",
    ok: false,
    why: "Closer, but a 200 that takes 30 seconds is a failure to the customer, and some failures come back as 200.",
  },
  {
    id: "good",
    label:
      "Share of checkout requests that succeed within 2 seconds, measured at the load balancer",
    ok: true,
    why: "Good events ÷ total events, from the user's side: it counts both errors and slowness, where users feel them.",
  },
  {
    id: "avg",
    label: "Average checkout latency",
    ok: false,
    why: "An average hides the slow tail (module 5), and it isn't a ratio you can set a percentage target on.",
  },
];

export const NINES = [99, 99.5, 99.9, 99.95, 99.99, 99.999] as const;
export type Nine = (typeof NINES)[number];

export function allowed(target: number) {
  const bad = 1 - target / 100;
  return {
    per30Min: 30 * 24 * 60 * bad,
    perYearMin: 365 * 24 * 60 * bad,
    perMillion: 1_000_000 * bad,
  };
}

export function fmtDuration(min: number): string {
  if (min >= 1440) return `${(min / 1440).toFixed(1)} days`;
  if (min >= 60) return `${(min / 60).toFixed(1)} hours`;
  if (min >= 1) return `${min.toFixed(1)} minutes`;
  return `${Math.round(min * 60)} seconds`;
}
