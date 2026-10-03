/** An EXPLAIN plan for a join, node by node (illustrative numbers). */

export interface PlanNode {
  id: string;
  depth: number;
  line: string;
  detail?: string;
  actual: string;
  explain: string;
}

export const SQL = `SELECT o.id, c.name, o.amount
FROM orders o JOIN customers c ON c.id = o.customer_id
WHERE c.city = 'Pune' AND o.status = 'paid'
ORDER BY o.created_at DESC
LIMIT 10;`;

export const NODES: PlanNode[] = [
  {
    id: "limit",
    depth: 0,
    line: "Limit  (cost=1250.40..1250.43 rows=10 width=40)",
    actual: "(actual time=18.2..18.2 rows=10.00 loops=1)",
    explain:
      "The top node: it asks the sort for rows and stops after 10. Its total cost includes everything below it.",
  },
  {
    id: "sort",
    depth: 1,
    line: "->  Sort  (cost=1250.40..1252.90 rows=1000 width=40)",
    detail: "Sort Key: o.created_at DESC",
    actual: "(actual time=18.2..18.2 rows=10.00 loops=1)",
    explain:
      "Must read all of its input before returning the first row, so its start-up cost (1250.40) is high. With a LIMIT it only keeps the top 10.",
  },
  {
    id: "hash-join",
    depth: 2,
    line: "->  Hash Join  (cost=35.50..1228.80 rows=1000 width=40)",
    detail: "Hash Cond: (o.customer_id = c.id)",
    actual: "(actual time=0.9..17.5 rows=940.00 loops=1)",
    explain:
      "Joins the two inputs: it builds a hash table from the Pune customers, then streams paid orders through it looking for matches. Module 11 covers join methods.",
  },
  {
    id: "seq",
    depth: 3,
    line: "->  Seq Scan on orders o  (cost=0.00..1150.00 rows=50000 width=24)",
    detail: "Filter: (status = 'paid')",
    actual: "(actual time=0.01..9.8 rows=50210.00 loops=1)",
    explain:
      "Reads the whole orders table and keeps paid ones. rows=50000 is how many rows it emits after the filter, not how many it reads.",
  },
  {
    id: "hash",
    depth: 3,
    line: "->  Hash  (cost=23.00..23.00 rows=1000 width=24)",
    actual: "(actual time=0.8..0.8 rows=1012.00 loops=1)",
    explain: "Collects its input into an in-memory hash table for the join above.",
  },
  {
    id: "index",
    depth: 4,
    line: "->  Index Scan using customers_city_idx on customers c  (cost=0.29..23.00 rows=1000 width=24)",
    detail: "Index Cond: (city = 'Pune')",
    actual: "(actual time=0.02..0.6 rows=1012.00 loops=1)",
    explain:
      "The bottom-right leaf: uses the city index to find Pune customers. The planner estimated 1,000; the actual count, 1,012, is close, so its choices were sound.",
  },
];
