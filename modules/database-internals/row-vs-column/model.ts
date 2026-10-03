/** One million orders, two layouts, two queries (illustrative sizes). */

export type Layout = "row" | "column";
export type Query = "checkout" | "report";

export const COLUMNS = ["id", "customer", "date", "city", "amount", "status", "address", "note"];

export const QUERIES: Record<Query, { label: string; sql: string; needs: string[] }> = {
  checkout: {
    label: "Show one order",
    sql: "SELECT * FROM orders WHERE id = 'ord_9';",
    needs: COLUMNS,
  },
  report: {
    label: "Monthly revenue",
    sql: "SELECT date_trunc('month', date), SUM(amount)\nFROM orders GROUP BY 1;",
    needs: ["date", "amount"],
  },
};

export function cost(layout: Layout, q: Query): { mb: number; reads: number; note: string } {
  if (layout === "row") {
    if (q === "checkout")
      return { mb: 0.008, reads: 1, note: "The whole order sits together on one page: one read." };
    return {
      mb: 200,
      reads: 25000,
      note: "Every page holds whole rows, so all 200 MB is read to use two columns.",
    };
  }
  if (q === "checkout")
    return {
      mb: 0.064,
      reads: 8,
      note: "Each column lives in its own place: eight reads to rebuild one order.",
    };
  return {
    mb: 3,
    reads: 380,
    note: "Only date and amount are read, and they compress well: about 3 MB.",
  };
}
