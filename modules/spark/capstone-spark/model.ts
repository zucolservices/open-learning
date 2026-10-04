/** The slow nightly job: five problems, each with evidence from the Spark UI and a choice of fixes. All numbers illustrative. */

export const START_HOURS = 10;
export const DEADLINE_HOURS = 6;

export interface Problem {
  id: string;
  title: string;
  module: number;
  where: string;
  evidence: string[];
  saves: number;
  options: { id: string; label: string; correct?: boolean; feedback: string }[];
}

export const PROBLEMS: Problem[] = [
  {
    id: "scan",
    title: "Reading three years to process one day",
    module: 16,
    where: "SQL / DataFrame tab · scan node",
    evidence: [
      "FileScan parquet sales [store_id, amount, ts, date]",
      "  PartitionFilters: []",
      "  PushedFilters: [IsNotNull(ts)]",
      "  number of files read: 412,880   size of files read: 2.1 TB",
      ".where(F.to_date('ts') == yesterday)",
    ],
    saves: 2,
    options: [
      {
        id: "more",
        label: "Add executors so the scan goes faster",
        feedback: "Still reads 2.1 TB; you'd just pay for more machines to do it.",
      },
      {
        id: "partcol",
        label: "Filter on the date partition column instead of to_date(ts)",
        correct: true,
        feedback:
          "The filter now matches the folder layout, so PartitionFilters is filled in and only yesterday's folder is read.",
      },
      {
        id: "cache",
        label: "Cache the sales table",
        feedback: "Caching 2.1 TB costs more than reading it once.",
      },
    ],
  },
  {
    id: "recompute",
    title: "The same join, three times",
    module: 15,
    where: "SQL / DataFrame tab · query list",
    evidence: [
      "Query 4  write store_report     2 h 40 min   joins: sales ⋈ stores ⋈ products",
      "Query 5  write product_report   2 h 35 min   joins: sales ⋈ stores ⋈ products",
      "Query 6  write region_report    2 h 38 min   joins: sales ⋈ stores ⋈ products",
    ],
    saves: 2.5,
    options: [
      {
        id: "persist",
        label: "Persist the joined DataFrame once, then write all three reports from it",
        correct: true,
        feedback: "Each write was rebuilding the same join from the files. Now it's built once.",
      },
      {
        id: "parts",
        label: "Raise spark.sql.shuffle.partitions",
        feedback: "Each join might be a little faster, but you'd still do it three times.",
      },
      {
        id: "broadcast",
        label: "Broadcast the sales table",
        feedback: "Sales is the big table; broadcasting it would be slow or fail.",
      },
    ],
  },
  {
    id: "skew",
    title: "One task runs for 90 minutes",
    module: 13,
    where: "Stages tab · stage 14 summary",
    evidence: [
      "Stage 14 (join on store_id): 199/200 tasks complete",
      "Duration      min 31 s   median 44 s   75th 52 s   max 1.5 h",
      "Shuffle Read  min 0.9 GB median 1.1 GB 75th 1.2 GB max 140 GB",
      "Environment tab: spark.sql.adaptive.enabled = false   (from an old config file)",
    ],
    saves: 1.5,
    options: [
      {
        id: "aqe",
        label: "Remove the old setting so AQE (and its skew-join handling) is on again",
        correct: true,
        feedback:
          "AQE sees a partition over 5× the median and over 256 MB and splits it. Online orders with a NULL store_id were the hot key; filtering or handling them separately also helps.",
      },
      {
        id: "memory",
        label: "Double executor memory",
        feedback: "The hot key still lands in one task; it just has more room to be slow.",
      },
      {
        id: "cores",
        label: "Add more cores",
        feedback: "199 tasks are already done. One task can only use one core.",
      },
    ],
  },
  {
    id: "spill",
    title: "800 GB spilled to disk",
    module: 14,
    where: "Stages tab · stage 18 summary",
    evidence: [
      "Stage 18 (aggregate after a 6 TB shuffle): 200 tasks",
      "Shuffle Read   median 30 GB per task",
      "Spill (memory) total 3.1 TB    Spill (disk) total 800 GB",
      "spark.sql.shuffle.partitions = 200",
    ],
    saves: 1,
    options: [
      {
        id: "more-parts",
        label:
          "Raise spark.sql.shuffle.partitions to a few thousand and let AQE merge any small ones",
        correct: true,
        feedback:
          "Each task now gets a few GB instead of 30, which fits in memory. AQE coalesces partitions that turn out small, so over-asking is cheap.",
      },
      {
        id: "cache",
        label: "Cache the input",
        feedback: "Spill comes from oversized tasks, not from re-reading.",
      },
      {
        id: "coalesce",
        label: "coalesce(50) before the aggregation",
        feedback: "Fewer, bigger partitions: more spill, not less.",
      },
    ],
  },
  {
    id: "files",
    title: "An hour spent writing tiny files",
    module: 16,
    where: "Jobs tab · final write",
    evidence: [
      ".write.partitionBy('store_id', 'hour')",
      "files written: 192,000    average size: 0.9 MB",
      "job duration 1 h 10 min; tasks finished after 14 min, the rest is committing files",
    ],
    saves: 1,
    options: [
      {
        id: "records",
        label: "Set maxRecordsPerFile",
        feedback: "That splits big files; these are already tiny.",
      },
      {
        id: "repart",
        label: "repartition('store_id', 'hour') before the write, or partition by date only",
        correct: true,
        feedback:
          "Each folder now gets one file from one task, and listing and committing take minutes, not an hour.",
      },
      {
        id: "parts",
        label: "Raise spark.sql.shuffle.partitions",
        feedback: "More tasks write even more files.",
      },
    ],
  },
];

export const PRECEDENTS: { who: string; when: string; what: string }[] = [
  {
    who: "Meta",
    when: "2016",
    what: "Writing too many ~100 MB output files: three of a job's ten hours went on moving files. One stage had 70,000 tasks.",
  },
  {
    who: "LinkedIn",
    when: "2020",
    what: "10–20% of production cluster compute sat idle waiting for shuffle data, which led them to build push-based shuffle (Magnet).",
  },
  {
    who: "Databricks",
    when: "2020",
    what: "Too few shuffle partitions spill; too many make tiny fetches. AQE was built to adjust both, and to split skewed joins.",
  },
  {
    who: "Uber",
    when: "2023",
    what: "Its Spark analysers flag scanning too many partitions and running the same plan twice, across ~100K apps a day.",
  },
];
