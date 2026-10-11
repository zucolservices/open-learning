/**
 * Building a pull request description for a made-up café fix by choosing one sentence per
 * section. Good choices answer a reviewer's question before it's asked.
 */

export const SECTIONS: {
  id: string;
  label: string;
  question: string;
  options: { text: string; good: boolean; why: string }[];
}[] = [
  {
    id: "title",
    label: "First line",
    question: "What does this do, at a glance?",
    options: [
      {
        text: "Fix bug",
        good: false,
        why: "Says nothing; Google's guide uses exactly this as a bad example.",
      },
      {
        text: "Apply the student discount before GST",
        good: true,
        why: "Short, imperative, and makes sense on its own in the history.",
      },
      {
        text: "Changes to checkout.ts, pricing.ts and tests as discussed",
        good: false,
        why: "Lists files, not purpose.",
      },
    ],
  },
  {
    id: "why",
    label: "Why",
    question: "What problem does it solve?",
    options: [
      {
        text: "Students were charged GST on the full price, about 60 paise too much per chai (₹114.00 instead of ₹113.40). Finance confirmed the discount comes first (issue #482).",
        good: true,
        why: "The problem, its effect, and who decided.",
      },
      {
        text: "Requested by the team.",
        good: false,
        why: "No context for a reviewer or for someone reading this in a year.",
      },
      {
        text: "Pricing has been wrong for a while, I think, possibly since last spring's change, or maybe earlier, hard to say.",
        good: false,
        why: "Uncertain and wordy; state what you know.",
      },
    ],
  },
  {
    id: "how",
    label: "Approach",
    question: "Why this way?",
    options: [
      {
        text: "Moved the discount into priceBeforeTax(), so every caller gets the same order. Considered fixing only the receipt, but the API returned the same wrong total.",
        good: true,
        why: "Explains the choice and the alternative rejected.",
      },
      {
        text: "Refactored stuff.",
        good: false,
        why: "The reviewer has to reverse-engineer the approach from the diff.",
      },
      { text: "See the code.", good: false, why: "The code shows what, not why." },
    ],
  },
  {
    id: "test",
    label: "How to check",
    question: "How do I know it works?",
    options: [
      {
        text: "New test: a ₹120 student order costs ₹113.40. On staging, order a chai as a student.",
        good: true,
        why: "Evidence plus a quick manual check.",
      },
      { text: "Tested.", good: false, why: "How? What should the reviewer look for?" },
      { text: "Should be fine.", good: false, why: "Confidence isn't evidence." },
    ],
  },
  {
    id: "risk",
    label: "Risks",
    question: "What could go wrong?",
    options: [
      {
        text: "Old receipts aren't recalculated. Rollback: revert this PR; no data migration.",
        good: true,
        why: "Tells the reviewer where to look harder, and how to undo it.",
      },
      { text: "None.", good: false, why: "Every change has some; name the main one." },
      {
        text: "Could break everything, not sure.",
        good: false,
        why: "Alarming and unhelpful. Find out, or say what's uncertain specifically.",
      },
    ],
  },
];

export const SELF_REVIEW = [
  "A console.log left in pricing.ts",
  "A file changed by accident (package-lock.json)",
  "A TODO with no explanation",
];
