import type { GlossaryEntry } from "./types";

/** LLM Evaluation track glossary. `module` slugs refer to this track. */
export const llmEvaluation = {
  "vibe-check": {
    term: "Vibe check",
    definition:
      "Trying a few examples by hand and judging whether the output feels right. A useful warning sign, but not evidence that a change is better.",
    module: "why-evals",
  },
  regression: {
    term: "Regression",
    definition:
      "Something that used to work and broke after a change. A regression suite re-runs old cases to catch these.",
    module: "why-evals",
  },
  "success-criteria": {
    term: "Success criteria",
    definition:
      "Specific, measurable statements of what a good result looks like, such as “at least 95% correct on 400 real questions”, agreed before testing.",
    module: "success-criteria",
  },
  "goodharts-law": {
    term: "Goodhart's law",
    definition:
      "“When a measure becomes a target, it ceases to be a good measure”: optimise one number hard and the system finds ways to raise it without really improving.",
    module: "success-criteria",
  },
} satisfies Record<string, GlossaryEntry>;
