/**
 * A minute-by-minute day of traffic into a scaling group with a target-tracking policy.
 * Made-up traffic and capacities; the behaviour (lag, overshoot, cost) is the point.
 */
export type Shape = "office" | "spike";

/** Requests per second each server handles at 100% CPU. */
export const PER_SERVER = 100;

export function traffic(shape: Shape): number[] {
  return Array.from({ length: 24 * 60 }, (_, m) => {
    const h = m / 60;
    const day = Math.exp(-(((h - 13) / 3.6) ** 2)) * 900; // working-day hump
    const morning = h > 9 && h < 9.6 ? 450 * Math.sin(((h - 9) / 0.6) * Math.PI) : 0; // 9 am logins
    const base = 60 + 10 * Math.sin(m / 37);
    const spike =
      shape === "spike" && h > 19 && h < 20.5 ? 1500 * Math.exp(-(((h - 19.3) / 0.25) ** 2)) : 0;
    return Math.max(20, base + day + morning + spike);
  });
}

export interface Settings {
  target: number; // target average CPU, percent
  min: number;
  warmup: number; // minutes from launch to serving
  scheduled: boolean; // pre-scale to 8 servers from 08:30 to 18:00
}

export interface Result {
  serving: number[]; // servers in service per minute
  launched: number[]; // servers running (paid for) per minute
  overloadMinutes: number;
  serverHours: number;
}

export function simulate(load: number[], s: Settings): Result {
  const serving: number[] = [];
  const launched: number[] = [];
  let inService = s.min;
  const pending: number[] = []; // minutes remaining for each launching server
  let lastScaleIn = -999;
  let overload = 0;
  for (let m = 0; m < load.length; m++) {
    // Servers finishing warm-up join.
    for (let i = pending.length - 1; i >= 0; i--) {
      pending[i] -= 1;
      if (pending[i] <= 0) {
        pending.splice(i, 1);
        inService += 1;
      }
    }
    const scheduledFloor = s.scheduled && m >= 8.5 * 60 && m < 18 * 60 ? 8 : 0;
    const floor = Math.max(s.min, scheduledFloor);
    // Target tracking: how many servers would put average CPU at the target?
    const wanted = Math.max(floor, Math.ceil(load[m] / (PER_SERVER * (s.target / 100))));
    const total = inService + pending.length;
    if (wanted > total) {
      for (let i = 0; i < wanted - total; i++) pending.push(s.warmup);
    } else if (wanted < inService && m - lastScaleIn >= 5) {
      // Scale in gently: one server at a time, at most every five minutes.
      inService -= 1;
      lastScaleIn = m;
    }
    if (load[m] > inService * PER_SERVER) overload += 1;
    serving.push(inService);
    launched.push(inService + pending.length);
  }
  return {
    serving,
    launched,
    overloadMinutes: overload,
    serverHours: launched.reduce((a, v) => a + v, 0) / 60,
  };
}
