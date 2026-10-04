/** A simulated Spark UI for one query's write action. Numbers illustrative. */

export const QUERY = `orders = spark.read.parquet("orders/")          # 40 files
customers = spark.read.parquet("customers/")     # small
(orders.filter("status = 'paid'")
       .join(customers, "customer_id")
       .groupBy("city").agg(F.sum("amount"))
       .write.parquet("revenue_by_city/"))`;

export interface Stage {
  id: number;
  name: string;
  tasks: number;
  input: string;
  shuffleRead: string;
  shuffleWrite: string;
  duration: string;
  status: "completed" | "skipped";
  parents: number[];
  quantiles: [number, number, number, number, number];
}

export const JOBS = [
  { id: 0, desc: "broadcast customers (collect)", stages: [0], duration: "4 s" },
  { id: 1, desc: "write at revenue.py:6", stages: [1, 2], duration: "1.8 min" },
];

export const STAGES: Stage[] = [
  {
    id: 0,
    name: "scan customers",
    tasks: 2,
    input: "48 MB",
    shuffleRead: "",
    shuffleWrite: "",
    duration: "4 s",
    status: "completed",
    parents: [],
    quantiles: [1.2, 1.4, 1.6, 1.9, 2.1],
  },
  {
    id: 1,
    name: "scan orders → filter → broadcast join → partial aggregate",
    tasks: 40,
    input: "5.1 GB",
    shuffleRead: "",
    shuffleWrite: "38 MB",
    duration: "1.4 min",
    status: "completed",
    parents: [0],
    quantiles: [9, 18, 21, 24, 31],
  },
  {
    id: 2,
    name: "final aggregate → write",
    tasks: 12,
    input: "",
    shuffleRead: "38 MB",
    shuffleWrite: "",
    duration: "21 s",
    status: "completed",
    parents: [1],
    quantiles: [3, 4, 5, 6, 8],
  },
];

export type Tab = "jobs" | "stages" | "sql" | "executors";
