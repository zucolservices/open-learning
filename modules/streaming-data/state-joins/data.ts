/** Made-up customers, logins and payments for the join examples (times in minutes). */

export interface Change {
  t: number;
  key: string;
  tier: string | null;
}

/** The customer table's changelog: each record updates (or deletes) one key. */
export const CHANGELOG: Change[] = [
  { t: 0, key: "asha", tier: "silver" },
  { t: 1, key: "ravi", tier: "gold" },
  { t: 2, key: "meera", tier: "silver" },
  { t: 5, key: "asha", tier: "gold" },
  { t: 9, key: "ravi", tier: "platinum" },
  { t: 11, key: "meera", tier: null },
];

export function tableAt(n: number): Record<string, string> {
  const table: Record<string, string> = {};
  for (const c of CHANGELOG.slice(0, n)) {
    if (c.tier === null) delete table[c.key];
    else table[c.key] = c.tier;
  }
  return table;
}

export const LOGINS = [
  { t: 2, user: "asha" },
  { t: 7, user: "ravi" },
  { t: 20, user: "asha" },
];

export const PAYMENTS = [
  { t: 4, user: "asha", amount: 1200 },
  { t: 8, user: "ravi", amount: 15000 },
  { t: 10, user: "meera", amount: 52000 },
  { t: 13, user: "asha", amount: 300 },
];

export const WITHIN = 5;

/** Tier for a user at time t (table lookup as the payment arrives). */
export function tierAt(user: string, t: number): string | null {
  const n = CHANGELOG.filter((c) => c.t <= t).length;
  return tableAt(n)[user] ?? null;
}

/** Login by the same user within WITHIN minutes before or after the payment. */
export function loginNear(user: string, t: number) {
  return LOGINS.find((l) => l.user === user && Math.abs(l.t - t) <= WITHIN) ?? null;
}

/** State kept by a stream-stream join over time: events per minute, retained for the window or forever. */
export function stateCurve(minutes: number, bounded: boolean): number[] {
  const perMinute = 40;
  return Array.from(
    { length: minutes + 1 },
    (_, m) => (bounded ? Math.min(m, WITHIN * 2) : m) * perMinute,
  );
}
