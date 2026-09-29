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
  ingestion: {
    term: "Ingestion",
    definition:
      "The half of a RAG system that runs ahead of time: parsing documents, splitting them into chunks, embedding the chunks and storing them in an index. It runs again when documents change.",
    module: "rag-end-to-end",
  },
  chunk: {
    term: "Chunk",
    definition:
      "One piece of a document (often a paragraph or a few hundred tokens) that is embedded and retrieved as a unit.",
    module: "rag-end-to-end",
  },
  "vector-index": {
    term: "Vector index",
    definition:
      "A store of embedding vectors organised so that the vectors closest to a query can be found quickly.",
    module: "rag-end-to-end",
  },
  "top-k-retrieval": {
    term: "Top-k retrieval",
    definition:
      "Returning the k passages that score highest for a question (for example the top 3) and passing only those to the model.",
    module: "rag-end-to-end",
  },
} satisfies Record<string, GlossaryEntry>;
