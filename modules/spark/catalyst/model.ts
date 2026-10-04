/** One query stepped through Catalyst's phases (trees simplified). */

export const QUERY = `SELECT c.city, SUM(o.amount * (1 + 0.18))
FROM orders o JOIN customers c ON o.customer_id = c.id
WHERE c.country = 'IN'
GROUP BY c.city`;

export interface Frame {
  phase: string;
  title: string;
  text: string;
  tree: [number, string, ("new" | "moved" | "warn")?][];
}

export const FRAMES: Frame[] = [
  {
    phase: "1 · Parse",
    title: "Unresolved logical plan",
    text: "The SQL text (or your DataFrame code) becomes a tree of operations. Spark doesn't yet know whether 'orders' exists or what type 'amount' is.",
    tree: [
      [0, "Aggregate [city] [sum(amount * (1 + 0.18))]"],
      [1, "Filter (country = 'IN')"],
      [2, "Join (customer_id = id)"],
      [3, "UnresolvedRelation orders", "warn"],
      [3, "UnresolvedRelation customers", "warn"],
    ],
  },
  {
    phase: "2 · Analyse",
    title: "Resolved logical plan",
    text: "Using the catalog, Spark finds the tables, matches every column to a source and works out types. A typo in a column name fails here, before anything runs.",
    tree: [
      [0, "Aggregate [city#12] [sum(amount#3 * (1 + 0.18))]"],
      [1, "Filter (country#14 = 'IN')"],
      [2, "Join (customer_id#2 = id#10)"],
      [3, "Relation orders [id, customer_id, amount, status, … 12 columns]"],
      [3, "Relation customers [id, name, city, country, … 9 columns]"],
    ],
  },
  {
    phase: "3 · Optimise",
    title: "Optimised logical plan",
    text: "Rules rewrite the tree: 1 + 0.18 is folded to 1.18 once; the country filter is pushed below the join, onto customers; only the needed columns are kept.",
    tree: [
      [0, "Aggregate [city] [sum(amount * 1.18)]", "new"],
      [1, "Join (customer_id = id)"],
      [2, "Project [customer_id, amount]", "new"],
      [3, "Relation orders"],
      [2, "Project [id, city]", "new"],
      [3, "Filter (country = 'IN')", "moved"],
      [4, "Relation customers"],
    ],
  },
  {
    phase: "4 · Plan",
    title: "Physical plan",
    text: "Now Spark picks how to run each step. Indian customers are a small table, so it chooses a broadcast hash join and two-phase aggregation; the filter is pushed into the Parquet reader.",
    tree: [
      [0, "HashAggregate (final) [city]"],
      [1, "Exchange hashpartitioning(city)"],
      [2, "HashAggregate (partial) [city]"],
      [3, "BroadcastHashJoin (customer_id = id)", "new"],
      [4, "FileScan parquet orders [customer_id, amount]"],
      [4, "BroadcastExchange"],
      [5, "FileScan parquet customers [id, city, country], PushedFilters: country = 'IN'", "moved"],
    ],
  },
  {
    phase: "5 · Generate code",
    title: "Compiled to bytecode",
    text: "Finally, parts of the plan are compiled into compact Java bytecode so each executor runs tight loops instead of interpreting the tree (module 12).",
    tree: [
      [0, "*(2) HashAggregate …", "new"],
      [1, "Exchange …"],
      [2, "*(1) HashAggregate … BroadcastHashJoin … FileScan", "new"],
    ],
  },
];

export function ruleEffect(pushdown: boolean, pruning: boolean) {
  const customersRows = pushdown ? 0.4 : 5;
  const ordersCols = pruning ? 2 : 12;
  const custCols = pruning ? 3 : 9;
  const gb = Math.round((80 * (ordersCols / 12) + 6 * (custCols / 9)) * 10) / 10;
  return { customersRows, ordersCols, custCols, gb };
}
