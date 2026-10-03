/** Two minutes of requests through a fixed window and a token bucket, both "10 per minute" (illustrative). */

export type Pattern = "edge" | "steady" | "spike";
export type Algo = "window" | "bucket";

export const PATTERNS: Record<Pattern, { label: string; note: string }> = {
  edge: {
    label: "Burst at the minute boundary",
    note: "10 requests in the last 5 s of minute 1, 10 more in the first 5 s of minute 2.",
  },
  steady: {
    label: "Steady, slightly too fast",
    note: "One request every 3 s: 20 a minute against a limit of 10.",
  },
  spike: { label: "A sudden spike", note: "30 requests at once, 30 s in." },
};

export function arrivals(p: Pattern): number[] {
  if (p === "edge")
    return [
      ...Array.from({ length: 10 }, (_, i) => 55 + i * 0.5),
      ...Array.from({ length: 10 }, (_, i) => 60 + i * 0.5),
    ];
  if (p === "steady") return Array.from({ length: 40 }, (_, i) => i * 3);
  return Array.from({ length: 30 }, (_, i) => 30 + i * 0.05);
}

export interface Result {
  t: number;
  ok: boolean;
  retryAfter?: number;
}

export function run(p: Pattern, a: Algo): Result[] {
  const ts = arrivals(p);
  const out: Result[] = [];
  if (a === "window") {
    const used: Record<number, number> = {};
    for (const t of ts) {
      const w = Math.floor(t / 60);
      used[w] = used[w] ?? 0;
      if (used[w] < 10) {
        used[w]++;
        out.push({ t, ok: true });
      } else out.push({ t, ok: false, retryAfter: Math.ceil((w + 1) * 60 - t) });
    }
    return out;
  }
  // Token bucket: capacity 10, refills 1 token every 6 s.
  let tokens = 10;
  let last = 0;
  for (const t of ts) {
    tokens = Math.min(10, tokens + (t - last) / 6);
    last = t;
    if (tokens >= 1) {
      tokens -= 1;
      out.push({ t, ok: true });
    } else out.push({ t, ok: false, retryAfter: Math.ceil((1 - tokens) * 6) });
  }
  return out;
}

/** Most requests accepted in any 10-second stretch. */
export function peak(rs: Result[]): number {
  const ok = rs.filter((r) => r.ok).map((r) => r.t);
  let best = 0;
  for (const s of ok) best = Math.max(best, ok.filter((t) => t >= s && t < s + 10).length);
  return best;
}
