/** Five services over shared tables, or each owning its own; four situations (illustrative). */

export type Mode = "shared" | "owned";

export const SITUATIONS = [
  "Billing renames a column in its invoices table",
  "Reports needs orders joined with invoices",
  "Placing an order must also create an invoice, all or nothing",
  "A heavy month-end report runs at noon",
];

export const OUTCOMES: Record<Mode, ["good" | "meh" | "bad", string][]> = {
  shared: [
    [
      "bad",
      "Reports and Marketing query invoices directly. Both break, and Billing didn't know they existed.",
    ],
    ["good", "One SQL join. Easy."],
    ["good", "One ACID transaction across both tables."],
    ["bad", "It competes with checkout for the same database. Customers feel it."],
  ],
  owned: [
    ["good", "Only Billing's own code changes; its API stays the same."],
    ["meh", "Combine data from two APIs, or keep a read model fed by events (module 15)."],
    ["meh", "Two services, two databases: use a saga with a compensating step if invoicing fails."],
    ["good", "Reports reads its own copy; checkout doesn't notice."],
  ],
};

export const SERVICES = ["Orders", "Billing", "Shipping", "Reports", "Marketing"];
export const TABLES: { t: string; owner: string; readers: string[] }[] = [
  { t: "customers", owner: "Orders", readers: ["Billing", "Shipping", "Marketing"] },
  { t: "orders", owner: "Orders", readers: ["Shipping", "Reports"] },
  { t: "invoices", owner: "Billing", readers: ["Reports", "Marketing"] },
  { t: "shipments", owner: "Shipping", readers: ["Orders", "Reports"] },
];

/** Three source records for one customer, and the golden record built from them. */
export const SOURCES = [
  {
    sys: "Core banking",
    name: "PRIYA S",
    phone: "98450 11111",
    address: "14 Lake Rd",
    updated: "2019",
  },
  {
    sys: "Cards",
    name: "Priya Sharma",
    phone: "99000 22222",
    address: "22 Hill St",
    updated: "2026",
  },
  {
    sys: "KYC (verified)",
    name: "Priya Sharma",
    phone: "99000 22222",
    address: "22 Hill Street",
    updated: "2026, verified",
  },
];

export const GOLDEN = [
  ["name", "Priya Sharma", "KYC: verified identity wins"],
  ["phone", "99000 22222", "most recent, matches KYC"],
  ["address", "22 Hill Street", "KYC: verified address wins"],
];
