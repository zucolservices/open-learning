/**
 * An untested, made-up invoice function with quirks, probes a learner can run against it, and two
 * refactors: a "clean rewrite from the spec" that changes behaviour, and a careful extraction
 * that keeps it. Characterisation tests lock in whatever the code does today.
 */

export type Kind = "retail" | "wholesale";
type Invoice = (items: number[], kind: Kind, coupon?: string) => number;

export const LEGACY_CODE = [
  "function invoice(items, kind, coupon) {",
  "  let t = 0;",
  "  for (const p of items) t += p;",
  '  if (kind === "wholesale") t = t * 0.85;',
  "  t = t * 1.18;",
  '  if (coupon === "SAVE10") t = t - 10;',
  '  if (kind === "wholesale") t = Math.floor(t);',
  "  else t = Math.round(t * 100) / 100;",
  "  return t;",
  "}",
];

export const legacy: Invoice = (items, kind, coupon) => {
  let t = 0;
  for (const p of items) t += p;
  if (kind === "wholesale") t = t * 0.85;
  t = t * 1.18;
  if (coupon === "SAVE10") t = t - 10;
  if (kind === "wholesale") t = Math.floor(t);
  else t = Math.round(t * 100) / 100;
  return t;
};

/** Rewritten from the (out-of-date) spec: coupon before tax, never below zero. */
const rewrite: Invoice = (items, kind, coupon) => {
  let t = items.reduce((a, b) => a + b, 0);
  if (kind === "wholesale") t *= 0.85;
  if (coupon === "SAVE10") t = Math.max(0, t - 10);
  t *= 1.18;
  return kind === "wholesale" ? Math.floor(t) : Math.round(t * 100) / 100;
};

/** Small extracted functions, same steps in the same order. */
const extracted: Invoice = (items, kind, coupon) => {
  const subtotal = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
  const tradeDiscount = (t: number) => (kind === "wholesale" ? t * 0.85 : t);
  const addGst = (t: number) => t * 1.18;
  const applyCoupon = (t: number) => (coupon === "SAVE10" ? t - 10 : t);
  const roundFor = (t: number) =>
    kind === "wholesale" ? Math.floor(t) : Math.round(t * 100) / 100;
  return roundFor(applyCoupon(addGst(tradeDiscount(subtotal(items)))));
};

export const REFACTORS: {
  id: "rewrite" | "extracted";
  label: string;
  impl: Invoice;
  blurb: string;
}[] = [
  {
    id: "rewrite",
    label: "Rewrite from the spec document",
    impl: rewrite,
    blurb: "Cleaner, and follows the spec: coupon before tax, never negative.",
  },
  {
    id: "extracted",
    label: "Extract small functions",
    impl: extracted,
    blurb: "Same steps, same order, now named.",
  },
];

export const PROBES: {
  id: string;
  items: number[];
  kind: Kind;
  coupon?: string;
  tags: string[];
}[] = [
  { id: "p1", items: [100, 200], kind: "retail", tags: ["retail"] },
  { id: "p2", items: [100, 200], kind: "wholesale", tags: ["wholesale"] },
  { id: "p3", items: [100], kind: "retail", coupon: "SAVE10", tags: ["coupon", "retail"] },
  { id: "p4", items: [], kind: "retail", coupon: "SAVE10", tags: ["coupon", "empty"] },
  { id: "p5", items: [99.99], kind: "wholesale", tags: ["wholesale", "rounding"] },
];

export const TAGS = ["retail", "wholesale", "coupon", "empty", "rounding"];

export const describe = (p: (typeof PROBES)[number]) =>
  `invoice([${p.items.join(", ")}], "${p.kind}"${p.coupon ? `, "${p.coupon}"` : ""})`;
