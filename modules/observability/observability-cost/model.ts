/**
 * One illustrative month of telemetry priced on four platforms at public US list prices
 * (checked 3 October 2026; annual billing where it differs). Assumptions: 20 hosts, 500 GB of logs
 * at about 1 KB per event, 50,000 active metric series scraped every 30 s, 100 GB of traces
 * (about 100 million spans in 10 million traces). Discounts, retention beyond the defaults,
 * extra features and people are ignored.
 */

export const PRICES_AS_OF = "3 October 2026";

export type Lever = "debug" | "index" | "series" | "sample" | "notraces";

export const LEVERS: { id: Lever; label: string; note: string; blind?: boolean }[] = [
  {
    id: "debug",
    label: "Drop debug logs at the Collector",
    note: "Production rarely needs them; assume they're 60% of log volume.",
  },
  {
    id: "index",
    label: "Index only 20% of logs, archive the rest cheaply",
    note: "Search the important logs fast; keep the rest in cheap storage (Datadog's Flex Logs, for example).",
  },
  {
    id: "series",
    label: "Aggregate away labels nobody queries",
    note: "Tools like Grafana's Adaptive Metrics find series unused by dashboards, alerts and queries. Assume 60% go.",
  },
  {
    id: "sample",
    label: "Tail-sample traces: keep errors, slow ones and 10% of the rest",
    note: "Every interesting trace survives; the boring majority mostly doesn't.",
  },
  {
    id: "notraces",
    label: "Turn tracing off entirely",
    note: "The cheapest trace is the one you never collect, until the 3 a.m. incident that needs it.",
    blind: true,
  },
];

export interface Volume {
  hosts: number;
  logGB: number;
  indexedShare: number;
  series: number;
  traceGB: number;
}

export function volume(on: Lever[]): Volume {
  const has = (l: Lever) => on.includes(l);
  return {
    hosts: 20,
    logGB: has("debug") ? 200 : 500,
    indexedShare: has("index") ? 0.2 : 1,
    series: has("series") ? 20_000 : 50_000,
    traceGB: has("notraces") ? 0 : has("sample") ? 10 : 100,
  };
}

export interface Bill {
  name: string;
  total: number;
  parts: [string, number][];
}

export function bills(v: Volume): Bill[] {
  const events = v.logGB * v.indexedShare; // millions of indexed events (1 KB each)
  const apmHosts = v.traceGB > 0 ? v.hosts : 0;
  const spansM = v.traceGB; // ~1 KB per span → 1 million spans per GB
  const tracesM = v.traceGB / 10;
  const samplesM = (v.series * 2_880 * 30) / 1e6; // 30 s scrape, 30 days
  const cwMetrics = Math.min(v.series, 10_000) * 0.3 + Math.max(0, v.series - 10_000) * 0.1;
  const list: Bill[] = [
    {
      name: "Datadog",
      parts: [
        ["Hosts ($15 infra + $31 APM each)", v.hosts * 15 + apmHosts * 31],
        ["Logs ($0.10/GB + $1.70 per million indexed)", v.logGB * 0.1 + events * 1.7],
        [
          "Custom metrics ($5 per 100, 100 free per host)",
          (Math.max(0, v.series - v.hosts * 100) / 100) * 5,
        ],
        ["Traces (150 GB per APM host included)", 0],
      ],
      total: 0,
    },
    {
      name: "Grafana Cloud",
      parts: [
        ["Platform fee", 19],
        [
          "Metrics ($6.50 per 1k series, 10k included)",
          (Math.max(0, v.series - 10_000) / 1000) * 6.5,
        ],
        ["Logs ($0.55/GB, 50 GB included)", Math.max(0, v.logGB - 50) * 0.55],
        ["Traces ($0.55/GB, 50 GB included)", Math.max(0, v.traceGB - 50) * 0.55],
      ],
      total: 0,
    },
    {
      name: "AWS CloudWatch + X-Ray",
      parts: [
        ["Logs ($0.50/GB)", v.logGB * 0.5],
        ["Custom metrics ($0.30 each, $0.10 after 10k)", cwMetrics],
        ["Traces ($5 per million, 100k free)", Math.max(0, tracesM - 0.1) * 5],
      ],
      total: 0,
    },
    {
      name: "Google Cloud",
      parts: [
        ["Logs ($0.50/GiB, 50 GiB free)", Math.max(0, v.logGB - 50) * 0.5],
        ["Managed Prometheus ($0.06 per million samples)", samplesM * 0.06],
        ["Trace ($0.20 per million spans, 2.5M free)", Math.max(0, spansM - 2.5) * 0.2],
      ],
      total: 0,
    },
  ];
  for (const b of list) b.total = b.parts.reduce((n, [, x]) => n + x, 0);
  return list;
}

export const UNITS: [string, string, string][] = [
  [
    "Datadog",
    "per host + per GB + per indexed event + per 100 custom metrics",
    "Infra Pro $15/host",
  ],
  ["New Relic", "per GB ingested + per user", "100 GB free, then $0.40/GB; Pro full user $349"],
  ["Grafana Cloud", "per active series + per GB", "$19 + $6.50 per 1k series; $0.55/GB logs"],
  ["Honeycomb", "per event (each span is one), unlimited seats", "Pro from $150 for 50M events"],
  ["Elastic Serverless", "per GB ingested + per GB retained", "from $0.09/GB ingested"],
  ["AWS CloudWatch", "per GB of logs + per custom metric", "$0.50/GB; $0.30 per metric"],
  ["Azure Monitor", "per GB, by log tier", "Analytics $2.30/GB; Basic $0.50/GB"],
  ["Google Cloud", "per GiB of logs + per million samples", "$0.50/GiB after 50 GiB free"],
];
