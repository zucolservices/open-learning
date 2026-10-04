/** Eight weeks of daily row counts (thousands) with weekends, growth, and two real problems. Illustrative. */

export type Method = "fixed" | "rolling" | "seasonal";

const DAYS = 56;
/** Day 0 is a Monday. */
export const isWeekend = (d: number) => d % 7 >= 5;
const noise = (d: number) => Math.sin(d * 12.9898) * 0.02 + Math.sin(d * 4.1414) * 0.01;

/** Real problems: a partial load on a Wednesday, a duplicate load on a Saturday. */
export const REAL: Record<number, string> = {
  30: "Partial load: one region missing",
  47: "Saturday loaded twice",
};

export const SERIES: number[] = Array.from({ length: DAYS }, (_, d) => {
  const base = (isWeekend(d) ? 46 : 100) * (1 + 0.004 * d) * (1 + noise(d));
  if (d === 30) return Math.round(base * 0.68 * 10) / 10;
  if (d === 47) return Math.round(base * 2 * 10) / 10;
  return Math.round(base * 10) / 10;
});

function stats(xs: number[]) {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length);
  return { m, sd };
}

export interface Settings {
  min: number;
  max: number;
  k: number;
}

/** Expected band for each day, or null while warming up. Confirmed anomalies are left out of history. */
export function bands(method: Method, s: Settings): ({ lo: number; hi: number } | null)[] {
  return SERIES.map((_, d) => {
    if (method === "fixed") return { lo: s.min, hi: s.max };
    const hist: number[] = [];
    if (method === "rolling") {
      if (d < 14) return null;
      for (let i = d - 14; i < d; i++) if (!(i in REAL)) hist.push(SERIES[i]);
    } else {
      if (d < 28) return null;
      for (let w = 1; w <= 4; w++) if (!(d - 7 * w in REAL)) hist.push(SERIES[d - 7 * w]);
    }
    const { m, sd } = stats(hist);
    const spread = Math.max(sd, m * 0.03);
    return { lo: m - s.k * spread, hi: m + s.k * spread };
  });
}

export function score(method: Method, s: Settings) {
  const b = bands(method, s);
  const alerts = SERIES.map((v, d) => (b[d] ? v < b[d]!.lo || v > b[d]!.hi : false));
  const falseAlarms = alerts.filter((a, d) => a && !(d in REAL)).length;
  const caught = Object.keys(REAL).filter((d) => alerts[Number(d)]).length;
  return { b, alerts, falseAlarms, caught, total: Object.keys(REAL).length };
}

export const MAX = Math.max(...SERIES) * 1.08;
