/** Automatic checks run on each real model output, the way a small eval would. */

export type CheckId = "order" | "urgency" | "short" | "json";

export const CHECKS: { id: CheckId; label: string; hint: string }[] = [
  {
    id: "order",
    label: "Right order no.",
    hint: "Quotes the email's order number, or says none; never invents one",
  },
  {
    id: "urgency",
    label: "Right urgency",
    hint: "Gives exactly one of low, medium or high, and it matches the team's rules",
  },
  { id: "short", label: "Under 20 words", hint: "The summary is quick to scan" },
  {
    id: "json",
    label: "Machine-readable",
    hint: "Valid JSON with order_id, urgency and summary, nothing else",
  },
];

export interface Expected {
  order: string;
  urgency: string;
}

export interface Parsed {
  order_id?: unknown;
  urgency?: unknown;
  summary?: unknown;
}

/** Parse the reply as JSON, allowing a ```json fence (most apps strip those) but no other prose. */
export function parseReply(out: string): Parsed | null {
  const t = out
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  if (!t.startsWith("{") || !t.endsWith("}")) return null;
  try {
    const v = JSON.parse(t) as Parsed;
    return v && typeof v === "object" && "order_id" in v && "urgency" in v && "summary" in v
      ? v
      : null;
  } catch {
    return null;
  }
}

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

export function runChecks(out: string, exp: Expected): Record<CheckId, boolean> {
  const json = parseReply(out);
  // Any order-like code (KX-48213, XYZ-23456…) counts, so an invented one fails.
  const ids = [...new Set(out.match(/\b[A-Z]{2,}-\d{3,}\b/g) ?? [])];
  const order = exp.order === "none" ? ids.length === 0 : ids.length === 1 && ids[0] === exp.order;
  let urgency: boolean;
  if (json) {
    urgency = String(json.urgency).toLowerCase() === exp.urgency;
  } else {
    const found = new Set((out.toLowerCase().match(/\b(low|medium|high)\b/g) ?? []) as string[]);
    urgency = found.size === 1 && found.has(exp.urgency);
  }
  const text = json && typeof json.summary === "string" ? json.summary : out;
  return { order, urgency, short: words(text) < 20, json: json !== null };
}
