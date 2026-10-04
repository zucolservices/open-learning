/** A café's sales: one messy sheet and the same facts modelled as tables. Data is made up. */

export const MESSY: {
  date: string;
  customer: string;
  item: string;
  amount: string;
  flag?: string;
}[] = [
  {
    date: "02/03/2026",
    customer: "Asha Rao",
    item: "Masala chai",
    amount: "₹120",
    flag: "date: 2 March or 3 February? amount stored as text",
  },
  {
    date: "2026-03-05",
    customer: "asha rao ",
    item: "Chai, masala",
    amount: "120",
    flag: "same person, different spelling; same drink, different name",
  },
  { date: "2026-03-05", customer: "Ben Thomas", item: "Samosa", amount: "60" },
  {
    date: "2026-03-05",
    customer: "Ben Thomas",
    item: "Samosa",
    amount: "60",
    flag: "entered twice by mistake",
  },
  {
    date: "03/09/2026",
    customer: "B. Thomas",
    item: "Masala chai",
    amount: "120",
    flag: "meant 9 March; read as 3 September by some tools",
  },
  { date: "2026-03-12", customer: "Chitra N", item: "Filter coffee", amount: "90" },
  { date: "12 Mar", customer: "chitra n.", item: "Samosa", amount: "60", flag: "no year" },
  { date: "2026-04-01", customer: "Dev Mehta", item: "Masala chai", amount: "120" },
];

export const CUSTOMERS: [number, string][] = [
  [1, "Asha Rao"],
  [2, "Ben Thomas"],
  [3, "Chitra Nair"],
  [4, "Dev Mehta"],
];

export const PRODUCTS: [number, string, number][] = [
  [1, "Masala chai", 120],
  [2, "Samosa", 60],
  [3, "Filter coffee", 90],
];

/** order id, ISO date, customer id, product id */
export const ORDERS: [number, string, number, number][] = [
  [101, "2026-03-02", 1, 1],
  [102, "2026-03-05", 1, 1],
  [103, "2026-03-05", 2, 2],
  [104, "2026-03-09", 2, 1],
  [105, "2026-03-12", 3, 3],
  [106, "2026-03-12", 3, 2],
  [107, "2026-04-01", 4, 1],
];

export type Q = "revenue" | "customers" | "best";

export const QUESTIONS: Record<
  Q,
  { ask: string; messy: string; messyWhy: string[]; modelled: string; sql: string }
> = {
  revenue: {
    ask: "What did we take in March?",
    messy: "₹450",
    messyWhy: [
      "“₹120” is text, so SUM skips it",
      "“12 Mar” has no year, so it's not counted as March",
      "the duplicate samosa is counted twice",
    ],
    modelled: "₹570",
    sql: `SELECT SUM(p.price)
FROM orders o JOIN products p ON p.id = o.product_id
WHERE o.order_date >= '2026-03-01' AND o.order_date < '2026-04-01'`,
  },
  customers: {
    ask: "How many different customers do we have?",
    messy: "7",
    messyWhy: [
      "“Asha Rao” and “asha rao ” look like two people",
      "“Ben Thomas” and “B. Thomas” too",
      "and “Chitra N” and “chitra n.”",
    ],
    modelled: "4",
    sql: `SELECT COUNT(*) FROM customers`,
  },
  best: {
    ask: "What's our best-seller?",
    messy: "A tie: Masala chai and Samosa, 3 each",
    messyWhy: [
      "“Chai, masala” is counted as a different drink",
      "the duplicate samosa row adds one",
    ],
    modelled: "Masala chai, 4 orders",
    sql: `SELECT p.name, COUNT(*) AS orders
FROM orders o JOIN products p ON p.id = o.product_id
GROUP BY p.name ORDER BY orders DESC LIMIT 1`,
  },
};
