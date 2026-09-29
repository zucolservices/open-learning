# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m20-facts.md` (reuses `m05-facts.md` for DPDP).

- OWASP Top 10 for LLM Applications 2025 (LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM08 Vector and Embedding Weaknesses) and the 2026 edition (3 Aug 2026; Vector and Embedding Weaknesses is LLM09:2026): "Cosine similarity does not respect ACLs. Authorize before retrieval…"
- Greshake et al., "Not what you've signed up for" (AISec 2023; arXiv 2302.12173): indirect prompt injection.
- Hines et al., "Defending Against Indirect Prompt Injection Attacks With Spotlighting" (Microsoft, 2024): >50% → <2% on its tests. Nasr et al. (Oct 2025): adaptive attacks beat 12 defences, >95% against spotlighting. UK NCSC on prompt injection. Simon Willison, "The lethal trifecta" (June 2025). Debenedetti et al., CaMeL (2025).
- Zou et al., PoisonedRAG (USENIX Security 2025): 5 crafted texts per target question, ~90% attack success.
- Morris et al., "Text Embeddings Reveal (Almost) As Much As Text" (EMNLP 2023): 92% exact recovery of 32-token inputs (GTR-base).
- Incidents (all fixed): EchoLeak, CVE-2025-32711 (Aim Security, June 2025); Slack AI (PromptArmor, Aug 2024); Bard image exfiltration (2023).
- Permission-aware retrieval: Azure AI Search security filters (GA; native ACLs preview), Amazon Bedrock metadata filters, Google Agent Search access control (preview), PostgreSQL row-level security (bypassed by superusers and owners unless FORCE ROW LEVEL SECURITY).
- Digital Personal Data Protection Act 2023 and Rules 2025 (most duties from May 2027). PII tools: Microsoft Presidio (Indian recognizers off by default), Amazon Comprehend, Google Sensitive Data Protection, Azure Language.
- The documents are made up; answers are real, unedited Phi-4-mini output.
