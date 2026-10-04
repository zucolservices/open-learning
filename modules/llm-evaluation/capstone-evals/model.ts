/** Capstone: should a support assistant switch to a cheaper model? Design choices, then launch-week surprises. */

export interface Choice {
  id: string;
  label: string;
  good: boolean;
}

export const DESIGN: { id: string; prompt: string; choices: Choice[]; prevents: string }[] = [
  {
    id: "criteria",
    prompt: "What does “as good” mean?",
    choices: [
      {
        id: "own",
        label:
          "Written criteria for our task: policy accuracy ≥ 95%, tone, no data leaks, p95 speed, cost",
        good: true,
      },
      { id: "board", label: "The same score on a public leaderboard", good: false },
    ],
    prevents: "leaderboard",
  },
  {
    id: "set",
    prompt: "What do we test on?",
    choices: [
      {
        id: "real",
        label:
          "400 real conversations, including Hindi and upset customers, plus a held-out test set",
        good: true,
      },
      { id: "demo", label: "The 50 examples from the vendor's demo", good: false },
    ],
    prevents: "hindi",
  },
  {
    id: "graders",
    prompt: "Who grades the answers?",
    choices: [
      {
        id: "mixed",
        label:
          "Code checks for refund amounts; a judge from another model family, checked against an expert",
        good: true,
      },
      { id: "self", label: "The new model grades both models' answers", good: false },
    ],
    prevents: "selfjudge",
  },
  {
    id: "compare",
    prompt: "How do we compare the two?",
    choices: [
      {
        id: "paired",
        label: "Same cases, several runs each, paired comparison with error bars",
        good: true,
      },
      { id: "once", label: "One run each; compare the overall scores", good: false },
    ],
    prevents: "noise",
  },
  {
    id: "rollout",
    prompt: "How do we switch?",
    choices: [
      {
        id: "canary",
        label: "5% canary with a sampled judge, cost tracking and a rollback plan",
        good: true,
      },
      { id: "monday", label: "Switch everyone over on Monday morning", good: false },
    ],
    prevents: "prod",
  },
];

export const INCIDENTS: {
  id: string;
  title: string;
  detail: string;
  fixes: Choice[];
  real: string;
}[] = [
  {
    id: "leaderboard",
    title: "Same score, worse at our job",
    detail: "Its leaderboard score matches, but it quotes the wrong refund window for sale items.",
    fixes: [
      {
        id: "own",
        label: "Measure our own task against criteria agreed before testing",
        good: true,
      },
      { id: "second", label: "Check a second public leaderboard", good: false },
    ],
    real: "Public benchmarks don't measure your task (module 12).",
  },
  {
    id: "hindi",
    title: "Hindi speakers get English",
    detail: "Overall scores tie, but customers writing in Hindi now get replies in English.",
    fixes: [
      {
        id: "group",
        label: "Add real Hindi conversations and break results down by group",
        good: true,
      },
      {
        id: "prompt",
        label: "Add “reply in the user's language” and ship without re-testing",
        good: false,
      },
    ],
    real: "One overall number hides regressions (module 1).",
  },
  {
    id: "selfjudge",
    title: "The judge loves the new model",
    detail:
      "The judge prefers the new model's answers by a wide margin. The judge is the new model.",
    fixes: [
      {
        id: "other",
        label: "Use a judge from a different family, calibrated against expert labels",
        good: true,
      },
      { id: "fair", label: "Tell the judge to be fair", good: false },
    ],
    real: "Self-preference is a documented judge bias (modules 6–7).",
  },
  {
    id: "noise",
    title: "The winner keeps changing",
    detail: "Last week the new model won by 2 points; this week it loses by 1.",
    fixes: [
      { id: "stats", label: "Paired comparison, several runs per case, error bars", good: true },
      { id: "rerun", label: "Re-run until it wins, then report that run", good: false },
    ],
    real: "Small gaps can be noise (modules 9–11).",
  },
  {
    id: "prod",
    title: "Surprises after the switch",
    detail:
      "Its tokenizer makes conversations longer, so bills rise; on some days answers degrade for reasons unrelated to the model.",
    fixes: [
      {
        id: "watch",
        label: "Canary first; watch cost and quality continuously; keep a rollback plan",
        good: true,
      },
      { id: "wait", label: "Wait for customer complaints", good: false },
    ],
    real: "In Aug–Sep 2025, infrastructure bugs degraded Claude's answers without any model change.",
  },
];
