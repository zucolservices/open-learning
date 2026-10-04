/** A tiny shop database, with actions that test its keys. Data is made up. */

export interface Db {
  customers: { id: number; name: string; email: string }[];
  products: { no: number; name: string }[];
  orders: { id: number; customer_id: number }[];
  items: { order_id: number; product_no: number; qty: number }[];
}

export const START: Db = {
  customers: [
    { id: 1, name: "Asha", email: "asha@example.com" },
    { id: 2, name: "Ben", email: "ben@example.com" },
  ],
  products: [
    { no: 10, name: "Chai" },
    { no: 11, name: "Samosa" },
    { no: 12, name: "Coffee" },
  ],
  orders: [
    { id: 100, customer_id: 1 },
    { id: 101, customer_id: 2 },
  ],
  items: [
    { order_id: 100, product_no: 10, qty: 2 },
    { order_id: 100, product_no: 11, qty: 1 },
    { order_id: 101, product_no: 10, qty: 1 },
  ],
};

export type ActionId =
  | "addOrder9"
  | "addOrder2"
  | "dupCustomer"
  | "dupEmail"
  | "delProduct10"
  | "delOrder100"
  | "dupItem";

export const ACTIONS: { id: ActionId; label: string; sql: string }[] = [
  {
    id: "addOrder2",
    label: "Add an order for customer 2",
    sql: "INSERT INTO orders VALUES (102, 2);",
  },
  {
    id: "addOrder9",
    label: "Add an order for customer 9",
    sql: "INSERT INTO orders VALUES (103, 9);",
  },
  {
    id: "dupCustomer",
    label: "Add another customer with id 1",
    sql: "INSERT INTO customers VALUES (1, 'Chitra', 'chitra@example.com');",
  },
  {
    id: "dupEmail",
    label: "Add a customer with Asha's email",
    sql: "INSERT INTO customers VALUES (3, 'A. Rao', 'asha@example.com');",
  },
  {
    id: "dupItem",
    label: "Add chai to order 100 again",
    sql: "INSERT INTO order_items VALUES (100, 10, 1);",
  },
  {
    id: "delProduct10",
    label: "Delete product 10 (chai)",
    sql: "DELETE FROM products WHERE no = 10;",
  },
  { id: "delOrder100", label: "Delete order 100", sql: "DELETE FROM orders WHERE id = 100;" },
];

export interface Result {
  db: Db;
  ok: boolean;
  msg: string;
  orphans: string[];
}

export function apply(db: Db, a: ActionId, enforce: boolean): Result {
  const next: Db = JSON.parse(JSON.stringify(db));
  const fail = (msg: string): Result => ({ db, ok: false, msg, orphans: orphans(db) });
  const done = (msg: string): Result => ({ db: next, ok: true, msg, orphans: orphans(next) });
  switch (a) {
    case "addOrder2":
      next.orders.push({ id: 102 + next.orders.length, customer_id: 2 });
      return done("Inserted: customer 2 exists.");
    case "addOrder9":
      if (enforce && !db.customers.some((c) => c.id === 9))
        return fail("Rejected by the foreign key: there is no customer 9.");
      next.orders.push({ id: 103 + next.orders.length, customer_id: 9 });
      return done("Inserted. Nothing checked that customer 9 exists.");
    case "dupCustomer":
      if (enforce && db.customers.some((c) => c.id === 1))
        return fail("Rejected by the primary key: id 1 is already taken.");
      next.customers.push({ id: 1, name: "Chitra", email: "chitra@example.com" });
      return done("Inserted. Now two different customers share id 1.");
    case "dupEmail":
      if (enforce && db.customers.some((c) => c.email === "asha@example.com"))
        return fail("Rejected by the unique constraint on email: another candidate key.");
      next.customers.push({ id: 3, name: "A. Rao", email: "asha@example.com" });
      return done("Inserted. Is this a new person, or Asha again?");
    case "dupItem":
      if (enforce && db.items.some((i) => i.order_id === 100 && i.product_no === 10))
        return fail(
          "Rejected by the composite primary key (order_id, product_no): change the quantity instead.",
        );
      next.items.push({ order_id: 100, product_no: 10, qty: 1 });
      return done("Inserted. Order 100 now lists chai twice.");
    case "delProduct10":
      if (enforce && db.items.some((i) => i.product_no === 10))
        return fail("Rejected (ON DELETE RESTRICT): order items still point at product 10.");
      next.products = next.products.filter((p) => p.no !== 10);
      return done("Deleted.");
    case "delOrder100": {
      next.orders = next.orders.filter((o) => o.id !== 100);
      if (enforce) {
        const n = next.items.filter((i) => i.order_id === 100).length;
        next.items = next.items.filter((i) => i.order_id !== 100);
        return done(`Deleted, and ON DELETE CASCADE removed its ${n} order items.`);
      }
      return done("Deleted. Its items stay behind.");
    }
  }
}

function orphans(db: Db): string[] {
  const out: string[] = [];
  for (const o of db.orders)
    if (!db.customers.some((c) => c.id === o.customer_id))
      out.push(`order ${o.id} → customer ${o.customer_id}`);
  for (const i of db.items) {
    if (!db.orders.some((o) => o.id === i.order_id)) out.push(`item → order ${i.order_id}`);
    if (!db.products.some((p) => p.no === i.product_no)) out.push(`item → product ${i.product_no}`);
  }
  return [...new Set(out)];
}

export function replay(log: ActionId[], enforce: boolean): Result {
  let r: Result = { db: START, ok: true, msg: "", orphans: [] };
  for (const a of log) r = apply(r.db, a, enforce);
  return r;
}

export const CANDIDATES: {
  col: string;
  unique: string;
  stable: string;
  verdict: string;
  good: boolean;
}[] = [
  {
    col: "member_id (generated)",
    unique: "yes",
    stable: "yes, never changes",
    verdict: "A surrogate key: means nothing, so nothing forces it to change.",
    good: true,
  },
  {
    col: "email",
    unique: "yes (if enforced)",
    stable: "no, people change email",
    verdict: "A good candidate key to keep unique, but a risky primary key.",
    good: false,
  },
  {
    col: "phone",
    unique: "not always (shared family phones)",
    stable: "no",
    verdict: "Not a key.",
    good: false,
  },
  {
    col: "name + date of birth",
    unique: "usually, not always",
    stable: "names change",
    verdict: "Not reliably unique: not a key.",
    good: false,
  },
  {
    col: "national ID number",
    unique: "yes",
    stable: "yes",
    verdict:
      "A natural key, but sensitive personal data: think twice before copying it everywhere.",
    good: false,
  },
];
