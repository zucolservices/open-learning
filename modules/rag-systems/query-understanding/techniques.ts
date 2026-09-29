/** More query techniques, checked in September 2026. */
export const TECHNIQUES: [string, string][] = [
  [
    "Standalone rewrite",
    "Turn a follow-up into a self-contained question using the chat history (“how long does it take?” → “how long does a new water connection take?”). A “don't answer, just rewrite” prompt.",
  ],
  [
    "Multi-query",
    "Generate several phrasings and search with all of them. LangChain's MultiQueryRetriever takes the plain union of results; RAG-Fusion (Adrian Raudaschl, 2023) merges them with RRF.",
  ],
  [
    "HyDE",
    "Search with a drafted answer (Gao et al., ACL 2023). The draft may contain invented details; it's used only to find real passages, and was comparable to fine-tuned retrievers, not better.",
  ],
  [
    "Decomposition",
    "Split a question into sub-questions, as in least-to-most prompting (ICLR 2023) or self-ask (2023). Amazon Bedrock Knowledge Bases offers a query-decomposition option.",
  ],
  [
    "Step-back",
    "Ask a broader question first (“what are the rules on disconnection?”) and search with both (Zheng et al., ICLR 2024).",
  ],
  [
    "Transliterate and translate",
    "For romanised Indian languages: transliterate with AI4Bharat's IndicXlit (21 languages) or translate with IndicTrans2 (22 scheduled languages) or Bhashini (its APIs are for proofs of concept unless you arrange paid use).",
  ],
  [
    "Routing",
    "Decide where to search at all: the help pages, the rules, a database or nowhere (LlamaIndex's RouterQueryEngine, for example). Module 14 routes to SQL.",
  ],
];
