# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m14-facts.md`.

- Biswal et al., "Text2SQL is Not Enough: Unifying AI and Databases with TAG" (2024): on 80 modified BIRD queries (Llama-3.1-70B), plain RAG 0% exact, Text2SQL 17%, hand-written TAG 55%; aggregation queries judged by eye.
- Li et al., BIRD (NeurIPS 2023): GPT-4 34.88% → 54.89% with external-knowledge hints; humans 72.37% → 92.96%. Leaderboard top 82.39% (Sep 2026).
- Lei et al., Spider 2.0 (ICLR 2025): 17–21% in late 2024; 2026 leaderboard tops 76.23 (Lite) / 96.70 (Snow). 2026 audit (arXiv 2601.08778): annotation errors in 52.8% of BIRD Mini-Dev and 62.8% of Spider 2.0-Snow. BEAVER (2026): about 11% on enterprise warehouses.
- OWASP Top 10 for LLM Applications 2025: LLM05 Improper Output Handling, LLM06 Excessive Agency. LangChain SQL docs: permissions "scoped as narrowly as possible … This will mitigate, though not eliminate, the risks". AWS: inclusions/exclusions "aren't a substitute for guardrails".
- Managed options (names as of 2026-09-29): Amazon Bedrock Knowledge Bases structured data (Redshift); Google Conversational Analytics API, BigQuery data canvas; Microsoft Fabric data agent (read-only queries); Snowflake Cortex Analyst / Cortex Agents, Semantic Views (vendor accuracy claims are vendor claims); Databricks Genie Agents (formerly Genie Spaces); Vanna 2.0, LangChain, LlamaIndex (RouterQueryEngine, NLSQLTableQueryEngine).
- DuckDB-WASM (MIT), loaded from jsDelivr; DuckDB docs recommend it for sandboxing.
- The register, rules and wards are made up; retrieval, SQL, routes and answers are real, unedited Phi-4-mini output.
