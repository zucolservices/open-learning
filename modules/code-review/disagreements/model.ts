/**
 * Three made-up review disagreements, from style to design, each with ways to settle it. The
 * "best" path follows Google's engineering-practices guide on resolving conflicts.
 */

export interface Option {
  id: string;
  label: string;
  outcome: string;
  best: boolean;
}

export interface Scene {
  id: string;
  kind: string;
  title: string;
  thread: string[];
  options: Option[];
}

export const SCENES: Scene[] = [
  {
    id: "style",
    kind: "Preference vs. the style guide",
    title: "Single or double quotes?",
    thread: [
      "Reviewer: Please use single quotes; they're cleaner.",
      "Author: I prefer double quotes.",
    ],
    options: [
      {
        id: "argue",
        label: "Keep debating in the thread",
        outcome:
          "Fourteen comments later, nobody has changed their mind and the feature is a day late.",
        best: false,
      },
      {
        id: "guide",
        label: "Check the style guide and let the formatter decide",
        outcome:
          "The team's style guide says double quotes and the formatter enforces it. Settled in one comment.",
        best: true,
      },
      {
        id: "manager",
        label: "Escalate to the engineering manager",
        outcome:
          "Your manager is puzzled to be asked about quotation marks. The answer was in the style guide.",
        best: false,
      },
    ],
  },
  {
    id: "design",
    kind: "A design disagreement",
    title: "Where should the cache live?",
    thread: [
      "Reviewer: This cache belongs in the API gateway, not the service.",
      "Author: The service knows when prices change; the gateway doesn't.",
      "Reviewer: But then every service builds its own cache…",
      "(six more comments)",
    ],
    options: [
      {
        id: "type",
        label: "Write a longer, more detailed reply",
        outcome:
          "The thread grows to twenty comments. Tone gets sharper as each side re-reads the other's words.",
        best: false,
      },
      {
        id: "call",
        label: "Suggest a 15-minute call, then record the outcome in the thread",
        outcome:
          "On a call you agree: the service owns invalidation, and a shared library avoids duplication. The summary comment helps everyone who reads it later.",
        best: true,
      },
      {
        id: "give",
        label: "Reviewer approves to avoid conflict",
        outcome:
          "The concern never gets discussed. Three months later two other services have copied the pattern, problems and all.",
        best: false,
      },
    ],
  },
  {
    id: "stuck",
    kind: "Still stuck",
    title: "Two good arguments, no agreement",
    thread: [
      "After the call, both still think their approach is better, and both have sound engineering reasons.",
    ],
    options: [
      {
        id: "sit",
        label: "Leave the pull request open until someone gives in",
        outcome: "It sits for a week, goes stale and needs rebasing twice. Nobody wins.",
        best: false,
      },
      {
        id: "escalate",
        label: "Ask the tech lead or code owner to decide, then both commit to it",
        outcome:
          "The lead decides in a day. Both of you build on the decision instead of reopening it in every later review.",
        best: true,
      },
      {
        id: "grudge",
        label: "Approve, but raise the same point in every future review",
        outcome: "Each later review reopens the old argument. Reviews slow down and trust erodes.",
        best: false,
      },
    ],
  },
];
