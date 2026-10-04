/** A supplier's product file, a live profile, and suggested rules to review. Made-up data. */

export const COLS = ["sku", "name", "price", "currency", "stock", "category", "weight_g"] as const;
export type Col = (typeof COLS)[number];

export const ROWS: Record<Col, string>[] = [
  ["AB-1001", "Steel bottle", "640", "INR", "120", "kitchen", "350"],
  ["AB-1002", "Bamboo brush", "90", "INR", "", "bath", "40"],
  ["AB-1003", "Cotton towel", "450", "INR", "60", "bath", "420"],
  ["AB-1004", "Clay pot", "99999", "INR", "15", "garden", "2100"],
  ["AB-1005", "Jute bag", "220", "INR", "300", "kitchen", "180"],
  ["AB-1006", "Neem comb", "75", "INR", "", "bath", "25"],
  ["AB-1007", "Brass lamp", "1450", "INR", "8", "decor", "900"],
  ["AB-1008", "Coir mat", "380", "INR", "40", "garden", "1300"],
  ["AB-1009", "Copper cup", "560", "INR", "75", "kitchen", "210"],
  ["AB-1010", "Wooden spoon", "120", "INR", "200", "kitchen", "60"],
  ["ab_1011", "Cane basket", "690", "INR", "22", "decor", "650"],
  ["AB-1012", "Sisal rug", "1890", "INR", "", "decor", "2400"],
].map((r) => Object.fromEntries(COLS.map((c, i) => [c, r[i]])) as Record<Col, string>);

const pattern = (v: string) =>
  v.replace(/[A-Z]/g, "A").replace(/[a-z]/g, "a").replace(/[0-9]/g, "9");

export function profile(c: Col) {
  const vals = ROWS.map((r) => r[c]);
  const present = vals.filter((v) => v !== "");
  const counts = new Map<string, number>();
  present.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  const nums = present.map(Number).filter((n) => !Number.isNaN(n));
  const numeric = nums.length === present.length && present.length > 0;
  const patterns = new Map<string, number>();
  present.forEach((v) => patterns.set(pattern(v), (patterns.get(pattern(v)) ?? 0) + 1));
  const sorted = [...nums].sort((a, b) => a - b);
  return {
    rows: vals.length,
    nulls: vals.length - present.length,
    distinct: counts.size,
    unique: [...counts.values()].filter((n) => n === 1).length,
    numeric,
    min: numeric ? sorted[0] : undefined,
    max: numeric ? sorted[sorted.length - 1] : undefined,
    median: numeric ? sorted[Math.floor(sorted.length / 2)] : undefined,
    top: [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3),
    patterns: [...patterns.entries()].sort((a, b) => b[1] - a[1]),
    values: nums,
  };
}

export const SUGGESTIONS: { id: string; rule: string; keep: boolean; why: string }[] = [
  {
    id: "sku-null",
    rule: "sku is never null",
    keep: true,
    why: "Every product needs an identifier.",
  },
  { id: "sku-unique", rule: "sku is unique", keep: true, why: "One row per product." },
  {
    id: "sku-pattern",
    rule: "sku matches AA-9999",
    keep: true,
    why: "11 of 12 follow it; 'ab_1011' is the error to fix, not a reason to drop the rule.",
  },
  {
    id: "price-range",
    rule: "price is between 75 and 99,999",
    keep: false,
    why: "The range was learned from data that includes the ₹99,999 clay pot, so it bakes the error into the rule.",
  },
  {
    id: "price-nonneg",
    rule: "price is never negative",
    keep: true,
    why: "A sound business rule.",
  },
  {
    id: "currency-set",
    rule: "currency is always INR",
    keep: false,
    why: "True of this sample only: the supplier starts selling in USD next month. Ask before encoding it.",
  },
  {
    id: "category-set",
    rule: "category is one of kitchen, bath, garden, decor",
    keep: true,
    why: "Matches the agreed category list.",
  },
  {
    id: "weight-type",
    rule: "weight_g holds integers (stored as text)",
    keep: true,
    why: "Profiling found a numeric column stored as text: cast it.",
  },
];
