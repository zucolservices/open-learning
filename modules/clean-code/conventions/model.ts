/**
 * Proposed conventions for a made-up café team, the sensible way to handle each, and an ADR whose
 * sections the learner fills in by choosing the best sentence.
 */

export type How = "automate" | "write" | "drop";

export const HOWS: { id: How; label: string }[] = [
  { id: "automate", label: "Automate" },
  { id: "write", label: "Write down" },
  { id: "drop", label: "Drop" },
];

export const PROPOSALS: { id: string; text: string; answer: How; why: string }[] = [
  {
    id: "indent",
    text: "Two-space indentation",
    answer: "automate",
    why: "A formatter enforces it on save; nobody needs to remember.",
  },
  {
    id: "unused",
    text: "No unused variables or imports",
    answer: "automate",
    why: "A linter rule, with auto-fix.",
  },
  {
    id: "bool",
    text: "Name booleans is…, has… or can…",
    answer: "write",
    why: "A tool can't judge meaning; put it in the style guide and mention it in review.",
  },
  {
    id: "folders",
    text: "Group code by feature (orders/, menu/), not by type",
    answer: "write",
    why: "A structural decision worth explaining, perhaps in an ADR.",
  },
  {
    id: "bugtest",
    text: "Every bug fix comes with a test that reproduces it",
    answer: "write",
    why: "Write it down and check in review; CI can't tell a bug fix from a feature.",
  },
  {
    id: "mine",
    text: "“I like my files with the opening brace on its own line”",
    answer: "drop",
    why: "A personal taste. Consistency matters more than any one person's preference.",
  },
  {
    id: "len",
    text: "Lines up to 100 characters",
    answer: "automate",
    why: "The formatter wraps lines for you.",
  },
];

export const ADR_SECTIONS: {
  id: string;
  label: string;
  options: { text: string; good: boolean }[];
}[] = [
  {
    id: "context",
    label: "Context",
    options: [
      {
        text: "Orders need transactions across order, payment and stock tables; the team knows SQL; we expect thousands, not millions, of orders a day.",
        good: true,
      },
      { text: "Everyone uses PostgreSQL these days.", good: false },
    ],
  },
  {
    id: "decision",
    label: "Decision",
    options: [
      {
        text: "We will store orders in PostgreSQL, accessed only through the orders module.",
        good: true,
      },
      { text: "Maybe PostgreSQL, unless something better comes along.", good: false },
    ],
  },
  {
    id: "status",
    label: "Status",
    options: [
      { text: "Accepted, 11 Oct 2026.", good: true },
      { text: "Done.", good: false },
    ],
  },
  {
    id: "consequences",
    label: "Consequences",
    options: [
      {
        text: "We get transactions and familiar tooling. We must run backups and migrations. Revisit if order volume grows a hundredfold.",
        good: true,
      },
      { text: "No downsides.", good: false },
    ],
  },
];
