/**
 * Three clients hit a café API that can handle 100 requests a second. Simplified model; numbers
 * are illustrative.
 */

export type Limit = "none" | "global" | "per";

export const CLIENTS = [
  { id: "asha", label: "Asha's app", rate: 10 },
  { id: "ravi", label: "Ravi's app", rate: 10 },
  { id: "bot", label: "A buggy script", rate: 300 },
];

const CAPACITY = 100;

export function served(limit: Limit, shed: boolean) {
  const total = CLIENTS.reduce((t, c) => t + c.rate, 0);
  if (limit === "per") {
    return {
      rows: CLIENTS.map((c) => {
        const ok = Math.min(c.rate, 20);
        return {
          ...c,
          pct: Math.round((ok / c.rate) * 100),
          status: ok < c.rate ? "429 Too Many Requests, Retry-After: 1" : "Served",
        };
      }),
      health: "Server at 40% load; everyone else unaffected.",
      ok: true,
    };
  }
  if (limit === "global" || shed) {
    const share = CAPACITY / total;
    return {
      rows: CLIENTS.map((c) => ({
        ...c,
        pct: Math.round(share * 100),
        status: limit === "global" ? "Mostly 429s" : "Mostly 503 Service Unavailable",
      })),
      health: "The server survives, but the buggy script crowds out real customers.",
      ok: false,
    };
  }
  return {
    rows: CLIENTS.map((c) => ({ ...c, pct: 0, status: "Timed out" })),
    health:
      "Queues grow without limit; every request waits until it times out. The service is effectively down.",
    ok: false,
  };
}
