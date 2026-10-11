/**
 * A six-month simulation of a team's choices. Debt slows feature work; shortcuts add debt;
 * cleaning removes it. All rates are illustrative.
 */

export type Choice = "ship" | "steady" | "stop";

export const CHOICES: { id: Choice; label: string; detail: string }[] = [
  {
    id: "ship",
    label: "Features only, take shortcuts",
    detail: "All effort on features; debt grows.",
  },
  {
    id: "steady",
    label: "Features, plus clean as you go",
    detail: "About a fifth of effort tidying what you touch.",
  },
  { id: "stop", label: "Stop and clean up", detail: "A month of cleanup, no features." },
];

export const START_DEBT = 0.3;
const BASE = 10;

export interface Month {
  choice: Choice;
  features: number;
  debtAfter: number;
}

export function simulate(plan: Choice[]): Month[] {
  let debt = START_DEBT;
  return plan.map((c) => {
    const speed = BASE * (1 - debt);
    let features = 0;
    if (c === "ship") {
      features = speed;
      debt = Math.min(1, debt + 0.12);
    } else if (c === "steady") {
      features = speed * 0.8;
      debt = Math.max(0, debt - 0.04);
    } else {
      debt = Math.max(0, debt - 0.3);
    }
    return {
      choice: c,
      features: Math.round(features * 10) / 10,
      debtAfter: Math.round(debt * 100) / 100,
    };
  });
}
