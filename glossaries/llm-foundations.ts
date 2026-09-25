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
  token: {
    term: "Token",
    definition:
      "A chunk of text (a word, part of a word, a punctuation mark or a space) from a model's fixed vocabulary. Models read and write tokens, and are priced and limited by them.",
    module: "tokens",
  },
  "next-token-prediction": {
    term: "Next-token prediction",
    definition:
      "The task LLMs are trained on: given the text so far, give a probability for every possible next token. Generating text repeats this one token at a time.",
    module: "what-an-llm-does",
  },
  "chat-template": {
    term: "Chat template",
    definition:
      "The format that turns a conversation (system instructions, user and assistant messages) into one piece of text with special markers, which the model then continues.",
    module: "what-an-llm-does",
  },
  bpe: {
    term: "Byte-pair encoding (BPE)",
    definition:
      "A way to learn a tokenizer's vocabulary: start from characters (or bytes) and repeatedly merge the most frequent neighbouring pair into a new token.",
    module: "tokens",
  },
  vocabulary: {
    term: "Vocabulary",
    definition:
      "The fixed set of tokens a model knows, each with an ID number. Modern vocabularies hold about 100,000 to 260,000 tokens.",
    module: "tokens",
  },
  tokenizer: {
    term: "Tokenizer",
    definition:
      "The program that splits text into tokens and turns them into ID numbers, and back again.",
    module: "tokens",
  },
  embedding: {
    term: "Embedding",
    definition:
      "A list of numbers (a vector) that represents a piece of text, placed so that texts with similar meanings have similar vectors.",
    analogy: "Coordinates on a map where nearby places have similar meanings.",
    module: "embeddings",
  },
  "cosine-similarity": {
    term: "Cosine similarity",
    definition:
      "A measure of how closely two vectors point in the same direction: 1 for the same direction, 0 at right angles, −1 for opposite.",
    module: "embeddings",
  },
  "semantic-search": {
    term: "Semantic search",
    definition: "Finding text by meaning rather than exact words, usually by comparing embeddings.",
    module: "embeddings",
  },
} satisfies Record<string, GlossaryEntry>;
