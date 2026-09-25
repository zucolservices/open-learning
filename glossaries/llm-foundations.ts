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
  sampling: {
    term: "Sampling",
    definition:
      "Choosing the next token from the model's probability distribution, rather than always taking the most likely one.",
    module: "sampling",
  },
  temperature: {
    term: "Temperature",
    definition:
      "A sampling setting that divides the scores before softmax: below 1 makes likely tokens even likelier (more predictable), above 1 flattens the distribution (more varied, eventually nonsensical).",
    module: "sampling",
  },
  "top-k": {
    term: "Top-k sampling",
    definition:
      "Only the k most likely tokens may be chosen; the rest are discarded before sampling.",
    module: "sampling",
  },
  "top-p": {
    term: "Top-p (nucleus) sampling",
    definition:
      "Only the smallest set of most likely tokens whose probabilities add up to p may be chosen.",
    module: "sampling",
  },
  softmax: {
    term: "Softmax",
    definition:
      "A function that turns a list of scores into probabilities that add up to 1, by exponentiating each and dividing by the total.",
    module: "sampling",
  },
  pretraining: {
    term: "Pretraining",
    definition:
      "The first, largest stage of training: predicting the next token across trillions of tokens of text, which gives a model its general knowledge and skills.",
    module: "pretraining",
  },
  loss: {
    term: "Loss",
    definition:
      "A number measuring how wrong a model's predictions are during training (for LLMs, how surprised it was by the actual next token). Training works by making it smaller.",
    module: "pretraining",
  },
  "scaling-law": {
    term: "Scaling law",
    definition:
      "A formula, fitted to experiments, that predicts how a model's loss falls as parameters, training data and compute grow.",
    module: "pretraining",
  },
  "base-model": {
    term: "Base model",
    definition:
      "A model straight out of pretraining. It continues text like a document rather than answering like an assistant.",
    module: "base-to-assistant",
  },
  "instruction-tuning": {
    term: "Instruction tuning",
    definition:
      "Fine-tuning a base model on examples of instructions and good responses so it follows requests helpfully.",
    module: "base-to-assistant",
  },
  sft: {
    term: "Supervised fine-tuning (SFT)",
    definition:
      "Further training a pretrained model on example conversations (prompt and ideal answer), usually counting loss only on the answer tokens.",
    module: "base-to-assistant",
  },
  lora: {
    term: "LoRA (low-rank adaptation)",
    definition:
      "A cheap fine-tuning method that freezes the original weights and trains small low-rank matrices added on top.",
    module: "base-to-assistant",
  },
  alignment: {
    term: "Alignment",
    definition:
      "Shaping a model's behaviour to be helpful, honest and harmless as intended, typically with preference training after fine-tuning.",
    module: "alignment",
  },
  rlhf: {
    term: "RLHF",
    definition:
      "Reinforcement learning from human feedback: people compare answers, a reward model learns their preferences, and the model is trained to score highly on it.",
    module: "alignment",
  },
  "reward-model": {
    term: "Reward model",
    definition:
      "A model trained on human (or AI) comparisons to score how good an answer is; used to steer another model during training.",
    module: "alignment",
  },
  sycophancy: {
    term: "Sycophancy",
    definition:
      "A model telling users what they want to hear (agreeing, flattering) rather than what's true or useful, often learned from preference training.",
    module: "alignment",
  },
  "reasoning-model": {
    term: "Reasoning model",
    definition:
      "A model trained to write out its thinking (often at length) before giving a final answer, which improves results on hard, multi-step problems.",
    module: "reasoning-models",
  },
  "chain-of-thought": {
    term: "Chain of thought",
    definition:
      "Intermediate reasoning steps a model writes before its answer. Because the model's only working space is its own output, writing steps lets it use them.",
    module: "reasoning-models",
  },
  "test-time-compute": {
    term: "Test-time compute",
    definition:
      "Computation spent when answering (for example, thinking tokens) rather than during training. More can improve accuracy on hard problems, at a cost in time and money.",
    module: "reasoning-models",
  },
  prompt: {
    term: "Prompt",
    definition:
      "Everything you send a model for one request: instructions, background, examples and the input to work on. It is the model's whole brief.",
    module: "prompting",
  },
  "system-prompt": {
    term: "System prompt",
    definition:
      "Standing instructions sent in a separate message before the conversation (the role, rules and tone) that apply to every turn. Some APIs call it the developer message.",
    module: "prompting",
  },
  "few-shot": {
    term: "Few-shot prompting",
    definition:
      "Including a few worked examples (input and ideal output) in the prompt so the model copies their style and shape. With no examples it's called zero-shot.",
    module: "prompting",
  },
  eval: {
    term: "Eval",
    definition:
      "A set of test inputs with automatic or human checks, run against a prompt or model to measure how well it does, so changes can be compared instead of guessed.",
    module: "prompting",
  },
  "json-schema": {
    term: "JSON schema",
    definition:
      "A precise description of the JSON a program expects: which fields, their types, allowed values and which are required. Used to check data, and to constrain model output.",
    module: "tool-calling",
  },
  "constrained-decoding": {
    term: "Constrained decoding",
    definition:
      "Blocking, at every step of generation, any token that would break a required format (such as a JSON schema), so the output is guaranteed to fit. It fixes the shape, not the truth.",
    module: "tool-calling",
  },
  "tool-calling": {
    term: "Tool calling",
    definition:
      "Letting a model ask for a function to be run (by writing its name and arguments). Your code runs it and sends the result back. Also called function calling or tool use.",
    module: "tool-calling",
  },
  mcp: {
    term: "Model Context Protocol (MCP)",
    definition:
      "An open standard for connecting tools and data sources to AI applications, so a tool server written once works with any MCP-capable app.",
    module: "tool-calling",
  },
  "context-engineering": {
    term: "Context engineering",
    definition:
      "Choosing, for each request, what goes into a model's context window (instructions, documents, history, tool results) and in what order.",
    module: "context-engineering",
  },
  "prompt-caching": {
    term: "Prompt caching",
    definition:
      "Reusing the provider's work on a prompt's unchanged beginning across requests, so those tokens are billed at a steep discount and processed faster.",
    module: "context-engineering",
  },
  hallucination: {
    term: "Hallucination",
    definition:
      "A fluent, confident model output that is false or unsupported, such as an invented fact, name or citation.",
    module: "hallucinations",
  },
  grounding: {
    term: "Grounding",
    definition:
      "Giving a model trusted sources in its context and asking it to answer only from them, ideally with citations, so answers can be checked.",
    module: "hallucinations",
  },
  inference: {
    term: "Inference",
    definition:
      "Running a trained model to produce outputs, as opposed to training it. For an LLM: reading the prompt (prefill), then generating tokens one at a time (decode).",
    module: "inference",
  },
  ttft: {
    term: "Time to first token (TTFT)",
    definition:
      "How long after sending a request the first output token arrives. Mostly the prefill of the prompt, plus queueing and network time.",
    module: "inference",
  },
  "memory-bandwidth": {
    term: "Memory bandwidth",
    definition:
      "How many bytes per second a chip can read from its memory. Because every generated token needs a full read of the weights, it caps decode speed.",
    module: "inference",
  },
  quantization: {
    term: "Quantization",
    definition:
      "Storing a model's numbers with fewer bits (for example 8 or 4 instead of 16), so it needs less memory and runs faster, usually at a small cost in quality.",
    module: "memory-quantization",
  },
  perplexity: {
    term: "Perplexity",
    definition:
      "A measure of how surprised a language model is by real text: the exponential of its average loss. Lower is better; comparing it before and after a change shows what was lost.",
    module: "memory-quantization",
  },
  moe: {
    term: "Mixture of experts (MoE)",
    definition:
      "A model whose feed-forward layers are split into many experts, with a router choosing a few per token. All experts must be in memory, but each token uses only a fraction of the parameters.",
    module: "memory-quantization",
  },
  batching: {
    term: "Batching",
    definition:
      "Processing several requests together so each read of the model's weights serves all of them. Raises total throughput; each request gets a little slower.",
    module: "serving",
  },
  throughput: {
    term: "Throughput",
    definition:
      "Total work done per unit of time, such as tokens per second across all users. Contrasts with latency, how long one request takes.",
    module: "serving",
  },
  "continuous-batching": {
    term: "Continuous batching",
    definition:
      "Letting requests join and leave a running batch at every decode step, instead of waiting for the whole batch to finish. Keeps the GPU busy.",
    module: "serving",
  },
  "paged-attention": {
    term: "PagedAttention",
    definition:
      "vLLM's technique of storing the KV cache in small fixed-size pages allocated on demand, like virtual memory, so far less GPU memory is wasted and bigger batches fit.",
    module: "serving",
  },
  streaming: {
    term: "Streaming",
    definition:
      "Sending an answer to the user token by token as it's generated, instead of all at once at the end, so reading can start after the first token.",
    module: "cost-latency",
  },
  "model-routing": {
    term: "Model routing",
    definition:
      "Sending each request to the cheapest model that can handle it well, for example easy questions to a small model and hard ones to a large model.",
    module: "cost-latency",
  },
} satisfies Record<string, GlossaryEntry>;
