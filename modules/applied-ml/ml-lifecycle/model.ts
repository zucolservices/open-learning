/** A churn project's weeks, phase by phase. Timeline illustrative. */

export const PHASES: { id: string; name: string }[] = [
  { id: "business", name: "Business understanding" },
  { id: "data", name: "Data understanding" },
  { id: "prep", name: "Data preparation" },
  { id: "model", name: "Modelling" },
  { id: "eval", name: "Evaluation" },
  { id: "deploy", name: "Deployment" },
  { id: "monitor", name: "Monitoring" },
];

export const EVENTS: { phase: string; weeks: number; text: string; loop?: boolean }[] = [
  {
    phase: "business",
    weeks: 1,
    text: "Marketing wants to “reduce churn”. You agree on a target: predict who will cancel in the next 30 days, so the retention team can call them.",
  },
  {
    phase: "data",
    weeks: 2,
    text: "You explore billing, usage and support tables. Cancellations are recorded three different ways.",
  },
  {
    phase: "prep",
    weeks: 3,
    text: "You clean the cancellation dates, join the tables and build features like “logins in the last 14 days”.",
  },
  {
    phase: "model",
    weeks: 1,
    text: "A logistic regression and a boosted-tree model, compared with a simple rule: “no login for 21 days”.",
  },
  {
    phase: "eval",
    weeks: 1,
    text: "The model beats the rule. But the retention team can only make 200 calls a week, and the model flags 900 people.",
  },
  {
    phase: "business",
    weeks: 1,
    text: "Back to the business question: rank customers, and call the top 200 most likely to leave and worth saving.",
    loop: true,
  },
  {
    phase: "prep",
    weeks: 1,
    text: "Add a “customer value” feature and fix a feature that secretly used data from after the cancellation.",
    loop: true,
  },
  {
    phase: "eval",
    weeks: 1,
    text: "On a held-out month, the top 200 contains far more real leavers than the rule's top 200.",
  },
  {
    phase: "deploy",
    weeks: 2,
    text: "A nightly batch job scores every customer and puts the list in the call centre's tool.",
  },
  {
    phase: "monitor",
    weeks: 1,
    text: "Three months later a price rise changes who leaves. The scores drift; you retrain on recent data.",
    loop: true,
  },
];

export function upTo(step: number) {
  const done = EVENTS.slice(0, step + 1);
  const weeks = Object.fromEntries(PHASES.map((p) => [p.id, 0])) as Record<string, number>;
  done.forEach((e) => (weeks[e.phase] += e.weeks));
  const total = done.reduce((a, e) => a + e.weeks, 0);
  return { weeks, total };
}
