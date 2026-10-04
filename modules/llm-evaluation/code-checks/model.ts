/** Program-run graders applied to answers whose true correctness we know. Answers are illustrative. */

export const QUESTION = "In what year did the Eiffel Tower open?";
export const GOLD = "1889";

export const ANSWERS: { text: string; correct: boolean }[] = [
  { text: "1889", correct: true },
  { text: "1889\n", correct: true },
  { text: "The Eiffel Tower opened in 1889.", correct: true },
  { text: "It opened in 1889, two years after building began.", correct: true },
  { text: "Eighteen eighty-nine", correct: true },
  { text: "1887", correct: false },
  { text: "Not 1889: it was 1887.", correct: false },
];

export type GraderId = "exact" | "normal" | "contains" | "regex" | "f1";

export const GRADERS: { id: GraderId; name: string; how: string }[] = [
  { id: "exact", name: "Exact match", how: "answer === gold" },
  {
    id: "normal",
    name: "Normalised match",
    how: "lowercase, strip punctuation, “a/an/the” and extra spaces, then compare",
  },
  { id: "contains", name: "Contains", how: "answer includes “1889”" },
  { id: "regex", name: "First year (regex)", how: "first 4-digit number == 1889" },
  { id: "f1", name: "Word overlap F1 ≥ 0.5", how: "share of words in common, SQuAD-style" },
];

export function normalise(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\b(a|an|the)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function f1(a: string, b: string) {
  const x = normalise(a).split(" ").filter(Boolean);
  const y = normalise(b).split(" ").filter(Boolean);
  const common = x.filter((w) => y.includes(w)).length;
  if (!common) return 0;
  const p = common / x.length;
  const r = common / y.length;
  return (2 * p * r) / (p + r);
}

export function grade(g: GraderId, answer: string): boolean {
  switch (g) {
    case "exact":
      return answer === GOLD;
    case "normal":
      return normalise(answer) === normalise(GOLD);
    case "contains":
      return answer.includes(GOLD);
    case "regex":
      return answer.match(/\b(\d{4})\b/)?.[1] === GOLD;
    case "f1":
      return f1(answer, GOLD) >= 0.5;
  }
}

/** Unbiased pass@k from n samples with c correct (Chen et al., 2021). */
export function passAtK(n: number, c: number, k: number) {
  if (n - c < k) return 1;
  let prod = 1;
  for (let i = n - c + 1; i <= n; i++) prod *= 1 - k / i;
  return 1 - prod;
}

export const OUTPUTS: {
  label: string;
  json: string;
  schema: boolean;
  true_: boolean;
  note: string;
}[] = [
  {
    label: "Right shape, right value",
    json: '{ "refund_days": 14, "currency": "INR" }',
    schema: true,
    true_: true,
    note: "Passes both.",
  },
  {
    label: "Right shape, wrong value",
    json: '{ "refund_days": 30, "currency": "INR" }',
    schema: true,
    true_: false,
    note: "The schema can't know the policy says 14.",
  },
  {
    label: "Cut off mid-way",
    json: '{ "refund_days": 14, "curr',
    schema: false,
    true_: false,
    note: "Truncated output fails the schema check.",
  },
];
