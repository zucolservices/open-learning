/**
 * Where a bug is found depends on which safety nets exist. Three made-up bugs in a café's checkout,
 * each catchable by a different kind of test. Fix-time labels are illustrative, not measured.
 */

export type Net = "unit" | "integration" | "e2e";

export const NETS: { id: Net; label: string; detail: string }[] = [
  { id: "unit", label: "Unit tests", detail: "check one function at a time, in milliseconds" },
  { id: "integration", label: "Integration tests", detail: "check code against a real database" },
  { id: "e2e", label: "End-to-end tests", detail: "click through the app in a browser" },
];

export type Stage = "laptop" | "ci" | "review" | "production";

export const STAGES: { id: Stage; label: string; by: string; when: string; fix: string }[] = [
  {
    id: "laptop",
    label: "Your laptop",
    by: "your own test run",
    when: "seconds after the change",
    fix: "minutes to fix",
  },
  {
    id: "ci",
    label: "CI pipeline",
    by: "the CI pipeline",
    when: "minutes later",
    fix: "under an hour",
  },
  {
    id: "review",
    label: "Manual check before release",
    by: "a manual check",
    when: "days later",
    fix: "hours spent working out what changed",
  },
  {
    id: "production",
    label: "A customer",
    by: "a customer",
    when: "after release",
    fix: "days, plus refunds and lost trust",
  },
];

export const BUGS: { id: string; label: string; caughtBy: Net; stage: Stage }[] = [
  {
    id: "rounding",
    label: "Student discount rounds ₹94.50 down to ₹94 on every order",
    caughtBy: "unit",
    stage: "laptop",
  },
  {
    id: "query",
    label: "Order history query uses a column the database renamed",
    caughtBy: "integration",
    stage: "ci",
  },
  {
    id: "button",
    label: "The Pay button is wired to the old handler and does nothing",
    caughtBy: "e2e",
    stage: "ci",
  },
];

/** Where each bug is found, given the nets in place. Without its net it escapes to production. */
export function foundAt(bug: (typeof BUGS)[number], nets: Net[]): Stage {
  if (!nets.includes(bug.caughtBy)) return bug.id === "button" ? "review" : "production";
  return bug.stage;
}
