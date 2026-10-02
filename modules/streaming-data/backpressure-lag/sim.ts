/**
 * Sale-day simulation, one step per minute for 90 minutes. Normal traffic is 6,000 events/s; from minute
 * 30 to 50 it jumps 7× (Flipkart reports Big Billion Days traffic around 7× normal). Each consumer handles
 * 4,000 events/s. Autoscaling follows KEDA's rule (replicas ≈ lag ÷ threshold, capped at the partition
 * count) and takes 3 minutes to add consumers; pre-warming scales to the partition count at minute 25.
 */
export const MINUTES = 90;
export const BASE = 6000;
export const PER_CONSUMER = 4000;
const LAG_PER_REPLICA = 600_000; // events of lag per extra consumer, for the autoscaler
const DELAY = 3;

export const incoming = (m: number) => (m >= 30 && m < 50 ? BASE * 7 : BASE);

export interface Point {
  m: number;
  inRate: number;
  outRate: number;
  consumers: number;
  lag: number;
}

export function simulate(
  partitions: number,
  start: number,
  autoscale: boolean,
  prewarm: boolean,
): Point[] {
  const out: Point[] = [];
  let lag = 0;
  let consumers = Math.min(start, partitions);
  const pending: { at: number; to: number }[] = [];
  for (let m = 0; m < MINUTES; m++) {
    if (prewarm && m === 25) consumers = partitions;
    while (pending.length && pending[0].at <= m) consumers = pending.shift()!.to;
    const inRate = incoming(m);
    const cap = Math.min(consumers, partitions) * PER_CONSUMER;
    const backlog = lag + inRate * 60;
    const done = Math.min(backlog, cap * 60);
    lag = backlog - done;
    out.push({ m, inRate, outRate: done / 60, consumers: Math.min(consumers, partitions), lag });
    if (autoscale) {
      const want = Math.max(start, Math.min(partitions, Math.ceil(lag / LAG_PER_REPLICA) + start));
      const target = pending.length ? pending[pending.length - 1].to : consumers;
      if (want !== target && !(prewarm && m >= 25 && want < partitions))
        pending.push({ at: m + DELAY, to: want });
    }
  }
  return out;
}

export function summary(pts: Point[]) {
  const peak = pts.reduce((a, p) => (p.lag > a.lag ? p : a), pts[0]);
  const lastBacklog = [...pts].reverse().find((p) => p.lag > 0);
  const clear = lastBacklog ? lastBacklog.m + 1 : null;
  const maxTimeLag = Math.max(...pts.map((p) => (p.outRate > 0 ? p.lag / p.outRate : 0)));
  return {
    peakLag: peak.lag,
    peakAt: peak.m,
    clearAt: clear,
    maxTimeLagMin: maxTimeLag / 60,
    endLag: pts[pts.length - 1].lag,
  };
}
