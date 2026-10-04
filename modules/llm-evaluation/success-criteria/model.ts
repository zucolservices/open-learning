/** Turning "be helpful" into criteria you can check. Thresholds and scores are illustrative. */

export type Kind = "vague" | "proxy" | "good";

export interface Dim {
  id: string;
  name: string;
  options: { id: string; text: string; kind: Kind; why: string }[];
}

export const DIMS: Dim[] = [
  {
    id: "accuracy",
    name: "Accuracy",
    options: [
      {
        id: "a1",
        text: "Gives correct answers",
        kind: "vague",
        why: "Correct how often, on what, judged by whom?",
      },
      {
        id: "a2",
        text: "At least 95% of answers match the policy, on 400 real past questions, checked against the policy pages",
        kind: "good",
        why: "Specific, measurable, and tied to real questions.",
      },
      {
        id: "a3",
        text: "Answers mention the word “policy”",
        kind: "proxy",
        why: "Easy to count, easy to game, says nothing about correctness.",
      },
    ],
  },
  {
    id: "tone",
    name: "Tone",
    options: [
      {
        id: "t1",
        text: "Average reply under 40 words",
        kind: "proxy",
        why: "Short isn't the same as kind. It would reward curt replies to upset customers.",
      },
      {
        id: "t2",
        text: "Sounds friendly",
        kind: "vague",
        why: "Friendly to whom? How would two people agree?",
      },
      {
        id: "t3",
        text: "At least 90% rated “polite and clear” against a written rubric, including 50 upset-customer cases",
        kind: "good",
        why: "A rubric makes it checkable; hard cases are included.",
      },
    ],
  },
  {
    id: "safety",
    name: "Safety",
    options: [
      {
        id: "s1",
        text: "Never leaks another customer's details: 0 leaks in 200 attempts to extract them",
        kind: "good",
        why: "Even a “never” can be tested.",
      },
      { id: "s2", text: "Is safe", kind: "vague", why: "Safe from what? There's nothing to test." },
      {
        id: "s3",
        text: "Refuses any question that mentions an account",
        kind: "proxy",
        why: "Zero leaks, and zero help: the measure was met by breaking the product.",
      },
    ],
  },
  {
    id: "latency",
    name: "Speed",
    options: [
      { id: "l1", text: "Fast", kind: "vague", why: "Fast for the typical user or the slowest?" },
      {
        id: "l2",
        text: "First words in under 1.5 s for 95% of requests",
        kind: "good",
        why: "A percentile target covers the slow cases too.",
      },
      {
        id: "l3",
        text: "Average response time looks OK on the dashboard",
        kind: "proxy",
        why: "Averages hide the slow tail.",
      },
    ],
  },
  {
    id: "cost",
    name: "Cost",
    options: [
      {
        id: "c1",
        text: "Under ₹2 per conversation on average, at expected volume",
        kind: "good",
        why: "A budget you can measure per conversation.",
      },
      {
        id: "c2",
        text: "Use the cheapest model available",
        kind: "proxy",
        why: "Cheap, but may fail every other criterion.",
      },
      { id: "c3", text: "Affordable", kind: "vague", why: "Affordable compared with what?" },
    ],
  },
];

export interface Option {
  name: string;
  scores: { accuracy: number; tone: number; leaks: number; p95: number; cost: number };
}

export const OPTIONS: Option[] = [
  { name: "Large model", scores: { accuracy: 97, tone: 93, leaks: 0, p95: 2.4, cost: 3.1 } },
  { name: "Small model", scores: { accuracy: 88, tone: 86, leaks: 1, p95: 0.7, cost: 0.4 } },
  {
    name: "Small model + retrieval",
    scores: { accuracy: 95, tone: 90, leaks: 0, p95: 1.2, cost: 0.9 },
  },
];
