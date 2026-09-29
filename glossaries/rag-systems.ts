import type { GlossaryEntry } from "./types";

/** RAG Systems track glossary. `module` slugs refer to this track. */
export const ragSystems = {
  rag: {
    term: "Retrieval-augmented generation (RAG)",
    definition:
      "Searching a collection of documents for passages relevant to a question, then giving those passages to a language model with the question so it answers from them. Named by Lewis et al. (2020).",
    module: "why-rag",
  },
  "parametric-memory": {
    term: "Parametric memory",
    definition:
      "What a model knows from training, stored in its weights (parameters). Lewis et al. (2020) contrast it with a searchable document index.",
    module: "why-rag",
  },
  "non-parametric-memory": {
    term: "Non-parametric memory",
    definition:
      "Knowledge kept outside the model, in a searchable collection of documents, and looked up when needed. It can be updated without retraining.",
    module: "why-rag",
  },
  "knowledge-cutoff": {
    term: "Knowledge cutoff",
    definition:
      "The point after which a model's training data stops. The model knows nothing that happened, or was written, after it.",
    module: "why-rag",
  },
  "fine-tuning": {
    term: "Fine-tuning",
    definition:
      "Training an existing model further on your own examples, which changes its weights. Good for tone, format and behaviour; a slow and unreliable way to add new facts.",
    module: "why-rag",
  },
} satisfies Record<string, GlossaryEntry>;
