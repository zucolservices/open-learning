/** Three sick services, each described by its four golden signals over 20 minutes (illustrative). */

export type SignalKey = "latency" | "traffic" | "errors" | "saturation";

export interface Case {
  id: string;
  name: string;
  series: Record<SignalKey, number[]>;
  units: Record<SignalKey, string>;
  saturationOf: string;
  answer: string;
  explain: string;
}

const ramp = (a: number, b: number, from = 10) =>
  Array.from({ length: 20 }, (_, i) =>
    i < from ? a : a + ((b - a) * (i - from + 1)) / (20 - from),
  );
const flat = (v: number, wobble = 0.04) =>
  Array.from({ length: 20 }, (_, i) => v * (1 + Math.sin(i * 1.7) * wobble));

export const CASES: Case[] = [
  {
    id: "orders",
    name: "orders-api",
    series: {
      latency: ramp(120, 900),
      traffic: ramp(400, 1300),
      errors: ramp(0.2, 3),
      saturation: ramp(55, 98),
    },
    units: { latency: "ms p99", traffic: "req/s", errors: "% failed", saturation: "% CPU" },
    saturationOf: "CPU",
    answer: "overload",
    explain:
      "Traffic tripled, CPU is pinned near 100% and everything slows down with it. It's simply overloaded: add capacity (or let the autoscaler), and shed or queue load if you can't.",
  },
  {
    id: "payments",
    name: "payments-api",
    series: {
      latency: ramp(180, 25),
      traffic: flat(600),
      errors: ramp(0.3, 41),
      saturation: ramp(60, 20),
    },
    units: { latency: "ms p99", traffic: "req/s", errors: "% failed", saturation: "% CPU" },
    saturationOf: "CPU",
    answer: "fast-fail",
    explain:
      "Latency fell and CPU dropped while 41% of requests fail: it's answering instantly with errors. Something it depends on is refusing it (a rotated password, a broken config), so it fails fast. A dashboard that hides errors would show a service that got faster.",
  },
  {
    id: "ledger",
    name: "ledger-service",
    series: {
      latency: ramp(90, 600, 6),
      traffic: flat(300),
      errors: flat(0.1, 0.5),
      saturation: ramp(40, 100, 4),
    },
    units: { latency: "ms p99", traffic: "req/s", errors: "% failed", saturation: "% pool used" },
    saturationOf: "database connection pool",
    answer: "exhaustion",
    explain:
      "Traffic is flat and nothing fails yet, but the connection pool is full and p99 latency keeps climbing as requests queue for a connection. A resource is running out; errors will follow. Rising p99 is the early warning.",
  },
];

export const DIAGNOSES: { id: string; label: string }[] = [
  { id: "overload", label: "Overloaded by more traffic than it can handle" },
  { id: "fast-fail", label: "Failing fast because a dependency rejects it" },
  { id: "exhaustion", label: "A resource running out, with traffic unchanged" },
  { id: "healthy", label: "Healthy: nothing to do" },
];
