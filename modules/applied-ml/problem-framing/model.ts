/** Framing a churn problem: choices for each part of the spec. Illustrative. */

export type Kind = "good" | "weak" | "bad";

export const SLOTS: {
  id: string;
  name: string;
  options: { id: string; text: string; kind: Kind; why: string }[];
}[] = [
  {
    id: "target",
    name: "What exactly do we predict?",
    options: [
      {
        id: "unhappy",
        text: "Whether a customer is unhappy",
        kind: "bad",
        why: "There's no column for “unhappy”. You can't train on what you can't measure.",
      },
      {
        id: "cancel30",
        text: "Whether an active subscriber cancels in the next 30 days",
        kind: "good",
        why: "Measurable, with a clear time window.",
      },
      {
        id: "complain",
        text: "Whether they contact support",
        kind: "weak",
        why: "A proxy. Many unhappy customers never call, and many callers are fine.",
      },
    ],
  },
  {
    id: "type",
    name: "What kind of output?",
    options: [
      {
        id: "reg",
        text: "A number: days until they cancel",
        kind: "weak",
        why: "Possible, but nobody acts on “day 47”.",
      },
      {
        id: "rank",
        text: "A ranked list, most likely to leave first",
        kind: "good",
        why: "The team can only call 200 a week: they need the top of a list.",
      },
      {
        id: "cls",
        text: "Yes/no for each customer",
        kind: "weak",
        why: "Fine, but 900 “yes” answers doesn't tell the team which 200 to call.",
      },
    ],
  },
  {
    id: "when",
    name: "When is the prediction made?",
    options: [
      {
        id: "first",
        text: "On the 1st of each month, using only data up to that day",
        kind: "good",
        why: "Matches how it will really run.",
      },
      {
        id: "anytime",
        text: "Using everything we know about the customer, including later events",
        kind: "bad",
        why: "Includes information from the future: it will look brilliant and fail in use.",
      },
    ],
  },
  {
    id: "baseline",
    name: "What must it beat?",
    options: [
      {
        id: "none",
        text: "Nothing: any model is better than none",
        kind: "bad",
        why: "Without a baseline you can't tell whether ML adds anything.",
      },
      {
        id: "rule",
        text: "A simple rule: call customers with no login for 21 days",
        kind: "good",
        why: "A cheap rule of thumb. If ML can't clearly beat it, ship the rule.",
      },
    ],
  },
  {
    id: "action",
    name: "What happens with the prediction?",
    options: [
      {
        id: "call",
        text: "The retention team calls the top 200 each week with an offer",
        kind: "good",
        why: "A concrete action you can measure.",
      },
      {
        id: "dash",
        text: "Put the scores on a dashboard",
        kind: "weak",
        why: "Interesting, but nobody is accountable for acting on it.",
      },
    ],
  },
];
