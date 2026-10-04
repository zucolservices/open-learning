/** Three ways to run SELECT sum(price) FROM sales WHERE qty > 10. Relative speeds are illustrative. */

export type Engine = "volcano" | "codegen" | "vector";

export const ROWS = 1_000_000;
export const BATCH = 4096;
const OPS = 3; // scan, filter, aggregate

export const ENGINES: Record<
  Engine,
  { name: string; calls: number; rel: number; code: string; how: string }
> = {
  volcano: {
    name: "Row at a time (Volcano)",
    calls: OPS * ROWS,
    rel: 10,
    how: "Each operator calls next() on the one below it and gets one row back. Millions of function calls, each one a jump the CPU can't predict.",
    code: `while (row = agg.child.next())      // Filter.next()
  //   └ while (row = scan.next())    // Scan.next()
  //       if (row.qty > 10) return row
  sum += row.price`,
  },
  codegen: {
    name: "Whole-stage code generation",
    calls: 0,
    rel: 1,
    how: "Spark writes one Java function for the whole chain of operators and compiles it. A plain loop with no calls between operators; values stay in CPU registers.",
    code: `// generated at run time, compiled once
for (int i = 0; i < n; i++) {
  if (qty[i] > 10) sum += price[i];
}`,
  },
  vector: {
    name: "Vectorised (batches)",
    calls: OPS * Math.ceil(ROWS / BATCH),
    rel: 1.4,
    how: "Each next() returns a batch of 4,096 rows stored column by column. One call per batch, and tight loops over arrays the CPU can run in parallel.",
    code: `while (batch = filter.nextBatch())   // 4,096 rows
  for (int i = 0; i < batch.size; i++)
    sum += batch.price[i];`,
  },
};

/** The explain() output for a query with a shuffle, split into codegen stages. */
export const EXPLAIN: { line: string; stage: 0 | 1 | 2 }[] = [
  { line: "*(2) HashAggregate(keys=[city], functions=[sum(price)])", stage: 2 },
  { line: "+- Exchange hashpartitioning(city, 200)", stage: 0 },
  { line: "   +- *(1) HashAggregate(keys=[city], functions=[partial_sum(price)])", stage: 1 },
  { line: "      +- *(1) Project [city, price]", stage: 1 },
  { line: "         +- *(1) Filter (qty > 10)", stage: 1 },
  { line: "            +- *(1) ColumnarToRow", stage: 1 },
  { line: "               +- FileScan parquet sales", stage: 0 },
];

export const NATIVE = [
  {
    name: "Photon",
    who: "Databricks (proprietary)",
    lang: "C++",
    note: "A vectorised engine built into Databricks; described in a SIGMOD 2022 paper.",
  },
  {
    name: "Apache Gluten",
    who: "Apache top-level project (since Feb 2026)",
    lang: "C++ backends",
    note: "Converts Spark plans to Substrait and runs them on Velox or ClickHouse.",
  },
  {
    name: "Apache DataFusion Comet",
    who: "Apache DataFusion subproject",
    lang: "Rust",
    note: "Runs Spark operators on the DataFusion engine, on CPUs (no GPUs needed).",
  },
];

export const PLAN_NODES = ["Scan", "Filter", "Python UDF", "Aggregate", "Write"];
