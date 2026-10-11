/**
 * A suite with four hidden causes of flakiness, run 100 times with a seeded random generator so
 * every learner sees the same results. Failure rates are illustrative.
 */

export type Cause = "time" | "order" | "shared" | "async" | "random";

export const CAUSES: { id: Cause; label: string; fix: string }[] = [
  {
    id: "time",
    label: "Real clock",
    fix: "Pass in a fixed clock instead of reading the real time.",
  },
  {
    id: "order",
    label: "Test order",
    fix: "Give each test its own customer; never rely on another test running first.",
  },
  { id: "shared", label: "Shared state", fix: "Reset the cache before each test." },
  { id: "async", label: "Race / missing wait", fix: "Await the save before checking the result." },
  {
    id: "random",
    label: "Random data",
    fix: "Use fixed values, or seed the generator and print the seed on failure.",
  },
];

export const TESTS: { id: string; name: string; cause: Cause | null; p: number; clue?: string }[] =
  [
    { id: "total", name: "basket total adds prices", cause: null, p: 0 },
    {
      id: "receipt",
      name: "receipt shows today's date",
      cause: "time",
      p: 0.03,
      clue: "Expected “11 Oct”, received “12 Oct” (run started at 23:59:59)",
    },
    { id: "gst", name: "GST is 5% on food", cause: null, p: 0 },
    {
      id: "fresh",
      name: "a new customer has no orders",
      cause: "order",
      p: 0.3,
      clue: "Expected 0 orders, received 1. Only fails when run after “place an order”.",
    },
    {
      id: "menu",
      name: "cache returns the saved menu",
      cause: "shared",
      p: 0.15,
      clue: "Expected 12 items, received 13: a dish added by another test is still in the cache.",
    },
    {
      id: "numbers",
      name: "two orders get different numbers",
      cause: "async",
      p: 0.08,
      clue: "Expected order #2, received undefined: checked before the save finished.",
    },
    {
      id: "bulk",
      name: "discount for a bulk order",
      cause: "random",
      p: 0.05,
      clue: "Expected a discount, received none. quantity = 0 (randomly generated).",
    },
    { id: "login", name: "staff can log in", cause: null, p: 0 },
  ];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

export interface RunStats {
  passes: Record<string, number>;
  redBuilds: number;
}

export function run100(fixed: string[], retries: boolean): RunStats {
  const r = rng(7);
  const passes: Record<string, number> = Object.fromEntries(TESTS.map((t) => [t.id, 0]));
  let redBuilds = 0;
  for (let i = 0; i < 100; i++) {
    let red = false;
    for (const t of TESTS) {
      const p = fixed.includes(t.id) ? 0 : t.p;
      const tries = retries ? 3 : 1;
      let ok = false;
      for (let k = 0; k < tries && !ok; k++) ok = r() >= p;
      if (ok) passes[t.id]++;
      else red = true;
    }
    if (red) redBuilds++;
  }
  return { passes, redBuilds };
}
