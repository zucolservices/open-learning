/**
 * 30 days of request errors, an SLO, its error budget, and two ways of alerting:
 * a naive threshold and the multi-window, multi-burn-rate alerts from Google's SRE Workbook.
 */

export const DAYS = 30;
export const MIN = DAYS * 24 * 60;
const RPM = 1000; // requests per minute

export interface Incident {
  id: string;
  label: string;
  day: number; // start day (fractional)
  hours: number;
  errRate: number;
}

export const INCIDENTS: Incident[] = [
  { id: "deploy", label: "Bad deploy (5% errors, 90 min)", day: 4.6, hours: 1.5, errRate: 0.05 },
  { id: "blip", label: "Network blip (30% errors, 4 min)", day: 11.3, hours: 4 / 60, errRate: 0.3 },
  { id: "leak", label: "Slow leak (0.5% errors, 2 days)", day: 17.2, hours: 48, errRate: 0.005 },
];
const BASE = 0.0003;

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

/** Error rate per minute. */
export function errorSeries(): number[] {
  const r = rng(5);
  const out = new Float64Array(MIN);
  for (let m = 0; m < MIN; m++) {
    let e = BASE * (0.5 + r());
    for (const inc of INCIDENTS) {
      const s = inc.day * 1440;
      if (m >= s && m < s + inc.hours * 60) e = Math.max(e, inc.errRate);
    }
    out[m] = e;
  }
  return Array.from(out);
}

export interface Alert {
  minute: number;
  kind: "page" | "ticket";
  rule: string;
}

export interface SloResult {
  budgetLeft: number[]; // per hour, share of the 30-day budget remaining (can go negative)
  alerts: Alert[];
  naive: Alert[];
  finalLeft: number;
  detected: Record<string, { burn: string | null; naive: boolean }>;
}

const WINDOWS: {
  long: number;
  short: number;
  burn: number;
  kind: "page" | "ticket";
  rule: string;
}[] = [
  { long: 60, short: 5, burn: 14.4, kind: "page", rule: "2% of budget in 1 h" },
  { long: 360, short: 30, burn: 6, kind: "page", rule: "5% of budget in 6 h" },
  { long: 4320, short: 360, burn: 1, kind: "ticket", rule: "10% of budget in 3 days" },
];

export function evaluate(slo: number, errs: number[]): SloResult {
  const budget = 1 - slo; // allowed error rate
  const totalBudget = budget * RPM * MIN; // allowed failed requests in 30 days
  const prefix = new Float64Array(MIN + 1);
  for (let m = 0; m < MIN; m++) prefix[m + 1] = prefix[m] + errs[m];
  const rate = (m: number, w: number) =>
    (prefix[m + 1] - prefix[Math.max(0, m + 1 - w)]) / Math.min(w, m + 1);

  const alerts: Alert[] = [];
  const firing = WINDOWS.map(() => false);
  const naive: Alert[] = [];
  let naiveFiring = false;
  const budgetLeft: number[] = [];
  for (let m = 0; m < MIN; m++) {
    WINDOWS.forEach((w, i) => {
      const on = rate(m, w.long) >= w.burn * budget && rate(m, w.short) >= w.burn * budget;
      if (on && !firing[i]) alerts.push({ minute: m, kind: w.kind, rule: w.rule });
      firing[i] = on;
    });
    const n = rate(m, 5) > 0.01; // naive: >1% errors over 5 minutes
    if (n && !naiveFiring)
      naive.push({ minute: m, kind: "page", rule: "error rate > 1% for 5 min" });
    naiveFiring = n;
    if (m % 60 === 59) budgetLeft.push(1 - (prefix[m + 1] * RPM) / totalBudget);
  }
  const detected: SloResult["detected"] = {};
  for (const inc of INCIDENTS) {
    const s = inc.day * 1440;
    const e = s + inc.hours * 60 + 360;
    const hit = alerts.find((a) => a.minute >= s && a.minute <= e);
    detected[inc.id] = {
      burn: hit ? hit.kind : null,
      naive: naive.some((a) => a.minute >= s && a.minute <= e),
    };
  }
  return { budgetLeft, alerts, naive, finalLeft: budgetLeft[budgetLeft.length - 1], detected };
}
