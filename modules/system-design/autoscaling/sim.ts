/**
 * Three hours of traffic, minute by minute, with target-tracking autoscaling.
 * Illustrative: one server handles 100 requests/s flat out.
 */

export const MINUTES = 180;
export const PER_SERVER = 100; // req/s at 100% CPU
export const MIN_SERVERS = 2;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Requests per second each minute: a gentle morning, a sharp lunch spike, noise. */
export function demandCurve(seed = 3): number[] {
  const r = rng(seed);
  const out: number[] = [];
  for (let m = 0; m < MINUTES; m++) {
    let d = 300 + m * 1.5;
    if (m >= 90 && m < 93)
      d += ((m - 89) / 3) * 900; // a sharp spike: up in 3 minutes
    else if (m >= 93 && m < 130) d += 900;
    else if (m >= 130 && m < 145) d += 900 * (1 - (m - 130) / 15);
    d *= 1 + (r() - 0.5) * 0.3; // ±15% noise
    out.push(Math.round(d));
  }
  return out;
}

export interface ScaleOptions {
  target: number; // target CPU utilisation, 0..1
  warmupMin: number; // minutes before a new server takes traffic
  windowMin: number; // scale-in stabilisation window
  scheduled: boolean; // pre-scale to 22 servers from minute 75 to 145
}

export interface ScaleResult {
  demand: number[];
  ready: number[]; // servers taking traffic each minute
  total: number[]; // ready + warming up
  overloadMinutes: number;
  droppedRequests: number;
  serverHours: number;
  scaleIns: number;
}

export function simulate(o: ScaleOptions): ScaleResult {
  const demand = demandCurve();
  const pending: number[] = []; // minute each warming server becomes ready
  let ready = 4;
  const desiredHistory: number[] = [];
  const readyOut: number[] = [];
  const totalOut: number[] = [];
  let overloadMinutes = 0;
  let dropped = 0;
  let serverMinutes = 0;
  let scaleIns = 0;
  for (let m = 0; m < MINUTES; m++) {
    // Servers that finished warming up join now.
    for (let i = pending.length - 1; i >= 0; i--) {
      if (pending[i] <= m) {
        ready++;
        pending.splice(i, 1);
      }
    }
    const d = demand[m];
    const capacity = ready * PER_SERVER;
    if (d > capacity) {
      overloadMinutes++;
      dropped += (d - capacity) * 60;
    }
    let desired = Math.max(MIN_SERVERS, Math.ceil(d / (PER_SERVER * o.target)));
    if (o.scheduled && m >= 75 && m < 145) desired = Math.max(desired, 22);
    desiredHistory.push(desired);
    const total = ready + pending.length;
    if (desired > total) {
      for (let i = 0; i < desired - total; i++) pending.push(m + o.warmupMin);
    } else {
      const recent = desiredHistory.slice(Math.max(0, desiredHistory.length - o.windowMin));
      const stable = Math.max(...recent);
      if (stable < total && ready > MIN_SERVERS) {
        const remove = Math.min(total - stable, ready - MIN_SERVERS);
        if (remove > 0) {
          ready -= remove;
          scaleIns++;
        }
      }
    }
    readyOut.push(ready);
    totalOut.push(ready + pending.length);
    serverMinutes += ready + pending.length;
  }
  return {
    demand,
    ready: readyOut,
    total: totalOut,
    overloadMinutes,
    droppedRequests: dropped,
    serverHours: serverMinutes / 60,
    scaleIns,
  };
}

/** Kubernetes HPA: desired = ceil(current × current metric / target metric). */
export const hpaDesired = (current: number, metric: number, target: number) =>
  Math.ceil(current * (metric / target));
