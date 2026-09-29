# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m23-facts.md`.

- Barnett et al., "Seven Failure Points When Engineering a Retrieval Augmented Generation System" (CAIN 2024; arXiv 2401.05856): Missing Content; Missed the Top Ranked Documents; Not in Context; Not Extracted; Wrong Format; Incorrect Specificity; Incomplete.
- Leung et al. (EACL 2026; arXiv 2510.13975): 16 error types by pipeline stage; annotators mark the earliest faulty stage; automatic stage attribution agreed 57.8%.
- Hamel Husain & Shreya Shankar, Evals FAQ (Sept 2026): "focus on the first upstream failure"; "Start with retrieval evaluation". (Practitioner opinion.)
- Tracing: OpenTelemetry GenAI semantic conventions (Development status; `retrieval` operation, now in open-telemetry/semantic-conventions-genai); OpenInference (Apache-2.0; retriever and reranker spans with document content); Langfuse (MIT core; acquired by ClickHouse, Jan 2026); Arize Phoenix (Elastic-2.0); LangSmith; MLflow Tracing (Apache-2.0); AgentCore Observability, Microsoft Foundry tracing, Google Cloud Trace.
- All wrong and fixed answers are real, unedited output recorded in modules 5, 12, 13, 17 and 22.
