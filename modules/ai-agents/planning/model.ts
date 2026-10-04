/** One offsite-planning task under three strategies, with an optional surprise. Numbers are illustrative. */

export type Strategy = "react" | "plan" | "replan";

export interface Call {
  who: "planner" | "executor" | "agent";
  text: string;
  tokens: number;
  bad?: boolean;
}

const STEPS = [
  "shortlist venues",
  "check availability",
  "book venue",
  "book travel",
  "draft agenda",
  "send invites",
];

export function run(
  strategy: Strategy,
  surprise: boolean,
): { calls: Call[]; outcome: string; ok: boolean } {
  const calls: Call[] = [];
  if (strategy === "react") {
    let context = 1200;
    STEPS.forEach((s, i) => {
      context += 900;
      if (surprise && i === 2) {
        calls.push({ who: "agent", text: "book venue → fully booked", tokens: context, bad: true });
        context += 900;
        calls.push({ who: "agent", text: "next choice: book the second venue", tokens: context });
      } else calls.push({ who: "agent", text: s, tokens: context });
    });
    return {
      calls,
      outcome: surprise
        ? "Adapted on the spot, but every call re-read the whole growing history."
        : "Done. Each step re-read the whole history, so cost grew with every turn.",
      ok: true,
    };
  }
  calls.push({ who: "planner", text: `plan: ${STEPS.length} steps`, tokens: 1500 });
  for (let i = 0; i < STEPS.length; i++) {
    if (surprise && i === 2) {
      calls.push({ who: "executor", text: "book venue → fully booked", tokens: 700, bad: true });
      if (strategy === "replan") {
        calls.push({ who: "planner", text: "re-plan: book venue #2, keep the rest", tokens: 1800 });
        calls.push({ who: "executor", text: "book the second venue", tokens: 700 });
      } else {
        for (let j = 3; j < STEPS.length; j++)
          calls.push({
            who: "executor",
            text: `${STEPS[j]} (for a venue we don't have)`,
            tokens: 700,
            bad: true,
          });
        return {
          calls,
          outcome:
            "Followed the plan blindly: travel and invites are for a venue that was never booked.",
          ok: false,
        };
      }
    } else calls.push({ who: "executor", text: STEPS[i], tokens: 700 });
  }
  return {
    calls,
    outcome: surprise
      ? "The surprise triggered a re-plan; only the broken step changed."
      : "Done with one planning call and short, focused executor calls.",
    ok: true,
  };
}

export const TODOS: [string, boolean][][] = [
  [
    ["Shortlist venues", false],
    ["Check availability", false],
    ["Book venue", false],
    ["Book travel", false],
    ["Send invites", false],
  ],
  [
    ["Shortlist venues", true],
    ["Check availability", true],
    ["Book venue", false],
    ["Book travel", false],
    ["Send invites", false],
  ],
  [
    ["Shortlist venues", true],
    ["Check availability", true],
    ["Book venue: first choice full → try Sea Breeze", false],
    ["Book travel", false],
    ["Send invites", false],
  ],
  [
    ["Shortlist venues", true],
    ["Check availability", true],
    ["Book venue: Sea Breeze", true],
    ["Book travel", true],
    ["Send invites", false],
  ],
];
