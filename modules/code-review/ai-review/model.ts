/**
 * A loyalty-points change with five AI review comments (two right, two wrong for lack of
 * context, one optional) and one human comment the AI missed. Everything is made up.
 */

export const DIFF = [
  " export function points(order: Order, member: Member | null): number {",
  "+  let total = 0;",
  "+  for (let i = 0; i <= order.items.length; i++) total += order.items[i].price;",
  '+  const rate = member.tier === "gold" ? 2 : 1;',
  "+  return Math.floor(total / 10000) * rate;",
  " }",
];

export type Choice = "apply" | "dismiss";

export interface AiComment {
  id: string;
  line: number;
  short: string;
  text: string;
  best: Choice | "either";
  apply: string;
  dismiss: string;
}

export const AI: AiComment[] = [
  {
    id: "loop",
    short: "Loop runs past the end",
    line: 2,
    text: "The loop runs one step past the end of the array: use < rather than <=.",
    best: "apply",
    apply: "Right. The last step would read an item that doesn't exist and crash.",
    dismiss: "That's a real bug: the loop reads past the end of the list. The AI was right here.",
  },
  {
    id: "null",
    short: "member can be null",
    line: 3,
    text: "member can be null, so this throws for guest checkouts.",
    best: "apply",
    apply: "Right. Guests have no membership, and this line would crash for every one of them.",
    dismiss:
      "The type says member can be null, and guests check out all the time. This would crash.",
  },
  {
    id: "round",
    short: "Round instead of floor",
    line: 4,
    text: "Use Math.round instead of Math.floor so customers get fairer points.",
    best: "dismiss",
    apply:
      "That breaks the rule. The loyalty scheme gives a point per full ₹100 spent; rounding up would hand out points nobody earned. The AI didn't know.",
    dismiss:
      "Right. The scheme gives a point per full ₹100. The AI had no way to know the product rule; reply with a link to it.",
  },
  {
    id: "unused",
    short: "points() looks unused",
    line: 0,
    text: "points() appears to be unused. Consider removing it.",
    best: "dismiss",
    apply: "Removing it breaks checkout. It's called through a registry the AI didn't trace.",
    dismiss:
      "Right. It's looked up by name from the checkout registry, which the AI didn't see. A confident claim isn't a correct one.",
  },
  {
    id: "name",
    short: "Rename total",
    line: 1,
    text: "Consider renaming total to totalPaise to make the unit clear.",
    best: "either",
    apply: "Fine: a small clarity win. It's optional, so it's the author's call.",
    dismiss: "Fine: it's optional. A short reply saying why keeps things friendly.",
  },
];

export const HUMAN =
  "Gift cards shouldn't earn points (see the loyalty spec, section 2). Could you filter them out and add a test?";

export type Approver = "ai" | "human";
