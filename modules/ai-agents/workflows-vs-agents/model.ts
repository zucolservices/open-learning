/** Anthropic's workflow patterns plus the two ends of the dial, and seven tasks to match. */

export type Pattern =
  "single" | "chain" | "route" | "parallel" | "orchestrator" | "evaluator" | "agent";

export const PATTERNS: { id: Pattern; label: string; nodes: string[]; what: string }[] = [
  {
    id: "single",
    label: "One model call",
    nodes: ["input", "model", "output"],
    what: "One well-prompted call, perhaps with retrieval or a tool. Often enough.",
  },
  {
    id: "chain",
    label: "Prompt chaining",
    nodes: ["step 1", "check", "step 2", "step 3"],
    what: "An assembly line: each call takes the previous one's output, with checks between. Trades speed for accuracy.",
  },
  {
    id: "route",
    label: "Routing",
    nodes: ["classify", "→ billing", "→ refunds", "→ tech"],
    what: "A receptionist: sort each input, then send it to a specialised prompt, tool or model.",
  },
  {
    id: "parallel",
    label: "Parallelisation",
    nodes: ["split", "part A ‖ part B ‖ part C", "combine"],
    what: "Independent pieces at the same time (sectioning), or the same task several times to compare (voting).",
  },
  {
    id: "orchestrator",
    label: "Orchestrator-workers",
    nodes: ["lead plans", "worker ‖ worker ‖ …", "lead combines"],
    what: "A lead model decides the subtasks at run time and hands them out. For when you can't list the pieces in advance.",
  },
  {
    id: "evaluator",
    label: "Evaluator-optimiser",
    nodes: ["write", "critique", "revise ↺"],
    what: "A writer and an editor in a loop until clear criteria are met.",
  },
  {
    id: "agent",
    label: "Agent",
    nodes: ["goal", "model ⇄ tools ↺", "done"],
    what: "The model chooses every step in a loop. For open-ended tasks where nobody can predict the steps.",
  },
];

export interface Task {
  id: string;
  text: string;
  best: Pattern;
  ok: Partial<Record<Pattern, string>>;
  why: string;
}

export const TASKS: Task[] = [
  {
    id: "sentiment",
    text: "Label each product review positive, negative or mixed",
    best: "single",
    ok: {},
    why: "One call per review does it. Anything more adds cost for nothing.",
  },
  {
    id: "translate",
    text: "Translate a product page into five languages",
    best: "parallel",
    ok: { chain: "Works, but doing them one after another is five times slower." },
    why: "Five independent jobs: run them at the same time.",
  },
  {
    id: "inbox",
    text: "Answer a support inbox of billing, refund and technical emails",
    best: "route",
    ok: { single: "One prompt for everything gets worse as you tune it for any one type." },
    why: "Different kinds of request need different prompts and tools: sort first.",
  },
  {
    id: "report",
    text: "Write an outline, check it covers the brief, then write the report",
    best: "chain",
    ok: { evaluator: "A loop also works, but the steps here are known and fixed." },
    why: "Fixed steps with a check in between: an assembly line.",
  },
  {
    id: "letter",
    text: "Polish a grant application until it meets ten written criteria",
    best: "evaluator",
    ok: { chain: "One review pass may not be enough; a loop keeps going until criteria pass." },
    why: "Clear criteria and visible improvement from feedback: writer plus editor.",
  },
  {
    id: "refactor",
    text: "Rename a function across a codebase, touching however many files need it",
    best: "orchestrator",
    ok: { agent: "A single agent can do it, but a lead dispatching per-file work scales better." },
    why: "The subtasks depend on what the lead finds, so they're decided at run time.",
  },
  {
    id: "research",
    text: "Find out why our churn rose last quarter, following whatever leads appear",
    best: "agent",
    ok: {
      orchestrator:
        "A lead with workers suits broad research; the key is that steps aren't known in advance.",
    },
    why: "Open-ended: each finding suggests the next step.",
  },
];

export function judge(t: Task, p: Pattern | undefined) {
  if (!p) return null;
  if (p === t.best) return { tone: "good" as const, text: `Good fit. ${t.why}` };
  if (t.ok[p]) return { tone: "ok" as const, text: t.ok[p]! };
  const order: Pattern[] = [
    "single",
    "chain",
    "route",
    "parallel",
    "evaluator",
    "orchestrator",
    "agent",
  ];
  return order.indexOf(p) > order.indexOf(t.best)
    ? {
        tone: "bad" as const,
        text: `More autonomy than needed: slower, costlier and harder to test. ${t.why}`,
      }
    : { tone: "bad" as const, text: `Not enough for this job. ${t.why}` };
}
