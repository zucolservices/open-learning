/** "Active customers in September" three ways, then once. Made-up orders. */

export const ORDERS: [string, string, boolean][] = [
  ["Asha", "2026-09-02", false],
  ["Asha", "2026-09-20", false],
  ["Ben", "2026-09-05", true],
  ["Chitra", "2026-08-25", false],
  ["Chitra", "2026-09-11", false],
  ["Dev", "2026-08-28", false],
  ["Esha", "2026-09-14", false],
  ["Farhan", "2026-09-29", true],
  ["Farhan", "2026-09-30", false],
  ["Gita", "2026-08-15", false],
  ["Hari", "2026-09-03", false],
  ["Hari", "2026-09-04", false],
];

export interface Def {
  window: "month" | "30d";
  refunds: boolean;
  min: 1 | 2;
}

export function activeCustomers(d: Def) {
  const inWindow = (date: string) =>
    d.window === "month"
      ? date >= "2026-09-01" && date <= "2026-09-30"
      : date >= "2026-09-01"
        ? true
        : date >= "2026-08-31";
  const counts = new Map<string, number>();
  for (const [c, date, refunded] of ORDERS) {
    if (!inWindow(date)) continue;
    if (!d.refunds && refunded) continue;
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, n]) => n >= d.min).map(([c]) => c);
}

export const DASHBOARDS: { tool: string; team: string; def: Def; how: string }[] = [
  {
    tool: "BI dashboard",
    team: "Finance",
    def: { window: "month", refunds: false, min: 1 },
    how: "≥1 paid order in the calendar month",
  },
  {
    tool: "Spreadsheet",
    team: "Marketing",
    def: { window: "30d", refunds: true, min: 1 },
    how: "any order in the last 30 days, refunds included",
  },
  {
    tool: "Notebook",
    team: "Product",
    def: { window: "month", refunds: false, min: 2 },
    how: "≥2 paid orders in the month",
  },
];

export const METRICFLOW = `semantic_models:
  - name: orders
    model: ref('fct_orders')
    entities:
      - name: order
        type: primary
        expr: order_id
      - name: customer
        type: foreign
        expr: customer_id
    dimensions:
      - name: ordered_at
        type: time
        type_params: { time_granularity: day }
      - name: is_refunded
        type: categorical
    measures:
      - name: customers
        agg: count_distinct
        expr: customer_id

metrics:
  - name: active_customers
    type: simple
    type_params: { measure: customers }
    filter: "{{ Dimension('order__is_refunded') }} = false"`;

export const LOOKML = `view: orders {
  dimension_group: ordered {
    type: time
    timeframes: [date, month]
    sql: \${TABLE}.ordered_at ;;
  }
  dimension: is_refunded { type: yesno  sql: \${TABLE}.is_refunded ;; }
  measure: active_customers {
    type: count_distinct
    sql: \${TABLE}.customer_id ;;
    filters: [is_refunded: "no"]
  }
}`;
