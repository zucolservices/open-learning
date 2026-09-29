/**
 * List prices in US dollars before tax, observed 29 September 2026 on each vendor's pricing page
 * or price API (see SOURCES.md). They change often; treat them as a snapshot.
 */
export const INR_PER_USD = 96;

/** Per million tokens: [input, output, cached input]. */
export const ANSWER_MODELS: {
  id: string;
  name: string;
  inp: number;
  out: number;
  cached: number;
}[] = [
  { id: "luna", name: "OpenAI GPT-6 Luna", inp: 0.1, out: 0.5, cached: 0.01 },
  { id: "flashlite", name: "Google Gemini 3.1 Flash-Lite", inp: 0.25, out: 1.5, cached: 0.025 },
  { id: "mini", name: "OpenAI gpt-5-mini", inp: 0.25, out: 2, cached: 0.025 },
  { id: "haiku", name: "Anthropic Claude Haiku 4.5", inp: 1, out: 5, cached: 0.1 },
];

/** Per million tokens embedded. */
export const EMBEDDERS: { id: string; name: string; price: number }[] = [
  { id: "e5", name: "Self-hosted open model (e.g. e5)", price: 0 },
  { id: "oai", name: "OpenAI text-embedding-3-small", price: 0.02 },
  { id: "titan", name: "Amazon Titan Text Embeddings V2 (Mumbai)", price: 0.024 },
  { id: "cohere", name: "Cohere Embed 4", price: 0.12 },
];

/** Monthly search/storage cost as a function of stored GB and queries per month. */
export const STORES: {
  id: string;
  name: string;
  note: string;
  cost(gb: number, queries: number): number;
}[] = [
  {
    id: "pg",
    name: "pgvector on a Postgres you already run",
    note: "No new bill if the server has room; you run it yourself.",
    cost: () => 0,
  },
  {
    id: "s3v",
    name: "Amazon S3 Vectors (Mumbai)",
    note: "$0.066 per GB-month plus $2.70 per million queries.",
    cost: (gb, q) => gb * 0.066 + (q / 1e6) * 2.7,
  },
  {
    id: "pinecone",
    name: "Pinecone Standard",
    note: "Minimum $50 a month; usage above that is extra (not modelled).",
    cost: () => 50,
  },
  {
    id: "azbasic",
    name: "Azure AI Search Basic (Central India)",
    note: "$0.133 an hour, about $97 a month, whatever the traffic.",
    cost: () => 0.133 * 730,
  },
  {
    id: "oss",
    name: "Amazon OpenSearch Serverless, Classic (Mumbai)",
    note: "At least 2 capacity units: about $361 a month. The newer NextGen collections have no minimum.",
    cost: () => 2 * 0.2472 * 730,
  },
];
