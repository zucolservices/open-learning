/**
 * Monthly log costs for a given daily volume, using list prices read on 3 October 2026 (US East,
 * USD; see SOURCES.md). Assumes about one million log events per GB. Contracts and regions vary.
 */

export interface Plan {
  gbPerDay: number;
  dropDebug: boolean;
  sampleHealth: boolean;
  /** Days kept searchable. */
  hotDays: 7 | 15 | 30;
}

/** Share of raw volume that is DEBUG lines and health-check noise (illustrative). */
const DEBUG = 0.35;
const HEALTH = 0.2;

export function kept(p: Plan): number {
  let v = p.gbPerDay;
  if (p.dropDebug) v *= 1 - DEBUG;
  if (p.sampleHealth) v *= 1 - HEALTH * 0.95; // keep 1 in 20 health-check lines
  return v;
}

export function monthly(p: Plan) {
  const gb = kept(p) * 30;
  const storedGb = kept(p) * p.hotDays;
  // CloudWatch Logs Standard: $0.50/GB ingest, $0.03/GB-month storage.
  const cloudwatch = gb * 0.5 + storedGb * 0.03;
  // Datadog: $0.10/GB ingested + $1.70 per million events indexed (15-day retention price).
  const datadog = gb * 0.1 + gb * 1.0 * 1.7 * (p.hotDays / 15);
  // Grafana Cloud Logs: $0.05 process + $0.40 write + $0.10 retain per GB; 50 GB a month included.
  const grafana = Math.max(0, gb - 50) * 0.55;
  return { gb, cloudwatch, datadog, grafana };
}

export const STAGES: { t: string; d: string; where: string }[] = [
  {
    t: "The app writes to stdout",
    d: "Each container prints structured lines to standard output, nothing more. It doesn't know where logs end up.",
    where: "app",
  },
  {
    t: "The node keeps them in files",
    d: "On Kubernetes, the container runtime writes each container's output to files under /var/log/pods on its node.",
    where: "node",
  },
  {
    t: "An agent on every node collects",
    d: "A collector runs once per node (a DaemonSet): Fluent Bit, Vector, Grafana Alloy or the OpenTelemetry Collector. It tails the files and adds labels such as namespace and pod.",
    where: "agent",
  },
  {
    t: "The pipeline cleans up",
    d: "Processors parse fields, drop DEBUG lines, sample noisy health checks and redact anything sensitive, before a single byte is paid for.",
    where: "pipeline",
  },
  {
    t: "A store makes them searchable",
    d: "Some stores index every word (Elasticsearch, OpenSearch); some index only labels and scan the rest (Loki); some use column stores built for wide events (ClickHouse-based tools).",
    where: "store",
  },
  {
    t: "Older logs move to cheaper tiers",
    d: "Recent logs stay hot and fast; older ones move to cheaper, slower storage or an archive you can restore from when an investigation or audit needs them.",
    where: "archive",
  },
];
