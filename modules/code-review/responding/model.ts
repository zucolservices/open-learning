/**
 * Five review comments on a made-up café pull request and three possible replies to each. Good
 * replies thank, fix, clarify or explain; poor ones get defensive, dismiss or hand work back.
 */

export const THREADS: {
  id: string;
  comment: string;
  kind: string;
  replies: { text: string; good: boolean; why: string }[];
}[] = [
  {
    id: "retry",
    kind: "blocking",
    comment: "If the payment request is retried, this charges the customer twice.",
    replies: [
      {
        text: "Great catch, thanks. Added an idempotency key and a test that retries the request.",
        good: true,
        why: "Thanks, fixes, and proves it with a test.",
      },
      {
        text: "That's an edge case, it rarely happens.",
        good: false,
        why: "Double-charging customers is exactly what review is for. Rare isn't never.",
      },
      {
        text: "Could you fix it in a follow-up?",
        good: false,
        why: "Hands a real bug back to the reviewer and ships it meanwhile.",
      },
    ],
  },
  {
    id: "helper",
    kind: "question",
    comment: "Is there a reason not to use the existing formatMoney() helper?",
    replies: [
      {
        text: "Didn't know it existed. Switched to it, thanks!",
        good: true,
        why: "Review just shared knowledge; take it.",
      },
      { text: "Mine is shorter.", good: false, why: "Two money formatters will drift apart." },
      {
        text: "(no reply, just changes the code)",
        good: false,
        why: "The fix is fine, but the reviewer can't tell you saw the comment. Reply, even briefly.",
      },
    ],
  },
  {
    id: "confused",
    kind: "question",
    comment: "I don't follow what step 3 in splitBill() is doing.",
    replies: [
      {
        text: "Renamed it to roundToNearestRupee and split it out. Is it clearer now?",
        good: true,
        why: "Google's guide: if a reviewer doesn't understand, clarify the code itself, not just the comment thread.",
      },
      {
        text: "It rounds to the nearest rupee.",
        good: false,
        why: "Answers this reviewer, but the next reader will be just as confused.",
      },
      {
        text: "It's obvious if you read it carefully.",
        good: false,
        why: "Defensive, and the reviewer did read it carefully.",
      },
    ],
  },
  {
    id: "vague",
    kind: "unclear",
    comment: "This is a bit of a mess.",
    replies: [
      {
        text: "Which part reads worst? Happy to restructure, or we could go through it on a quick call.",
        good: true,
        why: "Turns a vague comment into something actionable, without getting defensive.",
      },
      {
        text: "So is half this codebase.",
        good: false,
        why: "Never respond in anger, even to an unhelpful comment.",
      },
      {
        text: "(ignore it and merge)",
        good: false,
        why: "Unresolved concerns come back later, usually louder.",
      },
    ],
  },
  {
    id: "nit",
    kind: "nit",
    comment: "nit: x could be item here.",
    replies: [
      { text: "Done.", good: true, why: "Small, cheap, finished." },
      {
        text: "Ten replies arguing that x is fine.",
        good: false,
        why: "A nit is optional. Change it or say no thanks, but don't spend an hour on it.",
      },
      {
        text: "I'll leave it, it's a loop variable in three lines.",
        good: true,
        why: "Also fine: nits are optional, and you explained.",
      },
    ],
  },
];
