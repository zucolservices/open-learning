/** Renaming a widely used column safely. Made-up project and reports. */

export const REPORTS = [
  "Board pack",
  "Sales weekly",
  "Churn model",
  "Finance close",
  "CRM sync",
  "Ops dashboard",
  "Pricing study",
  "Exec KPIs",
  "Region review",
  "Loyalty report",
  "Forecast",
  "Partner feed",
];

export interface Stage {
  title: string;
  options: { id: string; label: string; ok: boolean; note: string; breaks?: boolean }[];
}

export const STAGES: Stage[] = [
  {
    title: "You need cust_rev_amt in dim_customers renamed to lifetime_revenue. First move?",
    options: [
      {
        id: "inplace",
        label: "Rename the column in dim_customers and deploy",
        ok: false,
        breaks: true,
        note: "Twelve reports query cust_rev_amt. All of them fail tonight.",
      },
      {
        id: "v2",
        label: "Create version 2 of the model with the new name, alongside version 1",
        ok: true,
        note: "dim_customers_v2 has lifetime_revenue; v1 keeps working unchanged.",
      },
      {
        id: "both",
        label: "Add lifetime_revenue as a copy and keep both columns forever",
        ok: false,
        note: "Nothing breaks, but now there are two names for one thing, forever.",
      },
    ],
  },
  {
    title: "v2 is built. How do consumers find out, and by when must they move?",
    options: [
      {
        id: "date",
        label: "Mark v2 as latest and give v1 a deprecation_date three months out",
        ok: true,
        note: "dbt warns anyone still referencing v1; the deadline is in the model's metadata.",
      },
      {
        id: "slack",
        label: "Post in a chat channel and hope",
        ok: false,
        note: "Half the owners miss it; there's no record or deadline.",
      },
    ],
  },
  {
    title: "Who actually uses v1?",
    options: [
      {
        id: "lineage",
        label: "Look up downstream lineage in the catalog and contact each owner",
        ok: true,
        note: "Twelve consumers, each with a named owner.",
      },
      {
        id: "guess",
        label: "Ask around the office",
        ok: false,
        note: "You find seven. The partner feed and the churn model surprise you later.",
      },
    ],
  },
  {
    title: "Owners are migrating. What next?",
    options: [
      {
        id: "migrate",
        label: "Help each report switch to v2, checking numbers match",
        ok: true,
        note: "All twelve now read lifetime_revenue from v2.",
      },
      {
        id: "drop",
        label: "Delete v1 now to speed things up",
        ok: false,
        breaks: true,
        note: "Every report not yet migrated breaks.",
      },
    ],
  },
  {
    title: "The deprecation date has passed and nothing references v1.",
    options: [
      {
        id: "remove",
        label: "Remove v1",
        ok: true,
        note: "Done: one name, no outage, and a record of why.",
      },
      {
        id: "keep",
        label: "Keep v1 just in case",
        ok: false,
        note: "Old versions pile up and confuse new people.",
      },
    ],
  },
];

export const NAMES: [string, string, string][] = [
  ["cust_rev_amt", "lifetime_revenue", "Business terms, no abbreviations."],
  ["CustID", "customer_id", "Primary keys as <object>_id."],
  ["Active (Y/N)", "is_active", "Booleans start with is_ or has_."],
  ["created", "created_at", "Timestamps as <event>_at, in UTC."],
  ["tbl_order", "orders", "Models are plural nouns."],
  ["shopify_orders_clean", "stg_shopify__orders", "Staging: stg_<source>__<entity>s."],
];

export const CONTRACT = `models:
  - name: dim_customers
    latest_version: 2
    config:
      contract: { enforced: true }
    columns:
      - name: customer_id
        data_type: int
      - name: lifetime_revenue
        data_type: numeric
    versions:
      - v: 2
      - v: 1
        deprecation_date: 2027-01-31
        columns:
          - include: all
            exclude: [lifetime_revenue]
          - name: cust_rev_amt
            data_type: numeric`;
