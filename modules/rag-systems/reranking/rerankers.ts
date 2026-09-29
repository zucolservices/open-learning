/** Rerankers, checked in September 2026. Details change; check current docs. */
export const RERANKERS: [string, string, string][] = [
  [
    "cross-encoder/ms-marco-MiniLM-L6-v2",
    "open · Apache-2.0 · about 23 MB",
    "Small English cross-encoder; runs even in a browser. One of the judges here.",
  ],
  [
    "BAAI bge-reranker-v2-m3",
    "open · Apache-2.0 · about 568M parameters",
    "Multilingual cross-encoder, including Hindi. One of the judges here.",
  ],
  [
    "mixedbread mxbai-rerank-v2, Qwen3-Reranker",
    "open · Apache-2.0",
    "Newer open rerankers in several sizes.",
  ],
  [
    "Jina Reranker v3 / v3.5",
    "open weights · CC BY-NC 4.0",
    "Listwise, long context; non-commercial licence, so check before production use.",
  ],
  [
    "Cohere Rerank 4 (Pro, Fast)",
    "API, also on cloud marketplaces",
    "Multilingual, 32K-token context; scores from 0 to 1.",
  ],
  [
    "Voyage rerank-2.5",
    "API (MongoDB)",
    "Multilingual, 32K tokens, can follow instructions; newer rerank-3 in preview.",
  ],
  [
    "Azure AI Search semantic ranker",
    "built into the service",
    "Reranks the top 50 results; scores from 0 to 4; free monthly allowance, then paid.",
  ],
  [
    "Google ranking API (Agent Search)",
    "API",
    "semantic-ranker models, 25 languages, scores from 0 to 1, up to 1,000 records per request.",
  ],
  [
    "Amazon Rerank 1.0, Cohere Rerank on Bedrock",
    "API (Amazon Bedrock)",
    "Rerank models callable from Bedrock Knowledge Bases.",
  ],
];
