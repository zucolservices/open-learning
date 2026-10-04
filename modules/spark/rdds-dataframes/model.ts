/** One question asked through the RDD API and the DataFrame API, and what Spark can do with each. */

export type Api = "rdd" | "df";

export const CODE: Record<Api, string> = {
  rdd: `orders = sc.textFile("orders.csv").map(parse)        # Python objects
pune = orders.filter(lambda o: o.city == "Pune")
avg = pune.map(lambda o: (o.amount, 1)) \\
          .reduce(lambda a, b: (a[0] + b[0], a[1] + b[1]))`,
  df: `orders = spark.read.parquet("orders/")                 # columns + schema
(orders.filter(orders.city == "Pune")
       .agg(avg("amount")))`,
};

export const SEES: Record<
  Api,
  { items: string[]; columns: number; filterAtScan: boolean; gb: number }
> = {
  rdd: {
    items: [
      "Opaque Python functions: it can't look inside the lambdas",
      "Rows are arbitrary objects with no known columns",
      "Must read every field of every row, then run your code",
    ],
    columns: 12,
    filterAtScan: false,
    gb: 120,
  },
  df: {
    items: [
      "A schema: 12 named, typed columns",
      "A filter on city and an average of amount",
      "So it reads only 2 columns, and asks the file reader to skip non-Pune row groups",
    ],
    columns: 2,
    filterAtScan: true,
    gb: 9,
  },
};

export const LINEAGE = ["textFile", "map(parse)", "filter(Pune)", "map(pairs)"];
