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
} satisfies Record<string, GlossaryEntry>;
