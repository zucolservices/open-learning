# Platforms, cost & long context: storyboard

1. **Cook, kit or restaurant** (analogy): your own database, a dedicated vector database or search service, a managed RAG service.
2. **The map** (explore): three layers (store & search, managed retrieval, models) × open source, AWS, Google Cloud, Azure, with 2026 names.
3. **What it costs** ⭐ (simulation): pages, questions a day, passages per answer, embedding model, store and answering model → monthly cost in USD and INR with a breakdown, plus the one-off embedding cost. List prices from `prices.ts` (29 Sept 2026, ₹96 = $1); assumptions stated on screen. Default (50,000 pages, 20,000 questions/day, 5 passages, Titan V2, pgvector, Gemini 3.1 Flash-Lite) ≈ $574 a month, almost all answering.
4. **Just paste everything?** ⭐ (simulation): collection size (10K–25M tokens, log slider) and questions a day; monthly input cost for Claude Haiku 4.5 (200K window) and GPT-6 Luna (1.05M window, input doubled above 272K): full, cached, and RAG with 5 passages; "doesn't fit" past the window.
5. **Keeping data in India** (cards): regions vs processing location, models, search and storage, MeitY empanelment per service.
6. **Pick a stack** (choice).
7. **What to remember**.

No model output in this module; all figures are computed from the listed prices and assumptions.
