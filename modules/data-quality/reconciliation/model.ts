/** A source orders table, a warehouse copy with one kind of fault, and four checks. Illustrative. */

export interface Row {
  id: number;
  amount: number;
}

export const SOURCE: Row[] = [
  [1001, 240],
  [1002, 89.5],
  [1003, 1200],
  [1004, 35],
  [1005, 410.2],
  [1006, 99.99],
  [1007, 15],
  [1008, 760],
  [1009, 54.1],
  [1010, 320],
  [1011, 18.75],
  [1012, 600],
].map(([id, amount]) => ({ id, amount }));

export type Scenario = "clean" | "lost" | "duplost" | "swap" | "float";

export const SCENARIOS: { id: Scenario; label: string; story: string }[] = [
  { id: "clean", label: "A clean copy", story: "Nothing went wrong." },
  { id: "lost", label: "A row lost", story: "A network blip dropped order 1007 mid-load." },
  {
    id: "duplost",
    label: "One lost, one doubled",
    story: "1008 was loaded twice and 1003 not at all: the count still says 12.",
  },
  {
    id: "swap",
    label: "Two amounts swapped",
    story: "A bad join swapped the amounts of 1002 and 1004.",
  },
  {
    id: "float",
    label: "Floats in the copy",
    story: "The warehouse stores amount as a float, so values differ in the tenth decimal place.",
  },
];

export function target(s: Scenario): Row[] {
  const t = SOURCE.map((r) => ({ ...r }));
  if (s === "lost") return t.filter((r) => r.id !== 1007);
  if (s === "duplost") return [...t.filter((r) => r.id !== 1003), { id: 1008, amount: 760 }];
  if (s === "swap") {
    t[1].amount = 35;
    t[3].amount = 89.5;
    return t;
  }
  if (s === "float")
    return t.map((r, i) => ({
      ...r,
      amount: r.amount + (i % 3 === 0 ? 1e-10 : i % 3 === 1 ? -1e-10 : 0),
    }));
  return t;
}

const sum = (rs: Row[]) => rs.reduce((a, r) => a + r.amount, 0);

export type Check = "count" | "sum" | "ids" | "rows";
export const CHECKS: { id: Check; label: string; cost: string }[] = [
  { id: "count", label: "Row count", cost: "cheap" },
  { id: "sum", label: "Sum of amount", cost: "cheap" },
  { id: "ids", label: "Hash total of ids", cost: "cheap" },
  { id: "rows", label: "Row-by-row diff", cost: "expensive" },
];

export function run(c: Check, s: Scenario, tol: number) {
  const a = SOURCE;
  const b = target(s);
  if (c === "count") return { ok: a.length === b.length, detail: `${a.length} vs ${b.length}` };
  if (c === "sum") {
    const d = Math.abs(sum(a) - sum(b));
    return {
      ok: d <= tol,
      detail: `${sum(a).toFixed(2)} vs ${sum(b).toFixed(2)}${d > 0 && d < 0.005 ? ` (off by ${d.toExponential(0)})` : ""}`,
    };
  }
  if (c === "ids") {
    const h = (rs: Row[]) => rs.reduce((x, r) => x + r.id, 0);
    return { ok: h(a) === h(b), detail: `${h(a)} vs ${h(b)}` };
  }
  return { ok: diff(s, tol).length === 0, detail: "" };
}

export function diff(s: Scenario, tol: number) {
  const b = target(s);
  const out: {
    id: number;
    kind: "only in source" | "only in copy" | "changed" | "extra copy";
    a?: number;
    b?: number;
  }[] = [];
  for (const r of SOURCE) {
    const m = b.filter((x) => x.id === r.id);
    if (m.length === 0) out.push({ id: r.id, kind: "only in source", a: r.amount });
    else if (Math.abs(m[0].amount - r.amount) > tol)
      out.push({ id: r.id, kind: "changed", a: r.amount, b: m[0].amount });
    if (m.length > 1) out.push({ id: r.id, kind: "extra copy", b: m[1].amount });
  }
  for (const x of b)
    if (!SOURCE.some((r) => r.id === x.id))
      out.push({ id: x.id, kind: "only in copy", b: x.amount });
  return out;
}
