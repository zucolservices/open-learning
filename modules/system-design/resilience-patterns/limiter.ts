/** Rate limiters over a scripted request pattern (one client, 10 seconds). */

export type Algo = "token" | "fixed" | "sliding";
export interface Req {
  t: number;
  ok: boolean;
}

/** Steady 4/s, a burst of 25 at 3.0–3.3 s, and 10 just before plus 10 just after the 7 s boundary. */
export function pattern(): number[] {
  const ts: number[] = [];
  for (let t = 0.1; t < 10; t += 0.25) ts.push(+t.toFixed(3));
  for (let i = 0; i < 25; i++) ts.push(3 + i * 0.012);
  for (let i = 0; i < 10; i++) ts.push(6.9 + i * 0.009);
  for (let i = 0; i < 10; i++) ts.push(7.0 + i * 0.009);
  return ts.sort((a, b) => a - b);
}

export interface LimiterResult {
  reqs: Req[];
  level: [number, number][]; // token bucket level over time
  accepted: number;
  rejected: number;
  maxInOneSecond: number;
}

export function limit(algo: Algo, perSecond: number, burst: number): LimiterResult {
  const ts = pattern();
  const reqs: Req[] = [];
  const level: [number, number][] = [];
  let tokens = burst;
  let last = 0;
  const acceptedTimes: number[] = [];
  for (const t of ts) {
    let ok: boolean;
    if (algo === "token") {
      tokens = Math.min(burst, tokens + (t - last) * perSecond);
      last = t;
      level.push([t, tokens]);
      ok = tokens >= 1;
      if (ok) tokens -= 1;
      level.push([t, tokens]);
    } else if (algo === "fixed") {
      const w = Math.floor(t);
      ok = acceptedTimes.filter((a) => Math.floor(a) === w).length < perSecond;
    } else {
      ok = acceptedTimes.filter((a) => a > t - 1).length < perSecond;
    }
    if (ok) acceptedTimes.push(t);
    reqs.push({ t, ok });
  }
  let maxIn = 0;
  for (const a of acceptedTimes)
    maxIn = Math.max(maxIn, acceptedTimes.filter((b) => b >= a && b < a + 1).length);
  return {
    reqs,
    level,
    accepted: acceptedTimes.length,
    rejected: reqs.length - acceptedTimes.length,
    maxInOneSecond: maxIn,
  };
}
