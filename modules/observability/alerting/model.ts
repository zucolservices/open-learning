/**
 * A week of checkout error rates, minute by minute (illustrative), for a 99.9% SLO. It contains
 * harmless blips, one slow burn and one sharp outage. Three alert rules are evaluated on it.
 */

export const MIN = 7 * 24 * 60;
export const SLO_BAD = 0.001; // 99.9%

function noise(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Incident windows (minutes from the start of the week). */
export const SLOW = { start: 2 * 1440 + 9 * 60, end: 2 * 1440 + 17 * 60 }; // day 3, 09:00–17:00
export const FAST = { start: 5 * 1440 + 20 * 60, end: 5 * 1440 + 20 * 60 + 25 }; // day 6, 20:00–20:25

export const ERRORS: number[] = Array.from({ length: MIN }, (_, i) => {
  let e = 0.0002 + noise(i) * 0.0003;
  // Blips: a few minutes of errors now and then (a deploy, a retry storm), harmless overall.
  if (noise(i * 7 + 3) > 0.9965) e = 0.02;
  if (i >= SLOW.start && i < SLOW.end) e = 0.0065 + noise(i) * 0.001;
  if (i >= FAST.start && i < FAST.end) e = 0.12;
  return e;
});

const prefix = (() => {
  const p = new Float64Array(MIN + 1);
  for (let i = 0; i < MIN; i++) p[i + 1] = p[i] + ERRORS[i];
  return p;
})();

/** Average error rate over the `w` minutes ending at minute i. */
function avg(i: number, w: number) {
  const a = Math.max(0, i - w + 1);
  return (prefix[i + 1] - prefix[a]) / (i - a + 1);
}

export type Rule = "naive" | "threshold" | "burn";

export const RULES: Record<Rule, { name: string; text: string }> = {
  naive: {
    name: "Any bad minute",
    text: "Page when the error rate in any minute is above the SLO (0.1%).",
  },
  threshold: {
    name: "High for 10 minutes",
    text: "Page when the error rate stays above 1% for 10 minutes.",
  },
  burn: {
    name: "Multi-window burn rate",
    text: "Page at 14.4× burn over 1 hour (and 5 minutes), or 6× over 6 hours (and 30 minutes).",
  },
};

function firing(rule: Rule, i: number): boolean {
  if (rule === "naive") return ERRORS[i] > SLO_BAD;
  if (rule === "threshold") {
    if (i < 9) return false;
    for (let k = 0; k < 10; k++) if (ERRORS[i - k] <= 0.01) return false;
    return true;
  }
  const b = (w: number) => avg(i, w) / SLO_BAD;
  return (b(60) > 14.4 && b(5) > 14.4) || (b(360) > 6 && b(30) > 6);
}

export interface Result {
  pages: number;
  /** Minute each real incident was first paged, or null. */
  slowAt: number | null;
  fastAt: number | null;
  falsePages: number;
  /** Minutes (by hour) with a page starting, for the strip. */
  pageMinutes: number[];
}

export function evaluate(rule: Rule): Result {
  const pageMinutes: number[] = [];
  let lastPage = -Infinity;
  let was = false;
  for (let i = 0; i < MIN; i++) {
    const f = firing(rule, i);
    // A new page when the alert starts firing, at most one per 30 minutes (grouping).
    if (f && !was && i - lastPage > 30) {
      pageMinutes.push(i);
      lastPage = i;
    }
    was = f;
  }
  const inWin = (m: number, w: { start: number; end: number }) => m >= w.start && m <= w.end + 60;
  const slowAt = pageMinutes.find((m) => inWin(m, SLOW)) ?? null;
  const fastAt = pageMinutes.find((m) => inWin(m, FAST)) ?? null;
  const falsePages = pageMinutes.filter((m) => !inWin(m, SLOW) && !inWin(m, FAST)).length;
  return { pages: pageMinutes.length, slowAt, fastAt, falsePages, pageMinutes };
}
