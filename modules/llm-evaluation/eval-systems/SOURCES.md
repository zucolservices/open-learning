# Sources: Evaluating RAG and agents (fact-checked 2026-10-05)

- TruLens, "RAG triad" (context relevance, groundedness, answer relevance).
- Es et al., "Ragas: Automated Evaluation of Retrieval Augmented Generation" (2023): faithfulness, answer relevance, context relevance; Ragas docs for context precision and context recall (needs reference).
- Google ADK evaluation docs: trajectory match EXACT, IN_ORDER, ANY_ORDER; LangChain agentevals: strict, unordered, subset, superset.
- Anthropic, "Demystifying evals for AI agents" / agent eval guidance: grade outcomes; exact paths are brittle.
- Yao et al., τ-bench (2024): pass^k.

Cases, passages, runs and scores are illustrative.
