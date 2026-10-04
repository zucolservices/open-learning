/** One slow, expensive agent run as a trace, and fixes that trim it. Numbers illustrative (cost in ₹). */

export type Fix = "cache" | "smallEasy" | "trim" | "dedupe" | "smallHard";

export const FIXES: { id: Fix; label: string; good: boolean }[] = [
  { id: "cache", label: "Cache the unchanging start of the prompt", good: true },
  { id: "smallEasy", label: "Small model for classifying and writing the reply", good: true },
  { id: "trim", label: "Send the last order, not the whole order history", good: true },
  { id: "dedupe", label: "Fix the tool error that caused a repeat search", good: true },
  { id: "smallHard", label: "Small model for the refund decision too", good: false },
];

export interface Span {
  id: string;
  kind: "model" | "tool";
  label: string;
  ms: number;
  cost: number;
  tokens?: number;
}

export function trace(fixes: Fix[]) {
  const has = (f: Fix) => fixes.includes(f);
  const cacheCut = has("cache") ? 0.35 : 1;
  const spans: Span[] = [
    {
      id: "classify",
      kind: "model",
      label: has("smallEasy") ? "classify intent (small model)" : "classify intent (large model)",
      ms: has("smallEasy") ? 400 : 1600,
      cost: (has("smallEasy") ? 0.1 : 1.2) * cacheCut,
      tokens: 6,
    },
    { id: "search", kind: "tool", label: "orders_search", ms: 900, cost: 0 },
  ];
  if (!has("dedupe")) {
    spans.push({
      id: "err",
      kind: "model",
      label: "reads “Error 400”, retries the same call",
      ms: 1400,
      cost: 1.4 * cacheCut,
      tokens: 7,
    });
    spans.push({ id: "search2", kind: "tool", label: "orders_search (again)", ms: 900, cost: 0 });
  }
  spans.push({
    id: "decide",
    kind: "model",
    label: has("smallHard") ? "decide on refund (small model)" : "decide on refund (large model)",
    ms: (has("trim") ? 2200 : 4800) * (has("smallHard") ? 0.4 : 1),
    cost: (has("trim") ? 2.0 : 6.5) * (has("smallHard") ? 0.1 : 1) * (has("cache") ? 0.6 : 1),
    tokens: has("trim") ? 9 : 48,
  });
  spans.push({ id: "refund", kind: "tool", label: "refunds_request", ms: 700, cost: 0 });
  spans.push({
    id: "reply",
    kind: "model",
    label: has("smallEasy") ? "write reply (small model)" : "write reply (large model)",
    ms: has("smallEasy") ? 600 : 1900,
    cost: (has("smallEasy") ? 0.15 : 1.6) * cacheCut,
    tokens: 8,
  });
  const ms = spans.reduce((a, s) => a + s.ms, 0);
  const cost = spans.reduce((a, s) => a + s.cost, 0);
  const quality = has("smallHard") ? 71 : 94;
  return { spans, ms, cost, quality };
}
