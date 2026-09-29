/** Embedding models to know, checked in September 2026. Details change; verify before choosing. */
export const CHOICES: { name: string; by: string; note: string }[] = [
  {
    name: "all-MiniLM-L6-v2",
    by: "open · Apache-2.0 · 23 MB",
    note: "384 dimensions, reads up to 256 word pieces. Fast and tiny, but English only: its vocabulary lacks most Hindi vowel signs.",
  },
  {
    name: "multilingual-e5-small",
    by: "open · MIT · about 118M parameters",
    note: "384 dimensions, 512 tokens, about 100 languages. Needs “query:” and “passage:” prefixes.",
  },
  {
    name: "bge-m3",
    by: "open · MIT · about 568M parameters",
    note: "1024 dimensions, 8,192 tokens, 100+ languages; can also produce keyword-style and multi-vector scores. Much larger, so slower and heavier to host.",
  },
  {
    name: "OpenAI text-embedding-3 (small / large)",
    by: "API",
    note: "1536 / 3072 dimensions, 8,192 tokens; can return shorter vectors to save storage. $0.02 / $0.13 per million tokens.",
  },
  {
    name: "Cohere Embed v4",
    by: "API, also on cloud marketplaces",
    note: "256–1536 dimensions, 128k-token context, text and images.",
  },
  {
    name: "Google gemini-embedding-001 / Gemini Embedding 2",
    by: "API",
    note: "gemini-embedding-001: 3072 dimensions (shortenable), 2,048 tokens. Gemini Embedding 2 (generally available April 2026): 8,192 tokens, text and images.",
  },
  {
    name: "Voyage 4 series",
    by: "API (MongoDB), plus an open-weight nano model",
    note: "256–2048 dimensions, 32k tokens; all sizes share one embedding space.",
  },
  {
    name: "Amazon Titan Text Embeddings V2",
    by: "API (Amazon Bedrock)",
    note: "1024 / 512 / 256 dimensions, 8,192 tokens; optimised for English, with 100+ languages in preview.",
  },
];
