# Agentic RAG & MCP: storyboard

1. **The clerk and the assistant** (analogy): search once vs decide, search, read, search again, stop.
2. **How an agent works** (step-through, illustration written by us, labelled): the shop-licence question; tool request as JSON, program runs search (real passages trade-2, form-T-3, grievance-1), second search, stop and answer.
3. **A small model tries** ⭐ (simulation, real output): Phi-4-mini with a text protocol ("SEARCH: …" / "ANSWER: …") and e5 search (top 3 of 32 passages). Five runs, each against single-shot RAG (one search, top 3):
   - three-part question, no limits: six searches, no answer (6-step cap); RAG answered all three parts;
   - same with a 4-search budget shown to the model and repeat blocking: answered after 4 searches, missing the fee amount and where to complain;
   - shop question with budget, repeat blocking and a forced final answer: two good searches, three repeats, forced answer with wrong ids; RAG found all three passages but padded one detail;
   - simple question: 1 search + correct answer (2 calls vs 1); not-in-documents: correct refusal both ways.
4. **Budgets and stopping** (cards): ReAct loops, framework defaults, over/under-search, cost vs chat; managed agentic retrieval.
5. **MCP: one plug for many tools** (explore): app → three example servers (written by us) with tools/resources/prompts and transports; the lethal trifecta.
6. **Agent or single search?** (sort checkpoint).
7. **What to remember**.

Data: `scratchpad/rag/embed/r16.mjs` (no guard), `r16b.mjs` (budget + repeat blocking), `r16c.mjs` (+ forced answer). Phi-4-mini q4f16, greedy; multilingual-e5-small.
