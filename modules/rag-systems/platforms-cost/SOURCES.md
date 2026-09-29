# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m21-facts.md` (reuses m01, m08, m09 and m12 notes). All prices are USD list prices before tax, observed 29 September 2026; ₹96 = $1 (Fed H.10, ₹95.81 on 25 Sept 2026, rounded).

- Answering models (per 1M tokens in/out, cached input): OpenAI GPT-6 Luna $0.10/$0.50 ($0.01; input 2× above 272K tokens; 1.05M window); gpt-5-mini $0.25/$2 ($0.025); Google Gemini 3.1 Flash-Lite $0.25/$1.50 ($0.025, plus hourly cache storage); Anthropic Claude Haiku 4.5 $1/$5 ($0.10; 200K window).
- Embeddings (per 1M tokens): OpenAI text-embedding-3-small $0.02; Amazon Titan Text Embeddings V2 $0.024 (Mumbai); Cohere Embed 4 $0.12.
- Stores: Amazon S3 Vectors (Mumbai) $0.066/GB-month + $2.70 per million queries; Pinecone Standard minimum $50/month; Azure AI Search Basic, Central India $0.133/h; Amazon OpenSearch Serverless Classic, Mumbai, 2 OCU × $0.2472/h (NextGen collections, GA May 2026, have no minimum).
- Anthropic, "Introducing Contextual Retrieval" (2024): knowledge bases under 200,000 tokens (about 500 pages) can go straight into the prompt. Chroma, "Context Rot" (July 2025). Li et al., "Retrieval Augmented Generation or Long-Context LLMs?" (EMNLP 2024 Industry): Self-Route cut cost by 65% (Gemini-1.5-Pro) and 39% (GPT-4o) against long context, with scores within about 2%.
- Residency (Sept 2026): Claude on Bedrock in Mumbai/Hyderabad uses global routing; current Gemini models in global/US/EU only; Google Agent Search, Bedrock managed knowledge base and Pinecone had no India location; Azure AI Search full features in Central India; S3 Vectors and Titan V2 in Mumbai. MeitY empanels specific cloud service offerings.
- Licences: OpenSearch, Qdrant, Milvus, Chroma, Vespa (Apache 2.0); pgvector (PostgreSQL licence); Elasticsearch (AGPLv3/SSPL/ELv2); Weaviate (BSD-3 plus a proprietary `wl/` directory since v1.39.5).
