/** Panels you could put at the top of a checkout service's dashboard (illustrative). */

export type Signal = "latency" | "traffic" | "errors" | "saturation" | null;

export const PANELS: {
  id: string;
  title: string;
  signal: Signal;
  note: string;
  shape: number[];
}[] = [
  {
    id: "p99",
    title: "Checkout p99 latency (ms)",
    signal: "latency",
    note: "What the slowest users feel.",
    shape: [2, 2, 3, 2, 2, 6, 7, 3, 2],
  },
  {
    id: "rps",
    title: "Checkout requests per second",
    signal: "traffic",
    note: "How busy it is.",
    shape: [4, 5, 5, 6, 7, 7, 6, 5, 5],
  },
  {
    id: "err",
    title: "Checkout errors (% of requests)",
    signal: "errors",
    note: "How often users fail.",
    shape: [1, 1, 1, 1, 1, 5, 6, 1, 1],
  },
  {
    id: "pool",
    title: "DB connection pool in use (%)",
    signal: "saturation",
    note: "The tightest resource.",
    shape: [4, 4, 5, 5, 6, 9, 9, 6, 5],
  },
  {
    id: "cpu",
    title: "CPU per node (12 lines)",
    signal: null,
    note: "A cause, not a symptom; twelve lines nobody can read at 3 a.m.",
    shape: [5, 6, 5, 6, 5, 6, 5, 6, 5],
  },
  {
    id: "gc",
    title: "JVM garbage collection pauses",
    signal: null,
    note: "Useful when drilling into one service, not as a first answer.",
    shape: [2, 3, 2, 3, 2, 3, 2, 3, 2],
  },
  {
    id: "inodes",
    title: "Disk inodes free",
    signal: null,
    note: "Important for one rare failure; belongs on a resource dashboard.",
    shape: [8, 8, 8, 8, 8, 8, 8, 8, 8],
  },
  {
    id: "pods",
    title: "Number of pods",
    signal: null,
    note: "Tells you about the platform, not about users.",
    shape: [5, 5, 5, 6, 6, 6, 5, 5, 5],
  },
  {
    id: "avg",
    title: "Average latency (ms)",
    signal: null,
    note: "An average hides the slow tail; use percentiles.",
    shape: [2, 2, 2, 2, 2, 3, 3, 2, 2],
  },
];

export const SLOTS = 4;
