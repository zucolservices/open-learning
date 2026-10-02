/** A release goes wrong at 6 p.m.: three situations, three ways out (illustrative minutes). */

export type Situation = "flagged" | "plain" | "format";
export type Action = "rollback" | "forward" | "flag";

export const SITUATIONS: Record<Situation, { name: string; text: string }> = {
  flagged: {
    name: "New UPI flow, behind a flag",
    text: "v42 shipped a new UPI payment flow, switched on for everyone at 5:45 p.m. through a feature flag. At 6:00 p.m., 8% of UPI payments start failing.",
  },
  plain: {
    name: "A bug, no flag",
    text: "v42 refactored the receipt code. No flag: the change is simply live. At 6:00 p.m., 8% of checkouts fail while building the receipt.",
  },
  format: {
    name: "A new data format",
    text: "v42 started saving orders in a new compressed format. At 6:00 p.m., 8% of checkouts fail. Since 5:45 p.m. v42 has written 9,000 orders that v41 can't read.",
  },
};

export interface Outcome {
  /** Minutes from 6:00 p.m. until customers stop failing. */
  minutes: number | null;
  verdict: "good" | "ok" | "bad";
  steps: string[];
  lesson: string;
}

export const OUTCOMES: Record<Situation, Record<Action, Outcome>> = {
  flagged: {
    flag: {
      minutes: 3,
      verdict: "good",
      steps: [
        "6:02 on-call sees the alert",
        "6:03 turns the flag off; apps pick it up in seconds",
        "6:03 failures stop",
      ],
      lesson:
        "The fastest, smallest fix: v42 stays deployed with the new flow switched off. Debug tomorrow.",
    },
    rollback: {
      minutes: 12,
      verdict: "ok",
      steps: ["6:02 alert", "6:04 starts redeploying v41", "6:12 rollout complete, failures stop"],
      lesson: "Works, but slower than the flag and it also takes out everything else v42 brought.",
    },
    forward: {
      minutes: 70,
      verdict: "bad",
      steps: [
        "6:02 alert",
        "6:10 someone starts a fix",
        "6:40 fix reviewed, pipeline running",
        "7:10 v43 deployed, failures stop",
      ],
      lesson:
        "An hour of failures, and a rushed fix written under pressure is the commonest cause of a second bad deploy.",
    },
  },
  plain: {
    flag: {
      minutes: null,
      verdict: "bad",
      steps: ["6:02 alert", "6:03 looks for a flag… there isn't one"],
      lesson: "No flag, no switch. Flags only help if they were put in before the release.",
    },
    rollback: {
      minutes: 12,
      verdict: "good",
      steps: [
        "6:02 alert",
        "6:04 redeploys v41, the last known good artifact",
        "6:12 failures stop",
      ],
      lesson:
        '"Rolls back first and investigates the problem second", as Google\'s reliability engineers put it. v41 is already built and tested.',
    },
    forward: {
      minutes: 70,
      verdict: "bad",
      steps: ["6:02 alert", "6:15 diagnosis", "6:45 fix through the pipeline", "7:10 v43 deployed"],
      lesson: "Possible, but customers wait an hour for something a rollback fixes in minutes.",
    },
  },
  format: {
    flag: {
      minutes: null,
      verdict: "bad",
      steps: ["6:02 alert", "6:03 no flag controls the storage format"],
      lesson: "Nothing to switch off.",
    },
    rollback: {
      minutes: null,
      verdict: "bad",
      steps: [
        "6:02 alert",
        "6:12 v41 is back",
        "6:13 v41 can't read the 9,000 new-format orders: those customers now fail too",
      ],
      lesson:
        "A one-way door. Once new data is written in a format the old version can't read, rolling back makes things worse.",
    },
    forward: {
      minutes: 55,
      verdict: "ok",
      steps: [
        "6:02 alert",
        "6:20 fix: read both formats, write the old one again",
        "6:57 v43 deployed, failures stop",
      ],
      lesson:
        "The only way out. Next time, ship in two phases: first teach every server to read the new format, then switch writing on.",
    },
  },
};
