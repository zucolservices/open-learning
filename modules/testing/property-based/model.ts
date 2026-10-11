/**
 * A tiny property-based tester: seeded random lists of prices, up to 100 tries, and real
 * shrinking towards the smallest failing list. Three made-up sort implementations to test.
 */

export type Impl = "default" | "bubble" | "correct";

export const IMPLS: { id: Impl; label: string; code: string }[] = [
  { id: "default", label: "prices.sort()", code: "return [...prices].sort();" },
  {
    id: "bubble",
    label: "Hand-written bubble sort",
    code: "for (j = 0; j < n - 2 - i; j++) … // off by one",
  },
  {
    id: "correct",
    label: "Sort with a comparator",
    code: "return [...prices].sort((a, b) => a - b);",
  },
];

export function sortWith(impl: Impl, xs: number[]): number[] {
  if (impl === "default") return [...xs].sort();
  if (impl === "correct") return [...xs].sort((a, b) => a - b);
  const a = [...xs];
  const n = a.length;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n - 2 - i; j++) if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
  return a;
}

export type PropId = "ordered" | "length" | "idempotent" | "same";

export const PROPS: {
  id: PropId;
  label: string;
  check(input: number[], out: number[], again: number[]): boolean;
}[] = [
  {
    id: "ordered",
    label: "Each price is ≤ the next",
    check: (_, o) => o.every((x, i) => i === 0 || o[i - 1] <= x),
  },
  {
    id: "length",
    label: "Same number of prices out as in",
    check: (i, o) => i.length === o.length,
  },
  {
    id: "same",
    label: "Same prices out as in (nothing lost or added)",
    check: (i, o) => [...i].sort((a, b) => a - b).join() === [...o].sort((a, b) => a - b).join(),
  },
  {
    id: "idempotent",
    label: "Sorting twice gives the same as sorting once",
    check: (_, o, again) => o.join() === again.join(),
  },
];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

function holds(impl: Impl, props: PropId[], xs: number[]): boolean {
  const out = sortWith(impl, xs);
  const again = sortWith(impl, out);
  return PROPS.filter((p) => props.includes(p.id)).every((p) => p.check(xs, out, again));
}

export interface PbtResult {
  ok: boolean;
  tries: number;
  failing?: number[];
  shrinks: number[][];
}

export function check(impl: Impl, props: PropId[], seed = 11): PbtResult {
  const r = rng(seed);
  for (let t = 1; t <= 100; t++) {
    const len = Math.floor(r() * 9);
    const xs = Array.from({ length: len }, () => Math.floor(r() * 200));
    if (!holds(impl, props, xs))
      return { ok: false, tries: t, failing: xs, shrinks: shrink(impl, props, xs) };
  }
  return { ok: true, tries: 100, shrinks: [] };
}

/** Repeatedly try smaller lists (fewer items, smaller numbers) that still fail. */
function shrink(impl: Impl, props: PropId[], start: number[]): number[][] {
  const steps = [start];
  let cur = start;
  for (let guard = 0; guard < 200; guard++) {
    const cands: number[][] = [];
    for (let i = 0; i < cur.length; i++) cands.push([...cur.slice(0, i), ...cur.slice(i + 1)]);
    for (let i = 0; i < cur.length; i++)
      for (const v of [0, Math.floor(cur[i] / 2), cur[i] - 1])
        if (v >= 0 && v < cur[i]) cands.push(cur.map((x, k) => (k === i ? v : x)));
    const next = cands.find((c) => !holds(impl, props, c));
    if (!next) break;
    cur = next;
    steps.push(cur);
  }
  return steps;
}
