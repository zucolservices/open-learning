/** The PySpark UDF ladder for one task. Relative times are illustrative. */

export type Impl = "builtin" | "pandas" | "arrow" | "pickled";

export const IMPLS: Record<
  Impl,
  { name: string; rel: number; where: string; transfer: string; code: string; note: string }
> = {
  builtin: {
    name: "Built-in function",
    rel: 1,
    where: "JVM only",
    transfer: "none",
    code: `df.withColumn("name_clean", F.initcap(F.trim("name")))`,
    note: "Runs inside the JVM with Catalyst and code generation. No Python process involved.",
  },
  pandas: {
    name: "pandas UDF",
    rel: 3,
    where: "Python worker, a batch at a time",
    transfer: "Arrow batches",
    code: `@pandas_udf("string")
def clean(s: pd.Series) -> pd.Series:
    return s.str.strip().str.title()`,
    note: "Columns travel to Python as Arrow batches and are processed as whole pandas Series: vectorised.",
  },
  arrow: {
    name: "Arrow-optimised Python UDF",
    rel: 12,
    where: "Python worker, a row at a time",
    transfer: "Arrow batches",
    code: `@udf("string", useArrow=True)   # the default for @udf since Spark 4.2
def clean(name):
    return name.strip().title()`,
    note: "Transfer is batched with Arrow, but your function still runs once per row.",
  },
  pickled: {
    name: "Pickled Python UDF",
    rel: 20,
    where: "Python worker, a row at a time",
    transfer: "pickled rows",
    code: `@udf("string", useArrow=False)   # the default before Spark 4.2
def clean(name):
    return name.strip().title()`,
    note: "Every row is serialised with pickle, sent to Python, run, and sent back.",
  },
};

export const ORDER: Impl[] = ["builtin", "pandas", "arrow", "pickled"];

export const WORKER_CASES: { code: string; worker: boolean; why: string }[] = [
  {
    code: `df.filter(F.col("amount") > 100)`,
    worker: false,
    why: "A column expression: planned and run in the JVM.",
  },
  {
    code: `spark.sql("SELECT upper(name) FROM t")`,
    worker: false,
    why: "SQL built-ins run in the JVM.",
  },
  {
    code: `df.withColumn("x", my_udf("name"))`,
    worker: true,
    why: "Your Python function has to see each row.",
  },
  { code: `rdd.map(lambda r: r * 2)`, worker: true, why: "RDD lambdas run in Python." },
  {
    code: `df.toPandas()`,
    worker: false,
    why: "No executor-side Python, but every row comes back to the driver (via Arrow).",
  },
];
