/** Rough work estimates for three join methods (illustrative "row touches", not real costs). */

export type Method = "nested" | "hash" | "merge";

export const METHODS: Record<Method, { name: string; idea: string }> = {
  nested: { name: "Nested loop", idea: "For each customer, look for their orders." },
  hash: {
    name: "Hash join",
    idea: "Build a lookup table of customers, then stream every order through it.",
  },
  merge: {
    name: "Merge join",
    idea: "Sort both sides by customer id, then walk the two lists together.",
  },
};

export const CUSTOMERS = [10, 1000, 100000];
export const ORDERS = [10000, 1000000];

export function work(m: Method, c: number, o: number, index: boolean, sorted: boolean): number {
  const lg = (n: number) => Math.max(1, Math.log2(n));
  if (m === "nested") return index ? c * (lg(o) + o / c / 10) : c * o;
  if (m === "hash") return c + o;
  return (sorted ? 0 : c * lg(c) + o * lg(o)) + c + o;
}

export function best(c: number, o: number, index: boolean, sorted: boolean): Method {
  return (Object.keys(METHODS) as Method[]).reduce((a, b) =>
    work(a, c, o, index, sorted) <= work(b, c, o, index, sorted) ? a : b,
  );
}

export function fmt(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} million`;
  if (n >= 1e3) return `${Math.round(n / 1e3)} thousand`;
  return String(Math.round(n));
}
