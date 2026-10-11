/**
 * The capstone: a made-up café chain's untested checkout service. The learner spends a limited
 * testing budget by risk, picks techniques, then runs the plan against the next release.
 */

export interface Area {
  id: string;
  label: string;
  likelihood: number;
  impact: number;
}

export const AREAS: Area[] = [
  { id: "tax", label: "Prices and GST", likelihood: 3, impact: 3 },
  { id: "payment", label: "Taking payment", likelihood: 2, impact: 3 },
  { id: "kitchen", label: "Sending orders to the kitchen", likelihood: 2, impact: 3 },
  { id: "loyalty", label: "Loyalty points", likelihood: 2, impact: 2 },
  { id: "receipt", label: "Receipt email layout", likelihood: 2, impact: 1 },
  { id: "report", label: "Monthly admin CSV report", likelihood: 1, impact: 1 },
];

export const BUDGET = 10;
export const DEPTHS = ["None", "Smoke", "Solid", "Deep"];

export const TECHNIQUES: {
  area: string;
  question: string;
  options: { id: string; label: string; good: boolean; why: string }[];
}[] = [
  {
    area: "tax",
    question: "Prices and GST: lots of rules and edge cases.",
    options: [
      {
        id: "unit",
        label:
          "Unit tests at every rate boundary, plus a property (“total equals the sum of its lines”)",
        good: true,
        why: "Fast, precise, and covers the edges.",
      },
      {
        id: "e2e",
        label: "End-to-end tests that check prices through the browser",
        good: false,
        why: "Slow and fragile for dozens of cases; a unit test checks each in milliseconds.",
      },
      {
        id: "manual",
        label: "A manual check before each release",
        good: false,
        why: "Easy to skip, and misses edge cases.",
      },
    ],
  },
  {
    area: "payment",
    question: "Taking payment: a third-party provider and its SDK.",
    options: [
      {
        id: "contract",
        label:
          "Integration tests against the provider's sandbox, plus a contract test on the fields you use",
        good: true,
        why: "Catches changes on the provider's side.",
      },
      {
        id: "mock",
        label: "Mock the payment SDK in every test",
        good: false,
        why: "Mocks agree with yesterday's SDK; an upgrade can break you silently.",
      },
      {
        id: "prod",
        label: "Only watch production errors",
        good: false,
        why: "Customers find the bug first.",
      },
    ],
  },
  {
    area: "kitchen",
    question: "Sending orders to the kitchen: a message queue and a separate kitchen screen.",
    options: [
      {
        id: "queue",
        label:
          "An integration test with a real queue in a throwaway container, checking the message format",
        good: true,
        why: "Tests the join where it can actually break.",
      },
      {
        id: "stub",
        label: "Unit tests with a stubbed queue",
        good: false,
        why: "A stub can't tell you the kitchen screen can't read the message.",
      },
      {
        id: "none",
        label: "Skip it: it rarely changes",
        good: false,
        why: "Low likelihood, but a broken kitchen stops the café.",
      },
    ],
  },
];

export const CHANGES: { id: string; label: string; area: string | null; bug: string | null }[] = [
  {
    id: "c1",
    label: "GST rounding moves from the bill total to each line",
    area: "tax",
    bug: "Bills differ by a few paise from the till; the accountant flags every day's takings.",
  },
  {
    id: "c2",
    label: "Payment SDK upgraded to a new major version",
    area: "payment",
    bug: "The SDK renamed status to state; every card payment is recorded as failed and refunded.",
  },
  {
    id: "c3",
    label: "Kitchen message gains a new allergens field",
    area: "kitchen",
    bug: "The kitchen screen rejects messages with unknown fields; orders stop appearing at lunchtime.",
  },
  { id: "c4", label: "New footer text on receipt emails", area: null, bug: null },
];

export function caught(
  changeArea: string,
  depths: Record<string, number>,
  techs: Record<string, string>,
): boolean {
  const t = TECHNIQUES.find((x) => x.area === changeArea);
  const good = t?.options.find((o) => o.id === techs[changeArea])?.good ?? false;
  return (depths[changeArea] ?? 0) >= 2 && good;
}

export const CHECKLIST: [string, string[]][] = [
  ["Foundations", ["Choose cases by partitions and boundaries", "Mix test sizes on purpose"]],
  [
    "Unit testing",
    ["Test behaviour, not implementation", "Doubles sparingly; readable tests; small TDD loops"],
  ],
  [
    "Beyond units",
    [
      "Real infrastructure for the joins",
      "Contracts between teams",
      "Query by role; few end-to-end journeys",
    ],
  ],
  [
    "Test quality",
    ["Coverage as a flashlight", "Mutants show blind spots", "Fix flakes; fresh data per test"],
  ],
  [
    "Advanced",
    [
      "Properties and fuzzing find the unexpected",
      "Performance budgets",
      "Characterise legacy code first",
    ],
  ],
  [
    "In the team",
    ["Fast CI on every change", "Explore new features", "Roll out gradually, switch off fast"],
  ],
];
