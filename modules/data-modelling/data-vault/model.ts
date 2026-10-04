/** Four loads into a small Data Vault. Hashes are a short stand-in, not a real hash function. Data made up. */

export const h = (s: string) => {
  let x = 0;
  for (const c of s) x = (x * 31 + c.charCodeAt(0)) >>> 0;
  return x.toString(16).padStart(8, "0").slice(-6);
};

export interface Table {
  name: string;
  kind: "hub" | "link" | "sat";
  head: string[];
  rows: { cells: string[]; load: number }[];
}

const hubCustomer = (load: number) => ({
  name: "hub_customer",
  kind: "hub" as const,
  head: ["customer_hk", "customer_no", "load_date", "record_source"],
  rows: [
    { cells: [h("C-17"), "C-17", "2026-01-05", "crm"], load: 1 },
    { cells: [h("C-18"), "C-18", "2026-01-05", "crm"], load: 1 },
  ].filter((r) => r.load <= load),
});

export const LOADS = [
  { title: "Empty vault", note: "Nothing loaded yet." },
  {
    title: "Load 1: CRM customers",
    note: "Each business key goes in a hub once. Descriptive details go in a satellite. Every row records when it arrived and where from.",
  },
  {
    title: "Load 2: shop orders",
    note: "A new hub for orders, and a link recording which customer placed which order. Existing tables aren't touched.",
  },
  {
    title: "Load 3: Asha moves",
    note: "The CRM says Asha now lives in Mumbai. The satellite gets a new row; nothing is updated or deleted.",
  },
  {
    title: "Load 4: a third source",
    note: "A loyalty app arrives. Its data hangs off the same customer hub in a satellite of its own. No redesign.",
  },
];

export function vault(load: number): Table[] {
  const t: Table[] = [];
  if (load >= 1) {
    t.push(hubCustomer(load));
    t.push({
      name: "sat_customer_crm",
      kind: "sat",
      head: ["customer_hk", "load_date", "name", "city", "record_source"],
      rows: [
        { cells: [h("C-17"), "2026-01-05", "Asha", "Pune", "crm"], load: 1 },
        { cells: [h("C-18"), "2026-01-05", "Ben", "Kochi", "crm"], load: 1 },
        { cells: [h("C-17"), "2026-07-01", "Asha", "Mumbai", "crm"], load: 3 },
      ].filter((r) => r.load <= load),
    });
  }
  if (load >= 2) {
    t.push({
      name: "hub_order",
      kind: "hub",
      head: ["order_hk", "order_no", "load_date", "record_source"],
      rows: [{ cells: [h("O-900"), "O-900", "2026-02-10", "shop"], load: 2 }],
    });
    t.push({
      name: "link_customer_order",
      kind: "link",
      head: ["link_hk", "customer_hk", "order_hk", "load_date", "record_source"],
      rows: [{ cells: [h("C-17|O-900"), h("C-17"), h("O-900"), "2026-02-10", "shop"], load: 2 }],
    });
    t.push({
      name: "sat_order",
      kind: "sat",
      head: ["order_hk", "load_date", "amount", "status", "record_source"],
      rows: [{ cells: [h("O-900"), "2026-02-10", "2000", "paid", "shop"], load: 2 }],
    });
  }
  if (load >= 4) {
    t.push({
      name: "sat_customer_loyalty",
      kind: "sat",
      head: ["customer_hk", "load_date", "points", "tier", "record_source"],
      rows: [{ cells: [h("C-17"), "2026-09-01", "1200", "gold", "loyalty"], load: 4 }],
    });
  }
  return t;
}

export const DV1 = [
  { name: "hubs", start: 0, end: 3 },
  { name: "links", start: 3, end: 6 },
  { name: "satellites", start: 3, end: 7 },
];
export const DV2 = [
  { name: "hubs", start: 0, end: 3 },
  { name: "links", start: 0, end: 3 },
  { name: "satellites", start: 0, end: 4 },
];
