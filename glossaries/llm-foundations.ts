import type { GlossaryEntry } from "./types";

/** LLM Foundations track glossary. `module` slugs refer to this track. */
export const llmFoundations = {
  llm: {
    term: "Large language model (LLM)",
    definition:
      "A neural network trained on huge amounts of text to predict the next token. Chat assistants are LLMs that generate replies one token at a time.",
    analogy: "Phone autocomplete, scaled up enormously.",
    module: "what-an-llm-does",
  },
} satisfies Record<string, GlossaryEntry>;
