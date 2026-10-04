/** Sources of eval cases and the kinds of failure each one catches. Sizes and scores are illustrative. */

export type SourceId = "logs" | "thumbs" | "expert" | "adversarial" | "synthetic";

export const SOURCES: { id: SourceId; name: string; detail: string; size: number }[] = [
  {
    id: "logs",
    name: "Real logs",
    detail: "A sample of everyday questions from launch week",
    size: 60,
  },
  { id: "thumbs", name: "Thumbs-down chats", detail: "Conversations users rated badly", size: 20 },
  {
    id: "expert",
    name: "Expert-written edge cases",
    detail: "Support leads write the tricky ones",
    size: 25,
  },
  {
    id: "adversarial",
    name: "Adversarial cases",
    detail: "Deliberate attempts to break it",
    size: 15,
  },
  {
    id: "synthetic",
    name: "Generated cases",
    detail: "An LLM expands 20 hand-written combinations",
    size: 40,
  },
];

export const FAILURES: {
  id: string;
  name: string;
  kind: "typical" | "edge" | "adversarial";
  caughtBy: SourceId[];
}[] = [
  {
    id: "window",
    name: "Wrong refund window",
    kind: "typical",
    caughtBy: ["logs", "thumbs", "synthetic"],
  },
  { id: "tone", name: "Curt with upset customers", kind: "typical", caughtBy: ["logs", "thumbs"] },
  {
    id: "hindi",
    name: "Replies in English to Hindi",
    kind: "edge",
    caughtBy: ["thumbs", "expert"],
  },
  {
    id: "empty",
    name: "Empty or off-topic message",
    kind: "edge",
    caughtBy: ["expert", "synthetic"],
  },
  { id: "long", name: "A whole email pasted in", kind: "edge", caughtBy: ["logs", "expert"] },
  { id: "unclear", name: "Questions people disagree on", kind: "edge", caughtBy: ["expert"] },
  {
    id: "inject",
    name: "“Ignore your instructions…”",
    kind: "adversarial",
    caughtBy: ["adversarial"],
  },
  {
    id: "leak",
    name: "Asks for another customer's order",
    kind: "adversarial",
    caughtBy: ["adversarial", "expert"],
  },
];

export function coverage(sources: SourceId[]) {
  const size = SOURCES.filter((s) => sources.includes(s.id)).reduce((a, s) => a + s.size, 0);
  const caught = FAILURES.filter((f) => f.caughtBy.some((c) => sources.includes(c)));
  return {
    size,
    caught: caught.map((f) => f.id),
    missed: FAILURES.filter((f) => !caught.includes(f)),
  };
}

/** Score on the cases you tuned against, and on cases held back. */
export function tuning(heldOut: boolean) {
  return heldOut ? { tuned: 86, test: 84 } : { tuned: 95, test: 81 };
}

/** New kinds of failure found as you read more traces (a saturation curve). */
export function discovered(traces: number) {
  return Math.round(14 * (1 - Math.exp(-traces / 35)));
}
