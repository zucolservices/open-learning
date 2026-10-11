/**
 * Five made-up changes and five ways to get a second mind on them, from shipping straight to
 * main through to the whole team working together. Wait times are illustrative.
 */

export type Style = "ship" | "show" | "ask" | "pair" | "mob";

export const STYLES: {
  id: Style;
  label: string;
  desc: string;
  weight: number;
  wait: string;
  light: string;
  heavy: string;
}[] = [
  {
    id: "ship",
    label: "Ship",
    desc: "Merge straight to main; no review.",
    weight: 1,
    wait: "0 h",
    light:
      "With no second look, a mistake here goes straight to customers. Tests alone can't judge this.",
    heavy: "",
  },
  {
    id: "show",
    label: "Show",
    desc: "Open a PR, merge it now, teammates review afterwards.",
    weight: 2,
    wait: "0 h",
    light:
      "Reviewing after merge is too late for something this risky; it's live before anyone looks.",
    heavy: "Reasonable, though the team spends attention on something that needed none.",
  },
  {
    id: "ask",
    label: "Ask",
    desc: "Open a PR and wait for approval before merging.",
    weight: 3,
    wait: "~4 h",
    light:
      "A pull request helps, but one reviewer reading later can't share context the way working together does.",
    heavy: "It works, but a tiny change now waits hours for a reviewer.",
  },
  {
    id: "pair",
    label: "Pair",
    desc: "Two people write it together; review happens as you type.",
    weight: 4,
    wait: "0 h",
    light: "Two minds help, but this decision affects people who aren't in the pair.",
    heavy: "Two people's whole time on something this small is more than it needs.",
  },
  {
    id: "mob",
    label: "Mob",
    desc: "The whole team works on it together at one screen.",
    weight: 5,
    wait: "0 h",
    light: "",
    heavy: "The whole team's time on this is far more than it needs.",
  },
];

export const CHANGES: { id: string; text: string; good: Style[]; why: string }[] = [
  {
    id: "typo",
    text: "Fix a typo on the help page",
    good: ["ship", "show"],
    why: "Low risk, easy to undo. Tests and a quick glance afterwards are plenty.",
  },
  {
    id: "rename",
    text: "Rename a confusingly named function in one file; tests pass",
    good: ["show", "ask"],
    why: "Safe and covered by tests. Showing it lets teammates learn the new name without waiting.",
  },
  {
    id: "refund",
    text: "New rules for partial refunds",
    good: ["ask", "pair"],
    why: "Money and tricky edge cases: a second mind should see it before it merges.",
  },
  {
    id: "newbie",
    text: "A new joiner's first change to the payment code",
    good: ["pair"],
    why: "Pairing reviews every line as it's written and teaches the codebase at the same time.",
  },
  {
    id: "checkout",
    text: "Design the new checkout flow that touches four teams' code",
    good: ["mob"],
    why: "Everyone affected shapes it together; no long review threads later.",
  },
];
