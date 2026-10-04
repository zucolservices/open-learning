/** Three questions written in SQL and in PySpark, with the (simplified) plan both produce. */

export type Q = "revenue" | "paid" | "join";
export type Lang = "sql" | "py";

export const QUESTIONS: Record<
  Q,
  { name: string; sql: string; py: string; plan: [number, string][] }
> = {
  revenue: {
    name: "Top 3 cities by revenue",
    sql: `SELECT city, SUM(amount) AS revenue
FROM orders
GROUP BY city
ORDER BY revenue DESC
LIMIT 3`,
    py: `(orders.groupBy("city")
       .agg(F.sum("amount").alias("revenue"))
       .orderBy(F.desc("revenue"))
       .limit(3))`,
    plan: [
      [0, "TakeOrderedAndProject (limit 3, by revenue desc)"],
      [1, "HashAggregate (sum amount, by city)"],
      [2, "Exchange (hash by city)"],
      [3, "HashAggregate (partial sum)"],
      [4, "Scan parquet orders [city, amount]"],
    ],
  },
  paid: {
    name: "How many paid orders?",
    sql: `SELECT COUNT(*) FROM orders WHERE status = 'paid'`,
    py: `orders.filter(F.col("status") == "paid").count()`,
    plan: [
      [0, "HashAggregate (count)"],
      [1, "Exchange (single partition)"],
      [2, "HashAggregate (partial count)"],
      [3, "Filter (status = 'paid')"],
      [4, "Scan parquet orders [status], pushed filter: status = 'paid'"],
    ],
  },
  join: {
    name: "Orders with customer names",
    sql: `SELECT o.id, c.name, o.amount
FROM orders o JOIN customers c ON o.customer_id = c.id`,
    py: `(orders.join(customers, orders.customer_id == customers.id)
       .select(orders.id, customers.name, orders.amount))`,
    plan: [
      [0, "Project [id, name, amount]"],
      [1, "BroadcastHashJoin (customer_id = id)"],
      [2, "Scan parquet orders [id, customer_id, amount]"],
      [2, "BroadcastExchange"],
      [3, "Scan parquet customers [id, name]"],
    ],
  },
};
