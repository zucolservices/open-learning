/** A week after releasing an update with a hidden flaw. All numbers illustrative. */

export const DAILY = 10000; // conversations a day
export const FLAW_RATE = 0.06; // new version approves out-of-policy refunds

export type Signal = "thumbs" | "judge" | "rule";

export const SIGNALS: { id: Signal; name: string; detail: string }[] = [
  { id: "thumbs", name: "Thumbs up / down", detail: "Users rate replies" },
  {
    id: "judge",
    name: "LLM judge on a 10% sample",
    detail: "Checks replies against the refund policy",
  },
  {
    id: "rule",
    name: "Rule: refund above policy limit",
    detail: "Flags any refund the policy wouldn't allow",
  },
];

export interface Plan {
  canary: boolean;
  signals: Signal[];
}

export function simulate(p: Plan) {
  // Judge or rule catch the flaw on day 1; thumbs never do (it looks better); otherwise complaints force a rollback on day 5.
  const caught = p.signals.includes("judge") || p.signals.includes("rule");
  const detectDay = caught ? 1 : 5;
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = i + 1;
    const live = day <= detectDay;
    const share = p.canary && day <= 2 ? 0.05 : 1; // a canary widens to everyone after day 2
    return {
      day,
      thumbsUp: live ? 76 : 70,
      policy: live ? Math.round(100 - FLAW_RATE * 100) : 99,
      harmed: live ? Math.round(DAILY * share * FLAW_RATE) : 0,
    };
  });
  return { days, detectDay, caught, harmed: days.reduce((a, d) => a + d.harmed, 0) };
}
