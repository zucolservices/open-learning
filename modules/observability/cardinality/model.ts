/**
 * Cardinality calculator. Number of time series = product of each label's distinct values.
 * Prices are list prices read on 3 October 2026 (see SOURCES.md); contracts vary.
 */

export type Label = "method" | "route" | "status" | "region" | "pod" | "customer";

export const LABELS: Record<
  Label,
  { name: string; values: number; example: string; note: string }
> = {
  method: { name: "method", values: 4, example: "GET, POST, PUT, DELETE", note: "small and fixed" },
  route: {
    name: "route",
    values: 20,
    example: "/pay, /orders/{id}, …",
    note: "templates, not full URLs",
  },
  status: {
    name: "status",
    values: 5,
    example: "2xx, 3xx, 4xx, 5xx, other",
    note: "classes keep it small",
  },
  region: {
    name: "region",
    values: 4,
    example: "north, south, east, west",
    note: "small and fixed",
  },
  pod: {
    name: "pod",
    values: 90,
    example: "payments-7f9c…",
    note: "30 pods, renamed on each of 3 deploys a day",
  },
  customer: {
    name: "customer_id",
    values: 200_000,
    example: "c_18273…",
    note: "unbounded: grows with the business",
  },
};

export function series(on: Label[]): number {
  return on.reduce((n, l) => n * LABELS[l].values, 1);
}

/** Monthly list price for this many series of one metric on three platforms. */
export function costs(n: number) {
  return {
    grafana: Math.max(0, n - 10_000) * (6.5 / 1000),
    datadog: (n / 100) * 5,
    // CloudWatch: $0.30 for the first 10,000; cheaper volume tiers after (lowest $0.02), so a floor.
    cloudwatch: Math.min(n, 10_000) * 0.3 + Math.max(0, n - 10_000) * 0.02,
  };
}

export function fmtNum(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} million`;
  return n.toLocaleString("en-IN");
}

export function fmtUsd(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}k`;
  return `$${Math.round(n)}`;
}
