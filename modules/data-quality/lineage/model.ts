/** A small lineage graph: sources → staging → marts → things people use. */

export interface Node {
  id: string;
  label: string;
  col: number;
  row: number;
  kind: "source" | "model" | "use";
  status: string;
  bad?: boolean;
  root?: boolean;
}

export const NODES: Node[] = [
  {
    id: "shop",
    label: "shop_db.orders",
    col: 0,
    row: 0,
    kind: "source",
    status: "Updated 10 min ago; row count normal.",
  },
  {
    id: "pay",
    label: "payments_api",
    col: 0,
    row: 1,
    kind: "source",
    status: "Updated 1 h ago; no failures.",
  },
  {
    id: "fx",
    label: "fx_rates.csv",
    col: 0,
    row: 2,
    kind: "source",
    status: "Last updated 9 days ago: the supplier's file stopped arriving.",
    bad: true,
    root: true,
  },
  {
    id: "crm",
    label: "crm.customers",
    col: 0,
    row: 3,
    kind: "source",
    status: "Updated this morning; all checks pass.",
  },
  {
    id: "stg_orders",
    label: "stg_orders",
    col: 1,
    row: 0,
    kind: "model",
    status: "Built at 06:10; tests pass.",
  },
  {
    id: "stg_pay",
    label: "stg_payments",
    col: 1,
    row: 1,
    kind: "model",
    status: "Built at 06:12; tests pass.",
  },
  {
    id: "stg_fx",
    label: "stg_fx_rates",
    col: 1,
    row: 2,
    kind: "model",
    status: "Built at 06:05, but every rate is from 9 days ago.",
    bad: true,
  },
  {
    id: "stg_cust",
    label: "stg_customers",
    col: 1,
    row: 3,
    kind: "model",
    status: "Built at 06:08; tests pass.",
  },
  {
    id: "fct_rev",
    label: "fct_revenue",
    col: 2,
    row: 0.5,
    kind: "model",
    status: "Built at 06:20; converts every currency with stale rates.",
    bad: true,
  },
  {
    id: "fct_ref",
    label: "fct_refunds",
    col: 2,
    row: 1.5,
    kind: "model",
    status: "Built at 06:22; also uses the stale rates.",
    bad: true,
  },
  {
    id: "dim_cust",
    label: "dim_customers",
    col: 2,
    row: 3,
    kind: "model",
    status: "Built at 06:15; fine.",
  },
  {
    id: "dash",
    label: "Revenue dashboard",
    col: 3,
    row: 0,
    kind: "use",
    status: "Finance says euro revenue looks 4% off.",
    bad: true,
  },
  {
    id: "export",
    label: "Finance export",
    col: 3,
    row: 1,
    kind: "use",
    status: "Sent to the accounting system nightly.",
    bad: true,
  },
  { id: "churn", label: "Churn model", col: 3, row: 2.2, kind: "use", status: "Retrained weekly." },
  {
    id: "email",
    label: "Marketing list",
    col: 3,
    row: 3.2,
    kind: "use",
    status: "Refreshed daily.",
  },
];

export const EDGES: [string, string][] = [
  ["shop", "stg_orders"],
  ["pay", "stg_pay"],
  ["fx", "stg_fx"],
  ["crm", "stg_cust"],
  ["stg_orders", "fct_rev"],
  ["stg_pay", "fct_rev"],
  ["stg_fx", "fct_rev"],
  ["stg_pay", "fct_ref"],
  ["stg_fx", "fct_ref"],
  ["stg_cust", "dim_cust"],
  ["stg_orders", "dim_cust"],
  ["fct_rev", "dash"],
  ["fct_rev", "export"],
  ["fct_ref", "export"],
  ["dim_cust", "churn"],
  ["fct_rev", "churn"],
  ["dim_cust", "email"],
];

function walk(start: string, dir: "up" | "down") {
  const out = new Set<string>();
  const stack = [start];
  while (stack.length) {
    const n = stack.pop()!;
    for (const [a, b] of EDGES) {
      const next = dir === "up" ? (b === n ? a : null) : a === n ? b : null;
      if (next && !out.has(next)) {
        out.add(next);
        stack.push(next);
      }
    }
  }
  return out;
}

export const upstream = (id: string) => walk(id, "up");
export const downstream = (id: string) => walk(id, "down");
