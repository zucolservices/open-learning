/** Designing a supermarket sales fact table in Kimball's four steps. Made-up example. */

export interface Opt {
  id: string;
  label: string;
  ok: boolean;
  note: string;
}

export const PROCESSES: Opt[] = [
  {
    id: "pos",
    label: "Customers buying at the checkout (point of sale)",
    ok: true,
    note: "A real measurement event: every scan at the till.",
  },
  {
    id: "dash",
    label: "The weekly sales dashboard",
    ok: false,
    note: "That's a report. Kimball designs from the business event, not from today's reports.",
  },
  {
    id: "deliv",
    label: "Suppliers delivering stock",
    ok: true,
    note: "A valid process too, but a different fact table. Let's take checkout sales first.",
  },
];

export const GRAINS: Opt[] = [
  {
    id: "line",
    label: "One row per item scanned on a receipt",
    ok: true,
    note: "The atomic grain: the lowest level the till captures.",
  },
  {
    id: "receipt",
    label: "One row per receipt",
    ok: false,
    note: "Loses which products were bought: you can't answer 'what sells with bread?'.",
  },
  {
    id: "daily",
    label: "One row per product, per store, per day",
    ok: false,
    note: "A summary. Useful later for speed, but it presumes the questions; you can't see hours or baskets.",
  },
];

export const DIMS: Opt[] = [
  { id: "date", label: "Date", ok: true, note: "When the scan happened." },
  { id: "time", label: "Time of day", ok: true, note: "Each scan has a time." },
  { id: "product", label: "Product", ok: true, note: "Each line is one product." },
  { id: "store", label: "Store", ok: true, note: "Each receipt is in one store." },
  { id: "promo", label: "Promotion", ok: true, note: "A line may be on offer." },
  {
    id: "cashier",
    label: "Cashier",
    ok: true,
    note: "Who served the receipt: single-valued for every line.",
  },
  {
    id: "supplierContract",
    label: "Supplier contract terms",
    ok: false,
    note: "Not single-valued at a till scan; belongs to a purchasing process.",
  },
];

export const FACTS: Opt[] = [
  { id: "qty", label: "Quantity", ok: true, note: "Measured on each line." },
  { id: "amount", label: "Sales amount", ok: true, note: "Additive across everything." },
  { id: "discount", label: "Discount amount", ok: true, note: "Per line, additive." },
  {
    id: "total",
    label: "Receipt total",
    ok: false,
    note: "A fact about the whole receipt, repeated on each line: sum it and you over-count. Different grain.",
  },
  {
    id: "area",
    label: "Store floor area",
    ok: false,
    note: "Not measured by a sale; it's an attribute of the store dimension.",
  },
];

export const STEPS = [
  { title: "1 · Select the business process", opts: PROCESSES, multi: false, key: "process" },
  { title: "2 · Declare the grain", opts: GRAINS, multi: false, key: "grain" },
  { title: "3 · Identify the dimensions", opts: DIMS, multi: true, key: "dims" },
  { title: "4 · Identify the facts", opts: FACTS, multi: true, key: "facts" },
] as const;

export const QUESTIONS: { q: string; needs: string[] }[] = [
  { q: "Sales by store last month", needs: ["line", "receipt", "daily"] },
  { q: "Which products are bought together?", needs: ["line"] },
  { q: "Busiest hour on Saturdays", needs: ["line", "receipt"] },
  { q: "Average basket size", needs: ["line", "receipt"] },
];

export const MIXED: [string, string, number][] = [
  ["receipt 881", "TOTAL", 300],
  ["receipt 881", "Bread", 60],
  ["receipt 881", "Milk", 90],
  ["receipt 881", "Eggs", 150],
];
