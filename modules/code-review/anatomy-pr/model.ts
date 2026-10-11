/**
 * A vague, made-up pull request and the improvements that turn it into one a reviewer can approve
 * quickly. Each improvement answers one of the reviewer's questions. Review times are illustrative.
 */

export const FIXES: {
  id: string;
  label: string;
  question: string;
  before: string;
  after: string;
}[] = [
  {
    id: "title",
    label: "A specific title",
    question: "What does this change do?",
    before: "fix stuff",
    after: "Apply student discount before GST, not after",
  },
  {
    id: "why",
    label: "Explain the why",
    question: "Why is this needed?",
    before: "(no description)",
    after:
      "Students were charged GST on the full price. Finance confirmed the discount comes first (see issue #482).",
  },
  {
    id: "test",
    label: "Say how to check it",
    question: "How do I know it works?",
    before: "",
    after:
      "Added a test for a ₹120 student order (expects ₹113.40). To try it: order one chai as a student on staging.",
  },
  {
    id: "scope",
    label: "Move the unrelated reformat to its own PR",
    question: "Why are 41 files changed?",
    before: "41 files changed (40 reformatted)",
    after: "2 files changed",
  },
  {
    id: "shot",
    label: "Add a before/after screenshot of the receipt",
    question: "What will customers see?",
    before: "",
    after: "[screenshot: receipt before ₹119.70 → after ₹113.40]",
  },
];

export const minutes = (done: number) => [45, 32, 22, 14, 9, 7][done];
