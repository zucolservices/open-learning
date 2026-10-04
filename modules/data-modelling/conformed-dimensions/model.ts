/** A retailer's bus matrix, plus a drill-across example. Made-up data. */

export const PROCESSES = [
  "Store sales",
  "Inventory",
  "Purchase orders",
  "Returns",
  "Online orders",
];
export const DIMS = ["Date", "Product", "Store", "Customer", "Supplier", "Promotion", "Warehouse"];

/** Suggested matrix: [process][dim]. */
export const SUGGESTED: boolean[][] = [
  [true, true, true, true, false, true, false],
  [true, true, true, false, false, false, true],
  [true, true, false, false, true, false, true],
  [true, true, true, true, false, false, false],
  [true, true, false, true, false, true, true],
];

export const WHY: Record<string, string> = {
  "Store sales|Supplier":
    "A till sale doesn't involve a supplier directly; supplier is an attribute of product if needed.",
  "Store sales|Warehouse": "The sale happens in a store, not a warehouse.",
  "Inventory|Customer": "Stock levels aren't about a customer.",
  "Inventory|Promotion": "A stock level isn't on offer; sales are.",
  "Purchase orders|Store": "Orders to suppliers deliver to warehouses here.",
  "Purchase orders|Customer": "Customers aren't part of buying from suppliers.",
  "Online orders|Store": "Online orders ship from a warehouse, not a shop.",
};

export const SALES_BY_MONTH: [string, number][] = [
  ["Jan", 400],
  ["Jan", 600],
  ["Feb", 700],
  ["Feb", 500],
];
/** Inventory periodic snapshot: three weekly-ish snapshots per month (units on hand). */
export const STOCK_BY_MONTH: [string, number][] = [
  ["Jan", 90],
  ["Jan", 80],
  ["Jan", 70],
  ["Feb", 60],
  ["Feb", 75],
  ["Feb", 90],
];

export const CATS_SALES = ["Beverages", "Snacks", "Bakery"];
export const CATS_STOCK_BAD = ["Hot drinks", "SNACKS", "Bakery"];
