/**
 * A messy, made-up pull request reviewed end to end: reading order, labelled comments, the
 * author's replies and the merge decision.
 */

export const FILES: { path: string; size: string; rank: number; note: string }[] = [
  {
    path: "src/giftcards/balance.ts",
    size: "+24 −3",
    rank: 0,
    note: "The core logic: read it first, while you're fresh.",
  },
  {
    path: "tests/giftcards/balance.test.ts",
    size: "+41",
    rank: 1,
    note: "The tests tell you what the author thinks the code does.",
  },
  {
    path: "src/checkout/pay.ts",
    size: "+6 −1",
    rank: 2,
    note: "The caller: check the core is used correctly.",
  },
  {
    path: "src/utils/format.ts",
    size: "+58 −52",
    rank: 3,
    note: "Unrelated reformatting. Worth asking to split it out.",
  },
  {
    path: "package-lock.json",
    size: "+1,912 −1,880",
    rank: 4,
    note: "Generated. Skim, or leave it to the dependency checks.",
  },
];

export const DIFF = [
  " export async function canPay(card: GiftCard, amount: number) {",
  "+  const bal = await api.balance(card.code);",
  "+  if (bal > amount) return true;",
  '+  console.log("checked", card.code);',
  "+  let x = bal - amount;",
  "+  return false;",
  " }",
];

export interface Candidate {
  id: string;
  text: string;
  best?: boolean;
  why: string;
}

export const COMMENTS: Record<number, Candidate[]> = {
  1: [
    {
      id: "a",
      text: "suggestion (non-blocking): consider handling errors.",
      why: "Under-labelled: if the balance service fails, checkout breaks. That should block.",
    },
    {
      id: "b",
      text: "issue (blocking): If the balance service is down, this throws and checkout shows a blank error. Could we catch it and show “try again”?",
      best: true,
      why: "Specific problem, impact, and a suggested way forward.",
    },
    {
      id: "c",
      text: "Error handling???",
      why: "The author has to guess what you mean and how much it matters.",
    },
  ],
  2: [
    { id: "a", text: "This is wrong.", why: "True, but it doesn't say what's wrong or why." },
    {
      id: "b",
      text: "nitpick: maybe >=?",
      why: "Under-labelled: rejecting a card with exactly enough balance is a real bug.",
    },
    {
      id: "c",
      text: "issue (blocking): A card with exactly the order amount gets rejected. Should this be >=? A test for the equal case would pin it down.",
      best: true,
      why: "Names the case, asks a real question, suggests a test.",
    },
  ],
  3: [
    {
      id: "a",
      text: "issue (blocking): This logs the gift card code, which works like a password. Could we log the card id instead?",
      best: true,
      why: "Explains the risk and offers a fix.",
    },
    {
      id: "b",
      text: "Why are you logging secrets?!",
      why: "Right concern, but it attacks the person and explains nothing.",
    },
    {
      id: "c",
      text: "nitpick: remove console.log.",
      why: "Under-labelled: leaking a code that spends money is a security issue.",
    },
  ],
  4: [
    {
      id: "a",
      text: "issue (blocking): unused variable.",
      why: "Over-labelled. It's harmless, and a linter should catch it.",
    },
    {
      id: "b",
      text: "nitpick (non-blocking): x is never used; safe to delete.",
      best: true,
      why: "Correctly optional, and says why.",
    },
    { id: "c", text: "Sloppy.", why: "Judges the author and gives nothing to act on." },
  ],
};

export const REPLIES: { id: string; author: string; options: Candidate[] }[] = [
  {
    id: "thanks",
    author: "Good catch on >=. Fixed, and added a test for the exact-balance case.",
    options: [
      {
        id: "a",
        text: "Thanks, that test is a nice touch. Resolving.",
        best: true,
        why: "Acknowledges the fix and closes the thread.",
      },
      { id: "b", text: "Finally.", why: "Makes fixing things feel like a telling-off." },
      {
        id: "c",
        text: "(Say nothing and leave the thread open.)",
        why: "The author can't tell whether you're satisfied.",
      },
    ],
  },
  {
    id: "push",
    author: "The balance service never goes down, so I'd rather skip the error handling.",
    options: [
      { id: "a", text: "OK, approving.", why: "Gives up a blocking issue without new facts." },
      {
        id: "b",
        text: "It went down twice last quarter (links in the incident log). A simple “try again” message would do. Happy to pair on it if useful.",
        best: true,
        why: "Facts beat opinions, and the offer to help keeps it friendly.",
      },
      {
        id: "c",
        text: "Just do it.",
        why: "Authority instead of reasons; the author learns nothing.",
      },
    ],
  },
  {
    id: "split",
    author: "Can I move the format.ts changes into a separate pull request?",
    options: [
      {
        id: "a",
        text: "No, keep everything together so it's one review.",
        why: "Mixing unrelated changes makes this one harder to review and to undo.",
      },
      {
        id: "b",
        text: "Yes please. That keeps this one focused.",
        best: true,
        why: "Smaller, single-purpose changes are easier to review.",
      },
      {
        id: "c",
        text: "Whatever you like.",
        why: "Not wrong, but a missed chance to reinforce a good habit.",
      },
    ],
  },
];

export type Verdict = "approve" | "changes" | "more";

export const VERDICTS: { id: Verdict; label: string; result: string; best: boolean }[] = [
  {
    id: "changes",
    label: "Request changes for the unused variable",
    result:
      "The only thing left is optional. Blocking on it costs the author another round for nothing.",
    best: false,
  },
  {
    id: "approve",
    label: "Approve, leaving the nit to the author",
    result:
      "Right. Every blocking issue is fixed and the change definitely improves the code. It doesn't have to be perfect.",
    best: true,
  },
  {
    id: "more",
    label: "Keep reviewing until it's perfect",
    result:
      "There's no perfect code, only better code. The change waits while the reviewer polishes.",
    best: false,
  },
];
