/** An orders load, five candidate tests, and what each catches. Made-up data. */

export type TestId =
  "pk_unique" | "pk_not_null" | "cust_rel" | "cust_not_null" | "status_values" | "amount_positive";

export const TESTS: { id: TestId; col: string; label: string; yaml: string; sql: string }[] = [
  {
    id: "pk_unique",
    col: "order_id",
    label: "unique",
    yaml: "- unique",
    sql: "select order_id from orders\nwhere order_id is not null\ngroup by order_id having count(*) > 1",
  },
  {
    id: "pk_not_null",
    col: "order_id",
    label: "not_null",
    yaml: "- not_null",
    sql: "select * from orders where order_id is null",
  },
  {
    id: "cust_not_null",
    col: "customer_id",
    label: "not_null",
    yaml: "- not_null",
    sql: "select * from orders where customer_id is null",
  },
  {
    id: "cust_rel",
    col: "customer_id",
    label: "relationships → customers",
    yaml: "- relationships:\n    arguments:\n      to: ref('customers')\n      field: customer_id",
    sql: "select o.customer_id from orders o\nleft join customers c using (customer_id)\nwhere o.customer_id is not null and c.customer_id is null",
  },
  {
    id: "status_values",
    col: "status",
    label: "accepted_values",
    yaml: "- accepted_values:\n    arguments:\n      values: ['placed', 'shipped', 'returned']",
    sql: "select * from orders\nwhere status not in ('placed', 'shipped', 'returned')",
  },
  {
    id: "amount_positive",
    col: "amount",
    label: "singular test: amount >= 0",
    yaml: "tests/assert_no_negative_amounts.sql",
    sql: "select * from orders where amount < 0",
  },
];

export const COLS = ["order_id", "customer_id", "status", "amount"];

export const CLEAN: (string | number | null)[][] = [
  [101, 1, "placed", 240],
  [102, 2, "shipped", 90],
  [103, 1, "returned", 120],
  [104, 3, "placed", 60],
];

/** Tuesday's load: each bad row has the defects it carries. */
export const BAD: { row: (string | number | null)[]; defects: TestId[] }[] = [
  { row: [201, 1, "placed", 240], defects: [] },
  { row: [202, 2, "shipd", 90], defects: ["status_values"] },
  { row: [202, 3, "placed", 60], defects: ["pk_unique"] },
  { row: [203, null, "placed", 300], defects: ["cust_not_null"] },
  { row: [204, 99, "shipped", 75], defects: ["cust_rel"] },
  { row: [205, 2, "returned", -120], defects: ["amount_positive"] },
];

export function results(load: "clean" | "bad", attached: TestId[]) {
  const rows = load === "clean" ? [] : BAD;
  return TESTS.filter((t) => attached.includes(t.id)).map((t) => {
    let failing = rows.filter((r) => r.defects.includes(t.id)).length;
    if (t.id === "pk_unique" && failing) failing = 1; // one duplicated key value
    return { test: t, failing };
  });
}

export function missed(load: "clean" | "bad", attached: TestId[]) {
  if (load === "clean") return [];
  return BAD.filter((r) => r.defects.length && !r.defects.some((d) => attached.includes(d)));
}
