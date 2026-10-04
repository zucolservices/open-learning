/** A support assistant's prompt change, scored on 100 prepared cases. The cases are illustrative. */

export interface Category {
  id: string;
  name: string;
  size: number;
  v1Fail: number[];
  v2Fail: number[];
  example: { q: string; v1: string; v2: string };
}

export const CATEGORIES: Category[] = [
  {
    id: "refunds",
    name: "Refunds",
    size: 30,
    v1Fail: [3, 17, 25],
    v2Fail: [],
    example: {
      q: "Can I return shoes I've worn once?",
      v1: "Yes, within 30 days if they're unworn indoors only…",
      v2: "Yes: within 30 days, unworn outside.",
    },
  },
  {
    id: "shipping",
    name: "Shipping",
    size: 30,
    v1Fail: [5, 12, 21, 28],
    v2Fail: [12],
    example: {
      q: "Where's my parcel?",
      v1: "I'm sorry for the trouble! Let me explain how our couriers work…",
      v2: "It left the depot today; arrival Thursday.",
    },
  },
  {
    id: "account",
    name: "Account",
    size: 20,
    v1Fail: [2, 9, 15],
    v2Fail: [],
    example: {
      q: "How do I change my email?",
      v1: "You can do that in settings, or contact support, or…",
      v2: "Settings → Profile → Email.",
    },
  },
  {
    id: "angry",
    name: "Upset customers",
    size: 10,
    v1Fail: [4],
    v2Fail: [1, 4, 7],
    example: {
      q: "Third time asking. This is useless!",
      v1: "I'm really sorry. Let me fix this now: …",
      v2: "Refunds take 5–7 days.",
    },
  },
  {
    id: "hindi",
    name: "Questions in Hindi",
    size: 10,
    v1Fail: [6],
    v2Fail: [0, 2, 3, 5, 6, 8, 9],
    example: {
      q: "मेरा ऑर्डर कब आएगा?",
      v1: "आपका ऑर्डर गुरुवार तक पहुँच जाएगा।",
      v2: "Your order arrives Thursday.",
    },
  },
];

export type Outcome = "pass" | "fail" | "regressed" | "fixed";

export interface Case {
  cat: string;
  i: number;
  v1: boolean;
  v2: boolean;
  outcome: Outcome;
}

export const CASES: Case[] = CATEGORIES.flatMap((c) =>
  Array.from({ length: c.size }, (_, i) => {
    const v1 = !c.v1Fail.includes(i);
    const v2 = !c.v2Fail.includes(i);
    const outcome: Outcome = v1 && v2 ? "pass" : !v1 && !v2 ? "fail" : v1 ? "regressed" : "fixed";
    return { cat: c.id, i, v1, v2, outcome };
  }),
);

export const REGRESSED = CASES.filter((c) => c.outcome === "regressed").length;

/** Indices of a pseudo-random sample of n cases (stable for a given seed). */
export function sample(n: number, seed: number): Set<number> {
  const idx = CASES.map((_, i) => i);
  let s = seed * 9301 + 49297;
  for (let i = idx.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return new Set(idx.slice(0, n));
}

/** Chance that a random sample of n contains at least one regressed case. */
export function chanceToSpot(n: number) {
  const N = CASES.length;
  let miss = 1;
  for (let k = 0; k < n; k++) miss *= (N - REGRESSED - k) / (N - k);
  return Math.max(0, 1 - miss);
}

export function byCategory() {
  return CATEGORIES.map((c) => ({
    ...c,
    v1: c.size - c.v1Fail.length,
    v2: c.size - c.v2Fail.length,
  }));
}

/** Index of each category's first case in CASES. */
export const STARTS = CATEGORIES.map((_, i) =>
  CATEGORIES.slice(0, i).reduce((a, c) => a + c.size, 0),
);
