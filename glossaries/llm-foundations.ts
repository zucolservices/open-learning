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
  attention: {
    term: "Attention",
    definition:
      "The mechanism that lets each token take information from other tokens, weighting each by how relevant it is. The core of the transformer.",
    analogy: "Glancing back at the words in a sentence that help you understand the current one.",
    module: "attention",
  },
  "attention-head": {
    term: "Attention head",
    definition:
      "One independent attention calculation with its own learned weights. Each head can learn a different pattern of looking.",
    module: "attention",
  },
  "multi-head": {
    term: "Multi-head attention",
    definition:
      "Running several attention heads side by side in a layer and combining their results.",
    module: "attention",
  },
  qkv: {
    term: "Query, key and value",
    definition:
      "Three vectors computed for each token in attention: the query says what it looks for, keys say what each token offers, and values carry the information that gets mixed in.",
    analogy: "Your question, the labels on library shelves, and the books themselves.",
    module: "attention",
  },
  "causal-mask": {
    term: "Causal mask",
    definition:
      "Blocking attention to later tokens, so each position can only use what came before it, as in next-token prediction.",
    module: "attention",
  },
  transformer: {
    term: "Transformer",
    definition:
      "The neural network design behind modern LLMs (2017): a stack of identical blocks, each with an attention layer and a feed-forward layer.",
    module: "transformer-block",
  },
  "transformer-block": {
    term: "Transformer block",
    definition:
      "One repeating unit of a transformer: attention (tokens exchange information) followed by a feed-forward network (each token processed on its own), each added back into the running vector.",
    module: "transformer-block",
  },
  parameter: {
    term: "Parameter",
    definition:
      "One of the learned numbers (weights) inside a model. Model size is usually given as a parameter count, such as 8 billion.",
    module: "transformer-block",
  },
  "logit-lens": {
    term: "Logit lens",
    definition:
      "A research technique that reads a model's prediction from the middle of its layer stack, to see how the answer forms.",
    module: "transformer-block",
  },
  "positional-encoding": {
    term: "Positional encoding",
    definition:
      "Information added to tokens so the model knows their order. Most modern models use rotary position embeddings (RoPE), which rotate queries and keys by an angle based on position.",
    module: "context-window",
  },
  "context-window": {
    term: "Context window",
    definition:
      "The maximum number of tokens a model can take into account at once, covering instructions, documents, conversation and its own output.",
    analogy: "The model's working memory, or the desk it can spread papers on.",
    module: "context-window",
  },
  "kv-cache": {
    term: "KV cache",
    definition:
      "Stored keys and values for every token already processed, so each new token only computes its own. It grows with the context and can use as much memory as the model itself.",
    module: "context-window",
  },
} satisfies Record<string, GlossaryEntry>;
