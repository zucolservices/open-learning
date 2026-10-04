/** An orders sheet taken from unnormalised to third normal form. Data is made up. */

export interface T {
  name: string;
  key: string[];
  head: string[];
  rows: (string | number)[][];
}

export const STAGES: { name: string; note: string; tables: T[] }[] = [
  {
    name: "Unnormalised",
    note: "One row per order, with all its items crammed into one cell. You can't sum or filter what's inside that cell.",
    tables: [
      {
        name: "orders_sheet",
        key: ["order_id"],
        head: ["order_id", "date", "customer", "phone", "items"],
        rows: [
          [100, "2 Mar", "Asha", "98450", "Chai ×2 @120, Samosa ×1 @60"],
          [101, "5 Mar", "Asha", "98450", "Chai ×1 @120"],
          [102, "5 Mar", "Ben", "99001", "Coffee ×1 @90"],
        ],
      },
    ],
  },
  {
    name: "First normal form",
    note: "One value per cell: one row per order and product. The key is now (order_id, product). But the customer and the price repeat.",
    tables: [
      {
        name: "order_lines",
        key: ["order_id", "product"],
        head: ["order_id", "date", "customer", "phone", "product", "price", "qty"],
        rows: [
          [100, "2 Mar", "Asha", "98450", "Chai", 120, 2],
          [100, "2 Mar", "Asha", "98450", "Samosa", 60, 1],
          [101, "5 Mar", "Asha", "98450", "Chai", 120, 1],
          [102, "5 Mar", "Ben", "99001", "Coffee", 90, 1],
        ],
      },
    ],
  },
  {
    name: "Second normal form",
    note: "Facts about only part of the key move out: date and customer depend on the order alone, price on the product alone.",
    tables: [
      {
        name: "orders",
        key: ["order_id"],
        head: ["order_id", "date", "customer", "phone"],
        rows: [
          [100, "2 Mar", "Asha", "98450"],
          [101, "5 Mar", "Asha", "98450"],
          [102, "5 Mar", "Ben", "99001"],
        ],
      },
      {
        name: "order_lines",
        key: ["order_id", "product"],
        head: ["order_id", "product", "qty"],
        rows: [
          [100, "Chai", 2],
          [100, "Samosa", 1],
          [101, "Chai", 1],
          [102, "Coffee", 1],
        ],
      },
      {
        name: "products",
        key: ["product"],
        head: ["product", "price"],
        rows: [
          ["Chai", 120],
          ["Samosa", 60],
          ["Coffee", 90],
        ],
      },
    ],
  },
  {
    name: "Third normal form",
    note: "The phone is a fact about the customer, not the order. Customers get their own table; each fact now lives in one place.",
    tables: [
      {
        name: "customers",
        key: ["customer_id"],
        head: ["customer_id", "name", "phone"],
        rows: [
          [1, "Asha", "98450"],
          [2, "Ben", "99001"],
        ],
      },
      {
        name: "orders",
        key: ["order_id"],
        head: ["order_id", "date", "customer_id"],
        rows: [
          [100, "2 Mar", 1],
          [101, "5 Mar", 1],
          [102, "5 Mar", 2],
        ],
      },
      {
        name: "order_lines",
        key: ["order_id", "product"],
        head: ["order_id", "product", "qty"],
        rows: [
          [100, "Chai", 2],
          [100, "Samosa", 1],
          [101, "Chai", 1],
          [102, "Coffee", 1],
        ],
      },
      {
        name: "products",
        key: ["product"],
        head: ["product", "price"],
        rows: [
          ["Chai", 120],
          ["Samosa", 60],
          ["Coffee", 90],
        ],
      },
    ],
  },
];

export type Test = "phone" | "price" | "newProduct" | "delete102";

export const TESTS: { id: Test; label: string; kind: string; results: [string, boolean][] }[] = [
  {
    id: "phone",
    label: "Asha changes her phone number",
    kind: "update anomaly",
    results: [
      ["Edit 2 rows; miss one and Asha has two numbers.", false],
      ["Edit 3 rows.", false],
      ["Edit 2 rows in orders.", false],
      ["Edit 1 row in customers.", true],
    ],
  },
  {
    id: "price",
    label: "Chai goes up to ₹130",
    kind: "update anomaly",
    results: [
      ["Rewrite text inside 2 cells.", false],
      ["Edit 2 rows.", false],
      ["Edit 1 row in products.", true],
      ["Edit 1 row in products.", true],
    ],
  },
  {
    id: "newProduct",
    label: "Add lassi to the menu before anyone orders it",
    kind: "insert anomaly",
    results: [
      ["Impossible without inventing an order.", false],
      ["Impossible: the key needs an order_id.", false],
      ["Insert 1 row in products.", true],
      ["Insert 1 row in products.", true],
    ],
  },
  {
    id: "delete102",
    label: "Delete order 102, Ben's only order",
    kind: "delete anomaly",
    results: [
      ["Ben's phone and the coffee price vanish too.", false],
      ["Ben's phone and the coffee price vanish too.", false],
      ["Ben's phone vanishes with the order.", false],
      ["Only the order goes; Ben and coffee stay.", true],
    ],
  },
];

export const VIOLATIONS = [
  {
    form: "2NF",
    rule: "the whole key",
    table: "order_lines (order_id, product, qty, price)",
    bad: "price",
    why: "The key is (order_id, product), but price depends on product alone: a fact about part of the key.",
  },
  {
    form: "3NF",
    rule: "nothing but the key",
    table: "orders (order_id, date, customer_id, phone)",
    bad: "phone",
    why: "phone depends on customer_id, which depends on order_id: a fact about another non-key column.",
  },
];
