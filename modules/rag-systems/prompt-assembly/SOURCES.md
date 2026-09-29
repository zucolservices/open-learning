# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m13-facts.md`.

- Anthropic prompting best practices (long context): documents at the top, query at the end; "Queries at the end can improve response quality by up to 30 percent in tests" (Anthropic's own tests); XML document tags with source metadata.
- OpenAI GPT-4.1 prompting guide (April 2025): instructions before and after long context (or above if once); XML and `ID | TITLE | CONTENT` worked well, "JSON performed particularly poorly". Google Gemini long-context guidance: query at the end.
- Liu et al., "Lost in the Middle" (TACL 2024; arXiv 2023): U-shaped curve with 10–30 documents on 2023 models; GPT-3.5 could fall below its no-document score. Chroma, "Context Rot" (July 2025): no notable position variation on a simple needle test, but performance falls with length and noise (also RULER, NoLiMa).
- LangChain `LongContextReorder` (langchain-community); Haystack `LostInTheMiddleRanker`. Jin et al., "Long-Context LLMs Meet RAG" (2024): more passages first help then hurt with a strong retriever (hard negatives).
- Liu, Zhang & Liang, "Evaluating Verifiability in Generative Search Engines" (Findings of EMNLP 2023): 51.5% of sentences fully supported, 74.5% citation precision.
- Citations features: Anthropic Citations (valid pointers, not proof of support), OpenAI file search `file_citation` annotations, Gemini grounding metadata / annotations, Cohere citations, Bedrock Knowledge Bases citations.
- Wu et al., ClashEval (NeurIPS 2024 D&B): models often adopt wrong retrieved content. Joren et al., "Sufficient Context" (ICLR 2025): models abstain less when given retrieved context.
- Prompt caching: Anthropic (reads 0.1× on most models, exceptions; per-model minimum length), OpenAI (current models: writes 1.25×, reads 0.1×), Gemini implicit caching.
- OWASP Top 10 for LLM Applications 2025, LLM01 Prompt Injection: separating untrusted content is a mitigation, not a guarantee.
- Questions and rules are made up; prompts and answers are real, unedited Phi-4-mini output.
