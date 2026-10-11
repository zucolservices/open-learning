/**
 * Five unhelpful review comments on a made-up café pull request, each with three rewrites: one
 * specific and kind, one vague, one still harsh.
 */

export const ITEMS: {
  id: string;
  bad: string;
  options: { text: string; kind: "good" | "vague" | "harsh" }[];
  why: string;
}[] = [
  {
    id: "loop",
    bad: "Why would you do it like this?? This is wrong.",
    options: [
      { text: "Maybe have another look at this?", kind: "vague" },
      {
        text: "This loops over every order for each customer, so it'll get slow as orders grow. Could we build a map by customer ID first?",
        kind: "good",
      },
      { text: "This is obviously going to be slow.", kind: "harsh" },
    ],
    why: "Says what the problem is, why it matters, and suggests a way forward, about the code, not the person.",
  },
  {
    id: "name",
    bad: "Bad naming.",
    options: [
      {
        text: "The name d made me stop and decode. Something like deliveryFeeRupees would say what it holds.",
        kind: "good",
      },
      { text: "Names could be better.", kind: "vague" },
      { text: "Who names a variable d?", kind: "harsh" },
    ],
    why: "Points at the exact name, explains the effect on a reader, and offers an option.",
  },
  {
    id: "test",
    bad: "Did you even test this?",
    options: [
      { text: "Tests?", kind: "vague" },
      { text: "Clearly not tested.", kind: "harsh" },
      {
        text: "I couldn't find a test for an empty basket; total() looks like it divides by zero there. Could you add one?",
        kind: "good",
      },
    ],
    why: "Names the missing case and the likely bug, and asks instead of accusing.",
  },
  {
    id: "junior",
    bad: "This is how a beginner would write it.",
    options: [
      {
        text: "We keep pricing rules in pricing.ts so they're easy to find. Could this move there?",
        kind: "good",
      },
      { text: "Not how we do things here.", kind: "vague" },
      { text: "Please write it properly.", kind: "harsh" },
    ],
    why: "Explains the team's convention and the reason for it; comments on the code, never on the developer.",
  },
  {
    id: "praise",
    bad: "Nice.",
    options: [
      {
        text: "Nice: pulling the rounding into its own function made this much easier to follow.",
        kind: "good",
      },
      { text: "👍", kind: "vague" },
      { text: "Finally, something readable.", kind: "harsh" },
    ],
    why: "Specific praise tells the author what to keep doing.",
  },
];
