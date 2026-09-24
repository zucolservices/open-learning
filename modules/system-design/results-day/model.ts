/**
 * Results day, minute by minute from 09:50 to 11:00. Illustrative numbers for a state board with
 * about 8 lakh students: normal traffic ~50 requests/s, a 100×+ surge when results go live at 10:00.
 */

export const START = -10; // minutes relative to 10:00
export const END = 60;
export const MINUTES = END - START + 1;

export type DataChoice = "db" | "cache" | "static";
export type FrontChoice = "single" | "lb" | "cdn";
export type ScaleChoice = "auto" | "prescale";

export interface Design {
  data: DataChoice;
  front: FrontChoice;
  scale: ScaleChoice;
  sms: boolean;
}

/** Result lookups per second arriving at the site. */
export function demand(t: number): number {
  if (t < -3) return 50;
  if (t < 0) return 50 + (t + 4) * 600; // refreshing before the announcement
  const peak = 7000;
  return Math.round(100 + peak * Math.exp(-Math.max(0, t - 2) / 14) * Math.min(1, (t + 1) / 2));
}

const PER_SERVER = { db: 250, cache: 800, static: 3000 }; // lookups/s one app server handles
const DB_CAP = 3000; // lookups/s the results database can take
const WARMUP = 5; // minutes for a new server

export interface Minute {
  t: number;
  demand: number;
  served: number;
  servers: number;
}

export interface DayResult {
  minutes: Minute[];
  successFirst15: number;
  badMinutes: number; // minutes where more than 5% of lookups failed
  peakDb: number;
  serverMinutes: number;
  notes: string[];
}

export function replay(d: Design): DayResult {
  const minutes: Minute[] = [];
  let servers = d.front === "single" ? 1 : d.scale === "prescale" ? 30 : 2;
  const pending: { ready: number; n: number }[] = [];
  let ok15 = 0;
  let all15 = 0;
  let bad = 0;
  let peakDb = 0;
  let serverMinutes = 0;
  for (let t = START; t <= END; t++) {
    const raw = demand(t) * (d.sms && t >= 0 ? 0.7 : 1);
    // What reaches our servers: a CDN absorbs static files almost entirely, and repeat lookups of the
    // same result URL (a family checking together) when results are cacheable.
    const cdnHit = d.front === "cdn" ? (d.data === "static" ? 0.99 : 0.6) : 0;
    const origin = raw * (1 - cdnHit);
    // Autoscaling: aim for 60% utilisation; new servers take WARMUP minutes.
    if (d.front === "lb" || d.front === "cdn") {
      while (pending.length && pending[0].ready <= t) servers += pending.shift()!.n;
      if (d.scale === "auto") {
        const want = Math.min(60, Math.ceil(origin / (PER_SERVER[d.data] * 0.6)));
        const coming = pending.reduce((a, p) => a + p.n, 0);
        if (want > servers + coming)
          pending.push({ ready: t + WARMUP, n: want - servers - coming });
      }
    }
    const appCap = servers * PER_SERVER[d.data];
    const dbShare = d.data === "db" ? 1 : d.data === "cache" ? 0.45 : 0; // cache misses reach the DB
    const dbCap = dbShare ? DB_CAP / dbShare : Infinity;
    const cap = Math.min(appCap, dbCap);
    // Overload is worse than linear: queues and timeouts waste capacity.
    const servedOrigin = origin <= cap ? origin : cap * Math.max(0.2, cap / origin);
    const served = raw * cdnHit + servedOrigin;
    peakDb = Math.max(peakDb, Math.min(origin, cap) * dbShare);
    serverMinutes += servers;
    if (t >= 0 && t < 15) {
      ok15 += served;
      all15 += raw;
    }
    if (served < raw * 0.95) bad += 1;
    minutes.push({ t, demand: raw, served, servers });
  }
  const notes: string[] = [];
  if (d.data === "static" && d.front === "cdn")
    notes.push(
      "Every result is a pre-built file on the CDN: the edge answers nearly everything, and your servers barely notice 10:00.",
    );
  if (d.front === "single")
    notes.push(
      "One server is a single point of failure and a hard ceiling: it's overwhelmed within seconds of 10:00.",
    );
  if (d.scale === "auto" && d.front !== "single" && !(d.data === "static" && d.front === "cdn"))
    notes.push(
      "Autoscaling reacts after the surge starts, and new servers take five minutes: the worst minutes are the first ones.",
    );
  if (d.data === "db" && d.front !== "single")
    notes.push(
      "Every lookup hits the results database, which tops out at 3,000 a second however many app servers you add.",
    );
  if (d.data === "cache")
    notes.push(
      "The cache absorbs repeat lookups, but each student's first lookup still reaches the database.",
    );
  if (d.sms)
    notes.push("Sending results by SMS takes about 30% of people off the website entirely.");
  return {
    minutes,
    successFirst15: all15 ? ok15 / all15 : 1,
    badMinutes: bad,
    peakDb,
    serverMinutes,
    notes,
  };
}
