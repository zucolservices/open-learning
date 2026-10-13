/** A month of made-up grievances about a pension scheme, and how policies change the outcome. */

export type Cat = "pension" | "certificate" | "portal" | "other";

export const CATS: Record<Cat, { label: string; days: number }> = {
  pension: { label: "Pension not credited", days: 26 },
  certificate: { label: "Certificate delayed", days: 10 },
  portal: { label: "Portal error", days: 5 },
  other: { label: "Other", days: 15 },
};

const ORDER: Cat[] = [
  "pension",
  "certificate",
  "pension",
  "portal",
  "pension",
  "other",
  "pension",
  "certificate",
  "portal",
  "pension",
];

export interface Policy {
  quick: boolean;
  escalate: boolean;
  feedback: boolean;
  analyse: boolean;
  fix: boolean;
}

export function simulate(p: Policy) {
  const cases = Array.from({ length: 40 }, (_, i) => ({
    i,
    day: Math.floor(i / 2),
    cat: ORDER[i % ORDER.length],
  }));
  const received = cases.filter(
    (c) => !(p.fix && c.cat === "pension" && c.day >= 8 && c.i % 10 < 7),
  );
  const rows = received.map((c) => {
    let days = c.cat === "pension" && p.fix ? 5 : CATS[c.cat].days;
    if (p.escalate) days = Math.min(days, 18);
    const solved = !p.quick || CATS[c.cat].days <= 5;
    if (p.quick) days = 2;
    return { ...c, days, solved };
  });
  const within = rows.filter((r) => r.days <= 21).length;
  const avg = rows.reduce((t, r) => t + r.days, 0) / rows.length;
  const solved = rows.filter((r) => r.solved).length;
  const byCat = (Object.keys(CATS) as Cat[]).map((k) => ({
    cat: k,
    n: received.filter((c) => c.cat === k).length,
  }));
  return { total: rows.length, within, avg: Math.round(avg), solved, byCat };
}
