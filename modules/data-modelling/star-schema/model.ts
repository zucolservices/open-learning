/** A tiny shop-sales star schema with real (made-up) rows, and a group-by engine. */

export const DATES = [
  { date_key: 20260302, date: "2026-03-02", month: "Mar", weekday: "Mon" },
  { date_key: 20260307, date: "2026-03-07", month: "Mar", weekday: "Sat" },
  { date_key: 20260318, date: "2026-03-18", month: "Mar", weekday: "Wed" },
  { date_key: 20260404, date: "2026-04-04", month: "Apr", weekday: "Sat" },
  { date_key: 20260413, date: "2026-04-13", month: "Apr", weekday: "Mon" },
  { date_key: 20260422, date: "2026-04-22", month: "Apr", weekday: "Wed" },
];
export const STORES = [
  { store_key: 1, city: "Pune", region: "West" },
  { store_key: 2, city: "Mumbai", region: "West" },
  { store_key: 3, city: "Bengaluru", region: "South" },
];
export const PRODUCTS = [
  { product_key: 1, name: "Chai", category: "Beverages", price: 120 },
  { product_key: 2, name: "Coffee", category: "Beverages", price: 150 },
  { product_key: 3, name: "Samosa", category: "Snacks", price: 60 },
  { product_key: 4, name: "Cake", category: "Bakery", price: 200 },
];

export interface Fact {
  date_key: number;
  store_key: number;
  product_key: number;
  quantity: number;
  revenue: number;
}

export const FACTS: Fact[] = DATES.flatMap((d, di) =>
  STORES.flatMap((s, si) =>
    PRODUCTS.map((p, pi) => {
      const quantity =
        ((di * 7 + si * 3 + pi * 5) % 6) +
        (p.name === "Chai" ? 4 : 1) +
        (s.city === "Mumbai" ? 2 : 0);
      return {
        date_key: d.date_key,
        store_key: s.store_key,
        product_key: p.product_key,
        quantity,
        revenue: quantity * p.price,
      };
    }),
  ),
);

export type Attr =
  | "date.month"
  | "date.weekday"
  | "store.city"
  | "store.region"
  | "product.name"
  | "product.category";
export const ATTRS: Attr[] = [
  "date.month",
  "date.weekday",
  "store.city",
  "store.region",
  "product.category",
  "product.name",
];
export type Measure = "revenue" | "quantity";

function attrOf(f: Fact, a: Attr): string {
  const [dim, col] = a.split(".");
  if (dim === "date") return String(DATES.find((d) => d.date_key === f.date_key)![col as "month"]);
  if (dim === "store")
    return String(STORES.find((s) => s.store_key === f.store_key)![col as "city"]);
  return String(PRODUCTS.find((p) => p.product_key === f.product_key)![col as "name"]);
}

export function query(measure: Measure, by: Attr[], filterCat: string) {
  const rows = new Map<string, { keys: string[]; v: number }>();
  for (const f of FACTS) {
    if (filterCat !== "all" && attrOf(f, "product.category") !== filterCat) continue;
    const keys = by.map((a) => attrOf(f, a));
    const k = keys.join("|");
    const r = rows.get(k) ?? { keys, v: 0 };
    r.v += f[measure];
    rows.set(k, r);
  }
  return [...rows.values()].sort((a, b) => b.v - a.v);
}

export function sql(measure: Measure, by: Attr[], filterCat: string) {
  const dims = [
    ...new Set([...by.map((a) => a.split(".")[0]), ...(filterCat !== "all" ? ["product"] : [])]),
  ];
  const cols = by
    .map((a) => a.replace(".", "_dim.").replace("_dim.", "."))
    .map((a) => {
      const [d, c] = a.split(".");
      return `${d[0]}.${c}`;
    });
  const join = dims.map((d) => `JOIN dim_${d} ${d[0]} USING (${d}_key)`).join("\n");
  return `SELECT ${[...cols, `SUM(f.${measure}) AS ${measure}`].join(", ")}
FROM fact_sales f
${join}${filterCat !== "all" ? `\nWHERE p.category = '${filterCat}'` : ""}${cols.length ? `\nGROUP BY ${cols.join(", ")}` : ""}`;
}
