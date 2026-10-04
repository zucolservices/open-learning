/** Three jobs against a normalised model and a denormalised one. All figures illustrative. */

export type Shape = "norm" | "denorm";
export type Job = "checkout" | "rename" | "report";

export const JOBS: Record<Job, { name: string; kind: "OLTP" | "OLAP"; desc: string }> = {
  checkout: {
    name: "A customer checks out",
    kind: "OLTP",
    desc: "Record one order with two items and reduce stock.",
  },
  rename: {
    name: "Rename a product category",
    kind: "OLTP",
    desc: "“Snacks” becomes “Savouries”.",
  },
  report: {
    name: "Yearly sales by region and category",
    kind: "OLAP",
    desc: "Add up 10 million order lines.",
  },
};

export const RESULTS: Record<
  Shape,
  Record<Job, { work: number; rows: string; tables: string; note: string; ok: boolean }>
> = {
  norm: {
    checkout: {
      work: 3,
      rows: "4 small rows",
      tables: "3 tables",
      note: "Each fact written once: an order, two lines, a stock count.",
      ok: true,
    },
    rename: {
      work: 1,
      rows: "1 row",
      tables: "categories",
      note: "One row; every report sees the new name at once.",
      ok: true,
    },
    report: {
      work: 60,
      rows: "10 million rows",
      tables: "6 tables joined",
      note: "order_lines → orders → customers → regions, and → products → categories. Correct, but lots of joining.",
      ok: false,
    },
  },
  denorm: {
    checkout: {
      work: 8,
      rows: "2 wide rows",
      tables: "1 table, 18 columns each",
      note: "Customer, region, product and category details copied into every row. More to write, and more to get wrong.",
      ok: false,
    },
    rename: {
      work: 100,
      rows: "2 million rows",
      tables: "the whole sales table",
      note: "Every row that mentions the old name must change; miss some and reports disagree.",
      ok: false,
    },
    report: {
      work: 10,
      rows: "10 million rows, 3 columns",
      tables: "no joins",
      note: "Region, category and amount are already on each row: one scan.",
      ok: true,
    },
  },
};

export const FLOW = [
  { name: "Shop app", sub: "OLTP database", cls: "viz-data" },
  { name: "Payments", sub: "OLTP database", cls: "viz-data" },
  { name: "ETL / ELT", sub: "copy and reshape, on a schedule", cls: "viz-compute" },
  { name: "Warehouse", sub: "OLAP model: star schemas", cls: "viz-meta" },
  { name: "Dashboards", sub: "reports and analysis", cls: "viz-add" },
];
