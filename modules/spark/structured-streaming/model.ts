/** Four micro-batches of a windowed count with a 10-minute watermark. Event times are illustrative. */

export interface Ev {
  t: string; // event time hh:mm
  fate?: "late-ok" | "dropped";
}

export interface Batch {
  events: Ev[];
  windows: [string, number][]; // window start -> count, still in state
  emitted: [string, number][];
  watermark: string; // watermark after this batch (used by the next)
  note: string;
}

export const BATCHES: Batch[] = [
  {
    events: [{ t: "12:02" }, { t: "12:05" }, { t: "12:07" }],
    windows: [["12:00", 3]],
    emitted: [],
    watermark: "11:57",
    note: "Batch 0 reads the first three events. Latest event time 12:07, so the watermark becomes 12:07 − 10 min = 11:57.",
  },
  {
    events: [{ t: "12:11" }, { t: "12:14" }, { t: "12:08" }],
    windows: [
      ["12:00", 4],
      ["12:10", 2],
    ],
    emitted: [],
    watermark: "12:04",
    note: "Only the three new rows are processed; the running counts are updated in the state store. Latest event 12:14, watermark 12:04.",
  },
  {
    events: [{ t: "12:09", fate: "late-ok" }, { t: "12:21" }],
    windows: [
      ["12:00", 5],
      ["12:10", 2],
      ["12:20", 1],
    ],
    emitted: [],
    watermark: "12:11",
    note: "12:09 arrives late, but its window (12:00–12:10) hasn't fallen behind the watermark (12:04), so it still counts.",
  },
  {
    events: [{ t: "12:06", fate: "dropped" }, { t: "12:23" }],
    windows: [
      ["12:10", 2],
      ["12:20", 2],
    ],
    emitted: [["12:00", 5]],
    watermark: "12:13",
    note: "The watermark (12:11) has passed the end of the 12:00 window, so its final count is written out and its state dropped. 12:06 is too late and is ignored.",
  },
];

export type Trig = "default" | "interval" | "availableNow" | "continuous" | "rtm";

export const TRIGGERS: {
  id: Trig;
  label: string;
  code: string;
  latency: string;
  guarantee: string;
  note: string;
}[] = [
  {
    id: "default",
    label: "default",
    code: ".start()",
    latency: "as low as ~100 ms",
    guarantee: "exactly-once",
    note: "Each micro-batch starts as soon as the last one finishes.",
  },
  {
    id: "interval",
    label: "processingTime",
    code: '.trigger(processingTime="1 minute")',
    latency: "the interval",
    guarantee: "exactly-once",
    note: "A micro-batch every minute; none if there's no new data.",
  },
  {
    id: "availableNow",
    label: "availableNow",
    code: ".trigger(availableNow=True)",
    latency: "runs, then stops",
    guarantee: "exactly-once",
    note: "Process everything that's arrived, in one or more batches, then stop. Good for scheduled jobs; replaces the deprecated once trigger.",
  },
  {
    id: "continuous",
    label: "continuous",
    code: '.trigger(continuous="1 second")',
    latency: "~1 ms",
    guarantee: "at-least-once",
    note: "Experimental since Spark 2.3, with a limited set of supported queries.",
  },
  {
    id: "rtm",
    label: "real-time mode",
    code: "(Spark 4.1+, Scala; PySpark in 4.2)",
    latency: "single-digit ms (stateless)",
    guarantee: "see release notes",
    note: "Processes events as they arrive instead of in batches. New in open-source Spark 4.1 for stateless queries.",
  },
];
