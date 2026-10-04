/** A star vs one big table, on row and column storage. All sizes illustrative. */

export const ROWS_M = 100; // million fact rows
export const WIDTHS = [12, 60, 200];
export type Shape = "star" | "obt";
export type Store = "row" | "column";

const FACT_COLS = 6;
const BYTES = 8;

export function measure(shape: Shape, store: Store, width: number) {
  const dimCols = width - FACT_COLS;
  const factGB = (ROWS_M * FACT_COLS * BYTES) / 1000;
  const dimRowGB = (ROWS_M * dimCols * 10) / 1000; // dimension attributes copied onto every row
  const compress = store === "column" ? 0.15 : 1; // repeated text compresses well in columns
  const storage = shape === "star" ? factGB + 0.2 : factGB + dimRowGB * compress;
  const queryCols = 3;
  let read: number;
  if (store === "row") read = storage;
  else
    read =
      shape === "star"
        ? (ROWS_M * queryCols * BYTES) / 1000 + 0.05
        : (ROWS_M * 2 * BYTES) / 1000 + (ROWS_M * 10 * compress) / 1000;
  return {
    storage,
    read,
    joins: shape === "star" ? 2 : 0,
    renameRows: shape === "star" ? "1 row" : `${(ROWS_M / 8).toFixed(1)} million rows`,
  };
}

export const fmtGB = (g: number) => (g >= 1 ? `${g.toFixed(1)} GB` : `${Math.round(g * 1000)} MB`);

export const NESTED = `CREATE TABLE orders (
  order_id   STRING,
  order_date DATE,
  customer   STRUCT<id STRING, city STRING>,
  lines      ARRAY<STRUCT<product STRING, qty INT64, amount NUMERIC>>
);

SELECT o.customer.city, l.product, SUM(l.amount)
FROM orders o, UNNEST(o.lines) AS l
GROUP BY 1, 2;`;
