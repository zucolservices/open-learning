/** A small dbt project: sources, staging, intermediate and marts, with ref() edges. Made-up example. */

export type Layer = "source" | "staging" | "intermediate" | "marts";
export const LAYERS: Layer[] = ["source", "staging", "intermediate", "marts"];

export interface Node {
  id: string;
  layer: Layer;
  refs: string[];
  does: string;
}

export const NODES: Node[] = [
  {
    id: "shop.orders",
    layer: "source",
    refs: [],
    does: "Raw orders table loaded from the shop database.",
  },
  { id: "shop.customers", layer: "source", refs: [], does: "Raw customers table." },
  {
    id: "payments.payments",
    layer: "source",
    refs: [],
    does: "Raw payments from the payment provider.",
  },
  {
    id: "stg_shop__orders",
    layer: "staging",
    refs: ["shop.orders"],
    does: "One-to-one with the source: rename columns, cast types, nothing else.",
  },
  {
    id: "stg_shop__customers",
    layer: "staging",
    refs: ["shop.customers"],
    does: "Clean names and types for customers.",
  },
  {
    id: "stg_payments__payments",
    layer: "staging",
    refs: ["payments.payments"],
    does: "Amounts converted from paise to rupees.",
  },
  {
    id: "int_payments_pivoted_to_orders",
    layer: "intermediate",
    refs: ["stg_payments__payments"],
    does: "One row per order with total paid by method: reused by two marts.",
  },
  {
    id: "fct_orders",
    layer: "marts",
    refs: ["stg_shop__orders", "int_payments_pivoted_to_orders"],
    does: "Orders at one row per order, with amounts paid.",
  },
  {
    id: "dim_customers",
    layer: "marts",
    refs: ["stg_shop__customers", "int_payments_pivoted_to_orders"],
    does: "Customers with lifetime value.",
  },
];

export const PLACEABLE = NODES.filter((n) => n.layer !== "source").map((n) => n.id);

export function upstream(id: string): Set<string> {
  const out = new Set<string>();
  const walk = (x: string) => {
    for (const r of NODES.find((n) => n.id === x)?.refs ?? []) {
      out.add(r);
      walk(r);
    }
  };
  walk(id);
  return out;
}

export const FCT_SQL = `-- models/marts/fct_orders.sql
with orders as (
    select * from {{ ref('stg_shop__orders') }}
),
payments as (
    select * from {{ ref('int_payments_pivoted_to_orders') }}
)
select
    orders.order_id,
    orders.customer_id,
    orders.ordered_at,
    payments.total_paid
from orders
left join payments using (order_id)`;

export const COMPILED = `select * from analytics.staging.stg_shop__orders
...
select * from analytics.intermediate.int_payments_pivoted_to_orders`;

export const TESTS_YML = `models:
  - name: fct_orders
    columns:
      - name: order_id
        data_tests: [unique, not_null]
      - name: status
        data_tests:
          - accepted_values:
              arguments:
                values: ['placed', 'shipped', 'returned']
      - name: customer_id
        data_tests:
          - relationships:
              arguments:
                to: ref('dim_customers')
                field: customer_id`;
