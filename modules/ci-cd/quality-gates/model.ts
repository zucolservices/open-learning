/**
 * Merge rules vs a day of pull requests (illustrative). Each rule can stop certain bad changes
 * and adds some waiting to every change it applies to.
 */

export type Rule = "checks" | "lint" | "sast" | "secrets" | "review" | "owners" | "queue";

export const RULES: { id: Rule; name: string; detail: string }[] = [
  { id: "checks", name: "Tests must pass", detail: "required status check" },
  { id: "lint", name: "Linter and type checker", detail: "required status check" },
  { id: "sast", name: "Static security analysis", detail: "CodeQL, Semgrep, SonarQube…" },
  { id: "secrets", name: "Secret scanning with push protection", detail: "blocks the push" },
  { id: "review", name: "One approving review", detail: "any teammate" },
  { id: "owners", name: "Code owners must approve their area", detail: "CODEOWNERS file" },
  { id: "queue", name: "Merge queue", detail: "re-test on top of main before merging" },
];

export interface Change {
  id: string;
  title: string;
  /** What is wrong with it, if anything. */
  problem?: string;
  /** Rules that would stop it (any one is enough). */
  stoppedBy: Rule[];
  touchesPayments?: boolean;
}

export const CHANGES: Change[] = [
  { id: "readme", title: "Fix a typo in the README", stoppedBy: [] },
  { id: "coupon", title: "Add a coupon code field", stoppedBy: [] },
  {
    id: "totals",
    title: "Refactor cart totals",
    problem: "Breaks the 'free delivery over ₹499' test",
    stoppedBy: ["checks"],
  },
  {
    id: "undefined",
    title: "Tidy up the address form",
    problem: "Reads a variable that is never defined on one path",
    stoppedBy: ["lint"],
  },
  {
    id: "key",
    title: "Quick fix for the image upload",
    problem: "A cloud access key pasted into the code",
    stoppedBy: ["secrets"],
  },
  {
    id: "sql",
    title: "Search orders by customer name",
    problem: "Builds SQL by gluing in user input (injection)",
    stoppedBy: ["sast", "review"],
  },
  {
    id: "rounding",
    title: "Change rounding in the fee calculation",
    problem: "Tests pass, but rounds every fee down: the company loses money",
    stoppedBy: ["owners"],
    touchesPayments: true,
  },
  {
    id: "semantic",
    title: "Rename getPrice to getUnitPrice",
    problem: "Passes alone, but another PR merged an hour ago still calls getPrice",
    stoppedBy: ["queue"],
  },
  {
    id: "audit",
    title: "Turn off audit logging to speed up checkout",
    problem: "Removes the record of who changed what",
    stoppedBy: ["review", "owners"],
    touchesPayments: true,
  },
];

/** Illustrative waiting each rule adds to a change it applies to, in minutes. */
const WAIT: Record<Rule, number> = {
  checks: 8,
  lint: 2,
  sast: 6,
  secrets: 0,
  review: 180,
  owners: 120,
  queue: 15,
};

export interface Outcome {
  change: Change;
  status: "merged" | "stopped" | "escaped";
  by?: Rule;
}

export function run(on: Rule[]): {
  outcomes: Outcome[];
  goodWaitMin: number;
  caught: number;
  escaped: number;
} {
  const outcomes = CHANGES.map((c): Outcome => {
    const by = c.stoppedBy.find((r) => on.includes(r));
    if (!c.problem) return { change: c, status: "merged" };
    return by ? { change: c, status: "stopped", by } : { change: c, status: "escaped" };
  });
  // Automated checks run side by side: the slowest one counts. People add their own waits.
  const machine = Math.max(
    0,
    ...on.filter((r) => ["checks", "lint", "sast"].includes(r)).map((r) => WAIT[r]),
  );
  const perChange = (c: Change) =>
    machine +
    (on.includes("review") ? WAIT.review : 0) +
    (on.includes("owners") && c.touchesPayments ? WAIT.owners : 0) +
    (on.includes("queue") ? WAIT.queue : 0);
  const good = CHANGES.filter((c) => !c.problem);
  return {
    outcomes,
    goodWaitMin: good.reduce((n, c) => n + perChange(c), 0) / good.length,
    caught: outcomes.filter((o) => o.status === "stopped").length,
    escaped: outcomes.filter((o) => o.status === "escaped").length,
  };
}
