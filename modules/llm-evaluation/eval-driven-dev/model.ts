/** Pull requests to a support assistant, each scored by the eval suite in CI. Scores illustrative. */

export interface PR {
  id: number;
  title: string;
  regression: number; // % of must-keep-working cases passing
  capability: number; // % of stretch cases passing
  incident: string; // what users would hit if it shipped with a regression
}

export const PRS: PR[] = [
  {
    id: 101,
    title: "Shorten replies to cut cost",
    regression: 96,
    capability: 41,
    incident: "Upset customers get one-line answers; complaints rise.",
  },
  {
    id: 102,
    title: "Add Hindi examples to the prompt",
    regression: 100,
    capability: 55,
    incident: "",
  },
  {
    id: 103,
    title: "Switch to a cheaper model",
    regression: 91,
    capability: 38,
    incident: "Refund windows quoted wrongly for sale items.",
  },
  {
    id: 104,
    title: "Fix a typo in the system prompt",
    regression: 100,
    capability: 41,
    incident: "",
  },
  {
    id: 105,
    title: "New tool: look up order history",
    regression: 99,
    capability: 63,
    incident: "",
  },
];

export function run(ci: boolean, gate: number) {
  return PRS.map((p) => {
    const blocked = ci && p.regression < gate;
    const broke = p.regression < 99;
    return { ...p, blocked, shippedBroken: !blocked && broke };
  });
}

export const NOTES: { note: string; bucket: string }[] = [
  { note: "Quoted 30 days for a sale item", bucket: "Wrong policy" },
  { note: "Replied in English to a Hindi message", bucket: "Wrong language" },
  { note: "Said refund was done; tool had failed", bucket: "False success" },
  { note: "Gave the full-price refund rule for a sale jacket", bucket: "Wrong policy" },
  { note: "Asked for the order number twice", bucket: "Repeats itself" },
  { note: "Mixed Hindi and English mid-reply", bucket: "Wrong language" },
  { note: "Promised free return postage", bucket: "Wrong policy" },
  { note: "Claimed address updated without calling the tool", bucket: "False success" },
];
