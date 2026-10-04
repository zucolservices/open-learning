/** Two refund agents, five runs each, scored by different graders. Illustrative. */

export interface Run {
  outcome: boolean;
  verifiedFirst: boolean;
  tokens: number;
  steps: string[];
}

export const AGENTS: Record<"A" | "B", Run[]> = {
  A: [
    {
      outcome: true,
      verifiedFirst: true,
      tokens: 9,
      steps: ["verify identity", "look up order", "refund ₹1,200"],
    },
    { outcome: true, verifiedFirst: false, tokens: 7, steps: ["look up order", "refund ₹1,200"] },
    {
      outcome: true,
      verifiedFirst: true,
      tokens: 10,
      steps: ["verify identity", "look up order", "refund ₹1,200"],
    },
    {
      outcome: false,
      verifiedFirst: true,
      tokens: 12,
      steps: ["verify identity", "look up order", "refund ₹12,000 (wrong amount)"],
    },
    { outcome: true, verifiedFirst: false, tokens: 6, steps: ["refund ₹1,200"] },
  ],
  B: [
    {
      outcome: true,
      verifiedFirst: true,
      tokens: 14,
      steps: ["verify identity", "look up order", "check policy", "refund ₹1,200"],
    },
    {
      outcome: false,
      verifiedFirst: true,
      tokens: 22,
      steps: ["verify identity", "look up order", "check policy", "ask a person (unsure)"],
    },
    {
      outcome: true,
      verifiedFirst: true,
      tokens: 15,
      steps: ["verify identity", "look up order", "check policy", "refund ₹1,200"],
    },
    {
      outcome: true,
      verifiedFirst: true,
      tokens: 13,
      steps: ["verify identity", "look up order", "refund ₹1,200"],
    },
    {
      outcome: true,
      verifiedFirst: true,
      tokens: 16,
      steps: ["verify identity", "look up order", "check policy", "refund ₹1,200"],
    },
  ],
};

export interface Graders {
  path: boolean;
  budget: boolean;
}

export function pass(r: Run, g: Graders) {
  if (!r.outcome) return { ok: false, why: "wrong result" };
  if (g.path && !r.verifiedFirst) return { ok: false, why: "refunded without verifying identity" };
  if (g.budget && r.tokens > 15) return { ok: false, why: "over the cost budget" };
  return { ok: true, why: "" };
}
