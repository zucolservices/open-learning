/** Operations a learner can chain, and how Spark turns them into stages when an action runs. */

export interface Op {
  id: string;
  code: string;
  kind: "transformation" | "action";
  wide?: boolean;
}

export const OPS: Op[] = [
  { id: "read", code: 'spark.read.parquet("orders/")', kind: "transformation" },
  { id: "filter", code: '.filter(col("status") == "paid")', kind: "transformation" },
  { id: "select", code: '.select("city", "amount")', kind: "transformation" },
  { id: "withColumn", code: '.withColumn("gst", col("amount") * 0.18)', kind: "transformation" },
  { id: "groupBy", code: '.groupBy("city").sum("amount")', kind: "transformation", wide: true },
  { id: "orderBy", code: '.orderBy("sum(amount)")', kind: "transformation", wide: true },
  { id: "count", code: ".count()", kind: "action" },
  { id: "show", code: ".show(10)", kind: "action" },
  { id: "write", code: '.write.parquet("report/")', kind: "action" },
];

export const byId = Object.fromEntries(OPS.map((o) => [o.id, o]));

/** Split a chain of transformations into stages at wide operations. */
export function stages(chain: string[]): string[][] {
  const out: string[][] = [[]];
  for (const id of chain) {
    const op = byId[id];
    if (op.kind === "action") continue;
    if (op.wide && out[out.length - 1].length) out.push([]);
    out[out.length - 1].push(id);
  }
  return out.filter((s) => s.length);
}
