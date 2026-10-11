/**
 * Six review comments to label with Conventional Comments labels, and the review verdict that
 * follows. The pull request is made up.
 */

export type Label = "issue" | "suggestion" | "question" | "nitpick" | "praise";

export const LABELS: { id: Label; label: string; blocking: boolean }[] = [
  { id: "issue", label: "issue (blocking)", blocking: true },
  { id: "suggestion", label: "suggestion (non-blocking)", blocking: false },
  { id: "question", label: "question", blocking: false },
  { id: "nitpick", label: "nitpick (non-blocking)", blocking: false },
  { id: "praise", label: "praise", blocking: false },
];

export const COMMENTS: { id: string; text: string; answer: Label }[] = [
  {
    id: "c1",
    text: "This retries a failed payment without an idempotency key, so a customer can be charged twice.",
    answer: "issue",
  },
  {
    id: "c2",
    text: "Consider pulling the retry loop into a helper; we have three of these now.",
    answer: "suggestion",
  },
  { id: "c3", text: "Is the 30-second timeout from the bank's documentation?", answer: "question" },
  { id: "c4", text: "Extra blank line at the end of the function.", answer: "nitpick" },
  { id: "c5", text: "The test names read like the requirements. Lovely.", answer: "praise" },
  {
    id: "c6",
    text: "Refunds show the original total on the receipt instead of the refunded amount.",
    answer: "issue",
  },
];

export type Verdict = "approve" | "changes" | "comment";
export const VERDICTS: { id: Verdict; label: string }[] = [
  { id: "approve", label: "Approve" },
  { id: "changes", label: "Request changes" },
  { id: "comment", label: "Comment only" },
];
